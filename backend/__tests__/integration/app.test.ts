import request from "supertest";
import { Server } from "http";
import startServer from "../../src/server";

let server: Server;
beforeAll(async () => {
    server = await startServer();
});

test('should server responds to /', async () => {
    const response = await request(server).get('/');

    expect(response.status).toBe(200);
});