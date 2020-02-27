import { MigrationInterface, QueryRunner } from "typeorm";

export class populateTools1582228055447 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            INSERT INTO tag (tag) VALUES ('api');
            INSERT INTO tag (tag) VALUES ('calendar');
            INSERT INTO tag (tag) VALUES ('collaboration');
            INSERT INTO tag (tag) VALUES ('framework');
            INSERT INTO tag (tag) VALUES ('github');
            INSERT INTO tag (tag) VALUES ('http2');
            INSERT INTO tag (tag) VALUES ('https');
            INSERT INTO tag (tag) VALUES ('json');
            INSERT INTO tag (tag) VALUES ('localhost');
            INSERT INTO tag (tag) VALUES ('node');
            INSERT INTO tag (tag) VALUES ('organization');
            INSERT INTO tag (tag) VALUES ('planning');
            INSERT INTO tag (tag) VALUES ('rest');
            INSERT INTO tag (tag) VALUES ('schema');
            INSERT INTO tag (tag) VALUES ('web');
            INSERT INTO tag (tag) VALUES ('writing');

            INSERT INTO tool (title,link,description) VALUES ('Notion','https://notion.so','All in one tool to organize teams and ideas. Write, plan, collaborate, and get organized.');
            INSERT INTO tool (title,link,description) VALUES ('json-server','https://github.com/typicode/json-server','Fake REST API based on a json schema. Useful for mocking and creating APIs for front-end devs to consume in coding challenges.');
            INSERT INTO tool (title,link,description) VALUES ('fastify','https://www.fastify.io/','Extremely fast and simple, low-overhead web framework for NodeJS. Supports HTTP2.');

            INSERT INTO tool_tags_tag ("toolId", "tagTag") (select id, 'organization' from tool where title = 'Notion');
            INSERT INTO tool_tags_tag ("toolId", "tagTag") (select id, 'planning' from tool where title = 'Notion');
            INSERT INTO tool_tags_tag ("toolId", "tagTag") (select id, 'collaboration' from tool where title = 'Notion');
            INSERT INTO tool_tags_tag ("toolId", "tagTag") (select id, 'writing' from tool where title = 'Notion');
            INSERT INTO tool_tags_tag ("toolId", "tagTag") (select id, 'calendar' from tool where title = 'Notion');
            INSERT INTO tool_tags_tag ("toolId", "tagTag") (select id, 'api' from tool where title = 'json-server');
            INSERT INTO tool_tags_tag ("toolId", "tagTag") (select id, 'json' from tool where title = 'json-server');
            INSERT INTO tool_tags_tag ("toolId", "tagTag") (select id, 'schema' from tool where title = 'json-server');
            INSERT INTO tool_tags_tag ("toolId", "tagTag") (select id, 'node' from tool where title = 'json-server');
            INSERT INTO tool_tags_tag ("toolId", "tagTag") (select id, 'github' from tool where title = 'json-server');
            INSERT INTO tool_tags_tag ("toolId", "tagTag") (select id, 'rest' from tool where title = 'json-server');
            INSERT INTO tool_tags_tag ("toolId", "tagTag") (select id, 'web' from tool where title = 'fastify');
            INSERT INTO tool_tags_tag ("toolId", "tagTag") (select id, 'framework' from tool where title = 'fastify');
            INSERT INTO tool_tags_tag ("toolId", "tagTag") (select id, 'node' from tool where title = 'fastify');
            INSERT INTO tool_tags_tag ("toolId", "tagTag") (select id, 'http2' from tool where title = 'fastify');
            INSERT INTO tool_tags_tag ("toolId", "tagTag") (select id, 'https' from tool where title = 'fastify');
            INSERT INTO tool_tags_tag ("toolId", "tagTag") (select id, 'localhost' from tool where title = 'fastify');
        `)
    }
    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
