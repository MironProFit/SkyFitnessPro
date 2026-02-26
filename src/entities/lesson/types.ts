export interface ILesson {
  id: number;
  courseId: number;
  title: string;
  videoUrl: string; // YouTube ID or full URL
  taskDescription: string;
  userProgress?: string; // User's answer/status
}