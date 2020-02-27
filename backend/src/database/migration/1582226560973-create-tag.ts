import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class createTag1582226560973 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "tag",
            columns: [
                {
                    name: "tag",
                    type: "varchar",
                    isPrimary: true
                }

            ]
        }), true);

        await queryRunner.createTable(new Table({
            name: "tool_tags_tag",
            columns: [
                {
                    name: "toolId",
                    type: "int",
                    isPrimary: true
                },
                {
                    name: "tagTag",
                    type: "varchar",
                    isPrimary: true
                }

            ]
        }), true);


        await queryRunner.createForeignKey("tool_tags_tag", new TableForeignKey({
            columnNames: ["toolId"],
            referencedColumnNames: ["id"],
            referencedTableName: "tool",
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("tool_tags_tag", new TableForeignKey({
            columnNames: ["tagTag"],
            referencedColumnNames: ["tag"],
            referencedTableName: "tag",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('tool_tags_tag', true);
        await queryRunner.dropTable('tag', true);
    }

}
