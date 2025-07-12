import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStaffIdToUUID1752142110314 implements MigrationInterface {
    name = 'UpdateStaffIdToUUID1752142110314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]::text[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]::text[]`);
    }

}
