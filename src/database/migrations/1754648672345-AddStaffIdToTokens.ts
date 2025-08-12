import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStaffIdToTokens1754648672345 implements MigrationInterface {
    name = 'AddStaffIdToTokens1754648672345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens" ADD "staff_id" integer`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "FK_4ef2f8c7b6cbcfdb04fb240ebdc" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_4ef2f8c7b6cbcfdb04fb240ebdc"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "staff_id"`);
    }

}
