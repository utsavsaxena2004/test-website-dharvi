# Storage Setup Guide

## Creating the Images Bucket in Supabase

To enable image uploads for custom requests, you need to create a storage bucket in your Supabase project:

### Step 1: Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar

### Step 2: Create Images Bucket
1. Click **"New bucket"**
2. Set the following properties:
   - **Name**: `images`
   - **Public**: `true` (checked)
   - **File size limit**: `10MB` (10485760 bytes)
   - **Allowed MIME types**: `image/jpeg, image/png, image/gif, image/webp`

### Step 3: Set Storage Policies
After creating the bucket, you may need to set up Row Level Security (RLS) policies:

```sql
-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'images');

-- Allow public access to view images
CREATE POLICY "Allow public access to images" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'images');

-- Allow users to update their own uploads
CREATE POLICY "Allow users to update own images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own uploads
CREATE POLICY "Allow users to delete own images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Step 4: Test the Setup
1. Go to `/custom-design` in your application
2. Log in with a user account
3. Try uploading an image
4. Check if the image appears in the Supabase Storage dashboard

## Alternative: Manual SQL Setup
If you have database access, you can run this SQL to create the bucket:

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('images', 'images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
```

## Troubleshooting
- If uploads fail, check the browser console for error messages
- Ensure the bucket is set to public if you want images to be accessible
- Verify that the storage policies allow the necessary operations
- Check that the file size is within the 10MB limit 
