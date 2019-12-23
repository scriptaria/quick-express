import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class User1548770385371 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: "user",
      columns: [
        {
          name: "id",
          type: "integer",
          isPrimary: true,
          isGenerated: true,
          generationStrategy: "increment",
        },
        {
          name: "name",
          type: "varchar",
          length: "100",
          isNullable: false,
        },
        {
          name: "email",
          type: "varchar",
          length: "50",
          isUnique: true,
          isNullable: false,
        },
        {
          name: "password",
          type: "varchar",
          length: "100",
          isNullable: false,
        },
      ],
    }), true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const table = await queryRunner.getTable("user");
    await queryRunner.dropTable("user");
  }

}
