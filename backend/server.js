// ESM 문법(위에 "type":"module"일 때)
import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

// 프론트 도메인만 열기 (Squarespace 도메인으로 교체)
app.use(cors({
    origin: [
        "https://ucdksea.com",
        "https://www.ucdksea.com"
    ],
    credentials: true
}));

// 헬스체크 (Render가 200 확인)
app.get("/healthz", (req, res) => res.send("ok"));

// 샘플 API
app.get("/api/ping", (req, res) => res.json({ pong: true }));

// Render가 넣어주는 포트 사용 필수
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API up on", PORT));
