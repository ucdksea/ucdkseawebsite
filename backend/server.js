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

// 로그인 라우트
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  // TODO: 실제 로그인 검증 로직
  if (username === "test" && password === "1234") {
    return res.json({ success: true, message: "Login successful" });
  }

  return res.status(401).json({ success: false, message: "Invalid credentials" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API up on", PORT));
