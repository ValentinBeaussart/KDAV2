import { supabase } from './connection';
import type { NewsArticle } from './types';

export const createNewsArticle = async (article: Omit<NewsArticle, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('news')
      .insert({
        title: article.title,
        summary: article.summary,
        content: article.content,
        image: article.image || null,
        date: article.date,
        published: article.published
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating news article:', error);
    throw error;
  }
};

export const getNews = async (includeUnpublished = false) => {
  try {
    let query = supabase
      .from('news')
      .select()
      .order('date', { ascending: false });

    if (!includeUnpublished) {
      query = query.eq('published', true);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting news:', error);
    throw error;
  }
};

export const getNewsArticle = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from('news')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting news article:', error);
    throw error;
  }
};

export const updateNewsArticle = async (id: number, article: Partial<NewsArticle>) => {
  try {
    const { data, error } = await supabase
      .from('news')
      .update(article)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating news article:', error);
    throw error;
  }
};

export const deleteNewsArticle = async (id: number) => {
  try {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting news article:', error);
    throw error;
  }
};