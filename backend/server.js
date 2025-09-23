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

// 헬스체크
app.get("/healthz", (_, res) => res.send("ok"));

+// ✅ 프론트가 호출하는 핑 엔드포인트
+app.get("/api/ping", (_, res) => res.json({ pong: true }));

// 로그인 라우트
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "test" && password === "1234") {
    return res.json({ success: true, message: "Login successful" });
  }
  return res.status(403).json({ success: false, message: "Invalid credentials" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API up on", PORT));
