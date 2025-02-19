import { z } from 'zod';

export const NewBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  year: z.number().min(1000).max(new Date().getFullYear()),
  genre: z.string().min(1, "Genre is required"),
  isbn: z.string().min(10, "ISBN must be at least 10 characters").optional(),
  description: z.string().min(1, "Description is required"),
  pages: z.number().min(1, "Pages must be greater than 0"),
  language: z.string().min(1, "Language is required"),
  rating: z.number().min(0).max(5).optional(),
  status: z.enum(["available", "borrowed"]).default("available"),
  coverUrl: z.string().url().optional(),
});

export const BookSchema = NewBookSchema.extend({
  id: z.string()
});

export type Book = z.infer<typeof BookSchema>;
export type NewBook = z.infer<typeof NewBookSchema>;