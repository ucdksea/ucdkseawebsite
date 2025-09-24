import express from "express";
import { verifyAdminActionToken, sendApprovalEmail } from "../lib/mail";
import { prisma } from "../lib/prisma";

const router = express.Router();

router.get("/users/action", async (req, res) => {
  const token = (req.query.token as string) || "";
  if (!token) return res.status(400).send("Missing token");

  try {
    const { action, user } = verifyAdminActionToken(token);

    // 반드시 존재해야 함 (등록에서 만들었으니까)
    const exists = await prisma.user.findUnique({ where: { id: user.id } });
    if (!exists) {
      // 혹시 토큰의 id가 달라졌다면 email로도 한 번 더 시도
      const byEmail = await prisma.user.findUnique({ where: { email: user.email } });
      if (!byEmail) {
        return res.status(400).send("No such user pending approval");
      }
      await prisma.user.update({
        where: { email: user.email },
        data: { isApproved: action === "approve" },
      });
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: { isApproved: action === "approve" },
      });
    }

    if (action === "approve") {
      await sendApprovalEmail(user.email, user.name, user.email);
    }

    const appUrl = process.env.APP_BASE_URL || "https://www.ucdksea.com";
    res
      .setHeader("Content-Type", "text/html; charset=utf-8")
      .send(`<!doctype html><meta charset="utf-8">
        <meta http-equiv="refresh" content="2;url=${appUrl}">
        <title>${action === "approve" ? "Approved ✅" : "Declined 🚫"}</title>
        <div style="font:14px system-ui;padding:40px">
          ${action === "approve" ? "Approved" : "Declined"}. Redirecting…
        </div>`);
  } catch (e: any) {
    res.status(400).send(`Invalid or expired link. (${e?.message || "error"})`);
  }
});

export default router;
