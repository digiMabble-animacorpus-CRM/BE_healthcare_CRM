import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTherapistTable1751880326563 implements MigrationInterface {
    name = 'CreateTherapistTable1751880326563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "therapists" ("id" SERIAL NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(100) NOT NULL, "email" character varying(150) NOT NULL, "number" character varying(15) NOT NULL, "dob" date, "description" text, "zipCode" character varying(20), "gender" character varying(10), "language" character varying(50), "city" character varying(100), "country" character varying(100), "specialization" character varying(100), "experience" character varying(100), "education" character varying(100), "registrationNumber" character varying(100), "certificationFiles" jsonb, "availability" jsonb, "tags" text array, "status" character varying(20) NOT NULL DEFAULT 'active', "lastUpdated" TIMESTAMP, "source" character varying(100), "branch" character varying(100), "address_id" integer NOT NULL, CONSTRAINT "UQ_1a3c887709f040e057315ebeae1" UNIQUE ("email"), CONSTRAINT "PK_9d6f686b5fb481d1b9d513f3421" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "therapists" ADD CONSTRAINT "FK_6cfff69940a4e0e77727da0f07c" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "therapists" DROP CONSTRAINT "FK_6cfff69940a4e0e77727da0f07c"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`DROP TABLE "therapists"`);
    }

}
