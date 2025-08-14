import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatestaffentity31755065180971 implements MigrationInterface {
    name = 'Updatestaffentity31755065180971'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff" DROP CONSTRAINT "FK_ba7013cadf78e45f692ac29758d"`);
        await queryRunner.query(`ALTER TABLE "staff" RENAME COLUMN "addressId" TO "address"`);
        await queryRunner.query(`ALTER TABLE "staff" RENAME CONSTRAINT "UQ_ba7013cadf78e45f692ac29758d" TO "UQ_7af725a209d7477d21203ecec80"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "staff" ALTER COLUMN "loginDetails" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "staff" ALTER COLUMN "createdBy" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "staff" ADD CONSTRAINT "FK_7af725a209d7477d21203ecec80" FOREIGN KEY ("address") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff" DROP CONSTRAINT "FK_7af725a209d7477d21203ecec80"`);
        await queryRunner.query(`ALTER TABLE "staff" ALTER COLUMN "createdBy" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "staff" ALTER COLUMN "loginDetails" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "staff" RENAME CONSTRAINT "UQ_7af725a209d7477d21203ecec80" TO "UQ_ba7013cadf78e45f692ac29758d"`);
        await queryRunner.query(`ALTER TABLE "staff" RENAME COLUMN "address" TO "addressId"`);
        await queryRunner.query(`ALTER TABLE "staff" ADD CONSTRAINT "FK_ba7013cadf78e45f692ac29758d" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
