import { Tool } from "../../src/app/entity/Tool";
import { createConnection, Connection } from "typeorm";
import truncate from "../utils/truncate";

describe('Unit tests for entity Tool', () => {

    let connection: Connection;

    beforeAll(async () => {
        connection = await createConnection();
    });

    beforeEach(async () => {
        await truncate(Tool);
    })

    it('should sequelize migrate table', async () => {
        const response = await connection.getRepository(Tool).find()
        expect(response).not.toBeNull();
    });

    it('should add tool with 3 tags', async () => {

        const tool = {
            title: "New tool",
            link: "http://link.com/",
            description: "description for new tool",
            tags: [{ tag: "node" }, { tag: "code" }, { tag: "link" },]
        }
        const newTool = await connection.getRepository(Tool).save(tool);

        expect(newTool).toHaveProperty("id");
        expect(newTool.id).toBeGreaterThan(0);
        expect(newTool.tags.length).toBe(3);
    });
}); queueMicrotask

