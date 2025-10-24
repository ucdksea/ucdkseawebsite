/** Vercel Node.js Function (CommonJS) */
module.exports = async (req, res) => {
  try {
    res.status(200).json({ ok: true, time: new Date().toISOString() , "tag":"r1"});
  } catch (e) {
    console.error("PING_ERROR", e);
    res.status(500).send("PING_ERROR: " + (e && e.message ? e.message : "unknown"));
  }
};
