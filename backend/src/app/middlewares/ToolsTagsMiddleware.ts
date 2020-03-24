import { Request, Response, NextFunction } from "express";
import { Tool } from "../entities/Tool";
import { Tag } from "../entities/Tag";

export const ToolsTagsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.path.includes('/tools')) {
        const entity: Tool = req.body;
        if (entity?.tags?.length) {
            entity.tags = entity.tags.map((tag: Tag | string) => {
                let result: Tag;
                if (tag instanceof Tag) {
                    tag.tag = tag.tag.toLowerCase();
                    result = tag;
                } else
                    result = { tag: tag.toLowerCase() }
                return result;
            });
        }
    }
    return next();
}