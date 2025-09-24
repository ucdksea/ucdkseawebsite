"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../lib/prisma");
const mail_1 = require("../lib/mail");
const router = express_1.default.Router();
router.post("/register", async (req, res) => {
    try {
        const { email, password, name } = req.body || {};
        if (!email || !password || !name) {
            return res.status(400).json({ ok: false, error: "Missing fields" });
        }
        // 이미 존재하면 에러
        const dup = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (dup)
            return res.status(409).json({ ok: false, error: "Email already registered" });
        const id = crypto_1.default.randomUUID();
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        // DB에 "승인대기"로 저장
        await prisma_1.prisma.user.create({
            data: {
                id,
                email,
                name,
                passwordHash,
                isApproved: false,
            },
        });
        // 운영진 알림 메일
        const admins = process.env.ADMIN_EMAILS || process.env.SMTP_USER || "";
        await (0, mail_1.sendAdminNewRegistration)(admins, { id, name, email });
        return res.json({ ok: true, message: "Registration submitted" });
    }
    catch (e) {
        return res.status(500).json({ ok: false, error: e?.message || "Internal error" });
    }
});
exports.default = router;
