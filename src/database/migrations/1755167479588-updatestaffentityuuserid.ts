import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatestaffentityuuserid1755167479588 implements MigrationInterface {
    name = 'Updatestaffentityuuserid1755167479588'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."customers_status_enum" AS ENUM('new', 'old')`);
        await queryRunner.query(`CREATE TABLE "customers" ("id" SERIAL NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(100) NOT NULL, "email" character varying(150) NOT NULL, "number" character varying(15) NOT NULL, "description" text, "zipCode" character varying(20), "language" character varying(50), "tags" text, "city" character varying(50), "country" character varying(50), "status" "public"."customers_status_enum" NOT NULL DEFAULT 'new', "lastUpdated" TIMESTAMP, "branch" character varying(100), "source" character varying(100), "gender" character varying(10), "dob" date, "address" character varying(255), "customer_image_url" character varying(255), CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE ("email"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "staff" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "staff" ADD CONSTRAINT "UQ_cec9365d9fc3a3409158b645f2e" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "staff" ADD CONSTRAINT "FK_cec9365d9fc3a3409158b645f2e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff" DROP CONSTRAINT "FK_cec9365d9fc3a3409158b645f2e"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "staff" DROP CONSTRAINT "UQ_cec9365d9fc3a3409158b645f2e"`);
        await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "user_id"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TYPE "public"."customers_status_enum"`);
    }

}
