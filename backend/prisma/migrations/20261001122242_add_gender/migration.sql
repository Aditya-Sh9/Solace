-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('FEMALE', 'MALE', 'UNDISCLOSED');

-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN     "gender" "Gender";
