"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.verifyToken = verifyToken;
exports.setAuthCookie = setAuthCookie;
exports.getAuthFromCookie = getAuthFromCookie;
exports.clearAuthCookie = clearAuthCookie;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
function signToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch {
        return null;
    }
}
/** 쿠키 설정 (Express) */
function setAuthCookie(res, token) {
    res.cookie("auth", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7 * 1000, // 7d (ms)
    });
}
/** 쿠키에서 JWT 파싱 (Express) */
function getAuthFromCookie(req) {
    const token = req.cookies?.auth;
    if (!token)
        return null;
    return verifyToken(token);
}
function clearAuthCookie(res) {
    res.clearCookie("auth", { path: "/" });
}
