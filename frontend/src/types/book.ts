export interface Book {
  id: number;
  book_name: string; 
  author_name: string; 
  publication_name: string; 
  published_date: string;
  price: number | string;
}

export interface BookFormData {
  name: string; 
  author: string; 
  publication: string;
  published_date: string;
  price: number;
}