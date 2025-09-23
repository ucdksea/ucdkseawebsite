import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors({
  origin: [
    "https://ucdksea.com",
    "https://www.ucdksea.com"
  ],
  credentials: true
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