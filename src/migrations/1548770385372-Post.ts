import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Post1548770385372 implements MigrationInterface {

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
                {
                    name: "userId",
                    type: "integer",
                    isNullable: false,
                },
            ],
        }), true);

        await queryRunner.createForeignKey("post", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "user",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable("post");
        await queryRunner.dropTable("post");
    }

}
