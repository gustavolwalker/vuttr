import { Request, Response } from "express";
import { Tool } from "../entity/Tool";
import { getRepository } from "typeorm";

export class ToolController {

    public index(_req: Request, res: Response): void {
        getRepository(Tool)
            .createQueryBuilder("tool")
            .leftJoinAndSelect("tool.tags", "tag")
            .andWhere(_req.query.tag ? `tag = '${_req.query.tag}'` : "")
            .getMany()
            .then((tools: Array<Tool>) => res.json(tools))
            .catch((err: Error) => {
                console.log(err);
                res.status(500).json(err)
            });
    }

    public show(req: Request, res: Response, next: any): void {
        getRepository(Tool).findOne(req.params.id)
            .then((tool: Tool | undefined) => {
                if (tool)
                    res.json(tool);
                else
                    res.status(404).json({ errors: ["Tool not found"] });
            })
            .catch((err: Error) => res.status(500).json(err));
    }

    public store(req: Request, res: Response, next: any): void {
        const entity: Tool = req.body;
        getRepository(Tool).save(entity).
            then((tool: Tool) => res.status(201).json(tool))
            .catch((err: Error) => res.status(500).json(err));
    }

    public update(req: Request, res: Response): void {
        getRepository(Tool).findOne(req.params.id)
            .then((tool: Tool | undefined) => {
                if (tool) {
                    const entity: Tool = req.body;
                    entity.id = tool.id;
                    getRepository(Tool).save(entity)
                        .then(() => res.status(202).json({ data: "success" }))
                        .catch((err: Error) => res.status(500).json(err));
                }
                else
                    res.status(404).json({ errors: ["Tool not found"] });
            }).catch((err: Error) => res.status(500).json(err));
    }


    public delete(req: Request, res: Response): void {
        getRepository(Tool).findOne(req.params.id)
            .then((toolToRemove: Tool | undefined) => {
                if (toolToRemove)
                    getRepository(Tool).remove(toolToRemove)
                        .then(() => res.status(204).json({ data: "success" }))
                        .catch((err: Error) => res.status(500).json(err));
                else
                    res.status(404).json({ errors: ["Tool not found"] });
            }).catch((err: Error) => res.status(500).json(err));
    }
}