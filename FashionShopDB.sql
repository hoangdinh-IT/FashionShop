SELECT * FROM "Users"
SELECT * FROM "Categories"
SELECT * FROM "Brands"
SELECT * FROM "Colors"
SELECT * FROM "Sizes"
SELECT * FROM "Products"
SELECT * FROM "ProductVariants"
SELECT * FROM "ProductImages"
SELECT * FROM "Vouchers"

UPDATE "Users" SET "Role" = 0 WHERE "Id" = '1ee314d5-ab19-4abd-a61b-29fc1701703c'
UPDATE "Colors" SET "IsDeleted" = false

DELETE FROM "Categories" WHERE "IsDeleted" = true
DELETE FROM "Brands" WHERE "IsDeleted" = true
DELETE FROM "Sizes" WHERE "IsDeleted" = true

DELETE FROM "Users"
DELETE FROM "Categories"
DELETE FROM "Brands"
DELETE FROM "Colors"
DELETE FROM "Sizes"
DELETE FROM "Products"
DELETE FROM "ProductVariants"
DELETE FROM "ProductImages"
DELETE FROM "Vouchers"

TRUNCATE TABLE "Sizes" RESTART IDENTITY CASCADE;

