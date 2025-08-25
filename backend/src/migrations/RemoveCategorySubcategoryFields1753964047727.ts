import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveCategorySubcategoryFields1753964047727 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Try dropping FK if it exists
    try {
      await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "FK_efaa1a4d8550ba5f4378803edb2"`);
    } catch (error) {
      console.warn('Constraint FK_efaa1a4d8550ba5f4378803edb2 not found, skipping.');
    }

    // Try dropping columns if they exist
    try {
      await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "categoryId"`);
    } catch (error) {
      console.warn('Column categoryId not found, skipping.');
    }

    try {
      await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "subCategoryId"`);
    } catch (error) {
      console.warn('Column subCategoryId not found, skipping.');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "book" ADD "categoryId" integer`);
    await queryRunner.query(`ALTER TABLE "book" ADD "subCategoryId" integer`);
  }
}
