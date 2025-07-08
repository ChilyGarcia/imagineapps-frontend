export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  is_active: boolean;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  start_time: string | null;
  prize: string | null;
  category: Category;
  user: User;
}

export interface EventFilters {
  category_id?: number;
  time_filter?: 'today' | 'week' | 'month' | 'year';
  date?: string;
}
