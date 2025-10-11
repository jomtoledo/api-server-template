import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedUserCredentials() {
    console.log("Seeding UserCredentials...");
    await prisma.userCredential.createMany({
        data: [
            { id: "aaaea159-8bb9-4e64-b765-a96b97ae67ae", userId: "0c894b78-236e-4dbf-8bb9-f841f24502d9", type: "password", value: "$2b$10$qVjd.AyWln48GV.5j0yoPuTA6h59XG6uzRfzO7pE1CpG042EeEjFO", status: 1 }
        ], 
        skipDuplicates: true
    });
    console.log("UserCredentials seeding finished.");
}