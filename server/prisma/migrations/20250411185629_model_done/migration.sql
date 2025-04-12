-- CreateTable
CREATE TABLE "Availability" (
    "id" SERIAL NOT NULL,
    "dates" TIMESTAMP(3)[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);
