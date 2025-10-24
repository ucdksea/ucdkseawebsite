export default function handler(req, res) {
    res.status(200).json({
      hasSecret: !!process.env.ADMIN_ACTION_SECRET,
      secretLen: process.env.ADMIN_ACTION_SECRET?.length ?? 0,
      startsWithQ: process.env.ADMIN_ACTION_SECRET?.startsWith("Q") ?? false,
    });
  }
  