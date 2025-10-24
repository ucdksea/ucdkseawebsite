/** Vercel Node.js Function (CommonJS) */
module.exports = (req, res) => {
  try {
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error("HEALTH_ERROR", e);
    res.status(500).send("HEALTH_ERROR: " + (e && e.message ? e.message : "unknown"));
  }
};
