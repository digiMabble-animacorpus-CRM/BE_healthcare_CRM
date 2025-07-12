import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStaffTable1752074725044 implements MigrationInterface {
    name = 'CreateStaffTable1752074725044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "branches" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "location" character varying, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_7f37d3b42defea97f1df0d19535" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "staff" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "phone_number" character varying NOT NULL, "email" character varying NOT NULL, "gender" character varying NOT NULL, "languages" text array NOT NULL, "description" character varying, "dob" character varying, "access_level" character varying NOT NULL, "selected_branch" character varying NOT NULL, "specialization" character varying, "experience" character varying, "education" character varying, "registration_number" character varying, "certification_files" jsonb, "availability" jsonb, "tags" text array, "status" character varying NOT NULL DEFAULT 'active', "login_details" jsonb NOT NULL, "created_by" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "address_id" integer, "role_id" integer, CONSTRAINT "UQ_902985a964245652d5e3a0f5f6a" UNIQUE ("email"), CONSTRAINT "REL_a9753b9ee30a302f26f1e62ed7" UNIQUE ("address_id"), CONSTRAINT "PK_e4ee98bb552756c180aec1e854a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "staff_branches_branches" ("staffId" integer NOT NULL, "branchesId" integer NOT NULL, CONSTRAINT "PK_056a0688096aaa08acb54bc8de4" PRIMARY KEY ("staffId", "branchesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_54781c0aed9b37c1fa1cb13e07" ON "staff_branches_branches" ("staffId") `);
        await queryRunner.query(`CREATE INDEX "IDX_11ce64b3a8e93aba9b63f9cd4e" ON "staff_branches_branches" ("branchesId") `);
        await queryRunner.query(`CREATE TABLE "staff_permissions" ("staff_id" integer NOT NULL, "permission_id" integer NOT NULL, CONSTRAINT "PK_2db522f507591b87fdc966cc08e" PRIMARY KEY ("staff_id", "permission_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7652b9d979e31bcbd9815e245d" ON "staff_permissions" ("staff_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b7acbd8bae43d59ecb133df559" ON "staff_permissions" ("permission_id") `);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "staff" ADD CONSTRAINT "FK_a9753b9ee30a302f26f1e62ed73" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "staff" ADD CONSTRAINT "FK_c3fe01125c99573751fe5e55666" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "staff_branches_branches" ADD CONSTRAINT "FK_54781c0aed9b37c1fa1cb13e072" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "staff_branches_branches" ADD CONSTRAINT "FK_11ce64b3a8e93aba9b63f9cd4e5" FOREIGN KEY ("branchesId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "staff_permissions" ADD CONSTRAINT "FK_7652b9d979e31bcbd9815e245d3" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "staff_permissions" ADD CONSTRAINT "FK_b7acbd8bae43d59ecb133df5599" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff_permissions" DROP CONSTRAINT "FK_b7acbd8bae43d59ecb133df5599"`);
        await queryRunner.query(`ALTER TABLE "staff_permissions" DROP CONSTRAINT "FK_7652b9d979e31bcbd9815e245d3"`);
        await queryRunner.query(`ALTER TABLE "staff_branches_branches" DROP CONSTRAINT "FK_11ce64b3a8e93aba9b63f9cd4e5"`);
        await queryRunner.query(`ALTER TABLE "staff_branches_branches" DROP CONSTRAINT "FK_54781c0aed9b37c1fa1cb13e072"`);
        await queryRunner.query(`ALTER TABLE "staff" DROP CONSTRAINT "FK_c3fe01125c99573751fe5e55666"`);
        await queryRunner.query(`ALTER TABLE "staff" DROP CONSTRAINT "FK_a9753b9ee30a302f26f1e62ed73"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b7acbd8bae43d59ecb133df559"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7652b9d979e31bcbd9815e245d"`);
        await queryRunner.query(`DROP TABLE "staff_permissions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_11ce64b3a8e93aba9b63f9cd4e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_54781c0aed9b37c1fa1cb13e07"`);
        await queryRunner.query(`DROP TABLE "staff_branches_branches"`);
        await queryRunner.query(`DROP TABLE "staff"`);
        await queryRunner.query(`DROP TABLE "branches"`);
    }

}
