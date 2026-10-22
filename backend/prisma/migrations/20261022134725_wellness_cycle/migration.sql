-- AlterTable
ALTER TABLE "check_ins" ADD COLUMN     "cycle_phase" "CyclePhase";

-- AlterTable
ALTER TABLE "cycle_entries" ADD COLUMN     "intensity" INTEGER,
ADD COLUMN     "symptoms" TEXT[],
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN     "cycle_length" INTEGER NOT NULL DEFAULT 28,
ADD COLUMN     "last_period_start" DATE,
ADD COLUMN     "period_length" INTEGER NOT NULL DEFAULT 5;
