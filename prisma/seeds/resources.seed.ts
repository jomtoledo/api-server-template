import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedResources() {
    console.log("Seeding Resources...");
    await prisma.resource.createMany({
        data: [
            { id: "c482177f-9e57-47b7-9b74-7410d3ead89d", name: "User Creation", type: "api", apiMethod: "POST", module: "default", controller: "user", action: "index" }, 
            { id: "8b57d9e8-b033-41d8-a208-5a768e49b790", name: "User Management", type: "nav", apiMethod: "GET", module: "default", controller: "user", action: "index" }, 
            { id: "c778e55a-0dbe-4fa2-b642-0236d37b207b", name: "User Login", type: "api", apiMethod: "POST", module: "default", controller: "user", action: "login" }, 
            { id: "5a27f25e-e2ee-4702-95e2-4f3683b6455d", name: "User Logout", type: "api", apiMethod: "POST", module: "default", controller: "user", action: "logout" }, 
            { id: "cea341f8-44e1-4a3d-b25f-9cad70777faa", name: "User Update", type: "api", apiMethod: "PUT", module: "default", controller: "user", action: "index" }, 
            { id: "df67d0c8-44f0-4f2c-962c-0f2b4002c51d", name: "User Deletion", type: "api", apiMethod: "DELETE", module: "default", controller: "user", action: "index" }, 
            { id: "61aeaae9-6ca4-401f-8261-1472cc52f796", name: "User Restoration", type: "api", apiMethod: "PATCH", module: "default", controller: "user", action: "index" }
        ], 
        skipDuplicates: true
    });
    console.log("Resources seeding finished.");
}