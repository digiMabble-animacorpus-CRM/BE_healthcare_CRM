import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleTypeToRoles1752250990829 implements MigrationInterface {
    name = 'AddRoleTypeToRoles1752250990829'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" ADD "role_type" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]::text[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "role_type"`);
    }

}
