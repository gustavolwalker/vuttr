import { Request, Response } from "express";
import { Tool } from "../entities/Tool";
import { Tag } from "../entities/Tag";

export function ToolsTagsMiddleware(req: Request, res: Response, next: any) {
    const entity: Tool = req.body;
    if (entity?.tags?.length) {
        entity.tags = entity.tags.map((tag: Tag | string) =>
            (tag instanceof Tag ? tag : { tag })
        );
    }
    return next();
}