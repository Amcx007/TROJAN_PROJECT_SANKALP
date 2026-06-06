-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "village" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "phc_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phcs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "phcs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_patients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "village" TEXT NOT NULL,
    "house_number" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_screenings" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "asha_id" TEXT NOT NULL,
    "phc_id" TEXT NOT NULL,
    "bp_systolic" INTEGER NOT NULL,
    "bp_diastolic" INTEGER NOT NULL,
    "sugar" INTEGER NOT NULL,
    "family_history" BOOLEAN NOT NULL DEFAULT false,
    "low_activity" BOOLEAN NOT NULL DEFAULT false,
    "tobacco_use" BOOLEAN NOT NULL DEFAULT false,
    "symptoms" TEXT,
    "risk_level" TEXT NOT NULL,
    "risk_reasons" TEXT NOT NULL,
    "consent_given" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "doctor_notes" TEXT,
    "diagnosis" TEXT,
    "prescription" TEXT,
    "resolved_at" TIMESTAMP(3),
    "resolved_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_screenings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_follow_ups" (
    "id" TEXT NOT NULL,
    "screening_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "assigned_to_asha_id" TEXT NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_follow_ups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_phc_id_fkey" FOREIGN KEY ("phc_id") REFERENCES "phcs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_screenings" ADD CONSTRAINT "admin_screenings_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "admin_patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_screenings" ADD CONSTRAINT "admin_screenings_asha_id_fkey" FOREIGN KEY ("asha_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_screenings" ADD CONSTRAINT "admin_screenings_phc_id_fkey" FOREIGN KEY ("phc_id") REFERENCES "phcs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_follow_ups" ADD CONSTRAINT "admin_follow_ups_screening_id_fkey" FOREIGN KEY ("screening_id") REFERENCES "admin_screenings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_follow_ups" ADD CONSTRAINT "admin_follow_ups_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "admin_patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_follow_ups" ADD CONSTRAINT "admin_follow_ups_assigned_to_asha_id_fkey" FOREIGN KEY ("assigned_to_asha_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_follow_ups" ADD CONSTRAINT "admin_follow_ups_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
