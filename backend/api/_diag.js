module.exports = (req, res) => {
  const secret = process.env.ADMIN_ACTION_SECRET ?? "";
  const headerRaw = req.headers["x-admin-token"];
  const header = Array.isArray(headerRaw) ? headerRaw[0] : (headerRaw ?? "");
  res.status(200).json({
    hasSecret: secret.length > 0,
    secretLen: secret.length,
    headerLen: typeof header === "string" ? header.length : 0,
    equalTrimmed:
      typeof header === "string" && header.trim() === secret.trim(),
  });
};
