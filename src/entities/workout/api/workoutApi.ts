import { apiClient } from '@/shared/api/axiosInstance';

export const workoutApi = {
  //Получаем тренировки
  getWorkout: (id: string) => apiClient.get(`workouts/${id}`),
  //Получаем прогресс

  saveProgress: (id: string, data: any) => apiClient.post(`workout/${id}/progress`, data),
};
