import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedLogCategories() {
    console.log("Seeding LogCategories...");
    await prisma.logCategory.createMany({
        data: [
            { id: "AUTH_LOGIN", name: "User Logged In", desc: "A User logged on to the system" }, 
            { id: "AUTH_LOGOUT", name: "User Logged Out", desc: "A User logged out from the system" }, 
            { id: "AUTH_FAILED", name: "User Logged In Failed", desc: "Failed login attempt" }, 
            { id: "USER_CREATE", name: "Created a User", desc: "A User created a new User account" }, 
            { id: "USER_GETBYID", name: "Retrieved a User", desc: "A User retrieved a User account" }, 
            { id: "USER_GET", name: "Retrieved Users", desc: "A User retrieved a list of User accounts" }, 
            { id: "USER_UPDATE", name: "Updated a User", desc: "A User updated a User account" }, 
            { id: "USER_DELETE", name: "Deleted a User", desc: "A User deleted/deactivated a User account" }, 
            { id: "USER_RESTORE", name: "Restored a User", desc: "A User restored a User account" }, 
            { id: "USER_PASSWORD_CHANGE", name: "Changed User Password", desc: "A User changed the password of a User account" }
        ], 
        skipDuplicates: true
    });
    console.log("LogCategories seeding finished.");
}