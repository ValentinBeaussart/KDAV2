import type { APIRoute } from 'astro';
import { supabase } from '../../lib/db/connection';

export const POST: APIRoute = async ({ request }) => {
  const jsonResponse = (body: object, status: number) => new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return jsonResponse({ error: 'No file uploaded' }, 400);
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxFileSize = 5 * 1024 * 1024; // 5 MB

    if (!allowedTypes.includes(file.type)) {
      return jsonResponse({ error: 'Invalid file type' }, 400);
    }

    if (file.size > maxFileSize) {
      return jsonResponse({ error: 'File size exceeds limit' }, 400);
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2);
    const extension = file.name.includes('.') ? file.name.split('.').pop() : '';
    if (!extension) {
      return jsonResponse({ error: 'File must have an extension' }, 400);
    }

    const filename = `${timestamp}-${randomString}.${extension}`;
    const filePath = `uploads/${filename}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('Images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) throw error;

    // Get public URL (or signed URL if needed)
    const { data: { publicUrl } } = supabase.storage.from('public').getPublicUrl(filePath);

    return jsonResponse({ url: publicUrl }, 200);
  } catch (error) {
    console.error('Error uploading file:', error);
    return jsonResponse({ 
      error: 'Error uploading file',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
};
