export interface Book {
  id: number;
  name: string;
  author: string;
  publication: string;
  published_date: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface BookFormData {
  name: string;
  author: string;
  publication: string;
  published_date: string;
  price: number;
}