-- CreateTable
CREATE TABLE "public"."user_roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "datetime_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "datetime_lastmodified" TIMESTAMP(3),
    "status" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL,
    "user_roles_id_fk" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "datetime_lastlogin" TIMESTAMP(3),
    "datetime_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "datetime_lastmodified" TIMESTAMP(3),
    "status" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_credentials" (
    "id" UUID NOT NULL,
    "users_id_fk" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "datetime_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "datetime_lastmodified" TIMESTAMP(3),
    "status" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "user_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_profiles" (
    "id" UUID NOT NULL,
    "users_id_fk" UUID NOT NULL,
    "profile_photo" TEXT,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "gender" INTEGER NOT NULL DEFAULT 1,
    "datetime_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "datetime_lastmodified" TIMESTAMP(3),
    "status" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."resources" (
    "id" UUID NOT NULL,
    "parent" UUID,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'api',
    "api_method" TEXT DEFAULT 'GET',
    "module" TEXT NOT NULL DEFAULT 'default',
    "controller" TEXT NOT NULL DEFAULT 'index',
    "action" TEXT NOT NULL DEFAULT 'index',
    "icon" TEXT,
    "datetime_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "datetime_lastmodified" TIMESTAMP(3),
    "status" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."resource_access" (
    "id" UUID NOT NULL,
    "resources_id_fk" UUID NOT NULL,
    "level" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "datetime_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "datetime_lastmodified" TIMESTAMP(3),
    "status" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "resource_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."log_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "datetime_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "datetime_lastmodified" TIMESTAMP(3),
    "status" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "log_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."logs" (
    "id" UUID NOT NULL,
    "log_categories_id_fk" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "table" TEXT,
    "row_id" TEXT,
    "old_data" JSONB,
    "new_data" JSONB,
    "users_id_fk" UUID NOT NULL,
    "datetime_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_name_key" ON "public"."user_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_number_key" ON "public"."users"("mobile_number");

-- CreateIndex
CREATE UNIQUE INDEX "user_credentials_users_id_fk_type_key" ON "public"."user_credentials"("users_id_fk", "type");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_users_id_fk_key" ON "public"."user_profiles"("users_id_fk");

-- CreateIndex
CREATE INDEX "resource_access_level_value_idx" ON "public"."resource_access"("level", "value");

-- CreateIndex
CREATE UNIQUE INDEX "resource_access_resources_id_fk_level_value_key" ON "public"."resource_access"("resources_id_fk", "level", "value");

-- CreateIndex
CREATE UNIQUE INDEX "log_categories_name_key" ON "public"."log_categories"("name");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_user_roles_id_fk_fkey" FOREIGN KEY ("user_roles_id_fk") REFERENCES "public"."user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_credentials" ADD CONSTRAINT "user_credentials_users_id_fk_fkey" FOREIGN KEY ("users_id_fk") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_profiles" ADD CONSTRAINT "user_profiles_users_id_fk_fkey" FOREIGN KEY ("users_id_fk") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resources" ADD CONSTRAINT "resources_parent_fkey" FOREIGN KEY ("parent") REFERENCES "public"."resources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resource_access" ADD CONSTRAINT "resource_access_resources_id_fk_fkey" FOREIGN KEY ("resources_id_fk") REFERENCES "public"."resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."logs" ADD CONSTRAINT "logs_log_categories_id_fk_fkey" FOREIGN KEY ("log_categories_id_fk") REFERENCES "public"."log_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."logs" ADD CONSTRAINT "logs_users_id_fk_fkey" FOREIGN KEY ("users_id_fk") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
