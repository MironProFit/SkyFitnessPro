import { apiClient } from '@/shared/api/axiosInstance';
import { ENDPOINTS } from '@/shared/api/types';
import type { Workout } from '@/shared/api/types'; 

export const workoutApi = {
  getWorkoutsByCourseId: (courseId: string) => 
    apiClient.get<Workout[]>(ENDPOINTS.WORKOUTS.BY_COURSE(courseId))
      .then((res) => res.data),

  getWorkoutById: (workoutId: string) =>
    apiClient.get<Workout>(ENDPOINTS.WORKOUTS.BY_ID(workoutId))
      .then((res) => res.data),
};