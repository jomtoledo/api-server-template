import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import MainController from './MainController';
import { UserAccountHelper } from "../../../helpers/UserAccountHelper";
export default class UserController extends MainController {
    
    constructor(prisma: PrismaClient) {
        super(prisma);
    }
    
    /**
     * Creates a new user account
     * - Expects role_id, email, mobile_number, and optional credential_type in the request body
     * - Validates email format
     * - Generates and encrypts a random password
     * - Saves the user and their credentials in the database
     */
    public create = async (req: Request, res: Response) => {
        const {
            role_id: roleId, email, mobile_number: mobileNo, credential_type: credType = 'password', 
            first_name: firstName, last_name: lastName
        } = req.body;
        
        if (!UserAccountHelper.validateEmail(email)) return res.status(400).json({ message: `Bad Request: Username must be a valid email!` });
        
        const generatedPassword = UserAccountHelper.generateRandomPassword();
        const hashedPassword = UserAccountHelper.encryptPassword(generatedPassword);
        try {
            // 3️⃣ Save account in DB
            const account = await this._prisma.user.create({
                data: {
                    roleId: roleId, 
                    email: email, 
                    mobileNo: mobileNo, 
                    dtCreated: new Date()
                },
            });
            await this._prisma.userProfile.create({
                data: {
                    userId: account.id, 
                    firstName: firstName || "Admin", 
                    lastName: lastName || "User", 
                    dtCreated: new Date()
                }
            });
            await this._prisma.userCredential.create({
                data: {
                    userId: account.id,
                    type: credType, 
                    value: hashedPassword, 
                    dtCreated: new Date()
                }
            });
            return res.json(account);
        } catch (e: any) {
            console.error(`ERR: /Default/UserController/create(): `, e);
            return res.status(500).json({ message: e?.message || `Internal server error!` } );
        }
    };
    
    /**
     * Handles user login
     * - Expects username (email or mobile number), password, and optional credential_type in the request body
     * - Validates credentials and generates a JWT token upon successful authentication
     * - Returns user details and token in the response
     * - Supports password-based authentication; biometric authentication is a TODO
     */
    public login = async (req: Request, res: Response) => {
        const { username, password, credential_type: credType = "password" } = req.body;
        try {
            const user = await this._prisma.user.findFirst({
                where: {
                    OR: [
                        { email: username },
                        { mobileNo: username }
                    ]
                }, 
                include: { credentials: true }
            });
            if (!user) return res.status(401).json({ message: `Invalid credentials!` });
            
            const userCredential = user.credentials.find((c: any) => c?.type?.toLowerCase() === credType?.toLowerCase());
            if (!userCredential) return res.status(401).json({ message: `Credential type not found!` });
            
            if (credType === "password") {
                const valid = await UserAccountHelper.validatePassword(
                    password,
                    userCredential.value
                );
                if (!valid) return res.status(401).json({ message: `Invalid credentials!` });
            }
            
            //TODO: Implement biometric authentication
            // if (["face_id", "fingerprint"].includes(credType)) {
            //     const isValidBiometric = true;
            //     if (!isValidBiometric) {
            //         return res.status(401).json({ message: "Biometric authentication failed" });
            //     }
            // }

            // 5️⃣ Generate JWT session token
            const token = await UserAccountHelper.generateToken(user);
            
            // 6️⃣ Return success response
            return res.json({
                message: `Login successful!`,
                token,
                user
            });
        } catch (e: any) {
            console.error(`ERR: /Default/UserController/login(): `, e);
            return res.status(500).json({ message: e?.message || `Internal server error!` });
        }
    };
    
    /**
     * Get user by ID
     * - Fetches a single user record by unique ID
     * - Includes related profile and credentials
     * - Returns 404 if user not found
     */
    public getById = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            if (!id) return res.status(400).json({ message: `Bad Request: An ID is required to identify the user to retrieve.` });
            const validId = (this.validateJSONString(id) || id) as string;
            const user = await this._prisma.user.findUnique({
                where: { id: validId },
                include: {
                    profile: true,
                    credentials: {
                        select: { id: true, type: true, dtCreated: true },
                    },
                    role: true
                }
            });
            if (!user) return res.status(400).json({ message: `Bad Request: Invalid User ID.` });
            return res.json(user);
        } catch (e: any) {
            console.error(`ERR: /Default/UserController/getById(): `, e);
            return res.status(500).json({ message: e?.message || `Internal server error!` });
        }
    };

    
    /**
     * Retrieve users with optional filtering, sorting, and pagination
     * - Supports filtering by id, roleId, email, mobileNo, and status via query parameters
     * - Supports sorting by order_by and order_dir query parameters
     * - Supports pagination via page and limit query parameters
     * - Returns paginated list of users along with pagination metadata
     * - Access controlled via middleware
     */
    public get = async (req: Request, res: Response) => {
        try {
            const { 
                id, user_roles_id_fk: roleId, email, mobile_number: mobileNo, status, 
                order_by: orderBy = "dtCreated", 
                order_dir: orderDir = "desc", 
                page = "1", 
                limit = "10" 
            } = req.query;
            const query: any = {};
            if (id) query.id = this.validateJSONString(id as string) || id;
            if (roleId) query.roleId = this.validateJSONString(roleId as string) || roleId;
            if (email) query.email = this.validateJSONString(email as string) || email;
            if (mobileNo) query.mobileNo = this.validateJSONString(mobileNo as string) || mobileNo;
            if (status) query.status = this.validateJSONString(status as string) || status;
            
            // Convert pagination values to numbers
            const pageNumber = Math.max(parseInt(page as string, 10), 1);
            const pageSize = Math.max(parseInt(limit as string, 10), 1);
            const skip = (pageNumber - 1) * pageSize;
            
            const [users, total] = await this._prisma.$transaction([
                this._prisma.user.findMany({
                    where: query,
                    orderBy: { [orderBy as string]: (orderDir as string).toLowerCase() === "asc" ? "asc" : "desc" },
                    skip,
                    take: pageSize,
                }),
                this._prisma.user.count({ where: query }),
            ]);

            return res.json({
                data: users,
                pagination: {
                    total,
                    page: pageNumber,
                    limit: pageSize,
                    totalPages: Math.ceil(total / pageSize),
                },
            });
        } catch (e: any) {
            console.error(`ERR: /Default/UserController/get(): `, e);
            return res.status(500).json({ message: e?.message || `Internal server error!` });
        }
    };
    
    /**
     * Update an existing user
     * - Expects userId as a route param
     * - Allows updating roleId, email, mobile_number, status
     */
    public update = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: `Bad Request: An ID is required to identify the data to update.` })
        if (!req?.body) return res.status(400).json({ message: `Request body cannot be empty for update operation.` });
        const { role_id: roleId, email, mobile_number: mobileNo, status } = req.body;
        console.log('req', req);
        try {
            // 🔍 Validate email format if provided
            if (email && !UserAccountHelper.validateEmail(email)) {
                return res.status(400).json({ message: `Bad Request: Invalid e-mail format.` });
            }
            
            const updatedUser = await this._prisma.user.update({
                where: { id },
                data: {
                    ...(roleId && { roleId }),
                    ...(email && { email }),
                    ...(mobileNo && { mobileNo }),
                    ...(status !== undefined && { status }), 
                    dtLastModified: new Date(),
                },
            });
            return res.json(updatedUser);
        } catch (e: any) {
            console.error(`ERR: /Default/UserController/update(): `, e);
            return res.status(500).json({ message: e?.message || `Internal server error!` } );
        }
    };
    
    /**
     * Soft delete a user by setting their status to 0 (inactive)
     * - Expects userId as a route param
     * - Returns 404 if user not found, 400 if already deleted
     * - Returns success message upon successful deletion
     */
    public delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            if (!id) return res.status(400).json({ message: `Bad Request: An ID is required to identify the data to delete.` });
            const user = await this._prisma.user.findUnique({ where: { id } });
            if (!user) return res.status(400).json({ message: `Bad Request: Invalid User ID.` });
            if (user.status === 0) return res.status(400).json({ message: `Bad Request: User already deleted.` });
            await this._prisma.user.update({
                where: { id },
                data: { dtLastModified: new Date(), status: 0 }
            });
            return res.json({ message: "User deleted successfully" });
        } catch (e: any) {
            console.error(`ERR: /Default/UserController/delete(): `, e);
            return res.status(500).json({ message: e?.message || `Internal server error!` } );
        }
    };
    
    /**
     * Restore a soft-deleted user by setting their status back to 1 (active)
     * - Expects userId as a route param
     * - Returns 404 if user not found, 400 if not deleted
     * - Returns success message upon successful restoration
     */  
    public restore = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            if (!id) return res.status(400).json({ message: `Bad Request: An ID is required to identify the data to restore.` });
            const user = await this._prisma.user.findUnique({ where: { id } });
            if (!user) return res.status(400).json({ message: `Bad Request: Invalid User ID.` });
            if (user.status === 1) return res.status(400).json({ message: `Bad Request: User already active.` });
            await this._prisma.user.update({
                where: { id },
                data: { dtLastModified: new Date(), status: 1 }
            });
            return res.json({ message: `User restored successfully` });
        } catch (e: any) {
            console.error(`ERR: /Default/UserController/restore(): `, e);
            return res.status(500).json({ message: e?.message || `Internal server error!` } );
        }
    };
}