// lib/mail.ts
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

function bool(v: any) { return String(v).toLowerCase() === "true"; }

const port = Number(process.env.SMTP_PORT ?? 587);
const secure = port === 465 || bool(process.env.SMTP_SECURE);

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port,
  secure, // 465면 true, 587이면 false
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
  // TLS 이슈시만 임시로 해제 (필요할때만 주석 해제)
  // tls: { rejectUnauthorized: false },
});

// 앱 시작 시 한번 점검하고 로그 남기기 (실패해도 앱 죽이지 않음)
mailer.verify().then(
  () => console.log("[SMTP] verify OK:", process.env.SMTP_HOST, port, "(secure:", secure, ")"),
  (err) => console.error("[SMTP] verify FAIL:", err?.message || err)
);

export async function sendApprovalEmail(to: string, name: string, email: string) {
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER!;
  const appName = process.env.APP_NAME || "Our Service";
  const loginUrl = process.env.APP_LOGIN_URL || "http://localhost:3000/login";

  const subject = `[${appName}] 회원가입 승인 완료 안내`;
  const text = [
    `${name}님, 안녕하세요.`,
    ``,
    `회원가입 승인이 완료되었습니다.`,
    `아래 링크에서 이메일(${email})로 로그인 해주세요.`,
    loginUrl,
    ``,
    `감사합니다.`,
  ].join("\n");

  const html = `
    <div style="font-family:system-ui, AppleSDGothicNeo, Arial; line-height:1.6;">
      <h2>${appName} 회원가입 승인 완료</h2>
      <p><b>${name}</b>님, 안녕하세요.</p>
      <p>회원가입 승인이 완료되었습니다. 아래 버튼을 눌러 로그인하세요.</p>
      <p style="margin:24px 0;">
        <a href="${loginUrl}" style="background:#111827;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;">
          로그인 하기
        </a>
      </p>
      <p>이메일: <b>${email}</b></p>
      <hr />
      <small>본 메일은 발신전용입니다.</small>
    </div>
  `;

  return mailer.sendMail({ from, to, subject, text, html });
}

/* ---- Admin one-click ---- */
function signAdminActionToken(
  user: { id: string; name: string; email: string },
  action: "approve" | "decline"
){
  const secret = process.env.ADMIN_ACTION_SECRET!;
  return jwt.sign({ action, user }, secret, { expiresIn: "30m" });
}
export function verifyAdminActionToken(token: string){
  const secret = process.env.ADMIN_ACTION_SECRET!;
  return jwt.verify(token, secret) as {
    action: "approve" | "decline";
    user: { id: string; name: string; email: string };
  };
}

export async function sendAdminNewRegistration(
  to: string | string[],
  user: { id: string; name: string; email: string }
){
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER!;
  const appName = process.env.APP_NAME || "UCD KSEA";
  const base = process.env.APP_BASE_URL || "http://127.0.0.1:3000";

  const approveToken = signAdminActionToken(user, "approve");
  const declineToken = signAdminActionToken(user, "decline");

  const approveUrl = `${base}/api/admin/users/action?token=${encodeURIComponent(approveToken)}`;
  const declineUrl = `${base}/api/admin/users/action?token=${encodeURIComponent(declineToken)}`;

  const toList = Array.isArray(to) ? to : to.split(",").map(s=>s.trim()).filter(Boolean);
  if (!toList.length) return;

  const subject = `[${appName}] New officer registration pending`;
  const text =
    `New registration\n` +
    `Name: ${user.name}\nEmail: ${user.email}\nUser ID: ${user.id}\n\n` +
    `Approve: ${approveUrl}\nDecline: ${declineUrl}\n`;

  const html = `
    <div style="font-family:system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height:1.6;">
      <h2>${appName} — New officer registration</h2>
      <p>A new registration is pending approval.</p>
      <ul>
        <li><b>Name:</b> ${user.name}</li>
        <li><b>Email:</b> ${user.email}</li>
        <li><b>User ID:</b> ${user.id}</li>
      </ul>
      <p>
        <a href="${approveUrl}" style="display:inline-block;padding:10px 14px;margin-right:8px;border-radius:9999px;background:#111827;color:#fff;text-decoration:none;font-weight:600;">Approve</a>
        <a href="${declineUrl}" style="display:inline-block;padding:10px 14px;border-radius:9999px;border:1px solid #D1D5DB;color:#111827;text-decoration:none;font-weight:600;background:#fff;">Decline</a>
      </p>
      <p style="font-size:12px;color:#6B7280">
        If the buttons don’t work:<br/>
        Approve: ${approveUrl}<br/>
        Decline: ${declineUrl}
      </p>
    </div>
  `;

  return mailer.sendMail({ from, to: toList, subject, text, html });
}
