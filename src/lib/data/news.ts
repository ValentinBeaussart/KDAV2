import type { NewsArticle } from './types';
import { readJsonFile, writeJsonFile, getNextId } from './storage';

export const getNews = async (includeUnpublished = false): Promise<NewsArticle[]> => {
  const news = await readJsonFile<NewsArticle>('news.json');
  return includeUnpublished 
    ? news 
    : news.filter(article => article.published);
};

export const getNewsArticle = async (id: number): Promise<NewsArticle | undefined> => {
  const news = await getNews(true);
  return news.find(article => article.id === id);
};

export const createNewsArticle = async (article: Omit<NewsArticle, 'id'>): Promise<NewsArticle> => {
  const news = await getNews(true);
  const newArticle = {
    ...article,
    id: await getNextId('news.json')
  };
  
  news.push(newArticle);
  await writeJsonFile('news.json', news);
  return newArticle;
};

export const updateNewsArticle = async (id: number, updates: Partial<NewsArticle>): Promise<NewsArticle | null> => {
  const news = await getNews(true);
  const index = news.findIndex(a => a.id === id);
  if (index === -1) return null;

  news[index] = {
    ...news[index],
    ...updates
  };

  await writeJsonFile('news.json', news);
  return news[index];
};

export const deleteNewsArticle = async (id: number): Promise<boolean> => {
  const news = await getNews(true);
  const index = news.findIndex(a => a.id === id);
  if (index === -1) return false;

  news.splice(index, 1);
  await writeJsonFile('news.json', news);
  return true;
};
