import request from "supertest";
import { Server } from "http";

import startServer from "../../src/server";
import { User } from "../../src/app/entities/User";
import { getRepository } from "typeorm";

describe('SessionController', () => {

    let app: Server;

    beforeAll(async () => {
        app = await startServer();
    });

    it(`should login response body have a token`, async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'admin@test.com', password: '1234' })

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    it(`should login required email and password`, async () => {
        const response = await request(app).post('/login');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toContain('E-mail and password are required');
    });

    it(`should login required a valid user`, async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'unvalid-user@test.com', password: '1234' })

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toContain('User not found');
    });

    it(`should login required a correct password`, async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'admin@test.com', password: 'xxxx' })

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toContain('Incorrect password');
    });

    it(`should change your password`, async () => {
        let user = {
            name: 'Test password',
            email: 'test-password@test.com',
            password: '1234'
        };

        await getRepository(User).delete({ email: user.email }).then(async () => {
            await request(app)
                .post('/users')
                .send(user)
                .then(async userResponse => {

                    expect(userResponse.status).toBe(201);

                    let response = await request(app)
                        .post('/login')
                        .send({ email: user.email, password: user.password })

                    expect(response.status).toBe(200);
                    expect(response.body).toHaveProperty('token');

                    let token = response.body.token;
                    response = await request(app)
                        .put('/change-password')
                        .send({ oldPassword: user.password, newPassword: '4321' })
                        .set('Authorization', `Bearer ${token}`);

                    expect(response.status).toBe(202);

                    response = await request(app)
                        .delete(`/users/${userResponse.body.id}`)
                        .set('Authorization', `Bearer ${token}`);

                    expect(response.status).toBe(204);
                });
        });
    });

    it(`should change your password if the new it's not the same as the old`, async () => {
        let user = {
            name: 'Test password',
            email: 'test-password@test.com',
            password: '1234'
        };
        await getRepository(User).delete({ email: user.email }).then(async () => {
            await request(app)
                .post('/users')
                .send(user)
                .then(async userResponse => {

                    expect(userResponse.status).toBe(201);

                    let response = await request(app)
                        .post('/login')
                        .send({ email: user.email, password: user.password })

                    expect(response.status).toBe(200);
                    expect(response.body).toHaveProperty('token');

                    let token = response.body.token;
                    response = await request(app)
                        .put('/change-password')
                        .send({ oldPassword: user.password, newPassword: user.password })
                        .set('Authorization', `Bearer ${token}`);

                    expect(response.status).toBe(400);
                    expect(response.body).toHaveProperty('message');
                    expect(response.body.message).toContain('The new password is the same of old password');

                    response = await request(app)
                        .delete(`/users/${userResponse.body.id}`)
                        .set('Authorization', `Bearer ${token}`);

                    expect(response.status).toBe(204);
                });
        });
    });

    it(`shouldn't change password on a invalid user`, async () => {
        let user = {
            name: 'Test password',
            email: 'test-password@test.com',
            password: '1234'
        };
        await getRepository(User).delete({ email: user.email }).then(async () => {
            await request(app)
                .post('/users')
                .send(user)
                .then(async (userResponse) => {

                    expect(userResponse.status).toBe(201);

                    let response = await request(app)
                        .post('/login')
                        .send({ email: user.email, password: user.password })

                    expect(response.status).toBe(200);
                    expect(response.body).toHaveProperty('token');

                    let token = response.body.token;

                    await getRepository(User).delete({ id: userResponse.body.id });

                    response = await request(app)
                        .put('/change-password')
                        .send({ oldPassword: user.password, newPassword: '4321' })
                        .set('Authorization', `Bearer ${token}`);

                    expect(response.status).toBe(401);
                    expect(response.body).toHaveProperty('errors');
                    expect(response.body.errors).toContain('User not found');
                });
        });
    });

    it(`shouldn't change password if old password is incorrect`, async () => {
        let user = {
            name: 'Test password',
            email: 'test-password@test.com',
            password: '1234'
        };
        await getRepository(User).delete({ email: user.email }).then(async () => {
            await request(app)
                .post('/users')
                .send(user)
                .then(async (userResponse) => {

                    expect(userResponse.status).toBe(201);

                    let response = await request(app)
                        .post('/login')
                        .send({ email: user.email, password: user.password })

                    expect(response.status).toBe(200);
                    expect(response.body).toHaveProperty('token');

                    let token = response.body.token;
                    response = await request(app)
                        .put('/change-password')
                        .send({ oldPassword: '0123', newPassword: '4321' })
                        .set('Authorization', `Bearer ${token}`);

                    expect(response.status).toBe(401);
                    expect(response.body).toHaveProperty('message');
                    expect(response.body.message).toContain('Incorrect password');
                });
        });
    });

    it(`shouldn't change password if password is invalid`, async () => {
        let user = {
            name: 'Test password',
            email: 'test-password@test.com',
            password: '1234'
        };
        await getRepository(User).delete({ email: user.email }).then(async () => {
            await request(app)
                .post('/users')
                .send(user)
                .then(async (userResponse) => {

                    expect(userResponse.status).toBe(201);

                    let response = await request(app)
                        .post('/login')
                        .send({ email: user.email, password: user.password })

                    expect(response.status).toBe(200);
                    expect(response.body).toHaveProperty('token');

                    let token = response.body.token;
                    response = await request(app)
                        .put('/change-password')
                        .send({ oldPassword: user.password, newPassword: '0' })
                        .set('Authorization', `Bearer ${token}`);

                    expect(response.status).toBe(400);
                    expect(Array.isArray(response.body)).toBe(true);
                    expect(JSON.stringify(response.body)).toContain('password');
                });
        });
    });


});