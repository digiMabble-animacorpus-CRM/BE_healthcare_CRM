// import { MigrationInterface, QueryRunner } from "typeorm";

// export class Updatestaffentityuuserid1755167065722 implements MigrationInterface {
//     name = 'Updatestaffentityuuserid1755167065722'

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_2441e5a7e71f5dc216fa2f96feb"`);
//         await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "customer_name"`);
//         await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "phone_number"`);
//         await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "view_properties"`);
//         await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "own_properties"`);
//         await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "invest_property"`);
//         await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "address_id"`);
//         await queryRunner.query(`ALTER TABLE "customers" ADD "name" character varying(100) NOT NULL`);
//         await queryRunner.query(`ALTER TABLE "customers" ADD "number" character varying(15) NOT NULL`);
//         await queryRunner.query(`ALTER TABLE "customers" ADD "description" text`);
//         await queryRunner.query(`ALTER TABLE "customers" ADD "zipCode" character varying(20)`);
//         await queryRunner.query(`ALTER TABLE "customers" ADD "language" character varying(50)`);
//         await queryRunner.query(`ALTER TABLE "customers" ADD "tags" text`);
//         await queryRunner.query(`ALTER TABLE "customers" ADD "city" character varying(50)`);
//         await queryRunner.query(`ALTER TABLE "customers" ADD "country" character varying(50)`);
//         await queryRunner.query(`ALTER TABLE "customers" ADD "lastUpdated" TIMESTAMP`);
//         await queryRunner.query(`ALTER TABLE "customers" ADD "address" character varying(255)`);
//         await queryRunner.query(`ALTER TABLE "staff" ADD "user_id" integer`);
//         await queryRunner.query(`ALTER TABLE "staff" ADD CONSTRAINT "UQ_cec9365d9fc3a3409158b645f2e" UNIQUE ("user_id")`);
//         await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "status"`);
//         await queryRunner.query(`CREATE TYPE "public"."customers_status_enum" AS ENUM('new', 'old')`);
//         await queryRunner.query(`ALTER TABLE "customers" ADD "status" "public"."customers_status_enum" NOT NULL DEFAULT 'new'`);
//         await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]::text[]`);
//         await queryRunner.query(`ALTER TABLE "staff" ADD CONSTRAINT "FK_cec9365d9fc3a3409158b645f2e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "staff" DROP CONSTRAINT "FK_cec9365d9fc3a3409158b645f2e"`);
//         await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]`);
//         await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "status"`);
//         await queryRunner.query(`DROP TYPE "public"."customers_status_enum"`);
//         await queryRunner.query(`ALTER TABLE "customers" ADD "status" character varying(20) NOT NULL DEFAULT 'new'`);
//         await queryRunner.query(`ALTER TABLE "staff" DROP CONSTRAINT "UQ_cec9365d9fc3a3409158b645f2e"`);
//         await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "user_id"`);
//         await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "address"`);
//         await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "lastUpdated"`);
//         await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "country"`);
//         await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "city"`);
//         await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "tags"`);
//         await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "language"`);
//         await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "zipCode"`);
//         await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "description"`);
//         await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "number"`);
//         await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "name"`);
//         await queryRunner.query(`ALTER TABLE "customers" ADD "address_id" integer NOT NULL`);
//         await queryRunner.query(`ALTER TABLE "customers" ADD "invest_property" double precision DEFAULT '0'`);
//         await queryRunner.query(`ALTER TABLE "customers" ADD "own_properties" integer DEFAULT '0'`);
//         await queryRunner.query(`ALTER TABLE "customers" ADD "view_properties" integer DEFAULT '0'`);
//         await queryRunner.query(`ALTER TABLE "customers" ADD "phone_number" character varying(15) NOT NULL`);
//         await queryRunner.query(`ALTER TABLE "customers" ADD "customer_name" character varying(100) NOT NULL`);
//         await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_2441e5a7e71f5dc216fa2f96feb" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
//     }

// }
