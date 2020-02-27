import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createUser1582823487011 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "user",
            columns: [
                {
                    name: "id",
                    type: "integer",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                }, {
                    name: "name",
                    type: "varchar",
                    isNullable: false,
                }, {
                    name: "email",
                    type: "varchar",
                    isNullable: false,
                }, {
                    name: "password",
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
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable(`user`);
    }

}
