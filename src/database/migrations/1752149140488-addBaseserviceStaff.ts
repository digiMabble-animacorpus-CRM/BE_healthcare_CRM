import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBaseserviceStaff1752149140488 implements MigrationInterface {
    name = 'AddBaseserviceStaff1752149140488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "staff" ADD "is_deleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "staff" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "staff" ADD CONSTRAINT "FK_556b47eef6c3c7758915d1bc05f" FOREIGN KEY ("selected_branch") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff" DROP CONSTRAINT "FK_556b47eef6c3c7758915d1bc05f"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "is_deleted"`);
        await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "is_active"`);
    }

}
