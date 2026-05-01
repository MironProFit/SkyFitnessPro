import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/shared/components/Button/Button';
import { workoutApi } from '@/entities/workout/api/workoutApi';
import { progressApi } from '@/entities/progress/api/progressApi';
import { courseApi } from '@/entities/course/api/courseApi';
import type { Workout, CourseProgress, Course } from '@/shared/api/types';
import styles from './WorkoutPage.module.css';
import CheckIcon from '@/shared/assets/icons/check.svg';
import toast from 'react-hot-toast';

//Иконки
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

  const workoutIds = useMemo(() => {
    const idsParam = searchParams.get('workouts');
    return idsParam ? idsParam.split(',').filter(Boolean) : [];
  }, [searchParams]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentWorkoutId = workoutIds[currentIndex];

  const [exerciseValues, setExerciseValues] = useState<number[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  //Состояние для показа кнопок навигации при наведении на нижнюю панель
  const [showNavButtons, setShowNavButtons] = useState(false);

  const { data: currentWorkout, isLoading: isLoadingWorkout } = useQuery<Workout>({
    queryKey: ['workout', currentWorkoutId],
    queryFn: () => workoutApi.getWorkoutById(currentWorkoutId!),
    enabled: !!currentWorkoutId,
    staleTime: 1000 * 60 * 5,
  });

  const { data: courseData } = useQuery<Course>({
    queryKey: ['course', courseId],
    queryFn: () => courseApi.getCourse(courseId),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5,
  });

  const { data: courseProgress } = useQuery<CourseProgress>({
    queryKey: ['progress', courseId],
    queryFn: () => progressApi.getCourseProgress(courseId),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 2,
  });

  const { mutate: saveProgressMutate } = useMutation({
    mutationFn: ({ cid, wid, pData }: { cid: string; wid: string; pData: number[] }) =>
      progressApi.saveWorkoutProgress(cid, wid, pData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', courseId] });
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
      setTimeout(() => setIsSuccessModalOpen(false), 2000);
    },
    onError: (error: any) => {
      console.error('Ошибка сохранения:', error);
      setIsSaving(false);
    },
  });

  const { mutate: resetCourseProgressMutate } = useMutation({
    mutationFn: () => progressApi.resetCourseProgress(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', courseId] });
      if (currentWorkout) {
        const zeros = new Array(currentWorkout.exercises.length).fill(0);
        setExerciseValues(zeros);
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

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (!currentWorkout || !courseId) return;
    setIsSaving(true);
    saveProgressMutate(
      { cid: courseId, wid: currentWorkout._id, pData: exerciseValues },
      { onSettled: () => setIsSaving(false) }
    );
  };

  const handleResetCourse = () => {
    if (!window.confirm('Вы уверены, что хотите сбросить весь прогресс этого курса?')) return;
    resetCourseProgressMutate();
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((p) => p - 1);
  };
  const handleNext = () => {
    if (currentIndex < workoutIds.length - 1) setCurrentIndex((p) => p + 1);
  };
  const handleBackToProfile = () => navigate('/profile');

  const getExercisePercent = (index: number): number => {
    if (!currentWorkout?.exercises[index]) return 0;
    const target = currentWorkout.exercises[index].quantity || 0;
    const current = exerciseValues[index] || 0;
    if (target > 0) return Math.min(100, Math.round((current / target) * 100));
    return current > 0 ? 100 : 0;
  };

  const totalWorkoutPercent = useMemo(() => {
    if (!currentWorkout?.exercises || currentWorkout.exercises.length === 0) return 0;
    const percents = currentWorkout.exercises.map((_, idx) => getExercisePercent(idx));
    const sum = percents.reduce((acc, curr) => acc + curr, 0);
    return Math.round(sum / percents.length);
  }, [currentWorkout, exerciseValues]);

  const saveButtonText =
    totalWorkoutPercent === 0 ? 'Заполнить свой прогресс' : 'Обновить свой прогресс';

  const showNavigation = workoutIds.length > 1;
  const courseName = courseData?.nameRU || courseData?.nameEN || 'Курс';
  const currentWorkoutNumber = currentIndex + 1;

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
        <h1 className={styles.courseTitle}>{courseName}</h1>

        <Button
          className={styles.hiddenBtn}
          style={{ marginRight: '20px' }}
          size="xl"
          onClick={handleBackToProfile}
        >
          <ArrowLeftIcon />
          <span>В профиль</span>
        </Button>

        <Button
          className={styles.hiddenBtn}
          onClick={handleResetCourse}
          size="xl"
          title="Сбросить прогресс всего курса"
        >
          <span>Сбросить прогресс</span>
          <ResetIcon />
        </Button>
      </header>

      <main className={styles.content}>
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
          <h2 className={styles.gridHeader}>Упражнения тренировки {currentWorkoutNumber}</h2>

          <div className={styles.gridInner}>
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
          </div>
        </section>

        <div
          className={styles.controls}
          onMouseEnter={() => setShowNavButtons(true)}
          onMouseLeave={() => setShowNavButtons(false)}
        >
          <Button onClick={handleOpenModal} size="xxl" className={styles.saveBtn}>
            {saveButtonText}
          </Button>

          {showNavigation && (
            <div className={styles.navContainer}>
              <Button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                size="lg"
                className={`${styles.navBtn} ${styles.hiddenBtn}`}
                style={{ opacity: showNavButtons ? 1 : 0 }}
              >
                <ArrowLeftIcon /> Назад
              </Button>

              <Button
                onClick={handleNext}
                disabled={currentIndex === workoutIds.length - 1}
                className={`${styles.navBtn} ${styles.hiddenBtn}`}
                style={{ opacity: showNavButtons ? 1 : 0 }}
              >
                Вперед <ArrowRightIcon />
              </Button>
            </div>
          )}

          {!showNavigation && <div />}
        </div>
      </main>

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
