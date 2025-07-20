-- Orders jadvali uchun RLS policy'larni qayta yaratish

-- Eski policy'larni o'chirish
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Only admins can update orders" ON orders;

-- Yangi policy'lar yaratish
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (
  auth.uid() = user_id OR 
  (auth.uid() IS NULL AND guest_id IS NOT NULL) OR
  auth.jwt() ->> 'role' = 'admin'
);

CREATE POLICY "Only admins can update orders" ON orders FOR UPDATE USING (
  auth.jwt() ->> 'role' = 'admin'
);

CREATE POLICY "Only admins can delete orders" ON orders FOR DELETE USING (
  auth.jwt() ->> 'role' = 'admin'
);

-- RLS ni qayta yoqish
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
