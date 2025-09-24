// server.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { withAudit } from "./lib/withAudit";
import { attachAuditMiddleware } from "./lib/prisma-audit-middleware";
import { mailer } from "./lib/mail";
import dotenv from "dotenv";
import path from "path";
import adminUsersRouter from "./routes/admin-users";


dotenv.config({ path: path.resolve(__dirname, "../.env") });


attachAuditMiddleware();

const app = express();

// server.ts (가장 위쪽 import 아래, 라우트 등록보다 "먼저")
const ALLOWED = new Set(
  (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)
    // 안전하게 기본값도 포함
    .concat(["https://www.ucdksea.com", "https://ucdksea.com"])
);

app.use((req, res, next) => {
  const origin = req.headers.origin as string | undefined;

  if (origin && ALLOWED.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  // 캐시/프록시 친화적
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") {
    // 브라우저가 요청한 헤더/메서드를 그대로 허용(없으면 기본 세트)
    const reqHeaders =
      (req.headers["access-control-request-headers"] as string) ||
      "Content-Type, Authorization";
    const reqMethod =
      (req.headers["access-control-request-method"] as string) ||
      "GET,POST,PUT,PATCH,DELETE,OPTIONS";

    res.setHeader("Access-Control-Allow-Methods", reqMethod);
    res.setHeader("Access-Control-Allow-Headers", reqHeaders);

    // 프리플라이트는 바디 없이 204로 즉시 끝내야 프록시가 안 틀어짐
    return res.sendStatus(204);
  }

  next();
});


// 먼저 body/cookie 미들웨어
app.use(express.json());
app.use(cookieParser());


// CORS 설정
app.use(
  cors({
    origin: [
      "https://ucdksea.com",
      "https://www.ucdksea.com",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ],
    credentials: true,
  })
);


// 디버그: 현재 등록된 모든 라우트를 문자열로 반환
app.get("/__routes", (_req, res) => {
  const routes: string[] = [];
  function print(path: any, layer: any) {
    if (layer.route) {
      layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))));
    } else if (layer.name === 'router' && layer.handle.stack) {
      layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))));
    } else if (layer.method) {
      routes.push(layer.method.toUpperCase() + ' ' + path.concat(split(layer.regexp)).filter(Boolean).join(''));
    }
  }
  function split(thing: any) {
    if (typeof thing === 'string') return thing.split('/');
    if (thing.fast_slash) return [''];
    const match = thing.toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '$')
      .match(/^\/\^\\\/(?:(.*))\\\/\?\$\//);
    return match ? match[1].split('\\/').map((s: string) => s.replace(/\\(.)/g, '$1')) : [''];
  }
  // @ts-ignore
  app._router.stack.forEach(print.bind(null, []));
  res.json({ routes });
});

// Preflight 허용
app.options("*", cors({
  origin: [
    "https://ucdksea.com",
    "https://www.ucdksea.com",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ],
  credentials: true,
}));

// ✅ 라우터는 그 다음에
app.use("/api/admin", adminUsersRouter);
import authRouter from "./routes/auth";
import devRouter from "./routes/dev";
app.use("/api/auth", authRouter);
app.use("/api/dev", devRouter);


// -------- dev: 메일 테스트 --------

app.get("/api/dev/test-email", async (_req, res) => {
  try {
    const info = await mailer.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: "[UCD KSEA] Test Email",
      text: "If you can read this, SMTP is working 🎉"
    });
    res.json({ ok: true, info });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// -------- posts 샘플 (임시 service 대체) --------
const service = {
  async createPost(body: any) {
    return { id: "p_" + Date.now().toString(36), title: body?.title || "(untitled)" };
  }
};

app.post(
  "/api/admin/posts",
  withAudit(
    async (req, res) => {
      const created = await service.createPost(req.body);
      res.json({ ok: true, id: created.id, title: created.title });
      return created; // 감사 래퍼가 result를 참조함
    },
    {
      action: "CREATE",
      targetType: "POST",
      targetId: (r) => r?.id,
      title: (r) => r?.title,
      summary: () => "Post created"
    }
  )
);

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
// 맨 위 import들 아래에 추가
import fs from "fs";

// (A) 현재 dist/routes 안에 뭐가 있는지 보기
app.get("/__dist", (_req, res) => {
  const dir = path.join(__dirname, "routes");
  const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  res.json({ __dirname, dir, files });
});

// (B) 실제로 등록된 모든 라우트 나열 (문자열)
app.get("/__routes", (_req, res) => {
  const out: string[] = [];
  // @ts-ignore
  app._router?.stack?.forEach((layer: any) => {
    if (layer.route && layer.route.path) {
      const methods = Object.keys(layer.route.methods)
        .filter((m) => layer.route.methods[m])
        .map((m) => m.toUpperCase());
      out.push(`${methods.join(",")} ${layer.route.path}`);
    } else if (layer.name === "router" && layer.handle?.stack) {
      // 프리픽스 추출
      const prefix =
        layer.regexp?.fast_slash
          ? "/"
          : (layer.regexp?.toString().match(/^\/\^\\\/(.+?)\\\/\?\$\//)?.[1] || "")
              .replace(/\\\//g, "/");
      layer.handle.stack.forEach((r: any) => {
        if (r.route?.path) {
          const methods = Object.keys(r.route.methods)
            .filter((m) => r.route.methods[m])
            .map((m) => m.toUpperCase());
          out.push(`${methods.join(",")} /${prefix}${r.route.path}`.replace(/\/+/g, "/"));
        }
      });
    }
  });
  res.type("text/plain").send(out.sort().join("\n"));
});

// (C) 최소 환경변수 확인
app.get("/__env", (_req, res) => {
  res.json({
    PORT: process.env.PORT,
    ADMIN_ACTION_BASE: process.env.ADMIN_ACTION_BASE,
    APP_BASE_URL: process.env.APP_BASE_URL,
  });
});

// --- DEBUG: 현재 서버가 읽은 DATABASE_URL 확인 ---
app.get("/__env/db", (_req, res) => {
  const raw = process.env.DATABASE_URL || "";
  let host = "", port = "", db = "", sslmode = "";
  try {
    const u = new URL(raw);
    host = u.hostname;
    port = u.port;
    db = u.pathname;
    sslmode = u.searchParams.get("sslmode") || "";
  } catch {}
  res.json({
    hasEnv: !!raw,
    host, port, db, sslmode,
    raw: raw.replace(/:[^:@/]+@/, "://***:***@") // 비번 마스킹
  });
});


const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => console.log("API up on", PORT));
