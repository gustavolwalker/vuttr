import request from "supertest";
import { Server } from "http";

import startServer from "../../src/server";
import truncate from "../utils/truncate";
import { User } from "../../src/app/entities/User";

describe('UsersController', () => {

    let server: Server;
    const user = {
        name: "Admin",
        email: "admin@server.com",
        password: "1234",
    }

    beforeAll(async () => {
        server = await startServer();
    });

    beforeEach(async () => {
        await truncate(User);
    });

    it('should index users', async () => {
        const response = await request(server).get('/users');
        expect(response.status).toBe(200);
    });

    it('should user exits', async () => {
        let response = await request(server).post('/users').send(user);
        expect(response.status).toBe(201);
        const { id } = response.body;

        response = await request(server).get(`/users/${id}`);
        expect(response.status).toBe(200);
        expect(response.body).not.toBeNull();
    });

    it('should user not exits', async () => {
        const response = await request(server).get(`/users/-1`);
        expect(response.status).toBe(404);
        const { errors } = response.body;
        expect(errors).not.toBeNull();
    });

    it('should to store new user', async () => {
        const response = await request(server).post('/users').send(user);
        expect(response.status).toBe(201);
        expect(response.header).toHaveProperty("content-type");
        expect(response.header['content-type']).toContain("application/json");
        expect(response.body).not.toBeNull();
    });

    it('should to update stored user', async () => {
        let response = await request(server).post('/users').send(user);
        expect(response.status).toBe(201);
        let userUpdate: User = response.body;
        userUpdate.name = "Administrator";

        response = await request(server).put(`/users/${userUpdate.id}`).send(userUpdate);
        expect(response.status).toBe(202);
    });

    it('should to delete user by id', async () => {
        let response = await request(server).post('/users').send(user);
        expect(response.status).toBe(201);
        const { id } = response.body;

        response = await request(server).delete(`/users/${id}`);
        expect(response.status).toBe(204);
    });
});