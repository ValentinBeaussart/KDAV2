import type { APIRoute } from 'astro';
import { supabase } from '../../lib/db/connection';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2);
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomString}.${extension}`;
    const filePath = `uploads/${filename}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from('public')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('public')
      .getPublicUrl(filePath);

    return new Response(JSON.stringify({ 
      url: publicUrl
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return new Response(JSON.stringify({ 
      error: 'Error uploading file',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};