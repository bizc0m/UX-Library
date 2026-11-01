import { languages, translate, initialLanguage } from './i18n.js';
import { runCheck, isDemo, cancelCheck } from './api.js';
import { limits, pricing, SUPPORT_URL } from './config.js';
import { lineClaim, buildClaim } from './report.js';
const $ = id => document.getElementById(id);
const state = {language:initialLanguage(),invoice:null,photos:[],busy:false,report:null,error:null};
let toastTimer;
const t = (key,values) => translate(state.language,key,values);
const money = value => new Intl.NumberFormat(state.language, {style:'currency',currency:state.report?.order.currency || 'EUR'}).format(value);
const duration = seconds => {
  const rounded = Math.max(0,Math.round(seconds));
  return rounded < 60 ? `${rounded} s` : `${Math.floor(rounded/60)} min ${rounded%60} s`;
};
function element(tag, text, className) {
  const node = document.createElement(tag);
  if(text !== undefined) node.textContent = text;
  if(className) node.className = className;
  return node;
}
function renderLanguage() {
  document.documentElement.lang = state.language;
  $('language').value = state.language;
  document.querySelectorAll('[data-i18n]').forEach(node=>node.textContent=t(node.dataset.i18n));
  document.querySelectorAll('[data-i18n-aria]').forEach(node=>node.setAttribute('aria-label',t(node.dataset.i18nAria)));
  $('thumbnails').setAttribute('aria-label',t('photos'));
  $('mode-label').textContent=t(isDemo?'demo':'live');
  $('mode-copy').textContent=t(isDemo?'demoNotice':'liveNotice');
  const price = value => new Intl.NumberFormat(state.language,{style:'currency',currency:pricing.currency}).format(value);
  $('pricing').replaceChildren(element('div',t('annualPrice',{price:price(pricing.annual),checks:pricing.annualChecks})),element('div',t('refillPrice',{price:price(pricing.refillPrice),checks:pricing.refillChecks})));
  renderFiles();
  renderError();
  if(state.report) renderResults();
}
function renderError() { $('error').hidden=!state.error; $('error').textContent=state.error?t(state.error):''; }
function fail(key) { state.error=key; renderError(); }
function clearResult() {
  state.report=null; state.error=null;
  $('results').hidden=true; $('claim-section').hidden=true; $('claim').value='';
  renderError();
}
function updateCheck() {
  const ready=Boolean(state.invoice && state.photos.length);
  $('check').disabled=!ready||state.busy;
  $('check-hint').textContent=t(!ready?'hintEmpty':isDemo?'hintDemo':'hintReady');
  $('uploads').disabled=state.busy;
  $('language').disabled=state.busy;
}
function renderFiles() {
  $('invoice-info').hidden=!state.invoice;
  $('invoice-name').textContent=state.invoice?.name || '';
  const bytes=state.invoice?.size||0;
  const unit=bytes<1024?'byte':bytes<1048576?'kilobyte':'megabyte';
  const divisor=unit==='byte'?1:unit==='kilobyte'?1024:1048576;
  $('invoice-size').textContent=state.invoice?new Intl.NumberFormat(state.language,{style:'unit',unit,unitDisplay:'short',maximumFractionDigits:2}).format(bytes/divisor):'';
  $('invoice-mark').textContent=state.invoice?'✓':'+';
  $('photos-mark').textContent=state.photos.length?'✓':'+';
  $('photo-count').textContent=t('photoCount',{count:state.photos.length});
  const thumbnails=state.photos.map((entry,index)=>{
    const li=element('li',undefined,'thumb');
    const img=element('img'); img.src=entry.url; img.alt=t('photos')+` ${index+1}`;
    img.addEventListener('error',()=>img.replaceWith(element('div',t('previewUnavailable'),'preview-error')),{once:true});
    const button=element('button','×'); button.type='button'; button.setAttribute('aria-label',t('removePhoto',{number:index+1}));
    button.addEventListener('click',()=>{ URL.revokeObjectURL(entry.url); state.photos.splice(index,1); clearResult(); renderFiles(); $('gallery-button').focus(); });
    li.append(img,button,element('small',entry.file.name)); return li;
  });
  $('thumbnails').replaceChildren(...thumbnails);
  updateCheck();
}
const imageFile = file => /^(image\/(jpeg|png|webp|gif|heic|heif|avif|bmp|tiff))$/i.test(file.type) || (!file.type && /\.(jpe?g|png|webp|gif|heic|heif|avif|bmp|tiff?)$/i.test(file.name));
function valid(file,invoice=false) {
  return file && file.size>0 && file.size<=limits.maxFileBytes && (imageFile(file)||(invoice&&(file.type==='application/pdf'||(!file.type&&/\.pdf$/i.test(file.name)))));
}
function totalSize(invoice,photos) {return (invoice?.size||0)+photos.reduce((sum,entry)=>sum+entry.file.size,0);}
$('invoice').addEventListener('change',event=>{
  const file=event.target.files[0]; event.target.value=''; if(!file)return;
  if(!valid(file,true)) return fail('errorFile');
  if(totalSize(file,state.photos)>limits.maxTotalBytes)return fail('errorLimit');
  state.invoice=file; clearResult(); renderFiles();
});
$('remove-invoice').addEventListener('click',()=>{state.invoice=null; clearResult(); renderFiles(); $('invoice').focus();});
function addPhotos(event) {
  const files=[...event.target.files]; event.target.value=''; if(!files.length)return;
  if(files.some(file=>!valid(file)))return fail('errorFile');
  const unique=files.filter((file,index)=>!state.photos.some(entry=>entry.file.name===file.name&&entry.file.size===file.size&&entry.file.lastModified===file.lastModified) && !files.slice(0,index).some(other=>other.name===file.name&&other.size===file.size&&other.lastModified===file.lastModified));
  if(state.photos.length+unique.length>limits.maxPhotos||totalSize(state.invoice,[...state.photos,...unique.map(file=>({file}))])>limits.maxTotalBytes)return fail('errorLimit');
  state.photos.push(...unique.map(file=>({file,url:URL.createObjectURL(file)}))); clearResult(); renderFiles();
}
$('gallery').addEventListener('change',addPhotos); $('camera').addEventListener('change',addPhotos);
$('gallery-button').addEventListener('click',()=>$('gallery').click()); $('camera-button').addEventListener('click',()=>$('camera').click());
$('language').addEventListener('change',event=>{
  if(!languages.includes(event.target.value))return;
  state.language=event.target.value;
  try{localStorage.setItem('grocerynanny.language',state.language);}catch{/* Language still works without persistence. */}
  renderLanguage();
});
$('check-form').addEventListener('submit',async event=>{
  event.preventDefault(); if(state.busy||!state.invoice||!state.photos.length)return;
  clearResult(); state.busy=true; updateCheck();
  const started=performance.now();
  $('analysis').hidden=isDemo;
  $('elapsed').textContent='0 s';
  const timer=isDemo?null:setInterval(()=>{$('elapsed').textContent=duration((performance.now()-started)/1000);},250);
  try {
    state.report=await runCheck(state.invoice,state.photos.map(entry=>entry.file),state.language);
    renderResults(); $('result-title').focus();
  } catch(error) { if(error.message!=='cancelled')fail(error.message.startsWith('error')?error.message:'errorAPI'); }
  finally { clearInterval(timer); state.busy=false; $('analysis').hidden=true; updateCheck(); }
});
$('cancel').addEventListener('click',cancelCheck);
function renderResults() {
  const {order,summary,products}=state.report;
  $('results').hidden=false;
  $('result-mode').textContent=isDemo?t('demo'):'CHECK';
  $('demo-result-note').hidden=!isDemo;
  $('order-info').textContent=t('orderInfo',{retailer:order.retailer,number:order.order_number,date:order.delivery_date});
  const cards=[['✓ '+t('conforming'),summary.ok,'ok'],['× '+t('anomalies'),summary.missing+summary.wrong+summary.surplus,'missing'],['! '+t('verify'),summary.uncertain,'uncertain'],[t('claimable'),money(summary.confirmed_claim),'money']];
  $('summary').replaceChildren(...cards.map(([label,value,style])=>{const card=element('div',undefined,`stat ${style}`);card.append(element('small',label),element('strong',String(value)));if(style==='money'&&summary.potential_claim>summary.confirmed_claim)card.append(element('em',t('potential',{amount:money(summary.potential_claim)})));return card;}));
  const time=duration(summary.check_time_seconds);
  const saved=duration(Math.max(0,summary.manual_time_seconds-summary.check_time_seconds));
  $('check-time').textContent=isDemo?t('demoTime',{time}):time;
  $('time-saved').textContent=isDemo?t('demoTime',{time:'~'+saved}):'~'+saved;
  $('manual-time').textContent='~'+duration(summary.manual_time_seconds);
  $('reference-count').textContent=t('references',{count:summary.references,items:summary.commercial_items});
  const symbols={ok:'✓',missing:'×',wrong:'↔',surplus:'+',uncertain:'!'};
  $('products').replaceChildren(...products.map(product=>{
    const row=element('tr');
    const name=element('td',product.name);
    if(product.ean)name.append(element('small',product.ean));
    const status=element('td'); status.append(element('span',`${symbols[product.status]} ${t(product.status)}`,`status ${product.status}`));
    if(product.status!=='ok')status.append(element('small',t('confidence',{percent:Math.round(product.confidence*100)})));
    row.append(name,element('td',String(product.expected)),element('td',product.detected===null?'?':String(product.detected)),status,element('td',['missing','wrong'].includes(product.status)?money(lineClaim(product)):'—'));
    return row;
  }));
  $('generate-claim').hidden=!(summary.missing>0||summary.wrong>0||summary.confirmed_claim>0);
}
$('generate-claim').addEventListener('click',()=>{
  const alreadyOpen=!$('claim-section').hidden;
  $('claim-section').hidden=false;
  if(!alreadyOpen)$('claim').value=(isDemo?`${t('demo')} — ${t('demoResultNote')}\n\n`:'')+buildClaim(state.report,t,money);
  $('claim').focus();
});
function notify(message){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,4000);}
$('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('claim').value);notify(t('copied'));}catch{$('claim').focus();$('claim').select();notify(t('copyFailed'));}});
$('download').addEventListener('click',()=>{
  const blob=new Blob(['\ufeff'+$('claim').value],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);const link=element('a');link.href=url;link.download=`GroceryNanny-${isDemo?'DEMO-':''}claim.txt`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
$('new-check').addEventListener('click',()=>{state.photos.forEach(entry=>URL.revokeObjectURL(entry.url));state.photos=[];state.invoice=null;clearResult();renderFiles();$('invoice').focus();});
try { const support=new URL(SUPPORT_URL);if(support.protocol==='https:'){$('support').href=support.href;$('support').hidden=false;} }catch{/* Empty or invalid URL means hidden. */}
renderLanguage();
if('serviceWorker' in navigator)window.addEventListener('load',()=>{navigator.serviceWorker.register('./sw.js').catch(()=>{/* CHECK remains usable without installation. */});});
