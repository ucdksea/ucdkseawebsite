import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors({
  origin: [
    "https://ucdksea.com",
    "https://www.ucdksea.com"
  ],
  credentials: true
}));

app.get("/healthz", (_, res) => res.send("ok"));

// 👇 추가
app.get("/api/ping", (_, res) => res.json({ pong: true }));

app.get("/api/activity", (req, res) => {
  res.json({
    data: [],
    page: Number(req.query.page || 1),
    page_size: Number(req.query.page_size || 20),
    total: 0
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API up on", PORT));
