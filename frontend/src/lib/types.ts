// Common types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Service types
export interface Service {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  icon_svg: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Article types
export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string;
  author: string;
  image_url: string | null;
  read_time: number | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ArticlesResponse {
  articles: Article[];
  pagination: Pagination;
}

// Testimonial types
export interface Testimonial {
  id: string;
  name: string;
  position: string | null;
  company: string | null;
  content: string;
  photo_url: string | null;
  rating: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Client types
export interface Client {
  id: string;
  name: string;
  logo_path: string;
  website_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Gallery types
export interface GalleryItem {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryResponse {
  items: GalleryItem[];
  categories: string[];
}

// Contact form types
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service_type?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

// Error types
export interface ApiError {
  error: string;
  message?: string;
  details?: unknown[];
}
