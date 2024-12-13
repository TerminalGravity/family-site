import { z } from 'zod'

export const gameSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  rules: z.string().min(1, 'Rules are required'),
  minPlayers: z.number().min(1, 'Minimum players must be at least 1'),
  maxPlayers: z.number().min(1, 'Maximum players must be at least 1'),
  duration: z.string().min(1, 'Duration is required'),
  complexity: z.enum(['Easy', 'Medium', 'Hard']),
  tags: z.array(z.string()),
  imageUrl: z.string().url().optional(),
  createdBy: z.string()
})

export const photoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL'),
  dinnerDate: z.string().datetime(),
  tags: z.array(z.string()),
  createdBy: z.string()
})

export const ratingSchema = z.object({
  value: z.number().min(1).max(5),
  createdBy: z.string()
})

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty'),
  createdBy: z.string()
}) 