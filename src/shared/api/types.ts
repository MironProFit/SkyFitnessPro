export const ENDPOINTS = {
  API: {
    URL: 'https://wedev-api.sky.pro',
    BASE: '/api/fitness',
  },
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  COURSES: {
    LIST: '/courses',
    BY_ID: (id: string) => `/courses/${id}`,
    RESET_COURSE: (courseId: string) => `/courses/${courseId}/reset`,
  },
  USER: {
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
    ME: '/users/me',
    ADD_COURSE: '/users/me/courses',
    DEL_COURSE: (courseId: string) => `/users/me/courses/${courseId}`,
  },

  WORKOUTS: {
    BY_COURSE: (courseId: string) => `/courses/${courseId}/workouts`,
    BY_ID: (workoutId: string) => `/workouts/${workoutId}`,
  },

  PROGRESS: {
    // GET: прогресс по всему курсу
    BY_COURSE: (courseId: string) => `/users/me/progress?courseId=${courseId}`,

    // GET: прогресс по конкретной тренировке
    BY_WORKOUT: (courseId: string, workoutId: string) =>
      `/users/me/progress?courseId=${courseId}&workoutId=${workoutId}`,

    // PATCH: сохранить прогресс тренировки
    SAVE: (courseId: string, workoutId: string) => `/courses/${courseId}/workouts/${workoutId}`,

    // PATCH: сбросить прогресс тренировки
    RESET_WORKOUT: (courseId: string, workoutId: string) =>
      `/courses/${courseId}/workouts/${workoutId}/reset`,

    // 🔹 PATCH: сбросить весь прогресс по курсу
    RESET_COURSE: (courseId: string) => `/courses/${courseId}/reset`,
  },
} as const;

// BASE URL
export const BASE_URL = `${ENDPOINTS.API.URL}${ENDPOINTS.API.BASE}`;

// API RESPONSE
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// AUTH DTOs
export type LoginDto = { email: string; password: string };
export type RegisterDto = { email: string; password: string };
export type RefreshDto = { refreshToken: string };

// AUTH RESPONSEs
export type LoginResponse = { token: string };
export type RegisterResponse = { message: string };
export type RefreshResponse = { accessToken: string; refreshToken?: string };

// USER
export type User = {
  email: string;
  user: { selectedCourses: string[]; email: string };
};

// COURSE
export type DailyDuration = { from: number; to: number };

export type Course = {
  _id: string;
  nameRU: string;
  nameEN: string;
  description: string;
  directions: string[];
  fitting: string[];
  difficulty: string;
  durationInDays: number;
  dailyDurationInMinutes: DailyDuration;
  workouts: string[];
  order: number;
  __v?: number;
};

// WORKOUT
export type Exercise = {
  _id: string;
  name: string;
  quantity: number;
};

export type Workout = {
  _id: string;
  name: string;
  video: string;
  exercises: Exercise[];
};

// PROGRESS
export type WorkoutProgress = {
  workoutId: string;
  workoutCompleted: boolean;
  progressData: number[];
};

export type CourseProgress = {
  courseId: string;
  courseCompleted: boolean;
  workoutsProgress: WorkoutProgress[];
};

// DTOs для прогресса
export type SaveProgressDto = {
  progressData: number[];
};

export type ResetProgressResponse = {
  message: string;
};

// ERRORS
export type ApiError = { message: string };
export type AuthError = { error: string };
