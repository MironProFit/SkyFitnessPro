// ===== ENDPOINTS =====
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
  },
  USER: {
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
    ME: '/users/me',
    // POST: courseId в теле запроса → эндпоинт без параметра
    ADD_COURSE: '/users/me/courses',
    // DELETE: courseId в URL → функция с параметром
    DEL_COURSE: (courseId: string) => `/users/me/courses/${courseId}`,
  },
} as const;

// ===== BASE URL =====
export const BASE_URL = `${ENDPOINTS.API.URL}${ENDPOINTS.API.BASE}`;

// ===== API RESPONSE =====
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// ===== AUTH DTOs =====
export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterDto = {
  email: string;
  password: string;
};

export type RefreshDto = {
  refreshToken: string;
};

// ===== AUTH RESPONSEs =====
export type LoginResponse = {
  token: string;
};

export type RegisterResponse = {
  message: string;
};

export type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
};

// ===== USER =====
export type User = {
  email: string;
  user: { selectedCourses: string[] };
};

// ===== COURSE =====
export type DailyDuration = {
  from: number;
  to: number;
};

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

// ===== WORKOUT =====
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

// ===== PROGRESS =====
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

// ===== ERRORS =====
export type ApiError = {
  message: string;
};

export type AuthError = {
  error: string;
};
