import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedResourceAccess() {
    console.log("Seeding ResourceAccess...");
    await prisma.resourceAccess.createMany({
        data: [
            { id: "ec85cddd-a945-4c9b-8b68-62d32a4122b2", resourceId: "c482177f-9e57-47b7-9b74-7410d3ead89d", level: 1, value: "PROCESSOR" },
            { id: "df2e252f-b017-430f-8824-a0846211f626", resourceId: "c482177f-9e57-47b7-9b74-7410d3ead89d", level: 1, value: "PROCESSOR" }, 
            { id: "f911b9e5-a1a1-4e57-9f96-90dd8cba7f14", resourceId: "8b57d9e8-b033-41d8-a208-5a768e49b790", level: 1, value: "PROCESSOR" }, 
            { id: "98ae63c6-a0e9-46e1-a67a-a7c59dd64a19", resourceId: "c778e55a-0dbe-4fa2-b642-0236d37b207b", level: 1, value: "PROCESSOR" }, 
            { id: "79cd91ce-408c-455b-b463-e63597745fcc", resourceId: "5a27f25e-e2ee-4702-95e2-4f3683b6455d", level: 1, value: "PROCESSOR" }, 
            { id: "069be2c5-96f7-4bd4-8535-f646a13e2b23", resourceId: "cea341f8-44e1-4a3d-b25f-9cad70777faa", level: 1, value: "PROCESSOR" }, 
            { id: "f4344d06-307b-40b2-b66f-789254ed41b1", resourceId: "df67d0c8-44f0-4f2c-962c-0f2b4002c51d", level: 1, value: "PROCESSOR" }, 
            { id: "33400a63-d307-4800-835c-fc86ec88a23b", resourceId: "61aeaae9-6ca4-401f-8261-1472cc52f796", level: 1, value: "PROCESSOR" }
        ], 
        skipDuplicates: true
    });
    console.log("ResourceAccess seeding finished.");
}