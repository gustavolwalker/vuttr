import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import * as jwt from "jsonwebtoken";
import { User } from "../entities/User";

class SessionController {

    login = async (req: Request, res: Response) => {
        let { email, password }: User = req.body;
        if (!(email && password)) {
            res.status(400).json({ errors: ["E-mail and password are required"] });
            return;
        }

        let user: User;
        try {
            user = await getRepository(User).findOneOrFail({
                where: { email }
            });
        } catch (error) {
            res.status(401).json({ errors: 'User not found' });
            return;
        }

        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            res.status(401).json({ message: 'Incorrect password' });
            return;
        }

        const token = jwt.sign(
            {
                userId: user.id,
                userName: user.name
            },
            process.env.APP_SECRET!,
            { expiresIn: "1h" }
        );
        res.json({ token });
    };

    changePassword = async (req: Request, res: Response) => {
        const id = res.locals.jwtPayload.userId;
        const { oldPassword, newPassword } = req.body;

        if (oldPassword == newPassword) {
            res.status(400).json({ message: 'The new password is the same of old password' });
            return;
        }

        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            res.status(401).json({ errors: 'User not found' });
            return;
        }

        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            res.status(401).json({ message: 'Incorrect password' });
            return;
        }

        user.password = newPassword;
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        user.hashPassword();

        userRepository.save(user)
            .then(() => res.status(202).json({ data: "success" }))
            .catch((err: Error) => res.status(500).json(err));
    };
}

export default SessionController;