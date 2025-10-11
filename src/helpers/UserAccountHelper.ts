import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export class UserAccountHelper {
    /**
     * Validate email format
     * @param email Email address to validate
     * @return True if email format is valid, false otherwise
     */
    static validateEmail(email: string): boolean {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Generates a random password of specified length
     * @param length Length of the password (default is 8)
     * @return Randomly generated password
     */
    static generateRandomPassword(length: number = 8): string {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let password = "";
        for (let i = 0; i < length; i++) password += chars.charAt(Math.floor(Math.random() * chars.length));
        return password;
    }
    
    /**
     * Encrypt password
     * @param password Plain text password
     * @return Encrypted password
     */
    static encryptPassword(password: string): string {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }

    /**
     * Compare given password with stored password
     * @param givenPassword Password provided by user
     * @param accountPassword Encrypted password stored in the database
     * @return True if passwords match, false otherwise
     */
    static async validatePassword(givenPassword: string, accountPassword: string): Promise<boolean> {
        return bcrypt.compare(givenPassword, accountPassword);
    }

    /**
     * Generate JWT token for an account
     * @param user User object containing at least the id
     * @return Generated JWT token
     */
    static async generateToken(user: any): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.sign(
                user,
                process.env.SECRET_KEY as jwt.Secret,
                { expiresIn: "4h" },
                (error: Error | null, token?: string) => {
                    if (error || !token) return reject("Token generation failed");
                    resolve(token);
                }
            );
        });
    }
}