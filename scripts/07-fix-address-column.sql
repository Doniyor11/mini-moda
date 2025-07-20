-- Address ustunini nullable qilish
ALTER TABLE orders ALTER COLUMN address DROP NOT NULL;

-- Mavjud ma'lumotlar uchun default qiymat
UPDATE orders SET address = '' WHERE address IS NULL;
