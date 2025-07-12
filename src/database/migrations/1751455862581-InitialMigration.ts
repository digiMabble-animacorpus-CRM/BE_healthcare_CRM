import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1751455862581 implements MigrationInterface {
    name = 'InitialMigration1751455862581'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "addresses" ("id" SERIAL NOT NULL, "street" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying, "zip_code" character varying NOT NULL, "country" character varying NOT NULL, CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customers" ("id" SERIAL NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "customer_name" character varying(100) NOT NULL, "email" character varying(150) NOT NULL, "phone_number" character varying(15) NOT NULL, "view_properties" integer DEFAULT '0', "own_properties" integer DEFAULT '0', "invest_property" double precision DEFAULT '0', "gender" character varying(10), "dob" date, "source" character varying(100), "branch" character varying(100), "status" character varying(20) NOT NULL DEFAULT 'new', "customer_image_url" character varying(255), "address_id" integer NOT NULL, CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE ("email"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tokens" ("id" SERIAL NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_email" character varying(255) NOT NULL, "token" character varying(500) NOT NULL, "type" character varying(50) NOT NULL, "expires_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "menus" ("id" SERIAL NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(100) NOT NULL, "description" character varying(255), "path" character varying(100) NOT NULL, "icon" character varying(50) NOT NULL, "parent_id" integer, "order" integer NOT NULL DEFAULT '0', "is_visible" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permissions" ("id" SERIAL NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(100) NOT NULL, "description" character varying(255) NOT NULL, "action" character varying(50) NOT NULL, "resource" character varying(100) NOT NULL, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(100) NOT NULL, "description" character varying(255) NOT NULL, "is_default" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "social_links" ("id" SERIAL NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "facebook" character varying, "instagram" character varying, "twitter" character varying, "userId" integer, CONSTRAINT "REL_e0c0e4cdf9d2487d704102474b" UNIQUE ("userId"), CONSTRAINT "PK_50d32c67ddd71c09d372b02167f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "profile_url" character varying, "email_id" character varying NOT NULL, "password" character varying NOT NULL, "mobile_no" character varying, "email_verified" boolean NOT NULL DEFAULT false, "gender" character varying(15), "user_type" character varying(15) NOT NULL DEFAULT 'regular', "dob" date, "last_login" TIMESTAMP, "device_token" text, "is_blocked" boolean NOT NULL DEFAULT false, "preferences" text array NOT NULL DEFAULT ARRAY[]::text[], "company_name" character varying, "website" character varying, "logo" character varying, "tax_id" character varying, "addressId" integer, CONSTRAINT "UQ_e752aee509d8f8118c6e5b1d8cc" UNIQUE ("email_id"), CONSTRAINT "REL_bafb08f60d7857f4670c172a6e" UNIQUE ("addressId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "properties" ("id" SERIAL NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "category" integer NOT NULL, "listing_type" character varying NOT NULL, "bedrooms" integer NOT NULL DEFAULT '0', "bathrooms" integer NOT NULL DEFAULT '0', "square_foot" integer NOT NULL DEFAULT '0', "floor" integer NOT NULL DEFAULT '0', "price" numeric(10,2) NOT NULL DEFAULT '0', "address_id" integer, "image" character varying, CONSTRAINT "PK_2d83bfa0b9fcd45dee1785af44d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "order_id" integer NOT NULL, "purchase_date" date NOT NULL, "amount" numeric(10,2) NOT NULL, "currency" character varying(10) NOT NULL, "amount_status" character varying NOT NULL DEFAULT 'Pending', "customer_id" integer NOT NULL, "property_id" integer NOT NULL, CONSTRAINT "UQ_cad55b3cb25b38be94d2ce831db" UNIQUE ("order_id"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."leads_lead_source_enum" AS ENUM('Website', 'Referral', 'Campaign', 'Walk-in', 'Social Media', 'Phone Call', 'Email')`);
        await queryRunner.query(`CREATE TYPE "public"."leads_lead_status_enum" AS ENUM('New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost', 'Follow Up')`);
        await queryRunner.query(`CREATE TABLE "leads" ("id" SERIAL NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "lead_source" "public"."leads_lead_source_enum" NOT NULL DEFAULT 'Website', "lead_status" "public"."leads_lead_status_enum" NOT NULL DEFAULT 'New', "budget_range" numeric(12,2), "preferred_contact_time" TIME, "notes" text, "date_of_inquiry" date NOT NULL, "customer_id" integer NOT NULL, "property_id" integer NOT NULL, CONSTRAINT "PK_cd102ed7a9a4ca7d4d8bfeba406" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permission_menus" ("permission_id" integer NOT NULL, "menu_id" integer NOT NULL, CONSTRAINT "PK_2b287dc61feb7f57543492ca9ef" PRIMARY KEY ("permission_id", "menu_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_877c6afa18c1bb2ef5cbc3020a" ON "permission_menus" ("permission_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_7010814842172d23fe3dbf0455" ON "permission_menus" ("menu_id") `);
        await queryRunner.query(`CREATE TABLE "role_permissions" ("role_id" integer NOT NULL, "permission_id" integer NOT NULL, CONSTRAINT "PK_25d24010f53bb80b78e412c9656" PRIMARY KEY ("role_id", "permission_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_178199805b901ccd220ab7740e" ON "role_permissions" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_17022daf3f885f7d35423e9971" ON "role_permissions" ("permission_id") `);
        await queryRunner.query(`CREATE TABLE "user_roles" ("user_id" integer NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("user_id", "role_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") `);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_2441e5a7e71f5dc216fa2f96feb" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menus" ADD CONSTRAINT "FK_00ccc1ed4e9fc23bc1246269359" FOREIGN KEY ("parent_id") REFERENCES "menus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "social_links" ADD CONSTRAINT "FK_e0c0e4cdf9d2487d704102474b2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_bafb08f60d7857f4670c172a6ea" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_0e68f46606eee449470d1fdf4df" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leads" ADD CONSTRAINT "FK_16d9cef47004d4053b548d3017a" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leads" ADD CONSTRAINT "FK_944e19e85c2bab99936ed423555" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission_menus" ADD CONSTRAINT "FK_877c6afa18c1bb2ef5cbc3020a3" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "permission_menus" ADD CONSTRAINT "FK_7010814842172d23fe3dbf04554" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`);
        await queryRunner.query(`ALTER TABLE "permission_menus" DROP CONSTRAINT "FK_7010814842172d23fe3dbf04554"`);
        await queryRunner.query(`ALTER TABLE "permission_menus" DROP CONSTRAINT "FK_877c6afa18c1bb2ef5cbc3020a3"`);
        await queryRunner.query(`ALTER TABLE "leads" DROP CONSTRAINT "FK_944e19e85c2bab99936ed423555"`);
        await queryRunner.query(`ALTER TABLE "leads" DROP CONSTRAINT "FK_16d9cef47004d4053b548d3017a"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_0e68f46606eee449470d1fdf4df"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_bafb08f60d7857f4670c172a6ea"`);
        await queryRunner.query(`ALTER TABLE "social_links" DROP CONSTRAINT "FK_e0c0e4cdf9d2487d704102474b2"`);
        await queryRunner.query(`ALTER TABLE "menus" DROP CONSTRAINT "FK_00ccc1ed4e9fc23bc1246269359"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_2441e5a7e71f5dc216fa2f96feb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b23c65e50a758245a33ee35fda"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_87b8888186ca9769c960e92687"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_17022daf3f885f7d35423e9971"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_178199805b901ccd220ab7740e"`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7010814842172d23fe3dbf0455"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_877c6afa18c1bb2ef5cbc3020a"`);
        await queryRunner.query(`DROP TABLE "permission_menus"`);
        await queryRunner.query(`DROP TABLE "leads"`);
        await queryRunner.query(`DROP TYPE "public"."leads_lead_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."leads_lead_source_enum"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "properties"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "social_links"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP TABLE "menus"`);
        await queryRunner.query(`DROP TABLE "tokens"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
    }

}
