import { useEffect, useState } from 'react';
import { categoryApi } from './api.js';

/** Loads all categories (objects with id, name, active, equipmentCount). */
export function useCategories() {
  const [categories, setCategories] = useState([]);
  useEffect(() => { categoryApi.list().then(setCategories).catch(() => {}); }, []);
  return categories;
}