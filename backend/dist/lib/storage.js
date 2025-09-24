"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImageByUrl = deleteImageByUrl;
// lib/storage.ts
const node_path_1 = __importDefault(require("node:path"));
const promises_1 = __importDefault(require("node:fs/promises"));
function isS3Url(u) {
    const host = (u.host || '').toLowerCase();
    return host.includes('amazonaws.com') || host.includes('r2.cloudflarestorage.com');
}
/** URL → S3 object key (CDN이어도 path 그대로) */
function urlToS3Key(u) {
    return decodeURIComponent(u.pathname.replace(/^\/+/, ''));
}
/** URL → 로컬 파일 경로 (public 하위만 허용) */
function urlToLocalPath(u) {
    const safePath = node_path_1.default.normalize(u.pathname).replace(/^(\.\.[/\\])+/, '');
    const publicRoot = node_path_1.default.join(process.cwd(), 'public');
    const candidate = node_path_1.default.join(publicRoot, safePath);
    if (!candidate.startsWith(publicRoot))
        return null;
    return candidate;
}
/** 로컬 파일 삭제 */
async function deleteLocalByUrl(urlStr) {
    try {
        const u = new URL(urlStr, 'http://dummy'); // 상대경로 허용
        const p = urlToLocalPath(u);
        if (!p)
            return { ok: false, error: 'Unsafe path' };
        await promises_1.default.unlink(p).catch((e) => {
            if (e?.code === 'ENOENT')
                return; // 이미 없으면 성공 간주
            throw e;
        });
        return { ok: true };
    }
    catch (e) {
        return { ok: false, error: String(e?.message ?? e) };
    }
}
/** S3 삭제(설치/환경 없으면 안전하게 실패 반환) */
async function deleteS3ByUrl(urlStr) {
    if (!process.env.S3_BUCKET || !process.env.AWS_REGION) {
        return { ok: false, error: 'S3 env not configured' };
    }
    try {
        const u = new URL(urlStr);
        const Key = urlToS3Key(u);
        // 동적 import (타입/모듈 미설치여도 빌드 에러 안 나게)
        const pkg = '@aws-sdk/client-s3';
        const mod = await import(pkg).catch(() => null);
        if (!mod)
            return { ok: false, error: '@aws-sdk/client-s3 not installed' };
        const s3 = new mod.S3Client({ region: process.env.AWS_REGION });
        await s3.send(new mod.DeleteObjectCommand({ Bucket: process.env.S3_BUCKET, Key }));
        return { ok: true };
    }
    catch (e) {
        return { ok: false, error: String(e?.message ?? e) };
    }
}
/** URL 한 장 삭제: S3 URL이면 S3, 그외 로컬 */
async function deleteImageByUrl(urlStr) {
    if (!urlStr)
        return { ok: true };
    let u;
    try {
        u = new URL(urlStr, 'http://dummy');
    }
    catch {
        return { ok: false, error: 'Invalid URL' };
    }
    return isS3Url(u) ? deleteS3ByUrl(urlStr) : deleteLocalByUrl(urlStr);
}
