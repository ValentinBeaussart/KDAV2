import type { APIRoute } from 'astro';
import { clubModel } from '../../../lib/db/models/club';

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const id = parseInt(params.id!);
    
    // Prevent editing KDA
    if (id === 1) {
      return new Response(JSON.stringify({ error: 'Cannot edit KDA club' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const club = await clubModel.getById(id);
    if (!club) {
      return new Response(JSON.stringify({ error: 'Club not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updates = await request.json();
    const result = await clubModel.update(id, updates);
    
    if (!result) {
      return new Response(JSON.stringify({ error: 'Club not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Error updating club',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const id = parseInt(params.id!);
    
    // Prevent deleting KDA
    if (id === 1) {
      return new Response(JSON.stringify({ error: 'Cannot delete KDA club' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await clubModel.delete(id);
    
    if (!result) {
      return new Response(JSON.stringify({ error: 'Club not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Error deleting club',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
