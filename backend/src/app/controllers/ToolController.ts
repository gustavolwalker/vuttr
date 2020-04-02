import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tool } from "../entities/Tool";

class ToolController {

    index = (req: Request, res: Response) => {

        let where = "";
        if (req.query) {
            if (req.query.tag)
                where += `LOWER(taglike.tag) like '%${req.query.tag.toLowerCase()}%'`
            if (req.query.q) {
                const like = req.query.q.toLowerCase();
                where += `CAST(tool.id AS VARCHAR) like '%${like}%' `;
                where += `OR LOWER(tool.title) like '%${like}%' `;
                where += `OR LOWER(tool.link) like '%${like}%' `;
                where += `OR LOWER(tool.description) like '%${like}%' `;
                where += `OR LOWER(taglike.tag) like '%${like}%' `;
            }
        }

        getRepository(Tool)
            .createQueryBuilder("tool")
            .leftJoinAndSelect("tool.tags", "tag")
            .leftJoin("tool.tags", "taglike")
            .where(where)
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
        const entity: Tool = plainToClass(Tool, req.body);
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
                    const entity: Tool = plainToClass(Tool, req.body);
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