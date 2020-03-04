import { MigrationInterface, getRepository } from "typeorm";
import { Tool } from "../../app/entities/Tool";

export class populateTools1582228055447 implements MigrationInterface {

    public async up(): Promise<any> {
        await getRepository(Tool).save({
            title: 'Notion',
            link: 'https://notion.so',
            description: 'All in one tool to organize teams and ideas. Write, plan, collaborate, and get organized.',
            tags: [
                { tag: 'organization' },
                { tag: 'planning' },
                { tag: 'collaboration' },
                { tag: 'writing' },
                { tag: 'calendar' }
            ]
        });
        await getRepository(Tool).save({
            title: 'json-server',
            link: 'https://github.com/typicode/json-server',
            description: 'Fake REST API based on a json schema. Useful for mocking and creating APIs for front-end devs to consume in coding challenges.',
            tags: [
                { tag: 'web' },
                { tag: 'framework' },
                { tag: 'node' },
                { tag: 'http2' },
                { tag: 'https' },
                { tag: 'localhost' }
            ]
        });
        await getRepository(Tool).save({
            title: 'fastify',
            link: 'https://www.fastify.io/',
            description: 'Extremely fast and simple, low-overhead web framework for NodeJS. Supports HTTP2.',
            tags: [
                { tag: 'api' },
                { tag: 'json' },
                { tag: 'schema' },
                { tag: 'node' },
                { tag: 'github' },
                { tag: 'rest' }
            ]
        });
    }

    public async down(): Promise<any> {
    }

}
