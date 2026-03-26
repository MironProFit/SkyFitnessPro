import type { ICourse } from '@/entities/course/types';
import { apiClient } from '../axiosInstance';
import { ENDPOINTS } from '@/shared/config/api.endpoints';

export const courseApi = {
  getAll: async () => {
    const res = await apiClient.get<ICourse[]>(ENDPOINTS.COURSES.LIST);
    return res.data;
  },
};
