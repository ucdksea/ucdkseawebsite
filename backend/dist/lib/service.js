"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.service = void 0;
// 🔹 최소 스텁: 실제 DB 연동 전까지는 메모리/가짜 값으로
exports.service = {
    async createPost(input) {
        // TODO: 나중에 Prisma 사용해서 실제 저장하도록 바꾸세요.
        const id = "post_" + Math.random().toString(36).slice(2, 8);
        const title = input?.title ?? "(untitled)";
        return { id, title };
    },
};
