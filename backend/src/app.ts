import express from "express";
import bodyParser from "body-parser";
import { Routes } from "./routes";

class App {

    public app!: express.Application;
    public routePrv!: Routes;

    constructor() {
        this.app = express();
        this.config();
        this.routePrv = new Routes();
        this.routePrv.routes(this.app);
    }

    private config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
}

export default new App().app;