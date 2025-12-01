export type Identifier = string | number;

export interface Author {
  id?: Identifier;
  name: string;
}

export interface Category {
  id: Identifier;
  name: string;
  description?: string;
  color?: string;
}

export interface Book {
  id: Identifier;
  title: string;
  description?: string;
  cover_image_url: string;
  pdf_url?: string;
  publisher?: string;
  published_at?: string;
  rating?: number;
  pages?: number;
  author: Author;
  category: Category;
}

export interface FavoriteBookEntry {
  id: Identifier;
  book?: Book;
}

export interface ApiStatus {
  code?: number;
  message: string;
}

export interface ApiError {
  status?: ApiStatus;
  message?: string;
  [key: string]: unknown;
}

export interface User {
  id: Identifier;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  residence?: string;
  city?: string;
  city_id?: string;
  country?: string;
  country_code?: string;
  gender?: string;
  home_church?: string;
  date_of_birth?: string;
  avatar_url?: string;
  token?: string;
}
