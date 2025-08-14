import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatestaffentityuuseridanduserentity1755168090973 implements MigrationInterface {
    name = 'Updatestaffentityuuseridanduserentity1755168090973'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]::text[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]`);
    }

}
