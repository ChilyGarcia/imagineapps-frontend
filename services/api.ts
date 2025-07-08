import { Event, EventFilters } from '@/types/events';

const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Fetches events from the API with optional filters
 * @param filters Optional filters for the events
 * @returns Promise with the events data
 */
export async function fetchEvents(filters?: EventFilters): Promise<Event[]> {
  try {
    // Build query parameters if filters are provided
    const queryParams = new URLSearchParams();
    
    if (filters) {
      if (filters.category_id) {
        queryParams.append('category_id', filters.category_id.toString());
      }
      
      if (filters.time_filter) {
        queryParams.append('time_filter', filters.time_filter);
      }
      
      if (filters.date) {
        queryParams.append('date', filters.date);
      }
    }

    // Build the URL with query parameters if they exist
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/events/${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error fetching events: ${response.status}`);
    }
    
    const data: Event[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}
