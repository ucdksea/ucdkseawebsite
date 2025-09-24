// lib/audit.ts
import { prisma } from "./prisma";
import { recordHash } from "./auditHash";

type AuditAction =
  | "LOGIN" | "LOGOUT" | "SIGNUP_REQUEST"
  | "CREATE" | "UPDATE" | "DELETE"
  | "ROLE_ASSIGN" | "ROLE_REVOKE" | "APPROVE" | "REJECT";

export async function appendAuditEvent(input: {
  actorId?: string | null;
  actorIp?: string | null;
  action: AuditAction;
  targetType: string;
  targetId?: string | null;
  title?: string | null;
  summary?: string | null;
  changes?: any;
  requestId?: string | null;
  severity?: number;
}) {
  const last = await prisma.auditEvent.findFirst({
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

  const hash = recordHash(prevHash, payload);
  const yyyymm = payload.ts.slice(0, 7).replace("-", "");

  return prisma.auditEvent.create({
    data: { ...payload, hash, prevHash, yyyymm },
  });
}
