import express from "express";
import { PrismaClient } from "@prisma/client";
import UserAccessControl from '../../../UserAccessControl';
import UserController from '../controllers/UserController';

export default class UserRouter {

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
        this.router.post('/create', this._uac.verifyAccess, this._userController.create);
        this.router.post('/login', this._userController.login);
        this.router.get('/:id', this._uac.verifyAccess, this._userController.getById);
        this.router.put('/:id', this._uac.verifyAccess, this._userController.update);
        this.router.delete('/:id', this._uac.verifyAccess, this._userController.delete);
        this.router.patch('/:id', this._uac.verifyAccess, this._userController.restore);
    }
}