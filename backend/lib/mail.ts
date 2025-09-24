import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const port = Number(process.env.SMTP_PORT ?? 587);

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port,
  secure: port === 465,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!
  }
});

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
    `감사합니다.`
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

  await mailer.sendMail({ from, to, subject, text, html });
}

/* -------- 관리자 알림 (토큰에 user 통째로) -------- */
function signAdminActionToken(
  user: { id: string; name: string; email: string },
  action: "approve" | "decline"
) {
  const secret = process.env.ADMIN_ACTION_SECRET!;
  return jwt.sign({ action, user }, secret, { expiresIn: "30m" });
}

export function verifyAdminActionToken(token: string) {
  const secret = process.env.ADMIN_ACTION_SECRET!;
  return jwt.verify(token, secret) as {
    action: "approve" | "decline";
    user: { id: string; name: string; email: string };
  };
}

export async function sendAdminNewRegistration(
  to: string | string[],
  user: { id: string; name: string; email: string }
) {
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER!;
  const appName = process.env.APP_NAME || "UCD KSEA";
  const base = process.env.APP_BASE_URL || "http://127.0.0.1:3000";

  const approveToken = signAdminActionToken(user, "approve");
  const declineToken = signAdminActionToken(user, "decline");
// lib/mail.ts (기존 base 변수 교체)
const actionBase =
  process.env.ADMIN_ACTION_BASE  // ← 새 환경변수 (권장)
  || process.env.API_BASE_URL    // ← 있으면 사용
  || process.env.APP_BASE_URL    // (기존 값이 www 라면 잘못된 대상)
  || "http://localhost:4000";

// 아래 URL 생성부를 이렇게 유지
const approveUrl = `${actionBase}/api/admin/users/action?token=${encodeURIComponent(approveToken)}`;
const declineUrl = `${actionBase}/api/admin/users/action?token=${encodeURIComponent(declineToken)}`;

  const toList = Array.isArray(to) ? to : to.split(",").map(s => s.trim()).filter(Boolean);
  if (!toList.length) return;

  const subject = `[${appName}] New officer registration pending`;
  const text =
    `New registration\n` +
    `Name: ${user.name}\nEmail: ${user.email}\nUser ID: ${user.id}\n\n` +
    `Approve: ${approveUrl}\nDecline: ${declineUrl}\n`;

  const html = `
  <div style="font-family:system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height:1.6; color:#111; max-width:560px; margin:auto; padding:24px">
    <h2 style="margin:0 0 12px">${appName} — New officer registration</h2>
    <p style="margin:0 0 16px">A new registration is pending approval.</p>
    <ul style="margin:0 0 20px; padding:0 0 0 18px">
      <li><b>Name:</b> ${user.name}</li>
      <li><b>Email:</b> ${user.email}</li>
      <li><b>User ID:</b> ${user.id}</li>
    </ul>
    <div style="margin:14px 0 6px">
      <a href="${approveUrl}" style="display:inline-block; padding:10px 14px; margin-right:8px; border-radius:9999px; background:#111827; color:#fff; text-decoration:none; font-weight:600; font-size:14px;">Approve</a>
      <a href="${declineUrl}" style="display:inline-block; padding:10px 14px; border-radius:9999px; border:1px solid #D1D5DB; color:#111827; text-decoration:none; font-weight:600; font-size:14px; background:#fff;">Decline</a>
    </div>
  </div>`;
  await mailer.sendMail({ from, to: toList, subject, text, html });
}
