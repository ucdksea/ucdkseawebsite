// lib/withAudit.ts
import type { Request, Response, NextFunction } from "express";
import { appendAuditEvent } from "./audit";
import { getActor, getClientIp, getRequestId } from "./req";

type AuditAction =
  | "LOGIN" | "LOGOUT" | "SIGNUP_REQUEST"
  | "CREATE" | "UPDATE" | "DELETE"
  | "ROLE_ASSIGN" | "ROLE_REVOKE" | "APPROVE" | "REJECT";

type WithAuditOpts = {
  action: AuditAction;
  targetType: string;
  targetId?: (result: any) => string | undefined;
  title?: (result: any) => string | undefined;
  summary?: (result: any) => string | undefined;
  changes?: (result: any) => any;
  severity?: (result: any) => number;
};

export function withAudit(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<any> | any,
  opts: WithAuditOpts
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const actorId = await getActor(req);
    const actorIp = getClientIp(req);
    const requestId = getRequestId(req);

    try {
      const result = await handler(req, res, next);

      await appendAuditEvent({
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
    } catch (e: any) {
      await appendAuditEvent({
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
