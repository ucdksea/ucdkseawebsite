import express from "express";
import cors from "cors";
import devRouter from "./routes/dev";

app.use(express.json());

// server.js
const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(()=>{
  const server = express();

  // (선택) 아주 특수한 커스텀 라우트만 여기서 처리하고…

  // ✅ 나머지 전부 Next에 위임 (API 라우트 포함)
  server.all('*', (req, res) => handle(req, res));

  const port = process.env.PORT || 3000;
  server.listen(port, () => console.log(`> Ready on http://localhost:${port}`));
});

app.use(cors({
  origin: ["https://ucdksea.com", "https://www.ucdksea.com"],
  credentials: true
}));

app.get("/healthz", (_req, res) => res.send("ok"));
app.get("/api/ping", (_req, res) => res.json({ ok: true }));

app.use("/api/dev", devRouter);

// TODO: /api/auth/register, /api/auth/login, /api/admin/... 등 다른 라우트들도 동일 패턴으로 추가

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API up on", PORT));
