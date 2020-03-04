import bcrypt from "bcryptjs";
import { createConnection, Connection } from "typeorm";
import { User } from "../../src/app/entities/User";

describe('Unit tests for entity User', () => {

    let connection: Connection;

    beforeAll(async () => {
        connection = await createConnection();
    });

    it('should sequelize migrate table', async () => {
        const response = await connection.getRepository(User).find()
        expect(response).not.toBeNull();
    });

    it('should add new user', async () => {
        let user = new User();
        user.name = "Gustavo";
        user.email = "gustavolwalker@gmail.com"
        user.password = "1234";
        user.hashPassword();

        const newUser = await connection.getRepository(User).save(user);

        expect(newUser).toHaveProperty("id");
        expect(newUser.id).not.toBeNull();

        await connection.getRepository(User).remove(user);
    });

    it('should encrypt user password', async () => {
        const pass_test = '1234';
        let user = new User();
        user.name = "Gustavo";
        user.email = "gustavolwalker@gmail.com"
        user.password = pass_test;
        user.hashPassword();

        const newUser = await connection.getRepository(User).save(user);
        const compare_hash = await bcrypt.compare(pass_test, newUser.password);

        expect(compare_hash).toBe(true);

        await connection.getRepository(User).remove(user);
    });

    it('should encrypt user password on update', async () => {
        const pass_test = '1234';
        let user = new User();
        user.name = "Gustavo";
        user.email = "gustavolwalker@gmail.com"
        user.password = pass_test;
        user.hashPassword();

        let newUser: User = await connection.getRepository(User).save(user);
        let compare_hash = await bcrypt.compare(pass_test, newUser.password);

        expect(newUser.name).toBe(user.name);
        expect(compare_hash).toBe(true);

        const pass_edited = '12345';
        newUser.name = "Gustavo Luiz Walker";
        newUser.password = pass_edited;
        newUser.hashPassword();
        await connection.getRepository(User)
            .save(newUser)
            .then(async () => {
                const editUser = await connection.getRepository(User).findOneOrFail(newUser.id);
                compare_hash = await editUser.checkIfUnencryptedPasswordIsValid(pass_edited);

                expect(newUser.name).toBe(editUser.name);
                expect(compare_hash).toBe(true);


            });
        await connection.getRepository(User).remove(newUser);
    });
});

