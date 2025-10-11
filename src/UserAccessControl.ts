import { Request, Response, NextFunction } from "express";
import { PrismaClient, Resource, ResourceAccess } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";

interface UserPayload extends JwtPayload {
  uid: string;
  roles: number[];
  tfa_required?: boolean;
  tfa_authenticated?: boolean;
}

export default class UserAccessControl {
    
    private _prisma: PrismaClient;
    private _jwtSecret: jwt.Secret;
    
    constructor (prisma: PrismaClient) {
        this._prisma = prisma;
        this._jwtSecret = process.env.SECRET_KEY as string;
    }
    
    /**
     * Extracts the Bearer token from the Authorization header in the request.
     * @param req Express Request object
     * @returns The token string if present, undefined otherwise
     */
    private _getToken = (req: Request): string | null => {
        const authHeader = req.headers?.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) return authHeader.split(' ')[1];
        return null;
    }
    
    /**
     * Verifies the JWT token and returns the decoded user payload.
     * @param token The JWT token string
     * @returns The decoded UserPayload if valid, undefined otherwise
     */
    private _verifyToken(token: string): UserPayload | undefined {
        try {
            const decoded = jwt.verify(token, this._jwtSecret as jwt.Secret) as UserPayload;
            return decoded;
        } catch (err) {
            return undefined;
        }
    }
    
    /**
     * Determines the resource being accessed based on the request method and URL.
     * Matches the request to a resource in the database.
     * @param req Express Request object
     * @returns The matched Resource with its accesses if found, undefined otherwise
     */
    private _getResourceFromURL = async (req: Request): Promise<(Resource & { accesses: ResourceAccess[] }) | undefined> => {
        const reqMethod = (req.method || "GET").toUpperCase();
        const rawURL = req.originalUrl?.split("?")[0] || "/";
        const uuidRegEx = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const parts = rawURL.split("/")?.filter(Boolean)?.filter(p => !uuidRegEx.test(p));
        const partsLen = parts?.length || 0;
        
        const mcas: { apiMethod: string; module: string; controller: string; action: string }[] = [];
        
        switch (partsLen) {
            case 0:
                mcas.push({ apiMethod: reqMethod, module: "default", controller: "index", action: "index" });
                break;
            case 1:
                mcas.push({ apiMethod: reqMethod, module: parts[0], controller: "index", action: "index" });
                mcas.push({ apiMethod: reqMethod, module: "default", controller: parts[0], action: "index" });
                mcas.push({ apiMethod: reqMethod, module: "default", controller: "index", action: parts[0] });
                break;
            case 2:
                mcas.push({ apiMethod: reqMethod, module: parts[0], controller: parts[1], action: "index" });
                mcas.push({ apiMethod: reqMethod, module: "default", controller: parts[0], action: parts[1] });
                break;

            default:
                mcas.push({ apiMethod: reqMethod, module: parts[0], controller: parts[1], action: parts[2] });
                break;
        }
        
        for (const mca of mcas) {
            const resource = await this._prisma.resource.findFirst({
                where: {
                    apiMethod: mca.apiMethod, 
                    module: mca.module, 
                    controller: mca.controller, 
                    action: mca.action, 
                    status: 1
                }, 
                include: { accesses: true }
            }) as (Resource & { accesses: ResourceAccess[] });
            if (resource) return resource;
        }
        return undefined;
    };
    
    /**
     * Checks if the user has access to the specified resource based on their role and access conditions.
     * @param user The decoded UserPayload from the JWT token
     * @param resource The Resource being accessed
     * @returns True if the user has access, false otherwise
     */
    private _hasAccess = async (user: UserPayload | undefined, resource: (Resource & { accesses: ResourceAccess[] })): Promise<boolean> => {
        if (user?.roleId == "ADMIN") return true;
        const resourceAccesses = resource?.accesses || [];
        if (resourceAccesses.length === 0) return false;
        for (const ra of resourceAccesses) {
            if (ra.status !== 1) continue;
            if (ra.level === 1 && ra.value.includes(user?.roleId || "")) return true; // role-based access
            if (ra.level === 3 && ra.value === user?.id) return true; // user-specific access
        }
        return false;
    }
    
    /**
     * Middleware to verify JWT token from request headers.
     * Attaches decoded user info to request object if valid.
     * Responds with 401 if token is missing or invalid.
     * @param req Express Request object
     * @param res Express Response object
     * @param next NextFunction to pass control to the next middleware
     */
    public verifyAccess = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = this._getToken(req);
            if (!token) return res.status(401).json({ message: `No token provided` });
            const payload = this._verifyToken(token);
            if (!payload) return res.status(401).json({ message: `Invalid or expired token` });
            
            const resource = await this._getResourceFromURL(req);
            if (!resource) return res.status(403).json({ message: `Access to resource not found` });
            
            const hasAccess = await this._hasAccess(payload, resource);
            if (!hasAccess) return res.status(403).json({ message: `Access denied to resource` });
            
            (req as any).user = payload;
            next();
        } catch (err) {
            return res.status(401).json({ message: `Invalid or expired token` });
        }
    }
}