import { MigrationInterface, QueryRunner } from "typeorm";

export class ConvertStaffToNumberIds1752145537212 implements MigrationInterface {
    name = 'ConvertStaffToNumberIds1752145537212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "staff_branches" ("staff_id" integer NOT NULL, "branch_id" integer NOT NULL, CONSTRAINT "PK_86b888f8803bf310deb863aedec" PRIMARY KEY ("staff_id", "branch_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3dea274ad9b57253df1c9548dd" ON "staff_branches" ("staff_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_5215055285d9266d2425f2281b" ON "staff_branches" ("branch_id") `);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "gender"`);
        await queryRunner.query(`CREATE TYPE "public"."staff_gender_enum" AS ENUM('male', 'female', 'other')`);
        await queryRunner.query(`ALTER TABLE "staff" ADD "gender" "public"."staff_gender_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "access_level"`);
        await queryRunner.query(`CREATE TYPE "public"."staff_access_level_enum" AS ENUM('staff', 'branch-admin', 'super-admin')`);
        await queryRunner.query(`ALTER TABLE "staff" ADD "access_level" "public"."staff_access_level_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "selected_branch"`);
        await queryRunner.query(`ALTER TABLE "staff" ADD "selected_branch" integer`);
        await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."staff_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`ALTER TABLE "staff" ADD "status" "public"."staff_status_enum" NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "staff" ADD "created_by" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "staff" ADD "updated_by" integer`);
        await queryRunner.query(`ALTER TABLE "staff_branches" ADD CONSTRAINT "FK_3dea274ad9b57253df1c9548dd6" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "staff_branches" ADD CONSTRAINT "FK_5215055285d9266d2425f2281bf" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff_branches" DROP CONSTRAINT "FK_5215055285d9266d2425f2281bf"`);
        await queryRunner.query(`ALTER TABLE "staff_branches" DROP CONSTRAINT "FK_3dea274ad9b57253df1c9548dd6"`);
        await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "staff" ADD "updated_by" character varying`);
        await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "staff" ADD "created_by" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."staff_status_enum"`);
        await queryRunner.query(`ALTER TABLE "staff" ADD "status" character varying NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "selected_branch"`);
        await queryRunner.query(`ALTER TABLE "staff" ADD "selected_branch" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "access_level"`);
        await queryRunner.query(`DROP TYPE "public"."staff_access_level_enum"`);
        await queryRunner.query(`ALTER TABLE "staff" ADD "access_level" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "gender"`);
        await queryRunner.query(`DROP TYPE "public"."staff_gender_enum"`);
        await queryRunner.query(`ALTER TABLE "staff" ADD "gender" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5215055285d9266d2425f2281b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3dea274ad9b57253df1c9548dd"`);
        await queryRunner.query(`DROP TABLE "staff_branches"`);
    }

}
