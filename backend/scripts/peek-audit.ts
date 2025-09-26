// /Users/stephanie/Desktop/ucdksea-website/backend/scripts/peek-audit.ts

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.auditEvent.findMany({
    orderBy: { ts: "desc" },
    take: 20,
  });
  console.log(JSON.stringify(rows, null, 2));
  const total = await prisma.auditEvent.count();
  console.log(`\nTotal audit events: ${total}`);
}
main().catch(e => { console.error(e); process.exit(1); });
