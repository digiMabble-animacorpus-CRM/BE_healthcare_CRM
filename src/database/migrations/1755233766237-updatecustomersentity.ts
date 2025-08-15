import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatecustomersentity1755233766237 implements MigrationInterface {
    name = 'Updatecustomersentity1755233766237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" RENAME COLUMN "address" TO "address_id"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "address_id"`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "address_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_2441e5a7e71f5dc216fa2f96feb" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_2441e5a7e71f5dc216fa2f96feb"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "address_id"`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "address_id" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "customers" RENAME COLUMN "address_id" TO "address"`);
    }

}
