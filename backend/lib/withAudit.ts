// lib/withAudit.ts
import { appendAuditEvent } from "@/lib/audit";
import { getActor, getClientIp, getRequestId } from "@/lib/req";

type AuditAction =
  | "LOGIN" | "LOGOUT" | "SIGNUP_REQUEST"
  | "CREATE" | "UPDATE" | "DELETE"
  | "ROLE_ASSIGN" | "ROLE_REVOKE" | "APPROVE" | "REJECT";

type WithAuditOpts = {
  action: AuditAction;
  targetType: string; // USER | POST | PRODUCT | QUOTE ...
  targetId?: (bodyOrRes: any) => string | undefined;
  title?: (bodyOrRes: any) => string | undefined;
  summary?: (bodyOrRes: any) => string | undefined;
  changes?: (bodyOrRes: any) => any; // [{field,kind,to}, ...]
  severity?: (bodyOrRes: any) => number; // 0~3
};

// route handler를 감싸서 성공 시 기록, 실패 시 에러로 기록
export function withAudit(handler: Function, opts: WithAuditOpts) {
  return async function auditedHandler(req: Request, ...rest: any[]) {
    const actorId = await getActor();
    const actorIp = getClientIp();
    const requestId = getRequestId();

    try {
      const res = await handler(req, ...rest);

      // 응답 본문/생성 ID를 추출하려면 clone 사용
      let body: any = null;
      try { body = await res.clone().json(); } catch {}

      await appendAuditEvent({
        actorId, actorIp, requestId,
        action: opts.action,
        targetType: opts.targetType,
        targetId: opts.targetId?.(body),
        title: opts.title?.(body),
        summary: opts.summary?.(body),
        changes: opts.changes?.(body),
        severity: opts.severity?.(body) ?? 0,
      });

      return res;
    } catch (e: any) {
      await appendAuditEvent({
        actorId, actorIp, requestId,
        action: opts.action,
        targetType: opts.targetType,
        summary: "FAILED: " + (e?.message || "error"),
        severity: 3,
      });
      throw e;
    }
  };
}
