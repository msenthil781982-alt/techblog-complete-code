
import { useQuery } from '@tanstack/react-query';
import postService from '../services/postService';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => postService.getCategories(),
  });
};

export const useCategory = (slug) => {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => postService.getCategoryBySlug(slug),
    enabled: Boolean(slug),
  });
};
