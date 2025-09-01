// lib/prisma-audit-middleware.ts
import { prisma } from "@/lib/prisma";
import { appendAuditEvent } from "@/lib/audit";

// 앱 부팅 시 1회만 설치되도록 호출
let installed = false;
export function installPrismaAuditMiddleware() {
  if (installed) return;
  installed = true;

  prisma.$use(async (params, next) => {
    const result = await next(params);

    // 회원가입(User.create)만 감지
    if (params.model === "User" && params.action === "create") {
      const user = result as { id: string; email: string | null };
      try {
        await appendAuditEvent({
          actorId: user.email ?? "unknown",
          actorIp: "", // IP는 register 라우트 내에서만 알 수 있으므로 빈값
          action: "SIGNUP_REQUEST",
          targetType: "USER",
          targetId: user.id,
          title: `Signup request: ${user.email ?? user.id}`,
          summary: "Awaiting approval",
          changes: [{ field: "approvalStatus", kind: "add", to: "PENDING" }],
          severity: 0,
        });
      } catch (e) {
        console.error("audit(SIGNUP_REQUEST) failed:", e);
      }
    }

    return result;
  });
}
