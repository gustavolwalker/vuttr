import { Tag } from "../../src/app/entity/Tag";
import { createConnection, Connection } from "typeorm";
import truncate from "../utils/truncate";

describe('Unit tests for entity Tag', () => {
    let connection: Connection;

    beforeAll(async () => {
        connection = await createConnection();
    });

    beforeEach(async () => {
        await truncate(Tag);
    })

    it('should sequelize migrate table', async () => {
        const response = await connection.getRepository(Tag).find();
        expect(response).not.toBeNull();
    });

    it('should create new tag', async () => {
        const response = await connection.getRepository(Tag).save({ tag: "utTag" });
        expect(response).not.toBeNull();
    });


});