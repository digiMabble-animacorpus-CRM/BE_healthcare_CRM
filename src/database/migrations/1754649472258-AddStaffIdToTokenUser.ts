import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStaffIdToTokenUser1754649472258 implements MigrationInterface {
    name = 'AddStaffIdToTokenUser1754649472258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_4ef2f8c7b6cbcfdb04fb240ebdc"`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "FK_4ef2f8c7b6cbcfdb04fb240ebdc" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "FK_8769073e38c365f315426554ca5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_8769073e38c365f315426554ca5"`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_4ef2f8c7b6cbcfdb04fb240ebdc"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "FK_4ef2f8c7b6cbcfdb04fb240ebdc" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
