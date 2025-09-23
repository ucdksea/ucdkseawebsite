import express from "express";
import cors from "cors";

app.set("trust proxy", 1);
const app = express();
app.use(express.json());
app.set("trust proxy", 1);

const allowed = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);
  

app.use(cors({
    origin: (origin, cb) => {
      // no Origin(서버 간 통신 등) 허용
      if (!origin) return cb(null, true);
      // 명시한 프론트만 허용
      if (allowed.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  }));

  const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || [
    "https://www.ucdksea.com",
    "https://ucdksea.com",
  ]).toString().split(",").map(s => s.trim()).filter(Boolean);

  const corsOptions = {
    origin(origin, cb) {
      // SSR/서버-서버 호출(Origin 없음) 허용
      if (!origin) return cb(null, true);
      const ok = ALLOWED_ORIGINS.includes(origin);
      cb(ok ? null : new Error("Not allowed by CORS"), ok);
    },
    credentials: true,
    methods: ["GET","HEAD","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };

app.use(cors(corsOptions));
app.options("*", cors());

app.get("/healthz", (_, res) => res.send("ok"));
app.get("/api/ping", (req, res) => {
    res.json({
      ok: true,
      time: new Date().toISOString(),
      origin: req.headers.origin || null,
    });
  });

app.get("/api/log", (req, res) => {
  res.json({
    data: [],
    page: Number(req.query.page || 1),
    page_size: Number(req.query.page_size || 20),
    total: 0
  });
});

app.post("/api/auth/register", (req, res) => {
    const { email, password, name } = req.body || {};
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // (데모) 승인 대기 상태로 응답. 실제로는 DB 저장/이메일 검증 등 추가.
    return res.status(201).json({ ok: true, message: "Registration submitted. Await admin approval." });
  });
  
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username === "test" && password === "1234") {
    return res.json({ success: true, message: "Login successful" });
  }
  return res.status(403).json({ success: false, message: "Invalid credentials" });
});


app.get("/api/admin/posts", (req, res) => res.json({ posts: [] }));
app.post("/api/admin/posts", (req, res) => res.json({ ok: true }));
app.delete("/api/admin/posts/:id", (req, res) => res.json({ ok: true }));
  
  // --- TEMP: SMTP live test route (삭제 예정) ---
// 점검: 현재 SMTP env 요약
app.get("/api/dev/env", (_req, res) => {
    const env = {
      SMTP_HOST: process.env.SMTP_HOST || null,
      SMTP_PORT: process.env.SMTP_PORT || null,
      SMTP_USER: process.env.SMTP_USER ? "(set)" : null,
      FROM_EMAIL: process.env.FROM_EMAIL || null,
      APP_BASE_URL: process.env.APP_BASE_URL || null,
      APP_LOGIN_URL: process.env.APP_LOGIN_URL || null,
    };
    res.json({ ok: true, env });
  });
  
  // SMTP 실발송 테스트
  app.get("/api/dev/test-email", async (_req, res) => {
    try {
      const host = process.env.SMTP_HOST;
      const port = Number(process.env.SMTP_PORT || 465);
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASS;
  
      if (!host || !user || !pass) {
        return res.status(400).json({
          ok: false,
          error: "SMTP env missing",
          missing: {
            SMTP_HOST: !host,
            SMTP_USER: !user,
            SMTP_PASS: !pass
          }
        });
      }
  
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass }
      });
  
      await transporter.verify();
      const info = await transporter.sendMail({
        from: process.env.FROM_EMAIL || user,
        to: user,
        subject: "SMTP test from api.ucdksea.com",
        text: "If you can read this, SMTP is working 🎉"
      });
  
      res.json({ ok: true, messageId: info.messageId });
    } catch (e) {
      res.status(500).json({ ok: false, error: String(e?.message || e) });
    }
  });
  import { sendAdminNewRegistration, sendApprovalEmail, verifyAdminActionToken } from "./lib/mail.js";

app.get("/api/admin/users/action", async (req, res) => {
  try {
    const token = String(req.query.token || "");
    const payload = verifyAdminActionToken(token); // { action, user:{ id, name, email } }

    if (payload.action === "approve") {
      await sendApprovalEmail(payload.user.email, payload.user.name, payload.user.email);
      return res.send("✅ Approved. An approval email has been sent to the user.");
    } else {
      return res.send("❌ Declined. The registration was declined.");
    }
  } catch (e) {
    console.error(e);
    return res.status(400).send("Invalid or expired token.");
  }
});


// server.ts or app.ts (Express)
import devRoutes from "./routes/dev";
app.use("/api/dev", devRoutes);


//
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API up on", PORT));

