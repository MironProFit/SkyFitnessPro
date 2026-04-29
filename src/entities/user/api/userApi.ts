// src/entities/user/api/userApi.ts
import { apiClient } from '@/shared/api/axiosInstance';
import { ENDPOINTS, type User } from '@/shared/api/types';
import { fetchWithoutContentType } from '@/shared/lib/fetchWithoutContentType';

export const userApi = {
  getMe: () => apiClient.get<User>(ENDPOINTS.USER.ME).then((res) => res.data),

  //POST: courseId в теле, но БЕЗ заголовка Content-Type
  addCourse: (courseId: string) =>
    fetchWithoutContentType(
      ENDPOINTS.USER.ADD_COURSE,
      { method: 'POST', body: { courseId } }
    ),

  //DELETE: courseId в URL, тоже без Content-Type (на всякий случай)
  removeCourse: (courseId: string) =>
    fetchWithoutContentType(
      ENDPOINTS.USER.DEL_COURSE(courseId),
      { method: 'DELETE' }
    ),
};
