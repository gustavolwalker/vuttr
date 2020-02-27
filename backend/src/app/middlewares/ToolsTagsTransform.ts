import mung from "express-mung";
import { Request, Response } from "express";


function TagsToStrings(tags: any[]) {
    return tags.map((tag: any) =>
        (typeof tag === 'object' ? tag.tag : tag)
    );
}

function ToolsTagsMungTransform(body: any, req: Request, res: Response) {
    if (req.path.includes('/tools')) {
        if (Array.isArray(body)) {
            body.forEach((elem: any) => {
                if (elem.tags)
                    elem.tags = TagsToStrings(elem.tags)
            });
        } else {
            if (body.tags)
                body.tags = TagsToStrings(body.tags);
        }
    }
    return body;
}

export const ToolsTagsResponseMiddleware = mung.json(ToolsTagsMungTransform);
