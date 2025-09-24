"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestId = getRequestId;
exports.getClientIp = getClientIp;
exports.getActor = getActor;
// lib/req.ts
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("./prisma");
function getRequestId(req) {
    return (req?.headers["x-request-id"] ||
        "req_" + crypto_1.default.randomBytes(6).toString("hex"));
}
function getClientIp(req) {
    const fwd = req?.headers["x-forwarded-for"] || "";
    const fromFwd = fwd.split(",")[0]?.trim();
    return fromFwd || req?.ip || req?.socket?.remoteAddress || "";
}
async function getActor(req) {
    try {
        const uid = req?.cookies?.uid;
        if (!uid)
            return "anonymous";
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: uid },
            select: { email: true }
        });
        return user?.email || uid;
    }
    catch {
        return "anonymous";
    }
}
