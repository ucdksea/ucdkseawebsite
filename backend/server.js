import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

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
app.options("*", cors());

app.get("/healthz", (_, res) => res.send("ok"));
app.get("/api/ping", (_, res) => res.json({ pong: true }));

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
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log("API up on", PORT));


  // --- TEMP: SMTP live test route (삭제 예정) ---
import nodemailer from "nodemailer";

app.get("/api/dev/test-email", async (req, res) => {
  const port = Number(process.env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,             // 465면 TLS
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    logger: true,                     // Render 로그에 자세히 남김
    debug: true,
  });

  try {
    // 1) SMTP 자격/접속 확인
    await transporter.verify();

    // 2) 실제 발송
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER, // ex) "UC DAVIS KSEA <your@gmail.com>"
      to: process.env.SMTP_USER,                              // 수신: 본인 메일로 우선
      subject: "SMTP test from api.ucdksea.com",
      text: "If you can read this, SMTP is working 🎉",
    });

    res.json({ ok: true, messageId: info.messageId });
  } catch (e) {
    console.error("SMTP TEST ERROR:", e);
    res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
});
