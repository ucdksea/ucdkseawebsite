"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
        const mod = await Promise.resolve(`${pkg}`).then(s => __importStar(require(s))).catch(() => null);
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
