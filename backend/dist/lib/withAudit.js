"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAudit = withAudit;
const audit_1 = require("./audit");
const req_1 = require("./req");
function withAudit(handler, opts) {
    return async (req, res, next) => {
        const actorId = await (0, req_1.getActor)(req);
        const actorIp = (0, req_1.getClientIp)(req);
        const requestId = (0, req_1.getRequestId)(req);
        try {
            const result = await handler(req, res, next);
            await (0, audit_1.appendAuditEvent)({
                actorId,
                actorIp,
                requestId,
                action: opts.action,
                targetType: opts.targetType,
                targetId: opts.targetId?.(result),
                title: opts.title?.(result),
                summary: opts.summary?.(result),
                changes: opts.changes?.(result),
                severity: opts.severity?.(result) ?? 0
            });
            return result;
        }
        catch (e) {
            await (0, audit_1.appendAuditEvent)({
                actorId,
                actorIp,
                requestId,
                action: opts.action,
                targetType: opts.targetType,
                summary: "FAILED: " + (e?.message || "error"),
                severity: 3
            });
            next(e);
        }
    };
}
