import request from "supertest";
import { Server } from "http";

import startServer from "../../src/server";
import truncate from "../utils/truncate";
import { Tool } from "../../src/app/entities/Tool";

describe('ToolsController', () => {

    let server: Server;
    const tool = {
        title: "New tool",
        link: "http://link.com/",
        description: "description for new tool"
    }

    beforeAll(async () => {
        server = await startServer();
    });

    beforeEach(async () => {
        await truncate(Tool);
    });

    it('should index tools', async () => {
        const response = await request(server).get('/tools');
        expect(response.status).toBe(200);
    });

    it('should index tools filtered', async () => {
        let tool1 = { ...tool, title: 'Tool 1', tags: ["node", "http"] };
        let response = await request(server).post('/tools').send(tool1);
        expect(response.status).toBe(201);

        let tool2 = { ...tool, title: 'Tool 2', tags: ["node", "https"] };
        response = await request(server).post('/tools').send(tool2);
        expect(response.status).toBe(201);

        let tool3 = { ...tool, title: 'Tool 3', tags: ["www", "https"] };
        response = await request(server).post('/tools').send(tool3);
        expect(response.status).toBe(201);

        response = await request(server).get('/tools?tag=node');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
    });

    it('should tool exits', async () => {
        let response = await request(server).post('/tools').send(tool);
        expect(response.status).toBe(201);
        const { id } = response.body;

        response = await request(server).get(`/tools/${id}`);
        expect(response.status).toBe(200);
        expect(response.body).not.toBeNull();
    });

    it('should tool not exits', async () => {
        const response = await request(server).get(`/tools/-1`);
        expect(response.status).toBe(404);
        const { errors } = response.body;
        expect(errors).not.toBeNull();
    });

    it('should to store new tool', async () => {
        const response = await request(server).post('/tools').send(tool);
        expect(response.status).toBe(201);
        expect(response.header).toHaveProperty("content-type");
        expect(response.header['content-type']).toContain("application/json");
        expect(response.body).not.toBeNull();
    });

    it('should to update stored tool', async () => {
        let response = await request(server).post('/tools').send(tool);
        expect(response.status).toBe(201);
        let toolUpdate: Tool = response.body;
        toolUpdate.description = "description changed";

        response = await request(server).put(`/tools/${toolUpdate.id}`).send(toolUpdate);
        expect(response.status).toBe(202);
    });

    it('should to delete tool by id', async () => {
        let response = await request(server).post('/tools').send(tool);
        expect(response.status).toBe(201);
        const { id } = response.body;

        response = await request(server).delete(`/tools/${id}`);
        expect(response.status).toBe(204);
    });
});