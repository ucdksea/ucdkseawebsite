"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// backend/lib/prisma.ts
const client_1 = require("@prisma/client");
exports.prisma = globalThis._prisma ?? new client_1.PrismaClient();
if (process.env.NODE_ENV !== 'production') {
    globalThis._prisma = exports.prisma;
}
