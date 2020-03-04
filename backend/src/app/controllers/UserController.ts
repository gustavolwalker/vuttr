import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { User } from "../entities/User";

class UserController {

    select: (keyof User)[] = ["id", "name", "email", "created_at", "updated_at"]

    index = (_req: Request, res: Response) => {
        getRepository(User).find({ select: this.select })
            .then((users: Array<User>) => res.json(users))
            .catch((err: Error) => {
                console.log(err);
                res.status(500).json(err)
            });
    }

    show = (req: Request, res: Response, next: any) => {
        getRepository(User).findOne(req.params.id,
            { select: this.select })
            .then((user: User | undefined) => {
                if (user)
                    res.json(user);
                else
                    res.status(404).json({ errors: ["User not found"] });
            })
            .catch((err: Error) => res.status(500).json(err));
    }

    store = async (req: Request, res: Response) => {
        const { name, email, password } = req.body;
        let user: User = new User();
        user.name = name;
        user.email = email;
        user.password = password;

        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        user.hashPassword();

        getRepository(User).save(user).
            then((user: User) => {
                const filtered =
                    this.select.reduce((obj: any, key: string) => {
                        obj[key] = Object.getOwnPropertyDescriptor(user, key)?.value;
                        return obj;
                    }, {});
                res.status(201).json(filtered);
            })
            .catch((err: Error) => {
                res.status(500).json(err)
            });
    }

    update = (req: Request, res: Response) => {
        getRepository(User).findOne(req.params.id)
            .then(async (user: User | undefined) => {
                if (user) {
                    const { name, email } = req.body;
                    user.name = name;
                    user.email = email;
                    const errors = await validate(user);
                    if (errors.length > 0) {
                        res.status(400).send(errors);
                        return;
                    }
                    getRepository(User).save(user)
                        .then(() => res.status(202).json({ data: "success" }))
                        .catch((err: Error) => res.status(500).json(err));
                }
                else
                    res.status(404).json({ errors: ["User not found"] });
            }).catch((err: Error) => res.status(500).json(err));
    }


    delete = (req: Request, res: Response) => {
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

export default UserController;
