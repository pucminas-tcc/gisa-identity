import { PrismaClient, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function getAccountData(): Promise<Prisma.AccountCreateInput[]> {
  return [
    {
      email: 'associate@pucminas.com.br',
      password: await argon2.hash('123pucminas'),
    },
    {
      email: 'partner@pucminas.com.br',
      password: await argon2.hash('123pucminas'),
    },
  ];
}

async function main() {
  console.log(`Start seeding ...`);

  const accountData = await getAccountData();

  for (const u of accountData) {
    const plan = await prisma.account.create({
      data: u,
    });
    console.log(`Created plan '${plan.email}' with id: ${plan.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
