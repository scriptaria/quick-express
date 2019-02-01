import { ColumnType, MigrationInterface, QueryRunner, Table } from "typeorm";

export class Post1548770385371 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "post",
            columns: [
                {
                    name: "id",
                    type: "integer",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "title",
                    type: "varchar",
                    length: "100",
                    isNullable: false,
                },
                {
                    name: "body",
                    type: "text",
                    isNullable: false,
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable("post");
        await queryRunner.dropTable("post");
    }

}
