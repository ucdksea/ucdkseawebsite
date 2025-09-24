// lib/prisma-audit-middleware.ts
import { prisma } from "./prisma";
// import { appendAuditEvent } from "./audit"; // 원하면 사용

export function attachAuditMiddleware() {
  const p = prisma as unknown as { $use?: Function };
  if (typeof p.$use !== "function") return;

  p.$use(async (params: any, next: any) => {
    const result = await next(params);
    // 여기서 params.model/params.action 보고 appendAuditEvent 써도 됨
    return result;
  });
}
