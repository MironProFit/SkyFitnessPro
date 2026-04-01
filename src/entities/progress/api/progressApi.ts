import { apiClient } from '@/shared/api/axiosInstance';

export const progressApi = {
  //Получаем прогресс тренировки
  getProgress: () => apiClient.get('/progress'),

  // Создаем прогресс тренировки
  craeteProgtress: (data: any) => apiClient.post('/progress', data),
};
