import { apiClient } from '@/shared/api/axiosInstance';
import { ENDPOINTS, type User } from '@/shared/api/types';

export const userApi = {
  getMe: () => apiClient.get<User>(ENDPOINTS.AUTH.ME),

  getProfile: () => apiClient.get<User>(ENDPOINTS.USER.PROFILE),

  updateProfile: (data: Partial<User>) => apiClient.patch<User>(ENDPOINTS.USER.PROFILE, data),

  updateSetting: (data: any) => apiClient.patch(ENDPOINTS.USER.PROFILE, data),
};
