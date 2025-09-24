import express from "express";
import cors from "cors";
import devRouter from "./routes/dev";

const app = express();
app.use(express.json());

app.use(cors({
  origin: ["https://ucdksea.com", "https://www.ucdksea.com"],
  credentials: true
}));

app.get("/healthz", (_req, res) => res.send("ok"));
app.get("/api/ping", (_req, res) => res.json({ ok: true }));

app.use("/api/dev", devRouter);

// TODO: /api/auth/register, /api/auth/login, /api/admin/... 등 다른 라우트들도 동일 패턴으로 추가

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API up on", PORT));
