// src/features/workout-selection/WorkoutSelectionModal.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/Button/Button';
import { workoutApi } from '@/entities/workout/api/workoutApi';
import type { Course } from '@/entities/course/model/types';
import type { Workout, CourseProgress } from '@/shared/api/types';
import styles from './WorkoutSelectionModal.module.css';

interface WorkoutSelectionModalProps {
  course: Course;
  courseProgress?: CourseProgress;
  isOpen: boolean;
  onClose: () => void;
  sortWorkoutsByLessonNumber: (workouts: Workout[]) => Workout[];
  extractLessonNumber: (name: string) => number | null;
}

export const WorkoutSelectionModal = ({
  course,
  courseProgress,
  isOpen,
  onClose,
  sortWorkoutsByLessonNumber,
  extractLessonNumber,
}: WorkoutSelectionModalProps) => {
  const navigate = useNavigate();
  const [selectedWorkouts, setSelectedWorkouts] = useState<Set<string>>(new Set());
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем тренировки при открытии модалки
  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen) return;

      setIsLoading(true);
      try {
        const workoutsData = await workoutApi.getWorkoutsByCourseId(course._id);
        const sortedWorkouts = sortWorkoutsByLessonNumber(workoutsData);
        setWorkouts(sortedWorkouts);

        // 🔹 Безопасно выбираем незавершённые тренировки
        const workoutsProgress = courseProgress?.workoutsProgress;
        if (workoutsProgress?.length) {
          const incompleteWorkouts = workoutsProgress
            .filter((wp) => !wp.workoutCompleted)
            .map((wp) => wp.workoutId);

          if (incompleteWorkouts.length > 0) {
            setSelectedWorkouts(new Set(incompleteWorkouts));
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки тренировок:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [course._id, isOpen, courseProgress, sortWorkoutsByLessonNumber]);

  const handleWorkoutToggle = (workoutId: string) => {
    setSelectedWorkouts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(workoutId)) {
        newSet.delete(workoutId);
      } else {
        newSet.add(workoutId);
      }
      return newSet;
    });
  };

  const handleStart = () => {
    if (selectedWorkouts.size === 0) return;
    const workoutIds = Array.from(selectedWorkouts).join(',');
    navigate(`/course/${course.nameEN}/workout?workouts=${workoutIds}`);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal} onClick={handleOverlayClick}>
      <div className={styles.content}>
        <h2 className={styles.title}>Выберите тренировку</h2>

        <div className={styles.workoutList}>
          {isLoading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : (
            workouts.map((workout) => {
              const isSelected = selectedWorkouts.has(workout._id);

              // 🔹 Безопасный доступ к прогрессу тренировки
              const progress = courseProgress?.workoutsProgress?.find(
                (wp) => wp.workoutId === workout._id
              );
              const isCompleted = progress?.workoutCompleted || false;
              const lessonNumber = extractLessonNumber(workout.name);

              return (
                <label
                  key={workout._id}
                  className={`${styles.workoutItem} ${isSelected ? styles.selected : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleWorkoutToggle(workout._id)}
                    className={styles.checkbox}
                  />
                  <div className={styles.workoutInfo}>
                    <div className={styles.workoutName}>
                      {isCompleted && <span className={styles.checkmark}>✓</span>}
                      {workout.name}
                    </div>
                    <div className={styles.workoutMeta}>
                      Йога на каждый день / {lessonNumber || '?'} день
                    </div>
                  </div>
                </label>
              );
            })
          )}
        </div>

        <Button
          onClick={handleStart}
          disabled={selectedWorkouts.size === 0 || isLoading}
          size="lg"
          className={styles.startButton}
        >
          Начать
        </Button>
      </div>
    </div>
  );
};
