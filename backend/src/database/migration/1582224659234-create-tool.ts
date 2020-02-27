import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createTool1582224659234 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "tool",
            columns: [
                {
                    name: "id",
                    type: "integer",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                }, {
                    name: "title",
                    type: "varchar",
                    isNullable: false,
                }, {
                    name: "link",
                    type: "varchar",
                    isNullable: false,
                }, {
                    name: "description",
                    type: "varchar",
                    isNullable: false,
                }, {
                    name: "created_at",
                    type: "timestamp with time zone",
                    isNullable: false,
                    default: "now()"
                }, {
                    name: "updated_at",
                    type: "timestamp with time zone",
                    isNullable: false,
                    default: "now()"
                }

            ]
        }), true)


    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable(`tool`);
    }

}
