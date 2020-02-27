import { Server } from "http";
import { createConnection } from "typeorm";
import app from "./app";
const HOST = process.env.HOST || "localhost";
const PORT = parseInt(process.env.PORT || "3000");


export default async (): Promise<Server> => {

    try {
        await createConnection().then(async connection => {
            console.log(`Database connected: ${connection.isConnected}, ${process.uptime()}`);
        });
        return app.listen(PORT, HOST, () => {
            console.log(`Server running on http://${HOST}:${PORT}`)
        });
    } catch {
        throw new Error('Launch postgres via this command: "docker-compose up -d"')
    }
}