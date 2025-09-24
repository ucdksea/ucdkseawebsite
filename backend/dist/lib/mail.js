"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailer = void 0;
exports.sendApprovalEmail = sendApprovalEmail;
exports.verifyAdminActionToken = verifyAdminActionToken;
exports.sendAdminNewRegistration = sendAdminNewRegistration;
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const port = Number(process.env.SMTP_PORT ?? 587);
exports.mailer = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
async function sendApprovalEmail(to, name, email) {
    const from = process.env.FROM_EMAIL || process.env.SMTP_USER;
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
    await exports.mailer.sendMail({ from, to, subject, text, html });
}
/* -------- 관리자 알림 (토큰에 user 통째로) -------- */
function signAdminActionToken(user, action) {
    const secret = process.env.ADMIN_ACTION_SECRET;
    return jsonwebtoken_1.default.sign({ action, user }, secret, { expiresIn: "30m" });
}
function verifyAdminActionToken(token) {
    const secret = process.env.ADMIN_ACTION_SECRET;
    return jsonwebtoken_1.default.verify(token, secret);
}
async function sendAdminNewRegistration(to, user) {
    const from = process.env.FROM_EMAIL || process.env.SMTP_USER;
    const appName = process.env.APP_NAME || "UCD KSEA";
    const base = process.env.APP_BASE_URL || "http://127.0.0.1:3000";
    const approveToken = signAdminActionToken(user, "approve");
    const declineToken = signAdminActionToken(user, "decline");
    const approveUrl = `${base}/api/admin/users/action?token=${encodeURIComponent(approveToken)}`;
    const declineUrl = `${base}/api/admin/users/action?token=${encodeURIComponent(declineToken)}`;
    const toList = Array.isArray(to) ? to : to.split(",").map(s => s.trim()).filter(Boolean);
    if (!toList.length)
        return;
    const subject = `[${appName}] New officer registration pending`;
    const text = `New registration\n` +
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
    await exports.mailer.sendMail({ from, to: toList, subject, text, html });
}
