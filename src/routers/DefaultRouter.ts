import express from "express";
import { PrismaClient } from "@prisma/client";
import UserAccessControl from '../UserAccessControl';
export default class DefaultRouter {

    private _prisma: PrismaClient;
    private _uac: UserAccessControl;
    public router = express.Router({ strict: true });
    
    constructor(prisma: PrismaClient, uac: UserAccessControl) {
        this._uac = uac;
        this._prisma = prisma;
        this._initializeRoutes();
    }
    
    private _initializeRoutes() {

    }
}