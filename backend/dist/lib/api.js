"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API = void 0;
async function request(method, url, body) {
    const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
    const res = await fetch(url, {
        method,
        headers: isForm ? undefined : { 'Content-Type': 'application/json' },
        body: isForm ? body : body ? JSON.stringify(body) : undefined,
        credentials: 'include',
    });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
    }
    // 업로드 같은 경우 JSON 안 줄 수도 있으니 안전하게 처리
    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : res.text();
}
exports.API = {
    get: (url) => request('GET', url),
    post: (url, body) => request('POST', url, body),
    put: (url, body) => request('PUT', url, body),
    del: (url) => request('DELETE', url),
};
