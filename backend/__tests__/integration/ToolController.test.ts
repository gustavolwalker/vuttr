import request from "supertest";
import { Server } from "http";

import startServer from "../../src/server";
import truncate from "../utils/truncate";
import { Tool } from "../../src/app/entities/Tool";

describe('ToolController', () => {

    let app: Server;
    let token: string;

    const tool = {
        title: "New tool",
        link: "http://link.com/",
        description: "description for new tool"
    }

    beforeAll(async () => {
        app = await startServer();
    });

    beforeEach(async () => {
        await truncate(Tool);
        await request(app)
            .post('/login')
            .send({ email: 'admin@test.com', password: '1234' })
            .then(response => {
                token = response.body.token;
            });
    });

    it(`should index tools`, async () => {
        const response = await request(app).get('/tools')

        expect(response.status).toBe(200);
    });

    it(`should index tools filtered`, async () => {
        let response = await request(app)
            .post('/tools')
            .send({ ...tool, title: 'Tool 1', tags: ["node", "http"] })
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(201);

        response = await request(app)
            .post('/tools')
            .send({ ...tool, title: 'Tool 2', tags: ["node", "https"] })
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(201);

        response = await request(app)
            .post('/tools')
            .send({ ...tool, title: 'Tool 3', tags: ["www", "https"] })
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(201);

        response = await request(app).get('/tools?tag=node');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
    });

    it(`should tool exits`, async () => {
        let response = await request(app)
            .post('/tools')
            .send(tool)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(201);

        const { id } = response.body;
        response = await request(app)
            .get(`/tools/${id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).not.toBeNull();
    });

    it(`should tool not exits`, async () => {
        const response = await request(app)
            .get(`/tools/-1`)
            .set('Authorization', `Bearer ${token}`);

        const { errors } = response.body;
        expect(response.status).toBe(404);
        expect(errors).not.toBeNull();
    });

    it(`shouldn't show tool without authorization`, async () => {
        let response = await request(app)
            .post('/tools')
            .send(tool)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(201);

        const { id } = response.body;
        response = await request(app)
            .get(`/tools/${id}`)

        expect(response.status).toBe(401);
    });

    it(`should to store new tool`, async () => {
        const response = await request(app)
            .post('/tools')
            .send(tool)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(201);
        expect(response.header).toHaveProperty("content-type");
        expect(response.header['content-type']).toContain("application/json");
        expect(response.body).not.toBeNull();
    });

    it(`shouldn't store new tool without authorization`, async () => {
        const response = await request(app)
            .post('/tools')
            .send(tool)

        expect(response.status).toBe(401);
    });

    it(`should to update stored tool`, async () => {
        let response = await request(app)
            .post('/tools')
            .send(tool)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(201);

        let toolUpdate: Tool = response.body;
        toolUpdate.description = "description changed";
        response = await request(app)
            .put(`/tools/${toolUpdate.id}`)
            .send(toolUpdate)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(202);
    });

    it(`shouldn't update stored tool without authorization`, async () => {
        let response = await request(app)
            .post('/tools')
            .send(tool)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(201);

        let toolUpdate: Tool = response.body;
        toolUpdate.description = "description changed";
        response = await request(app)
            .put(`/tools/${toolUpdate.id}`)
            .send(toolUpdate)

        expect(response.status).toBe(401);
    });

    it(`should to delete tool by id`, async () => {
        let response = await request(app)
            .post('/tools')
            .send(tool)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(201);

        const { id } = response.body;
        response = await request(app)
            .delete(`/tools/${id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(204);
    });

    it(`shouldn't to delete tool by id without authorization`, async () => {
        let response = await request(app)
            .post('/tools')
            .send(tool)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(201);

        const { id } = response.body;
        response = await request(app)
            .delete(`/tools/${id}`)

        expect(response.status).toBe(401);
    });

});