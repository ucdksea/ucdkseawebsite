// /lib/api.ts
type Body = FormData | object | undefined;

async function request(method: 'GET'|'POST'|'PUT'|'DELETE', url: string, body?: Body) {
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;

  const res = await fetch(url, {
    method,
    headers: isForm ? undefined : { 'Content-Type': 'application/json' },
    body: isForm ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  if (!res.ok) {
    const text = await res.text().catch(()=>'');
    throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
  }
  // 업로드 같은 경우 JSON 안 줄 수도 있으니 안전하게 처리
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

export const API = {
  get:  (url: string)            => request('GET', url),
  post: (url: string, body?:Body)=> request('POST', url, body),
  put:  (url: string, body?:Body)=> request('PUT', url, body),
  del:  (url: string)            => request('DELETE', url),
};
