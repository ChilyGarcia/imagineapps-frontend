import { useState, useEffect } from "react";

// Interfaz para las categorías del API
export interface Category {
  id: number;
  name: string;
  description: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8000/categories`);
        if (!response.ok) {
          throw new Error(`Error al obtener categorías: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Error desconocido al cargar categorías"));
        console.error("Error al cargar categorías:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return { categories, loading, error };
}
