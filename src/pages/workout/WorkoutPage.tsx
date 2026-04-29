import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; // Убрали useParams
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/shared/components/Button/Button';
import { workoutApi } from '@/entities/workout/api/workoutApi';
import { progressApi } from '@/entities/progress/api/progressApi';
import type { Workout, CourseProgress } from '@/shared/api/types';
import styles from './WorkoutPage.module.css';
import CheckIcon from '@/shared/assets/icons/check.svg';
import toast from 'react-hot-toast';

// Иконки стрелок
const ArrowLeftIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </svg>
);
// Иконка корзины/сброса
const ResetIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

export const WorkoutPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const courseId = searchParams.get('courseId') || '';

  // Список ID тренировок
  const workoutIds = useMemo(() => {
    const idsParam = searchParams.get('workouts');
    return idsParam ? idsParam.split(',').filter(Boolean) : [];
  }, [searchParams]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentWorkoutId = workoutIds[currentIndex];

  const [exerciseValues, setExerciseValues] = useState<number[]>([]);
  const [initialValues, setInitialValues] = useState<number[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // Убрали isResettingCourse, так как он не использовался в UI

  const { data: currentWorkout, isLoading: isLoadingWorkout } = useQuery<Workout>({
    queryKey: ['workout', currentWorkoutId],
    queryFn: () => workoutApi.getWorkoutById(currentWorkoutId!),
    enabled: !!currentWorkoutId,
    staleTime: 1000 * 60 * 5,
  });

  const {data:  courseProgress } = useQuery<CourseProgress>({
    queryKey: ['progress', courseId],
    queryFn: () => progressApi.getCourseProgress(courseId),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 2,
  });

  // Мутация сохранения прогресса одной тренировки
  const { mutate: saveProgressMutate } = useMutation({
    mutationFn: ({ cid, wid, pData }: { cid: string; wid: string; pData: number[] }) =>
      progressApi.saveWorkoutProgress(cid, wid, pData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', courseId] });
      setInitialValues([...exerciseValues]);
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
      setTimeout(() => setIsSuccessModalOpen(false), 2000);
    },
    onError: (error: any) => {
      console.error('Ошибка сохранения:', error);
      setIsSaving(false);
    },
  });

  // Мутация сброса ПРОГРЕССА ВСЕГО КУРСА
  const { mutate: resetCourseProgressMutate } = useMutation({
    mutationFn: () => progressApi.resetCourseProgress(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', courseId] });
      if (currentWorkout) {
        const zeros = new Array(currentWorkout.exercises.length).fill(0);
        setExerciseValues(zeros);
        setInitialValues([...zeros]);
      }
      toast.success('Прогресс курса сброшен!');
    },
    onError: (error: any) => {
      console.error('Ошибка сброса:', error);
      toast.error('Не удалось сбросить прогресс');
    },
  });

  useEffect(() => {
    if (!currentWorkout?.exercises) return;

    const expectedLength = currentWorkout.exercises.length;

    const savedProgress = courseProgress?.workoutsProgress?.find(
      (wp) => wp.workoutId === currentWorkout._id
    );

    let values: number[] = [];

    if (savedProgress?.progressData && savedProgress.progressData.length === expectedLength) {
      values = [...savedProgress.progressData];
    } else {
      values = new Array(expectedLength).fill(0);
    }

    setExerciseValues(values);
    setInitialValues([...values]);
  }, [currentWorkout, courseProgress, currentIndex]);

  const handleInputChange = (index: number, value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0) return;

    setExerciseValues((prev) => {
      const next = [...prev];
      next[index] = num;
      return next;
    });
  };

  const hasChanges = useMemo(() => {
    if (exerciseValues.length === 0 || initialValues.length === 0) return false;
    return exerciseValues.some((val, idx) => val !== initialValues[idx]);
  }, [exerciseValues, initialValues]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    if (!currentWorkout || !courseId) return;
    setIsSaving(true);

    saveProgressMutate(
      {
        cid: courseId,
        wid: currentWorkout._id,
        pData: exerciseValues,
      },
      {
        onSettled: () => setIsSaving(false),
      }
    );
  };

  const handleResetCourse = () => {
    if (
      !window.confirm(
        'Вы уверены, что хотите сбросить весь прогресс этого курса? Все данные будут потеряны.'
      )
    ) {
      return;
    }
    // Вызываем мутацию напрямую, так как состояние isResettingCourse убрали
    resetCourseProgressMutate();
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentIndex < workoutIds.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  const handleBackToProfile = () => {
    navigate('/profile');
  };

  const getExercisePercent = (index: number): number => {
    if (!currentWorkout?.exercises[index]) return 0;
    const target = currentWorkout.exercises[index].quantity || 0;
    const current = exerciseValues[index] || 0;

    if (target > 0) {
      return Math.min(100, Math.round((current / target) * 100));
    }
    return current > 0 ? 100 : 0;
  };

  // Проверяем, нужно ли показывать навигацию
  const showNavigation = workoutIds.length > 1;

  if (isLoadingWorkout || !currentWorkout) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Загрузка тренировки...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={handleBackToProfile}>
          ← В профиль
        </button>
        <h1 className={styles.courseTitle}>{/* Название курса */}</h1>

        {/* Кнопка сброса прогресса курса в шапке */}
        <button
          className={styles.resetCourseBtn}
          onClick={handleResetCourse}
          title="Сбросить прогресс всего курса"
        >
          <ResetIcon />
        </button>
      </header>

      <main className={styles.content}>
        <h2 className={styles.workoutTitle}>{currentWorkout.name}</h2>

        <div className={styles.videoWrapper}>
          {currentWorkout.video ? (
            <iframe
              src={currentWorkout.video}
              title={currentWorkout.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={styles.videoFrame}
            />
          ) : (
            <div className={styles.videoPlaceholder}>Видео недоступно</div>
          )}
        </div>

        <section className={styles.exercisesGrid}>
          {currentWorkout.exercises.map((exercise, index) => {
            const percent = getExercisePercent(index);

            return (
              <div key={exercise._id || index} className={styles.exerciseCard}>
                <div className={styles.exerciseInfo}>
                  <span className={styles.exerciseName}>{exercise.name}</span>
                  <span className={styles.exercisePercent}>{percent}%</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div className={styles.progressBarFill} style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </section>

        <div className={styles.controls}>
          {/* Показываем кнопку "Назад" только если тренировок больше 1 */}
          {showNavigation && (
            <Button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={styles.navBtn}
            >
              <ArrowLeftIcon /> Назад
            </Button>
          )}

          <Button onClick={handleOpenModal} className={styles.saveBtn} >
            Обновить свой прогресс
          </Button>

          {/* Показываем кнопку "Вперед" только если тренировок больше 1 */}
          {showNavigation && (
            <Button
              onClick={handleNext}
              disabled={currentIndex === workoutIds.length - 1}
              className={styles.navBtn}
            >
              Вперед <ArrowRightIcon />
            </Button>
          )}
        </div>
      </main>

      {/* Модалка ввода */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Мой прогресс</h3>

            <div className={styles.modalForm}>
              {currentWorkout.exercises.map((ex, idx) => (
                <div key={idx} className={styles.formGroup}>
                  <label htmlFor={`ex-${idx}`}>
                    Сколько раз вы сделали {ex.name.toLowerCase()}?
                  </label>
                  <input
                    id={`ex-${idx}`}
                    type="number"
                    min="0"
                    value={exerciseValues[idx] || ''}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    className={styles.numberInputLarge}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>

            <Button
              size="lg"
              className={styles.saveBtnModal}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </div>
      )}

      {/* Модалка успеха */}
      {isSuccessModalOpen && (
        <div className={styles.successOverlay}>
          <div className={styles.successContent}>
            <img src={CheckIcon} alt="Success" className={styles.checkIcon} />
            <h3>Ваш прогресс засчитан!</h3>
          </div>
        </div>
      )}
    </div>
  );
};
