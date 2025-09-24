// server.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { withAudit } from "./lib/withAudit";
import { attachAuditMiddleware } from "./lib/prisma-audit-middleware";
import { mailer } from "./lib/mail";

attachAuditMiddleware();

const app = express();
app.use(express.json());
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: [
      "https://ucdksea.com",
      "https://www.ucdksea.com",
      "http://localhost:3000",
      "http://127.0.0.1:3000"
    ],
    credentials: true
  })
);

// -------- dev: 메일 테스트 --------
app.get("/api/dev/test-email", async (_req, res) => {
  try {
    const info = await mailer.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: "[UCD KSEA] Test Email",
      text: "If you can read this, SMTP is working 🎉"
    });
    res.json({ ok: true, info });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// -------- posts 샘플 (임시 service 대체) --------
const service = {
  async createPost(body: any) {
    return { id: "p_" + Date.now().toString(36), title: body?.title || "(untitled)" };
  }
};

app.post(
  "/api/admin/posts",
  withAudit(
    async (req, res) => {
      const created = await service.createPost(req.body);
      res.json({ ok: true, id: created.id, title: created.title });
      return created; // 감사 래퍼가 result를 참조함
    },
    {
      action: "CREATE",
      targetType: "POST",
      targetId: (r) => r?.id,
      title: (r) => r?.title,
      summary: () => "Post created"
    }
  )
);

app.get("/healthz", (_req, res) => res.send("ok"));
app.get("/api/ping", (_req, res) => res.json({ ok: true }));

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => console.log("API up on", PORT));
