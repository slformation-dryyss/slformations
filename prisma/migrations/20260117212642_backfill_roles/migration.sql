UPDATE "User"
SET "roles" = ARRAY["role"]::text[]
WHERE "role" IS NOT NULL AND "role" <> 'STUDENT';