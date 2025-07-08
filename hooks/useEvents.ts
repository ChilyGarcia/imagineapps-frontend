import { useState, useEffect, useCallback } from 'react';
import { fetchEvents } from '@/services/api';
import { Event, EventFilters } from '@/types/events';

/**
 * Custom hook for fetching and managing events data
 * @param initialFilters Initial filters to apply
 * @returns Object containing events data, loading state, error state, and functions to manage events
 */
export function useEvents(initialFilters?: EventFilters) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<EventFilters | undefined>(initialFilters);

  /**
   * Fetches events based on current filters
   */
  const getEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchEvents(filters);
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Updates filters and triggers a re-fetch
   * @param newFilters New filters to apply
   */
  const updateFilters = useCallback((newFilters: EventFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  /**
   * Resets all filters and re-fetches events
   */
  const resetFilters = useCallback(() => {
    setFilters(undefined);
  }, []);

  // Fetch events on component mount and when filters change
  useEffect(() => {
    getEvents();
  }, [getEvents]);

  return {
    events,
    loading,
    error,
    updateFilters,
    resetFilters,
    refreshEvents: getEvents
  };
}
