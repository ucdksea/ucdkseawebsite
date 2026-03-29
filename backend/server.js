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

// ─────────────────────────────────────────────────────────────
// ✅ 여기서부터 복사해서 붙여넣으세요 (기존 코드는 절대 건드리지 마세요)
// ─────────────────────────────────────────────────────────────
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// [조회 GET]
app.get('/api/log', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.min(200, Math.max(1, parseInt(req.query.page_size) || 20));
    
    const [total, rows] = await Promise.all([
      prisma.auditEvent.count(),
      prisma.auditEvent.findMany({
        orderBy: { ts: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const data = rows.map((r) => ({
      id: r.id,
      timestamp: r.ts.toISOString(),
      action: r.action,                 
      actor: r.actorId || "system",
      target_type: r.targetType,
      target_id: r.targetId || "",
      title: r.title || "",
      summary: r.summary || "",
      changes: [],
      ip: r.actorIp || "",
    }));

    res.json({ data, page, page_size: pageSize, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// [저장 POST]
app.post('/api/log', async (req, res) => {
  try {
    const { email, status, reason } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

    const newLog = await prisma.auditEvent.create({
      data: {
        action: status === "SUCCESS" ? "LOGIN_SUCCESS" : "LOGIN_FAILED",
        actorId: email || "unknown",
        actorIp: ip,
        targetType: "AUTH",
        title: status === "SUCCESS" ? "System Access Granted" : "System Access Denied",
        summary: reason || "Authentication attempt recorded",
        severity: status === "SUCCESS" ? "INFO" : "WARNING",
        ts: new Date(),
      },
    });

    res.status(201).json({ success: true, logId: newLog.id });
  } catch (error) {
    console.error("Audit log creation error:", error);
    res.status(500).json({ error: "Failed to create audit log" });
  }
});
// ─────────────────────────────────────────────────────────────
// ✅ 여기까지! (이 아래에 const PORT = ... 코드가 오면 됩니다)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API up on", PORT));
