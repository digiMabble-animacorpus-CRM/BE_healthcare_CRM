import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatestaffentityuuseridanduserentityuser1755173971908 implements MigrationInterface {
    name = 'Updatestaffentityuuseridanduserentityuser1755173971908'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "staff" DROP CONSTRAINT "FK_cec9365d9fc3a3409158b645f2e"`);
        await queryRunner.query(`ALTER TABLE "staff" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "staff" ADD CONSTRAINT "FK_cec9365d9fc3a3409158b645f2e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff" DROP CONSTRAINT "FK_cec9365d9fc3a3409158b645f2e"`);
        await queryRunner.query(`ALTER TABLE "staff" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "staff" ADD CONSTRAINT "FK_cec9365d9fc3a3409158b645f2e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]`);
    }

}
