import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import UserAccessControl from "./UserAccessControl";
import DefaultRouter from "./routers/DefaultRouter";

class App {
  public app: express.Application;
  private port: number;
  private _prisma: PrismaClient;
  private _uac: UserAccessControl;
  private _defaultRouter: DefaultRouter;
  constructor(port: number) {
    this.app = express();
    this.port = port;
    this._prisma = new PrismaClient();
    this._uac = new UserAccessControl(this._prisma);
    this._defaultRouter = new DefaultRouter(this._prisma, this._uac);
    this._initializeMiddlewares();
    this._initializeRoutes();
  }

  private _initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private _initializeRoutes() {
    this.app.use('/', this._defaultRouter.router);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running at http://localhost:${this.port}`);
    });
  }
}

const port = Number(process.env.PORT) || 4000;
const app = new App(port);
app.listen();