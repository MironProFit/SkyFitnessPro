// src/pages/WorkoutPage/WorkoutPage.tsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/shared/components/Button/Button';
import { workoutApi } from '@/entities/workout/api/workoutApi';
import { progressApi } from '@/entities/progress/api/progressApi';
import type { Workout, CourseProgress } from '@/shared/api/types';
import styles from './WorkoutPage.module.css';
import ArrowLeftIcon from '@/shared/assets/icons/arrow-left.svg';
import ArrowRightIcon from '@/shared/assets/icons/arrow-right.svg';

export const WorkoutPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { courseName } = useParams<{ courseName: string }>();
  const queryClient = useQueryClient();

  // Парсим список выбранных тренировок из URL
  const workoutIds = useMemo(() => {
    const idsParam = searchParams.get('workouts');
    return idsParam ? idsParam.split(',').filter(Boolean) : [];
  }, [searchParams]);

  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const [exerciseValues, setExerciseValues] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const currentWorkoutId = workoutIds[currentWorkoutIndex];

  // Загружаем данные текущей тренировки
  const { data: workout, isLoading: isLoadingWorkout } = useQuery<Workout>({
    queryKey: ['workout', currentWorkoutId],
    queryFn: () => workoutApi.getWorkoutById(currentWorkoutId!),
    enabled: !!currentWorkoutId,
    staleTime: 1000 * 60 * 5,
  });

  // Загружаем прогресс курса (нужен для courseId)
  const {data:  courseProgress } = useQuery<CourseProgress>({
    queryKey: ['progress', workout?.courseId], // 🔹 Нужно добавить courseId в ответ Workout или передать иначе
    queryFn: () => progressApi.getCourseProgress(workout?.courseId || ''),
    enabled: !!workout?.courseId,
    staleTime: 1000 * 60 * 2,
  });

  // 🔹 Мутация сохранения прогресса
  const { mutate: saveProgressMutate } = useMutation({
    mutationFn: ({
      courseId,
      workoutId,
      progressData,
    }: {
      courseId: string;
      workoutId: string;
      progressData: number[];
    }) => progressApi.saveWorkoutProgress(courseId, workoutId, progressData),
    onSuccess: () => {
      // Обновляем кэш прогресса
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
    onError: (error) => {
      console.error('Ошибка сохранения прогресса:', error);
    },
  });

  // Инициализируем значения упражнений при загрузке тренировки
  useEffect(() => {
    if (workout?.exercises && courseProgress?.workoutsProgress) {
      const savedProgress = courseProgress.workoutsProgress.find(
        (wp) => wp.workoutId === workout._id
      );

      if (savedProgress?.progressData?.length) {
        setExerciseValues(savedProgress.progressData);
      } else {
        // Инициализируем нулями по количеству упражнений
        setExerciseValues(new Array(workout.exercises.length).fill(0));
      }
    }
  }, [workout, courseProgress]);

  // Обработчик изменения значения упражнения
  const handleExerciseChange = (index: number, value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0) return;

    setExerciseValues((prev) => {
      const newValues = [...prev];
      newValues[index] = numValue;
      return newValues;
    });
  };

  // Сохранение прогресса
  const handleSaveProgress = () => {
    if (!workout || !workout.courseId) return;

    setIsSaving(true);
    saveProgressMutate(
      {
        courseId: workout.courseId,
        workoutId: workout._id,
        progressData: exerciseValues,
      },
      {
        onSettled: () => setIsSaving(false),
      }
    );
  };

  // Навигация между тренировками
  const handlePrevWorkout = () => {
    if (currentWorkoutIndex > 0) {
      // Сохраняем прогресс перед переходом
      if (workout?.courseId) {
        saveProgressMutate({
          courseId: workout.courseId,
          workoutId: workout._id,
          progressData: exerciseValues,
        });
      }
      setCurrentWorkoutIndex((prev) => prev - 1);
      setExerciseValues([]); // Сброс для следующей тренировки (загрузится в useEffect)
    }
  };

  const handleNextWorkout = () => {
    if (currentWorkoutIndex < workoutIds.length - 1) {
      if (workout?.courseId) {
        saveProgressMutate({
          courseId: workout.courseId,
          workoutId: workout._id,
          progressData: exerciseValues,
        });
      }
      setCurrentWorkoutIndex((prev) => prev + 1);
      setExerciseValues([]);
    }
  };

  const handleBackToProfile = () => {
    // Сохраняем перед уходом
    if (workout?.courseId) {
      saveProgressMutate({
        courseId: workout.courseId,
        workoutId: workout._id,
        progressData: exerciseValues,
      });
    }
    navigate('/profile');
  };

  // Заглушка, если данные ещё не загружены
  if (isLoadingWorkout || !workout) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Загрузка тренировки...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Шапка с навигацией */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={handleBackToProfile}>
          <img src={ArrowLeftIcon} alt="←" />
          <span>В профиль</span>
        </button>

        <h1 className={styles.courseTitle}>{workout.courseName || courseName}</h1>

        <div className={styles.workoutCounter}>
          {currentWorkoutIndex + 1} / {workoutIds.length}
        </div>
      </header>

      {/* Контент тренировки */}
      <main className={styles.content}>
        {/* Название тренировки */}
        <h2 className={styles.workoutTitle}>{workout.name}</h2>

        {/* YouTube плеер */}
        <div className={styles.videoWrapper}>
          {workout.video ? (
            <iframe
              src={workout.video}
              title={workout.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={styles.videoFrame}
            />
          ) : (
            <div className={styles.videoPlaceholder}>Видео недоступно</div>
          )}
        </div>

        {/* Упражнения */}
        <section className={styles.exercises}>
          <h3 className={styles.exercisesTitle}>Задания</h3>

          {workout.exercises?.length > 0 ? (
            <ul className={styles.exerciseList}>
              {workout.exercises.map((exercise, index) => (
                <li key={exercise._id || index} className={styles.exerciseItem}>
                  <span className={styles.exerciseName}>{exercise.name}</span>
                  <div className={styles.exerciseInput}>
                    <label>
                      Повторения:
                      <input
                        type="number"
                        min="0"
                        value={exerciseValues[index] || 0}
                        onChange={(e) => handleExerciseChange(index, e.target.value)}
                        className={styles.numberInput}
                      />
                    </label>
                    <span className={styles.exerciseTarget}>/ {exercise.quantity || '?'}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noExercises}>В этой тренировке нет заданий</p>
          )}
        </section>

        {/* Кнопки управления */}
        <div className={styles.controls}>
          <Button
            type="button"
            onClick={handlePrevWorkout}
            disabled={currentWorkoutIndex === 0}
            variant="secondary"
            className={styles.navBtn}
          >
            <img src={ArrowLeftIcon} alt="←" />
            Назад
          </Button>

          <Button
            type="button"
            onClick={handleSaveProgress}
            disabled={isSaving || exerciseValues.length === 0}
            className={styles.saveBtn}
          >
            {isSaving ? 'Сохранение...' : 'Сохранить прогресс'}
          </Button>

          <Button
            type="button"
            onClick={handleNextWorkout}
            disabled={currentWorkoutIndex === workoutIds.length - 1}
            className={styles.navBtn}
          >
            Вперёд
            <img src={ArrowRightIcon} alt="→" />
          </Button>
        </div>
      </main>
    </div>
  );
};
