import { apiClient } from "@/lib/api/client";
import type { AdminBlogInput, BlogPost, Paginated } from "@/lib/types";

export interface BlogFilters {
  page?: number;
}

export async function getAdminBlogPosts(
  filters: BlogFilters = {},
): Promise<Paginated<BlogPost>> {
  const { data } = await apiClient.get<Paginated<BlogPost>>("/admin/blog", {
    params: filters,
  });
  return data;
}

export async function getAdminBlogPost(id: number): Promise<BlogPost> {
  const { data } = await apiClient.get<BlogPost>(`/admin/blog/${id}`);
  return data;
}

export async function createBlogPost(
  payload: AdminBlogInput,
): Promise<BlogPost> {
  const { data } = await apiClient.post<BlogPost>("/admin/blog", payload);
  return data;
}

export async function updateBlogPost(
  id: number,
  payload: Partial<AdminBlogInput>,
): Promise<BlogPost> {
  const { data } = await apiClient.patch<BlogPost>(`/admin/blog/${id}`, payload);
  return data;
}

export async function setBlogPublished(
  id: number,
  isPublished: boolean,
): Promise<BlogPost> {
  const { data } = await apiClient.patch<BlogPost>(`/admin/blog/${id}`, {
    is_published: isPublished,
  });
  return data;
}

export async function deleteBlogPost(id: number): Promise<void> {
  await apiClient.delete(`/admin/blog/${id}`);
}

// --- Public (no auth) ------------------------------------------------------

export async function getPublicBlogPosts(
  page = 1,
): Promise<Paginated<BlogPost>> {
  const { data } = await apiClient.get<Paginated<BlogPost>>("/blog", {
    params: { page },
  });
  return data;
}

export async function getPublicBlogPost(slug: string): Promise<BlogPost> {
  const { data } = await apiClient.get<BlogPost>(`/blog/${slug}`);
  return data;
}
