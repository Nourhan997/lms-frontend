import { apiClient } from "@/lib/api/client";
import type { Certificate } from "@/lib/types";

export async function getMyCertificates(): Promise<Certificate[]> {
  const { data } = await apiClient.get<Certificate[]>("/certificates");
  return data;
}
