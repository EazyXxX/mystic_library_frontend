import { api } from "./auth";
import { Book } from "../types/book";

export const getBooks = () => api.get<Book[]>("/books");

export const getBook = (id: string) => api.get<Book>(`/books/${id}`);

export const createBook = (book: Omit<Book, "id">) =>
  api.post<Book>("/books", book);

export const updateBook = (id: string, book: Partial<Book>) =>
  api.put<Book>(`/books/${id}`, book);

export const deleteBook = (id: string) => api.delete(`/books/${id}`);

export const reorderBooks = (bookIds: string[]) =>
  api.post("/books/reorder", { bookIds });
