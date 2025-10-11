import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedUserProfiles() {
    console.log("Seeding UserProfiles...");
    await prisma.userProfile.createMany({
        data: [
            { id: "ec309bdc-0aea-4d71-99fa-687969a4fd4a", userId: "0c894b78-236e-4dbf-8bb9-f841f24502d9", firstName: "Admin", lastName: "User",  status: 1 }
        ], 
        skipDuplicates: true
    });
    console.log("UserProfiles seeding finished.");
}