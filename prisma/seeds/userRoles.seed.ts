import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedUserRoles() {
    console.log("Seeding UserRoles...");
    await prisma.userRole.createMany({
        data: [
            { id: "ADMIN", name: "Admin", desc: "Administrator with full access", status: 1 }, 
            { id: "PROCESSOR", name: "Processor", desc: "Processors can have multiple access that can be given by an Admin", status: 1 }, 
            { id: "CLIENT_ADMIN", name: "Client Admin", desc: "Admin of a Client account", status: 1 }, 
            { id: "CLIENT_STAFF", name: "Client Staff", desc: "Staff of a Client account", status: 1 }, 
            { id: "GUEST", name: "Guest", desc: "Guest user with limited access", status: 1 }
        ], 
        skipDuplicates: true
    });
    console.log("UserRoles seeding finished.");
}