import { Book } from "../types/book";

export const books: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    year: 1925,
    genre: "Novel",
    isbn: "978-0743273565",
    description:
      "Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
    pages: 180,
    language: "English",
    rating: 4.5,
    status: "available",
    coverUrl:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300&h=400",
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    year: 1949,
    genre: "Dystopian",
    isbn: "978-0451524935",
    description:
      "A dystopian social science fiction novel that follows the life of Winston Smith, a low-ranking party member in a state of perpetual war, omnipresent government surveillance, and historical negationism.",
    pages: 328,
    language: "English",
    rating: 4.8,
    status: "borrowed",
    coverUrl:
      "https://images.unsplash.com/photo-1606787364406-a3cdf06c6d0c?auto=format&fit=crop&q=80&w=300&h=400",
  },
  {
    id: "3",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    year: 1960,
    genre: "Novel",
    isbn: "978-0446310789",
    description:
      "The story of young Scout Finch, her brother Jem, and their father Atticus, a lawyer who defends a black man accused of rape in the Depression-era South.",
    pages: 281,
    language: "English",
    rating: 4.7,
    status: "available",
    coverUrl:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300&h=400",
  },
];
