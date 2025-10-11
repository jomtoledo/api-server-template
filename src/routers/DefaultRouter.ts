import express from "express";
import { PrismaClient } from "@prisma/client";
import UserAccessControl from '../UserAccessControl';
import UsersRouter from "../modules/default/routers/UsersRouter";
import UserRouter from "../modules/default/routers/UserRouter";
export default class DefaultRouter {

    private _prisma: PrismaClient;
    private _uac: UserAccessControl;
    public router = express.Router({ strict: true });
    private _usersRouter: UsersRouter;
    private _userRouter: UserRouter;
    
    constructor(prisma: PrismaClient, uac: UserAccessControl) {
        this._uac = uac;
        this._prisma = prisma;
        this._usersRouter = new UsersRouter(this._prisma, this._uac);
        this._userRouter = new UserRouter(this._prisma, this._uac);
        this._initializeRoutes();
    }
    
    private _initializeRoutes() {
        this.router.use('/users', this._usersRouter.router);
        this.router.use('/user', this._userRouter.router);
    }
}