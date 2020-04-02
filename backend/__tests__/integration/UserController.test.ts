import request from "supertest";
import { Server } from "http";

import startServer from "../../src/server";
import { User } from "../../src/app/entities/User";

describe('UserController', () => {

    let app: Server;
    let token: string;

    const userSample = {
        name: "Test",
        email: "test@test.com",
        password: "1234",
    }

    beforeAll(async () => {
        app = await startServer();
    });

    beforeEach(async () => {
        await request(app)
            .post('/login')
            .send({ email: 'admin@test.com', password: '1234' })
            .then(response => {
                token = response.body.token;
            });
    })

    it(`should index users with authorization`, async () => {
        const response = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    it(`shouldn't index users without authorization`, async () => {
        const response = await request(app)
            .get('/users')
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toContain('Token not provided');
    });

    it(`shouldn't index users with an invalid token`, async () => {
        const response = await request(app)
            .get('/users')
            .set('Authorization', `Bearer invalid`);
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toContain('Token invalid');
    });

    it(`should user exits`, async () => {
        await request(app)
            .post('/users')
            .send(userSample)
            .then(async res => {
                expect(res.status).toBe(201);

                const { id } = res.body;
                const response = await request(app)
                    .get(`/users/${id}`)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);
                expect(response.body).not.toBeNull();
            });
    });

    it(`should user not exits`, async () => {
        const response = await request(app)
            .get(`/users/-1`)
            .set('Authorization', `Bearer ${token}`);

        const { errors } = response.body;
        expect(response.status).toBe(404);
        expect(errors).not.toBeNull();
    });

    it(`should to store new user`, async () => {
        const response = await request(app).post('/users').send(userSample);

        expect(response.status).toBe(201);
        expect(response.header).toHaveProperty("content-type");
        expect(response.header['content-type']).toContain("application/json");
        expect(response.body).not.toBeNull();
    });

    it(`should to update stored user`, async () => {
        await request(app)
            .post('/users')
            .send(userSample)
            .then(async res => {
                expect(res.status).toBe(201);

                let userUpdate: User = res.body;
                userUpdate.name = "Administrator";
                const response = await request(app)
                    .put(`/users/${userUpdate.id}`)
                    .send(userUpdate)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(202);
            });
    });

    it(`shouldn't update stored user without authorization`, async () => {
        await request(app)
            .post('/users')
            .send(userSample).then(async res => {
                expect(res.status).toBe(201);

                let userUpdate: User = res.body;
                userUpdate.name = "Administrator";
                const response = await request(app)
                    .put(`/users/${userUpdate.id}`)
                    .send(userUpdate)

                expect(response.status).toBe(401);
            });
    });

    it(`should to delete user by id`, async () => {
        await request(app)
            .post('/users')
            .send(userSample).then(async res => {
                expect(res.status).toBe(201);

                const { id } = res.body;
                const response = await request(app)
                    .delete(`/users/${id}`)
                    .set('Authorization', `Bearer ${token}`);;

                expect(response.status).toBe(204);
            });
    });

    it(`shouldn't delete user by id without authorization`, async () => {
        await request(app)
            .post('/users')
            .send(userSample).then(async res => {
                expect(res.status).toBe(201);

                const { id } = res.body;
                const response = await request(app)
                    .delete(`/users/${id}`)

                expect(response.status).toBe(401);
            });
    });
});