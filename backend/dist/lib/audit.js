"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendAuditEvent = appendAuditEvent;
// lib/audit.ts
const prisma_1 = require("./prisma");
const auditHash_1 = require("./auditHash");
async function appendAuditEvent(input) {
    const last = await prisma_1.prisma.auditEvent.findFirst({
        orderBy: { ts: "desc" },
        select: { hash: true },
    });
    const prevHash = last?.hash ?? null;
    const payload = {
        ts: new Date().toISOString(),
        actorId: input.actorId ?? null,
        actorIp: input.actorIp ?? null,
        action: input.action,
        targetType: input.targetType,
        targetId: input.targetId ?? null,
        title: input.title ?? null,
        summary: input.summary ?? null,
        changesJson: input.changes ?? null,
        requestId: input.requestId ?? null,
        severity: input.severity ?? 0,
    };
    const hash = (0, auditHash_1.recordHash)(prevHash, payload);
    const yyyymm = payload.ts.slice(0, 7).replace("-", "");
    return prisma_1.prisma.auditEvent.create({
        data: { ...payload, hash, prevHash, yyyymm },
    });
}
