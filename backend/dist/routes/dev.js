"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mail_1 = require("../lib/mail");
const router = express_1.default.Router();
router.get("/env", (_req, res) => {
    res.json({
        ok: true,
        env: {
            SMTP_HOST: process.env.SMTP_HOST,
            SMTP_PORT: process.env.SMTP_PORT,
            SMTP_USER: process.env.SMTP_USER ? "(set)" : "",
            FROM_EMAIL: process.env.FROM_EMAIL,
            APP_BASE_URL: process.env.APP_BASE_URL,
            APP_LOGIN_URL: process.env.APP_LOGIN_URL
        }
    });
});
router.get("/test-email", async (_req, res) => {
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
        res.status(500).json({ ok: false, error: err?.message || String(err) });
    }
});
exports.default = router;
