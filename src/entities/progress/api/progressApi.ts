// src/entities/progress/api/progressApi.ts
import { apiClient } from '@/shared/api/axiosInstance';
import { ENDPOINTS } from '@/shared/api/types';
import type { CourseProgress } from '@/shared/api/types';
import { TokenStorage } from '@/shared/lib/tokenStorage';

export const progressApi = {
  getCourseProgress: (courseId: string) =>
    apiClient.get<CourseProgress>(ENDPOINTS.PROGRESS.BY_COURSE(courseId)).then((res) => res.data),

  getWorkoutProgress: (courseId: string, workoutId: string) =>
    apiClient
      .get<CourseProgress>(ENDPOINTS.PROGRESS.BY_WORKOUT(courseId, workoutId))
      .then((res) => res.data),

  // 🔹 ИСПРАВЛЕННЫЙ МЕТОД СОХРАНЕНИЯ через FETCH
  saveWorkoutProgress: async (courseId: string, workoutId: string, progressData: number[]) => {
    console.log('📦 Отправка прогресса:', { courseId, workoutId, progressData });

    const token = TokenStorage.getAccessToken();
    if (!token) {
      throw new Error('Нет токена авторизации');
    }

    const url = `${ENDPOINTS.API.URL}${ENDPOINTS.API.BASE}${ENDPOINTS.PROGRESS.SAVE(courseId, workoutId)}`;

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          // ВАЖНО: Мы НЕ указываем Content-Type, как требует сервер
        },
        body: JSON.stringify({ progressData }), // Тело отправляем как строку JSON
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Ошибка сервера: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('❌ Ошибка сохранения прогресса:', error.message);
      throw error;
    }
  },

  // Сброс прогресса всей тренировки
  resetWorkoutProgress: (courseId: string, workoutId: string) =>
    apiClient.patch(ENDPOINTS.PROGRESS.RESET_WORKOUT(courseId, workoutId)).then((res) => res.data),

  // Сброс прогресса всего курса
  resetCourseProgress: (courseId: string) => {
    console.log(`🔄 Сброс прогресса всего курса: ${courseId}`);
    return apiClient
      .patch(ENDPOINTS.PROGRESS.RESET_COURSE(courseId))
      .then((res) => res.data)
      .catch((error) => {
        console.error('❌ Ошибка сброса прогресса курса:', error.response?.data || error.message);
        throw error;
      });
  },
};
