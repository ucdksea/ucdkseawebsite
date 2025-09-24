"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordHash = recordHash;
// lib/auditHash.ts
const crypto_1 = __importDefault(require("crypto"));
function recordHash(prevHash, payload) {
    const data = (prevHash ?? "") + JSON.stringify(payload, Object.keys(payload).sort());
    return crypto_1.default.createHash("sha256").update(data).digest("hex");
}
