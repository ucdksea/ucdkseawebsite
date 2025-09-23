// server.js
import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

// ❶ 허용할 프론트 도메인 명시
const allowedOrigins = new Set([
  "https://www.ucdksea.com",
  "https://ucdksea.com",
]);

// ❷ cors 옵션
const corsOptions = {
  origin(origin, cb) {
    // 일부 브라우저/봇은 origin이 없을 수 있으니 null 허용은 필요시 조정
    if (!origin || allowedOrigins.has(origin)) return cb(null, true);
    return cb(new Error("CORS: Not allowed"), false);
  },
  credentials: true, // 쿠키/인증정보 사용 시 필수
};

// ❸ 모든 라우트에 cors 적용 + 프리플라이트 허용
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // OPTIONS 프리플라이트 응답

// (선택) 명시적 헤더 보강 — 디버깅에 도움
app.use((req, res, next) => {
  const o = req.headers.origin;
  if (o && allowedOrigins.has(o)) {
    res.header("Access-Control-Allow-Origin", o);
    res.header("Vary", "Origin");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// 헬스체크
app.get("/healthz", (_, res) => res.send("ok"));

// 로그인 라우트 (POST) — 실제 구현은 여기에
app.post("/api/auth/login", (req, res) => {
  // ... 로그인 처리
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API up on", PORT));
