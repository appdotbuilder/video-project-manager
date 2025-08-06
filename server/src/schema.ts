
import { z } from 'zod';

// Video project schema
export const videoProjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type VideoProject = z.infer<typeof videoProjectSchema>;

// Input schema for creating video projects
export const createVideoProjectInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable()
});

export type CreateVideoProjectInput = z.infer<typeof createVideoProjectInputSchema>;

// Input schema for updating video projects
export const updateVideoProjectInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().nullable().optional()
});

export type UpdateVideoProjectInput = z.infer<typeof updateVideoProjectInputSchema>;

// Input schema for getting a single video project
export const getVideoProjectInputSchema = z.object({
  id: z.number()
});

export type GetVideoProjectInput = z.infer<typeof getVideoProjectInputSchema>;

// Input schema for deleting a video project
export const deleteVideoProjectInputSchema = z.object({
  id: z.number()
});

export type DeleteVideoProjectInput = z.infer<typeof deleteVideoProjectInputSchema>;
