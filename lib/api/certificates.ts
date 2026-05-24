import { apiClient } from "@/lib/api/client";
import type { Certificate, PublicCertificate } from "@/lib/types";

export async function getMyCertificates(): Promise<Certificate[]> {
  const { data } = await apiClient.get<Certificate[]>("/certificates");
  return data;
}

/** Public certificate verification by unique id (no auth). */
export async function verifyCertificate(
  uid: string,
): Promise<PublicCertificate> {
  const { data } = await apiClient.get<PublicCertificate>(
    `/certificates/verify/${uid}`,
  );
  return data;
}
