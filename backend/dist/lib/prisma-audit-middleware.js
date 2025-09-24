"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachAuditMiddleware = attachAuditMiddleware;
// lib/prisma-audit-middleware.ts
const prisma_1 = require("./prisma");
// import { appendAuditEvent } from "./audit"; // 원하면 사용
function attachAuditMiddleware() {
    const p = prisma_1.prisma;
    if (typeof p.$use !== "function")
        return;
    p.$use(async (params, next) => {
        const result = await next(params);
        // 여기서 params.model/params.action 보고 appendAuditEvent 써도 됨
        return result;
    });
}
