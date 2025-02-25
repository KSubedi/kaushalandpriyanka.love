const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Checking invites in the database...");

    // Count invites
    const inviteCount = await prisma.invite.count();
    console.log(`Total invites in database: ${inviteCount}`);

    // Get all invites
    const invites = await prisma.invite.findMany({
      orderBy: { created_at: "desc" },
      include: { response: true },
    });

    console.log(`Retrieved ${invites.length} invites`);

    if (invites.length > 0) {
      // Log the first invite
      console.log("First invite:", JSON.stringify(invites[0], null, 2));
    } else {
      console.log("No invites found in the database");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
