const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function seed() {
  try {
    const hashedPassword = await bcrypt.hash("mudar@123", 10);

    await prisma.accounts.create({
      data: {
        password: hashedPassword,
        email: "admin@admin.com",
        name: "Admin",
        nickname: "admin",
      },
    });

    console.info("Seed data inserted successfully.");
  } catch (error) {
    console.error("Error inserting seed data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
