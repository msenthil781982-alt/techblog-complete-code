
import { useQuery } from '@tanstack/react-query';
import postService from '../services/postService';

export const usePosts = (params = {}) => {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => postService.getPosts(params),
    keepPreviousData: true,
  });
};

export const useFeaturedPosts = () => {
  return useQuery({
    queryKey: ['posts', 'featured'],
    queryFn: () => postService.getFeaturedPosts(),
  });
};

export const useTrendingPosts = () => {
  return useQuery({
    queryKey: ['posts', 'trending'],
    queryFn: () => postService.getTrendingPosts(),
  });
};

export const usePost = (slug) => {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => postService.getPostBySlug(slug),
    enabled: Boolean(slug),
  });
};
