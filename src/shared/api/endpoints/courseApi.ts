import type { ICourse } from '@/entities/course/types';
import { apiClient } from '../axiosInstance';
import type { ApiResponse } from '../types';
import { ENDPOINTS } from '@/shared/config/api.endpoints';

export const courseApi = {
  getAll: () => apiClient.get<ApiResponse<ICourse[]>>(ENDPOINTS.COURSES.LIST),
};
