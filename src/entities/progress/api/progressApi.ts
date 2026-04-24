// src/entities/progress/api/progressApi.ts
import { apiClient } from '@/shared/api/axiosInstance';
import { ENDPOINTS } from '@/shared/api/types';
import type { CourseProgress, SaveProgressDto, ResetProgressResponse } from '@/shared/api/types';

export const progressApi = {
  // Получить прогресс по курсу
  getCourseProgress: (courseId: string) =>
    apiClient.get<CourseProgress>(ENDPOINTS.PROGRESS.BY_COURSE(courseId)).then(res => res.data),

  // Получить прогресс по конкретной тренировке
  getWorkoutProgress: (courseId: string, workoutId: string) =>
    apiClient.get<CourseProgress>(ENDPOINTS.PROGRESS.BY_WORKOUT(courseId, workoutId))
      .then(res => res.data),

  // 🔹 Сохранить прогресс тренировки (НОВОЕ)
  saveWorkoutProgress: (courseId: string, workoutId: string, progressData: number[]) =>
    apiClient.patch<SaveProgressDto, { message: string }>(
      ENDPOINTS.PROGRESS.SAVE(courseId, workoutId),
      { progressData }
    ).then(res => res.data),

  // 🔹 Сбросить прогресс тренировки (НОВОЕ)
  resetWorkoutProgress: (courseId: string, workoutId: string) =>
    apiClient.patch<ResetProgressResponse>(
      ENDPOINTS.PROGRESS.RESET(courseId, workoutId)
    ).then(res => res.data),
};