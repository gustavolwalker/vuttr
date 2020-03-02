import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { Tool } from "../entities/Tool";

class ToolController {

    index = (req: Request, res: Response) => {
        getRepository(Tool)
            .createQueryBuilder("tool")
            .leftJoinAndSelect("tool.tags", "tag")
            .andWhere(req.query.tag ? `tag = '${req.query.tag}'` : "")
            .getMany()
            .then((tools: Array<Tool>) => res.json(tools))
            .catch((err: Error) => {
                console.log(err);
                res.status(500).json(err)
            });
    }

    show = (req: Request, res: Response) => {
        getRepository(Tool).findOne(req.params.id)
            .then((tool: Tool | undefined) => {
                if (tool)
                    res.json(tool);
                else
                    res.status(404).json({ errors: ["Tool not found"] });
            })
            .catch((err: Error) => res.status(500).json(err));
    }

    store = async (req: Request, res: Response) => {
        const entity: Tool = req.body;
        const errors = await validate(entity);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        getRepository(Tool).save(entity).
            then((tool: Tool) => res.status(201).json(tool))
            .catch((err: Error) => res.status(500).json(err));
    }

    update = (req: Request, res: Response) => {
        getRepository(Tool).findOne(req.params.id)
            .then(async (tool: Tool | undefined) => {
                if (tool) {
                    const entity: Tool = req.body;
                    entity.id = tool.id;
                    const errors = await validate(entity);
                    if (errors.length > 0) {
                        res.status(400).send(errors);
                        return;
                    }
                    getRepository(Tool).save(entity)
                        .then(() => res.status(202).json({ data: "success" }))
                        .catch((err: Error) => res.status(500).json(err));
                }
                else
                    res.status(404).json({ errors: ["Tool not found"] });
            }).catch((err: Error) => res.status(500).json(err));
    }

    delete = (req: Request, res: Response) => {
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

export default ToolController;