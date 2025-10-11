import { PrismaClient } from '@prisma/client';

/**
 * MainController is an abstract class that provides common functionalities for all controllers.
 */
export default abstract class MainController {

    protected _prisma: PrismaClient;
    
    /**
     * @param prisma An instance of PrismaClient
     */
    constructor(prisma: PrismaClient) {
        this._prisma = prisma;
    }
    
    /**
     * Generates a UUID v4 string
     * @returns A UUID v4 string
     */
    generateUUIDv4 = (): string => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    /**
     * Validates if a string is a valid JSON string
     * @param str The string to validate
     * @returns The parsed JSON object if valid, false otherwise
     */
    validateJSONString = (str: string): JSON | false => {
        try {
            return JSON.parse(str);
        } catch (e) {
            return false;
        }
    }
}