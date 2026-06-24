import type {
  ApplicationDetail,
  ApplicationListResponse,
  CreateApplicationRequest,
  UpdateApplicationRequest,
} from "@interwjuer/contracts";

import { api, isNotFound } from "@/lib/api/client";

export const applicationsApi = {
  list(cursor?: string) {
    const query = cursor ? `?cursor=${encodeURIComponent(cursor)}` : "";
    return api.get<ApplicationListResponse>(`/applications${query}`);
  },

  create(body: CreateApplicationRequest) {
    return api.post<ApplicationDetail>("/applications", body);
  },

  update(id: string, body: UpdateApplicationRequest) {
    return api.patch<ApplicationDetail>(`/applications/${id}`, body);
  },

  delete(id: string) {
    return api.delete(`/applications/${id}`);
  },

  async byId(id: string): Promise<ApplicationDetail | null> {
    try {
      return await api.get<ApplicationDetail>(`/applications/${id}`);
    } catch (error) {
      if (isNotFound(error)) {
        return null;
      }

      throw error;
    }
  },
};
