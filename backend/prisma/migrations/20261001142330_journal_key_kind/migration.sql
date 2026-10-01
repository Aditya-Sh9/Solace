-- CreateEnum
CREATE TYPE "JournalKeyKind" AS ENUM ('PASSWORD', 'PASSPHRASE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "journal_key_kind" "JournalKeyKind";
