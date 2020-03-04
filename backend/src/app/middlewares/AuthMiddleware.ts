import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).json({ message: 'Token not provided' });

    const [, token] = authHeader.split(' ');
    let jwtPayload;

    try {
        jwtPayload = <any>jwt.verify(token, process.env.APP_SECRET!);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        res.status(401).json({ message: 'Token invalid' });
        return;
    }

    const { userId, userName } = jwtPayload;
    const newToken = jwt.sign({ userId, userName }, process.env.APP_SECRET!, {
        expiresIn: "1h"
    });
    res.setHeader("token", newToken);

    return next();
}