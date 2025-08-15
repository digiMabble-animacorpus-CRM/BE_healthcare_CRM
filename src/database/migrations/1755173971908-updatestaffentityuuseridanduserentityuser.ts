import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatestaffentityuuseridanduserentityuser1755173971908 implements MigrationInterface {
    name = 'Updatestaffentityuuseridanduserentityuser1755173971908';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Keep preferences default as text[]
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]::text[]`);

        // 2. Drop old FK (so we can update freely)
        await queryRunner.query(`ALTER TABLE "staff" DROP CONSTRAINT "FK_cec9365d9fc3a3409158b645f2e"`);

        // 3. Get all staff IDs with NULL user_id
        const nullStaffs: { id: number }[] = await queryRunner.query(`
            SELECT id FROM "staff" WHERE "user_id" IS NULL
        `);

        // 4. For each, create a unique user and assign it
        for (const staff of nullStaffs) {
            const userInsert = await queryRunner.query(`
                INSERT INTO "users" (name, email_id, password)
                VALUES (
                    'Auto User ${staff.id}',
                    'auto_${staff.id}@example.com',
                    'temp_password'
                )
                RETURNING id
            `);

            const newUserId = userInsert[0].id;

            await queryRunner.query(`
                UPDATE "staff"
                SET "user_id" = $1
                WHERE id = $2
            `, [newUserId, staff.id]);
        }

        // 5. Make column NOT NULL
        await queryRunner.query(`ALTER TABLE "staff" ALTER COLUMN "user_id" SET NOT NULL`);

        // 6. Re-add FK
        await queryRunner.query(`
            ALTER TABLE "staff"
            ADD CONSTRAINT "FK_cec9365d9fc3a3409158b645f2e"
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff" DROP CONSTRAINT "FK_cec9365d9fc3a3409158b645f2e"`);
        await queryRunner.query(`ALTER TABLE "staff" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`
            ALTER TABLE "staff"
            ADD CONSTRAINT "FK_cec9365d9fc3a3409158b645f2e"
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "preferences" SET DEFAULT ARRAY[]`);
    }
}
