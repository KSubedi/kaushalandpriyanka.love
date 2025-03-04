-- CreateTable
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "additional_guests" INTEGER NOT NULL DEFAULT 0,
    "events" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_template" BOOLEAN NOT NULL DEFAULT false,
    "template_name" TEXT,
    "location" TEXT,
    "template_invite_id" TEXT,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "additional_guests" INTEGER NOT NULL DEFAULT 0,
    "events" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "invite_id" TEXT NOT NULL,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Response_invite_id_key" ON "Response"("invite_id");

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_template_invite_id_fkey" FOREIGN KEY ("template_invite_id") REFERENCES "Invite"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_invite_id_fkey" FOREIGN KEY ("invite_id") REFERENCES "Invite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

