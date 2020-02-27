import express from "express";
import { ToolController } from "./app/controllers/ToolController";
import { ToolsTagsMiddleware } from "./app/middlewares/ToolsTagsMiddleware";
import { ToolsTagsResponseMiddleware } from "./app/middlewares/ToolsTagsTransform";
import { UserController } from "./app/controllers/UserController";

export class Routes {
    public toolController: ToolController = new ToolController();
    public userController: UserController = new UserController();


    public async routes(app: express.Application): Promise<void> {

        app.route("/").get((_req: express.Request, res: express.Response) => {
            res.status(200).send(`The app VUTTR running at: ${process.uptime()}`);
        });

        app.use(ToolsTagsResponseMiddleware)
        app.route("/tools")
            .get(this.toolController.index)
            .post(ToolsTagsMiddleware, this.toolController.store);

        app.route("/tools/:id")
            .get(this.toolController.show)
            .put(ToolsTagsMiddleware, this.toolController.update)
            .delete(this.toolController.delete);

        app.route("/users")
            .get(this.userController.index)
            .post(this.userController.store);

        app.route("/users/:id")
            .get(this.userController.show)
            .put(this.userController.update)
            .delete(this.userController.delete);
    }
}