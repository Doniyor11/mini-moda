-- Orders jadvaliga notes ustunini qo'shish
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT;

-- Mavjud ma'lumotlar uchun default qiymat
UPDATE orders SET notes = '' WHERE notes IS NULL;
