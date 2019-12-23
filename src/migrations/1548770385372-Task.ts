import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Task1548770385372 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: "task",
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
          name: "done",
          type: "boolean",
          default: false,
          isNullable: false,
        },
        {
          name: "userId",
          type: "integer",
          isNullable: false,
        },
      ],
    }), true);

    await queryRunner.createForeignKey("task", new TableForeignKey({
      columnNames: ["userId"],
      referencedColumnNames: ["id"],
      referencedTableName: "user",
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const table = await queryRunner.getTable("task");
    await queryRunner.dropTable("task");
  }

}
