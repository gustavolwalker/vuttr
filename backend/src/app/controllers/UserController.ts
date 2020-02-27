import { Request, Response } from "express";
import { User } from "../entity/User";
import { getRepository } from "typeorm";

export class UserController {

    public index(_req: Request, res: Response): void {
        getRepository(User).find()
            .then((users: Array<User>) => res.json(users))
            .catch((err: Error) => {
                console.log(err);
                res.status(500).json(err)
            });
    }

    public show(req: Request, res: Response, next: any): void {
        getRepository(User).findOne(req.params.id)
            .then((user: User | undefined) => {
                if (user)
                    res.json(user);
                else
                    res.status(404).json({ errors: ["User not found"] });
            })
            .catch((err: Error) => res.status(500).json(err));
    }

    public store(req: Request, res: Response, next: any): void {
        const entity: User = req.body;
        getRepository(User).save(entity).
            then((user: User) => res.status(201).json(user))
            .catch((err: Error) => res.status(500).json(err));
    }

    public update(req: Request, res: Response): void {
        getRepository(User).findOne(req.params.id)
            .then((user: User | undefined) => {
                if (user) {
                    const entity: User = req.body;
                    entity.id = user.id;
                    getRepository(User).save(entity)
                        .then(() => res.status(202).json({ data: "success" }))
                        .catch((err: Error) => res.status(500).json(err));
                }
                else
                    res.status(404).json({ errors: ["User not found"] });
            }).catch((err: Error) => res.status(500).json(err));
    }


    public delete(req: Request, res: Response): void {
        getRepository(User).findOne(req.params.id)
            .then((userToRemove: User | undefined) => {
                if (userToRemove)
                    getRepository(User).remove(userToRemove)
                        .then(() => res.status(204).json({ data: "success" }))
                        .catch((err: Error) => res.status(500).json(err));
                else
                    res.status(404).json({ errors: ["User not found"] });
            }).catch((err: Error) => res.status(500).json(err));
    }
}