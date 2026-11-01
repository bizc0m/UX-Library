export const statuses = ['ok','missing','surplus','wrong','uncertain'];
const cents = value => Math.round(value * 100);
export function lineClaim(product) {
  if (product.status === 'missing') return cents(product.unit_price * Math.max(0, product.expected - product.detected)) / 100;
  // 'wrong': detected counts substituted products; the entire expected line is wrong.
  if (product.status === 'wrong') return cents(product.unit_price * product.expected) / 100;
  return 0;
}
export function validateReport(raw) {
  const fail = () => { throw new Error('errorInvalid'); };
  if (!raw || typeof raw !== 'object' || !raw.order || !raw.summary || !Array.isArray(raw.products) || !raw.products.length || raw.products.length > 500) fail();
  const {order, summary, products} = raw;
  for (const key of ['retailer','order_number','delivery_date','country','currency']) if(typeof order[key] !== 'string' || !order[key].trim() || order[key].length > 200) fail();
  if(!/^[A-Z]{3}$/.test(order.currency) || !/^[A-Z]{2}$/.test(order.country) || !/^\d{4}-\d{2}-\d{2}$/.test(order.delivery_date) || !Number.isFinite(Date.parse(order.delivery_date))) fail();
  const counts = Object.fromEntries(statuses.map(status=>[status,0]));
  let expectedCount = 0;
  let confirmedCents = 0;
  let uncertainCents = 0;
  for (const product of products) {
    if(!product || typeof product.name !== 'string' || !product.name.trim() || product.name.length > 300 || !statuses.includes(product.status)) fail();
    if(!Number.isInteger(product.expected) || product.expected < 0 || product.expected > 10000) fail();
    if(product.detected === null) { if(product.status !== 'uncertain') fail(); }
    else if(!Number.isInteger(product.detected) || product.detected < 0 || product.detected > 10000) fail();
    if(!Number.isFinite(product.unit_price) || product.unit_price < 0 || product.unit_price > 100000 || !Number.isFinite(product.confidence) || product.confidence < 0 || product.confidence > 1) fail();
    if(product.ean != null && (typeof product.ean !== 'string' || !/^\d{8,14}$/.test(product.ean))) fail();
    if(product.status === 'ok' && (product.expected === 0 || product.expected !== product.detected)) fail();
    if(product.status === 'missing' && product.detected >= product.expected) fail();
    if(product.status === 'surplus' && product.detected <= product.expected) fail();
    if(product.status === 'wrong' && (product.expected === 0 || product.detected === 0)) fail();
    counts[product.status]++;
    expectedCount += product.expected;
    confirmedCents += cents(lineClaim(product));
    if(product.status === 'uncertain') uncertainCents += cents(product.expected * product.unit_price);
  }
  for(const status of statuses) if(summary[status] !== counts[status]) fail();
  if(summary.references !== products.length || summary.commercial_items !== expectedCount) fail();
  for(const key of ['confirmed_claim','potential_claim','manual_time_seconds','check_time_seconds']) if(!Number.isFinite(summary[key]) || summary[key] < 0) fail();
  if(cents(summary.confirmed_claim) !== confirmedCents || cents(summary.potential_claim) < confirmedCents || cents(summary.potential_claim) > confirmedCents + uncertainCents) fail();
  if(summary.manual_time_seconds !== expectedCount * 10) fail();
  return structuredClone(raw);
}
export function buildClaim(report, t, money) {
  const lines = report.products.filter(product => ['missing','wrong'].includes(product.status)).map(product => t('claimLine', {...product, status:t(product.status), amount:money(lineClaim(product))})).join('\n');
  return t('claimTemplate', {retailer:report.order.retailer,number:report.order.order_number,date:report.order.delivery_date,lines,amount:money(report.summary.confirmed_claim)});
}
