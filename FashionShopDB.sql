SELECT * FROM "Users"
SELECT * FROM "Categories"
SELECT * FROM "Brands"
SELECT * FROM "Colors"
SELECT * FROM "Sizes"
SELECT * FROM "Products"
SELECT * FROM "ProductImages"

UPDATE "Users" SET "Role" = 0 WHERE "Id" = '1ee314d5-ab19-4abd-a61b-29fc1701703c'
UPDATE "Colors" SET "IsDeleted" = false

DELETE FROM "Brands" WHERE "IsDeleted" = true

DELETE FROM "Users"
DELETE FROM "Categories"
DELETE FROM "Brands"
DELETE FROM "Colors"
DELETE FROM "Sizes"
DELETE FROM "Products"

SELECT indexdef
FROM pg_indexes
WHERE tablename = 'ProductVariants' 
AND indexname = 'IX_ProductVariants_ProductId_ColorId_SizeId';

