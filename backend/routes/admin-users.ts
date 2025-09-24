import express from "express";
import { verifyAdminActionToken, sendApprovalEmail } from "../lib/mail";
import { prisma } from "../lib/prisma"; // 나중에 켜기

const router = express.Router();

console.log("[admin-users] router loaded");

router.get("/__alive", (_req, res) => {
  res.json({ ok: true, router: "admin-users" });
});

router.get("/users/action", async (req, res) => {
  const token = (req.query.token as string) || "";
  if (!token) return res.status(400).send("Missing token");

  try {
    const { action, user } = verifyAdminActionToken(token);
    const appUrl = process.env.APP_BASE_URL || "https://www.ucdksea.com";

    // 나중에 DB 반영할 때:
    await prisma.user.update({
        where: { id: user.id },
        data: { isApproved: action === "approve" }
      });

    if (action === "approve") {
      await sendApprovalEmail(user.email, user.name, user.email);
    }

    res
      .setHeader("Content-Type", "text/html; charset=utf-8")
      .send(`<!doctype html>
<meta charset="utf-8">
<meta http-equiv="refresh" content="2;url=${appUrl}">
<title>${action === "approve" ? "Approved ✅" : "Declined 🚫"}</title>
<div style="font:14px system-ui;padding:40px">
  ${action === "approve" ? "Approved" : "Declined"}. Redirecting…
  <a href="${appUrl}">Go now</a>
</div>`);
  } catch (e: any) {
    res.status(400).send(`Invalid or expired link. (${e?.message || "error"})`);
  }
});

export default router;
