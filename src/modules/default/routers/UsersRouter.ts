import express from "express";
import { PrismaClient } from "@prisma/client";
import UserAccessControl from '../../../UserAccessControl';
import UserController from '../controllers/UserController';

export default class UsersRouter {

    public router = express.Router({ strict: true });
    private _prisma: PrismaClient;
    private _uac: UserAccessControl;
    private _userController: UserController;

    constructor(_prisma: PrismaClient, uac: UserAccessControl) {
        this._prisma = _prisma;
        this._uac = uac;
        this._userController = new UserController(this._prisma);
        this._initializeRoutes();
    }
    
    private _initializeRoutes() {
        this.router.get('/', this._uac.verifyAccess, this._userController.get);
    }
}