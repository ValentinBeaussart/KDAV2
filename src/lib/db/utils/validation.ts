import { z } from 'zod';

export const clubSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  logo: z.string().url().nullable().optional(),
  played: z.number().min(0).default(0),
  won: z.number().min(0).default(0),
  drawn: z.number().min(0).default(0),
  lost: z.number().min(0).default(0),
  goals_for: z.number().min(0).default(0),
  goals_against: z.number().min(0).default(0),
  points: z.number().min(0).default(0)
});

export const playerSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  number: z.number().min(1).max(99),
  position: z.enum(['Gardien', 'Défenseur', 'Milieu', 'Attaquant']),
  photo: z.string().url().nullable().optional(),
  appearances: z.number().min(0).default(0),
  goals: z.number().min(0).default(0),
  assists: z.number().min(0).default(0)
});

export const matchSchema = z.object({
  id: z.number().optional(),
  date: z.string(),
  time: z.string(),
  location: z.string().min(1),
  opponent_name: z.string().min(1),
  opponent_logo: z.string().url().nullable().optional(),
  opponent_club_id: z.number().optional(),
  home_score: z.number().nullable().optional(),
  away_score: z.number().nullable().optional(),
  is_completed: z.boolean().default(false),
  match_type: z.enum(['MCDO_POOL', 'FRIENDLY', 'CUP', 'CHAMP_CUP']),
  competition_round: z.string().nullable().optional(),
  lineup_image: z.string().url().nullable().optional()
});

export const newsSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1),
  summary: z.string().min(1),
  content: z.string().min(1),
  image: z.string().url().nullable().optional(),
  date: z.string(),
  published: z.boolean().default(false)
});