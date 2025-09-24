// lib/service.ts
type CreatePostInput = {
    title?: string;
    [k: string]: any;
  };
  
  // 🔹 최소 스텁: 실제 DB 연동 전까지는 메모리/가짜 값으로
  export const service = {
    async createPost(input: CreatePostInput) {
      // TODO: 나중에 Prisma 사용해서 실제 저장하도록 바꾸세요.
      const id = "post_" + Math.random().toString(36).slice(2, 8);
      const title = input?.title ?? "(untitled)";
      return { id, title };
    },
  };
  