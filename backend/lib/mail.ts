// lib/mail.ts
import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: Number(process.env.SMTP_PORT) === 465, // 465 포트면 TLS
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

export async function sendApprovalEmail(to: string, username: string) {
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER!;
  const appName = process.env.APP_NAME || "Our Service";
  const loginUrl = process.env.APP_LOGIN_URL || "http://localhost:3000/login";

  const subject = `[${appName}] 회원가입 승인 완료 안내`;
  const text = [
    `${username}님, 안녕하세요.`,
    ``,
    `회원가입 승인이 완료되었습니다.`,
    `아래 링크에서 아이디(${username})와 비밀번호로 로그인 해주세요.`,
    loginUrl,
    ``,
    `감사합니다.`,
  ].join("\n");

  const html = `
    <div style="font-family:system-ui, AppleSDGothicNeo, Arial; line-height:1.6;">
      <h2>${appName} 회원가입 승인 완료</h2>
      <p><b>${username}</b>님, 안녕하세요.</p>
      <p>회원가입 승인이 완료되었습니다. 아래 버튼을 눌러 로그인하세요.</p>
      <p style="margin:24px 0;">
        <a href="${loginUrl}" style="background:#111827;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;">
          로그인 하기
        </a>
      </p>
      <p>아이디: <b>${username}</b></p>
      <hr />
      <small>본 메일은 발신전용입니다.</small>
    </div>
  `;

  await mailer.sendMail({ from, to, subject, text, html });
}
