import { PrismaClient } from "@prisma/client";

export default class LoggerService {
    
    private _prisma: PrismaClient;
    
    constructor(prisma: PrismaClient) {
        this._prisma = prisma;
    }
    
    /**
     * Create an audit log entry.
     * @param categoryId - FK from LogCategory
     * @param desc - Description of the action (e.g., "Updated user details")
     * @param table - Affected database table
     * @param rowId - ID of the record affected
     * @param oldData - Data before the change (if applicable)
     * @param newData - Data after the change (if applicable)
     * @param userId - ID of the acting user
     */
    public async insert({
        log_categories_id_fk: categoryId, 
        desc, 
        table, 
        row_id: rowId, 
        old_data: oldData, 
        new_data: newData, 
        users_id_fk: userId 
    }: {
        log_categories_id_fk: string;
        desc: string;
        table?: string;
        row_id?: string;
        old_data?: any;
        new_data?: any;
        users_id_fk: string;
    }) {
        try {
            await this._prisma.log.create({
                data: {
                    categoryId,
                    desc,
                    table: table || undefined,
                    rowId: rowId || undefined,
                    oldData: oldData ? JSON.stringify(oldData) : undefined,
                    newData: newData ? JSON.stringify(newData) : undefined,
                    userId
                }
            });
        } catch (e: any) {
            console.error(`ERR: /LoggerService/insert(): `, e?.message || "Internal server error");
        }
    }
}