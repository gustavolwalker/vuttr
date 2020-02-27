import { User } from "../../src/app/entity/User";
import { createConnection, Connection } from "typeorm";
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
        const newTool = await connection.getRepository(User).save(user);

        expect(newTool).toHaveProperty("id");
        expect(newTool.id).toBeGreaterThan(0);
    });
});

