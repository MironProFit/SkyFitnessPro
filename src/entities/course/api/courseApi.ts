// entities/course/api/courseApi.ts

import { apiClient } from '@/shared/api/axiosInstance';
import type { Course } from '../model/types';
import { ENDPOINTS } from '@/shared/api/types';

export const courseApi = {
  // ─────────────────────────────────────────────────────
  // GET /courses — получение списка курсов (публичный)
  // ─────────────────────────────────────────────────────
  getCourses: () =>
    apiClient
      .get<Course[]>(ENDPOINTS.COURSES.LIST, { skipAuth: true })
      .then((response) => response.data),

  // ─────────────────────────────────────────────────────
  // GET /courses/:id — получение одного курса (публичный)
  // ─────────────────────────────────────────────────────
  getCourse: (id: string) =>
    apiClient
      .get<Course>(ENDPOINTS.COURSES.BY_ID(id), { skipAuth: true })
      .then((response) => response.data),
};
