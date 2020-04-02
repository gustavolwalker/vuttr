import request from "supertest";
import { Server } from "http";

import startServer from "../../src/server";
import truncate from "../utils/truncate";
import { Tool } from "../../src/app/entities/Tool";
import { getRepository } from "typeorm";
import { plainToClass } from "class-transformer";

describe('ToolController', () => {

    let app: Server;
    let token: string;

    const toolSample = {
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


    it(`should index tools filtered by query`, async () => {
        await getRepository(Tool).save(
            [
                plainToClass(Tool, { ...toolSample, title: 'Tool 1', tags: [{ tag: "node" }, { tag: "http" }] }),
                plainToClass(Tool, { ...toolSample, title: 'Tool 2', tags: [{ tag: "node" }, { tag: "https" }] }),
                plainToClass(Tool, { ...toolSample, title: 'Tool 3', tags: [{ tag: "www" }, { tag: "https" }] })
            ]
        ).then(async res => {
            const response = await request(app).get('/tools?q=tool 2');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
        });
    });

    it(`should index tools filtered by tag`, async () => {
        await getRepository(Tool).save(
            [
                plainToClass(Tool, { ...toolSample, title: 'Tool 1', tags: [{ tag: "node" }, { tag: "http" }] }),
                plainToClass(Tool, { ...toolSample, title: 'Tool 2', tags: [{ tag: "node" }, { tag: "https" }] }),
                plainToClass(Tool, { ...toolSample, title: 'Tool 3', tags: [{ tag: "www" }, { tag: "https" }] })
            ]
        ).then(async res => {
            const response = await request(app).get('/tools?tag=node');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
        });
    });

    it(`should tool exits`, async () => {
        await getRepository(Tool)
            .save(plainToClass(Tool, toolSample))
            .then(async tool => {
                const response = await request(app)
                    .get(`/tools/${tool.id}`)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);
                expect(response.body).not.toBeNull();
            });
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
        await getRepository(Tool)
            .save(plainToClass(Tool, toolSample))
            .then(async tool => {

                const response = await request(app)
                    .get(`/tools/${tool.id}`)

                expect(response.status).toBe(401);
            });
    });

    it(`should to store new tool`, async () => {
        const response = await request(app)
            .post('/tools')
            .send(toolSample)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(201);
        expect(response.header).toHaveProperty("content-type");
        expect(response.header['content-type']).toContain("application/json");
        expect(response.body).not.toBeNull();
    });

    it(`shouldn't store new tool without authorization`, async () => {
        const response = await request(app)
            .post('/tools')
            .send(toolSample)

        expect(response.status).toBe(401);
    });

    it(`should to update stored tool`, async () => {
        await getRepository(Tool)
            .save(plainToClass(Tool, toolSample))
            .then(async tool => {
                tool.description = "description changed";

                const response = await request(app)
                    .put(`/tools/${tool.id}`)
                    .send(tool)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(202);
            });
    });

    it(`shouldn't update stored tool without authorization`, async () => {
        await getRepository(Tool)
            .save(plainToClass(Tool, toolSample))
            .then(async tool => {

                tool.description = "description changed";
                const response = await request(app)
                    .put(`/tools/${tool.id}`)
                    .send(tool)

                expect(response.status).toBe(401);
            });
    });

    it(`should to delete tool by id`, async () => {
        await getRepository(Tool)
            .save(plainToClass(Tool, toolSample))
            .then(async tool => {

                const response = await request(app)
                    .delete(`/tools/${tool.id}`)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(204);
            });
    });

    it(`shouldn't to delete tool by id without authorization`, async () => {
        await getRepository(Tool)
            .save(plainToClass(Tool, toolSample))
            .then(async tool => {

                const response = await request(app)
                    .delete(`/tools/${tool.id}`)

                expect(response.status).toBe(401);
            });
    });

});