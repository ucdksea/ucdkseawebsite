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
app.options("*", cors());

app.get("/healthz", (_, res) => res.send("ok"));
app.get("/api/ping", (_, res) => res.json({ pong: true }));

app.get("/api/log", (req, res) => {
  res.json({
    data: [],
    page: Number(req.query.page || 1),
    page_size: Number(req.query.page_size || 20),
    total: 0
  });
});

app.get("/api/admin/posts", (req, res) => res.json({ posts: [] }));
app.post("/api/admin/posts", (req, res) => res.json({ ok: true }));
app.delete("/api/admin/posts/:id", (req, res) => res.json({ ok: true }));

app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body || {};
    if (username === "test" && password === "1234") {
      return res.json({ success: true, message: "Login successful" });
    }
    return res.status(403).json({ success: false, message: "Invalid credentials" });
  });
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log("API up on", PORT));