import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedUsers() {
    console.log("Seeding Users...");
    await prisma.user.createMany({
        data: [
            { id: "0c894b78-236e-4dbf-8bb9-f841f24502d9", roleId: "ADMIN", email: "info@jtsoftware.dev", mobileNo: "09273919009", status: 1 } 
        ], 
        skipDuplicates: true
    });
    console.log("Users seeding finished.");
}