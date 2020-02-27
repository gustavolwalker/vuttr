import bcrypt from "bcryptjs";
import { createConnection, Connection } from "typeorm";
import { User } from "../../src/app/entity/User";
import truncate from "../utils/truncate";


describe('Unit tests for entity User', () => {

    let connection: Connection;

    beforeAll(async () => {
        connection = await createConnection();
    });

    beforeEach(async () => {
        await truncate(User);
    })

    it('should sequelize migrate table', async () => {
        const response = await connection.getRepository(User).find()
        expect(response).not.toBeNull();
    });

    it('should add new user', async () => {
        const user = {
            name: "Gustavo",
            email: "gustavolwalker@gmail.com",
            password: "1234",
        }
        const newUser = await connection.getRepository(User).save(user);

        expect(newUser).toHaveProperty("id");
        expect(newUser.id).toBeGreaterThan(0);
    });

    it('should encrypt user password', async () => {
        let pass_test = '1234';
        const user = {
            name: "Gustavo",
            email: "gustavolwalker@gmail.com",
            password: pass_test
        }
        const newUser = await connection.getRepository(User).save(user);
        const compare_hash = await bcrypt.compare(pass_test, newUser.password_hash);

        expect(compare_hash).toBe(true);
    });
});

