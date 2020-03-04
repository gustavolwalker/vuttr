import express from "express";
import { AuthMiddleware } from "./app/middlewares/AuthMiddleware";
import SessionController from "./app/controllers/SessionController";
import ToolController from "./app/controllers/ToolController";
import { ToolsTagsMiddleware } from "./app/middlewares/ToolsTagsMiddleware";
import { ToolsTagsResponseMiddleware } from "./app/middlewares/ToolsTagsTransform";
import UserController from "./app/controllers/UserController";

export class Routes {
    public sessionController: SessionController = new SessionController();
    public toolController: ToolController = new ToolController();
    public userController: UserController = new UserController();


    public async routes(app: express.Application): Promise<void> {

        app.route("/").get((_req: express.Request, res: express.Response) => {
            res.status(200).send(`The app VUTTR running at: ${process.uptime()}`);
        });

        app.route("/login")
            .post(this.sessionController.login)

        app.route("/change-password")
            .put(AuthMiddleware, this.sessionController.changePassword)

        app.route("/users")
            .get(AuthMiddleware, this.userController.index)
            .post(this.userController.store);

        app.route("/users")
            .get(AuthMiddleware, this.userController.index)
            .post(this.userController.store);

        app.route("/users/:id")
            .get(AuthMiddleware, this.userController.show)
            .put(AuthMiddleware, this.userController.update)
            .delete(AuthMiddleware, this.userController.delete);

        app.use(ToolsTagsResponseMiddleware)
        app.route("/tools")
            .get(this.toolController.index)
            .post(AuthMiddleware, ToolsTagsMiddleware, this.toolController.store);

        app.route("/tools/:id")
            .get(AuthMiddleware, this.toolController.show)
            .put(AuthMiddleware, ToolsTagsMiddleware, this.toolController.update)
            .delete(AuthMiddleware, this.toolController.delete);
    }
}