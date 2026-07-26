import { MigrationInterface, QueryRunner } from "typeorm";

export class fixPushDeviceTokenIndex1700000000000 implements MigrationInterface {
    name = 'fixPushDeviceTokenIndex1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_push_device_tokens_token"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_push_device_tokens_userId_token" ON "push_device_tokens" ("userId", "token")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_push_device_tokens_userId_token"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_push_device_tokens_token" ON "push_device_tokens" ("token")`);
    }
}
