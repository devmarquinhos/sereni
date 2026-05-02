-- CreateTable
CREATE TABLE "psychologists" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "specialities" TEXT[],
    "crp" TEXT NOT NULL,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "contactLink" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "psychologists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "psychologists_crp_key" ON "psychologists"("crp");
