-- Eski policy'larni o'chirish
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete product images" ON storage.objects;

-- Yangi policy'lar yaratish
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Upload Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Update Access" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');

CREATE POLICY "Delete Access" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');

-- Bucket'ni public qilish
UPDATE storage.buckets SET public = true WHERE id = 'product-images';
