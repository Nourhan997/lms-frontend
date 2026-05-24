"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublicBlogPosts } from "@/lib/api/blog";
import type { ApiError, BlogPost, Paginated } from "@/lib/types";

export const blogKeys = {
  list: (page: number) => ["blog", "public", page] as const,
};

/** Published blog posts for the public blog index. */
export function usePublicBlogPosts(page = 1) {
  return useQuery<Paginated<BlogPost>, ApiError>({
    queryKey: blogKeys.list(page),
    queryFn: () => getPublicBlogPosts(page),
  });
}
