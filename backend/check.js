const { PrismaClient } = require('@prisma/client');

(async () => {
  const p = new PrismaClient();
  console.log('has post?', !!p.post);
  await p.$disconnect();
})();
