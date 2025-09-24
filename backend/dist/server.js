"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const withAudit_1 = require("./lib/withAudit");
const prisma_audit_middleware_1 = require("./lib/prisma-audit-middleware");
const mail_1 = require("./lib/mail");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env") });
(0, prisma_audit_middleware_1.attachAuditMiddleware)();
const app = (0, express_1.default)();
// 먼저 body/cookie 미들웨어
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// CORS 설정
app.use((0, cors_1.default)({
    origin: [
        "https://ucdksea.com",
        "https://www.ucdksea.com",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    credentials: true,
}));
// Preflight 허용
app.options("*", (0, cors_1.default)({
    origin: [
        "https://ucdksea.com",
        "https://www.ucdksea.com",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    credentials: true,
}));
// ✅ 라우터는 그 다음에
const auth_1 = __importDefault(require("./routes/auth"));
const dev_1 = __importDefault(require("./routes/dev"));
app.use("/api/auth", auth_1.default);
app.use("/api/dev", dev_1.default);
// -------- dev: 메일 테스트 --------
app.get("/api/dev/test-email", async (_req, res) => {
    try {
        const info = await mail_1.mailer.sendMail({
            from: process.env.FROM_EMAIL || process.env.SMTP_USER,
            to: process.env.SMTP_USER,
            subject: "[UCD KSEA] Test Email",
            text: "If you can read this, SMTP is working 🎉"
        });
        res.json({ ok: true, info });
    }
    catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});
// -------- posts 샘플 (임시 service 대체) --------
const service = {
    async createPost(body) {
        return { id: "p_" + Date.now().toString(36), title: body?.title || "(untitled)" };
    }
};
app.post("/api/admin/posts", (0, withAudit_1.withAudit)(async (req, res) => {
    const created = await service.createPost(req.body);
    res.json({ ok: true, id: created.id, title: created.title });
    return created; // 감사 래퍼가 result를 참조함
}, {
    action: "CREATE",
    targetType: "POST",
    targetId: (r) => r?.id,
    title: (r) => r?.title,
    summary: () => "Post created"
}));
app.get("/healthz", (_req, res) => res.send("ok"));
app.get("/api/ping", (_req, res) => res.json({ ok: true }));
app.get("/healthz", (_req, res) => res.send("ok"));
app.get("/api/dev/env", (_req, res) => {
    res.json({
        ok: true,
        env: {
            NODE_ENV: process.env.NODE_ENV,
            PORT: process.env.PORT,
            SMTP_HOST: process.env.SMTP_HOST,
            SMTP_PORT: process.env.SMTP_PORT,
            SMTP_USER: process.env.SMTP_USER ? "(set)" : "",
            FROM_EMAIL: process.env.FROM_EMAIL,
            APP_BASE_URL: process.env.APP_BASE_URL,
            APP_LOGIN_URL: process.env.APP_LOGIN_URL,
        },
    });
});
const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => console.log("API up on", PORT));
