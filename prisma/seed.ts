import { PrismaClient } from "@prisma/client";
import { seedUserRoles } from "./seeds/userRoles.seed";
import { seedUsers } from "./seeds/users.seed";
import { seedUserProfiles } from "./seeds/userProfiles.seed";
import { seedUserCredentials } from "./seeds/userCredentials.seed";
import { seedResources } from "./seeds/resources.seed";
import { seedResourceAccess } from "./seeds/resourceAccess.seed";
import { seedLogCategories } from "./seeds/logCategory.seed";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding DB...");
  await seedUserRoles();
  await seedUsers();
  await seedUserProfiles();
  await seedUserCredentials();
  await seedResources();
  await seedResourceAccess();
  await seedLogCategories();
  console.log("Seeding DB finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });