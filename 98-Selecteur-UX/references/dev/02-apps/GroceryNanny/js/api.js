import { API_ENDPOINT, limits } from './config.js';
import { demoCheck } from './demo.js';
import { validateReport } from './report.js';
export const isDemo = !API_ENDPOINT.trim();
let activeController;
export function cancelCheck() { activeController?.abort(); }
export async function runCheck(invoiceFile, groceryImages, language) {
  if (isDemo) return validateReport(demoCheck());
  let endpoint;
  try { endpoint = new URL(API_ENDPOINT); } catch { throw new Error('errorAPI'); }
  if(endpoint.protocol !== 'https:' && !(['localhost','127.0.0.1'].includes(endpoint.hostname) && endpoint.protocol === 'http:')) throw new Error('errorAPI');
  const controller = new AbortController();
  activeController = controller;
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, limits.timeoutMs);
  const started = performance.now();
  try {
    const body = new FormData();
    body.append('invoice', invoiceFile);
    for (const file of groceryImages) body.append('images[]', file);
    body.append('language', language);
    const response = await fetch(endpoint, { method: 'POST', body, signal: controller.signal, credentials:'omit', cache:'no-store', redirect:'error' });
    if(!response.ok) throw new Error(response.status === 501 ? 'errorNotImplemented' : 'errorAPI');
    let raw;
    try { raw = await response.json(); } catch { throw new Error('errorInvalid'); }
    const report = validateReport(raw);
    report.summary.check_time_seconds = Math.round((performance.now()-started)/1000 * 10)/10;
    return report;
  } catch (error) {
    if(timedOut) throw new Error('errorTimeout');
    if(controller.signal.aborted) throw new Error('cancelled');
    if(['errorInvalid','errorNotImplemented','errorAPI'].includes(error.message)) throw error;
    throw new Error('errorAPI');
  } finally {
    clearTimeout(timer);
    if(activeController === controller) activeController = null;
  }
}
