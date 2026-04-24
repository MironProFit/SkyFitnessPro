// src/widgets/course-card/CourseCard.tsx
import styles from './CourseCard.module.css';
import CalendarIcon from '@/shared/assets/icons/Calendar.svg';
import TimeIcon from '@/shared/assets/icons/Time.svg';
import PlusIcon from '@/shared/assets/icons/plus.svg';
import MinusIcon from '@/shared/assets/icons/minus.svg';
import CheckIcon from '@/shared/assets/icons/check.svg'; // 🔹 Твоя иконка

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/Button/Button';
import { courseImages } from '@/shared/constans/courseConfig';
import type { Course } from '@/entities/course/model/types';
import type { Workout, CourseProgress } from '@/shared/api/types';
import { ROUTES } from '@/shared/config/routes';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { useQuery } from '@tanstack/react-query';
import type { User } from '@/shared/api/types';
import { userApi } from '@/entities/user/api/userApi';
import { progressApi } from '@/entities/progress/api/progressApi';
import { workoutApi } from '@/entities/workout/api/workoutApi';
import clsx from 'clsx';

interface CourseCardProps {
  course: Course;
  pageProfile: boolean;
  backgroundColor: string | undefined;
}

const getDifficultyLevel = (difficulty: string): number => {
  const d = difficulty.toLowerCase();
  if (d.includes('начальн') || d.includes('легк')) return 1;
  if (d.includes('средн')) return 3;
  if (d.includes('сложн') || d.includes('тяжел')) return 5;
  return 1;
};

const getDifficultyLabel = (level: number): string => {
  if (level === 1) return 'Легкий';
  if (level === 3) return 'Средний';
  return 'Сложный';
};

const calculateCourseProgress = (progress?: CourseProgress): number => {
  if (!progress?.workoutsProgress || progress.workoutsProgress.length === 0) return 0;
  const completed = progress.workoutsProgress.filter((w) => w.workoutCompleted).length;
  const total = progress.workoutsProgress.length;
  return Math.round((completed / total) * 100);
};

const extractLessonNumber = (name: string): number | null => {
  const match = name.match(/(?:Урок|Lesson)\s*(\d+)|^(\d+)\./i);
  if (match) return parseInt(match[1] || match[2], 10);
  return null;
};

const sortWorkoutsByLessonNumber = (workouts: Workout[]): Workout[] => {
  return [...workouts].sort((a, b) => {
    const numA = extractLessonNumber(a.name);
    const numB = extractLessonNumber(b.name);
    if (numA !== null && numB !== null) return numA - numB;
    if (numA !== null) return -1;
    if (numB !== null) return 1;
    return 0;
  });
};

export const CourseCard = ({ pageProfile, course, backgroundColor }: CourseCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isToogle, setisToogle] = useState(false);

  // 🔹 Состояние для списка тренировок
  const [isWorkoutListOpen, setIsWorkoutListOpen] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkouts, setSelectedWorkouts] = useState<Set<string>>(new Set());
  const [isLoadingWorkouts, setIsLoadingWorkouts] = useState(false);

  const { isAuthenticated } = useAuth();
  const { addCourseForUser, removeCourseForUser } = useApp();
  const navigate = useNavigate();

  const {
    nameRU,
    nameEN,
    durationInDays,
    dailyDurationInMinutes,
    difficulty,
    _id: courseId,
  } = course;

  const durationText = `${dailyDurationInMinutes.from}-${dailyDurationInMinutes.to} мин/день`;
  const level = getDifficultyLevel(difficulty);
  const label = getDifficultyLabel(level);

  const { data: userData } = useQuery<User>({
    queryKey: ['user'],
    queryFn: () => userApi.getMe(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  const { data: courseProgress } = useQuery<CourseProgress>({
    queryKey: ['progress', courseId],
    queryFn: () => progressApi.getCourseProgress(courseId),
    enabled: isAuthenticated && pageProfile,
    staleTime: 1000 * 60 * 2,
  });

  const isSelected = isAuthenticated
    ? (userData?.user?.selectedCourses || []).includes(courseId)
    : false;

  const progressPercent = useMemo(() => calculateCourseProgress(courseProgress), [courseProgress]);

  const getWorkoutButtonText = (): string => {
    if (!courseProgress) return 'Загрузка...';
    if (progressPercent === 0) return 'Начать тренировку';
    if (progressPercent === 100) return 'Начать заново';
    return 'Продолжить тренировку';
  };

  // 🔹 Открытие списка
  const handleWorkoutButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoadingWorkouts(true);
    try {
      if (workouts.length > 0) {
        setIsWorkoutListOpen(true);
        return;
      }

      const workoutsData = await workoutApi.getWorkoutsByCourseId(courseId);
      const sortedWorkouts = sortWorkoutsByLessonNumber(workoutsData);
      setWorkouts(sortedWorkouts);

      const workoutsProgress = courseProgress?.workoutsProgress;
      if (workoutsProgress?.length) {
        const incompleteIds = workoutsProgress
          .filter((wp) => !wp.workoutCompleted)
          .map((wp) => wp.workoutId);
        if (incompleteIds.length > 0) {
          setSelectedWorkouts(new Set(incompleteIds));
        }
      }

      setIsWorkoutListOpen(true);
    } catch (error) {
      console.error('Ошибка загрузки тренировок:', error);
    } finally {
      setIsLoadingWorkouts(false);
    }
  };

  const handleBackToCard = () => setIsWorkoutListOpen(false);

  const handleWorkoutToggle = (workoutId: string) => {
    setSelectedWorkouts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(workoutId)) newSet.delete(workoutId);
      else newSet.add(workoutId);
      return newSet;
    });
  };

const handleStartWorkout = (e: React.MouseEvent) => {
  e.stopPropagation();
  if (selectedWorkouts.size === 0) return;
  
  const workoutIds = Array.from(selectedWorkouts).join(',');
  // 🔹 Добавляем courseId для страницы тренировки
  navigate(`/course/${course.nameEN}/workout?workouts=${workoutIds}&courseId=${courseId}`);
};

  const handleToggleCourse = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isToogle) return;

    setisToogle(true);
    try {
      if (isSelected) await removeCourseForUser(courseId);
      else await addCourseForUser(courseId);
    } catch (error) {
      console.error('Не удалось переключить курсы:', error);
    } finally {
      setisToogle(false);
    }
  };

  const imageNameLower = nameEN?.toLowerCase() || '';
  const courseBackgroundImage = courseImages[imageNameLower];

  return (
    <div
      className={clsx(
        styles.card,
        isHovered && styles.cardHovered,
        isWorkoutListOpen && styles.workoutListOpen // 🔹 Добавлено
      )}
      style={{ order: course.order }}
      onClick={() => {
        if (isWorkoutListOpen) return;
        navigate(ROUTES.COURSE_DETAIL(course.nameEN));
      }}
      onMouseEnter={() => !isToogle && !isWorkoutListOpen && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (isWorkoutListOpen) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(ROUTES.COURSE_DETAIL(course.nameEN));
        }
      }}
    >
      {/* 🔹 1. Основной контент (исчезает при открытии списка) */}
      <div className={clsx(styles.cardContent, isWorkoutListOpen && styles.cardContentHidden)}>
        <div className={styles.imageWrapper} style={{ backgroundColor }}>
          {courseBackgroundImage ? (
            <img className={styles.image} src={courseBackgroundImage} alt={nameRU} />
          ) : (
            <div className={styles.placeholderImage}>
              <span>{nameRU.charAt(0)}</span>
            </div>
          )}

          {isAuthenticated && (
            <div className={styles.addButtonWrapper} onClick={(e) => e.stopPropagation()}>
              <img
                className={clsx(
                  styles.addButton,
                  isSelected && styles.addButtonMinus,
                  isToogle && styles.loading
                )}
                src={isSelected ? MinusIcon : PlusIcon}
                alt={isSelected ? 'Удалить курс' : 'Добавить курс'}
                onClick={handleToggleCourse}
              />
              <span className={styles.tooltip}>
                {isSelected ? 'Удалить курс' : 'Добавить курс'}
              </span>
            </div>
          )}
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>{nameRU}</h3>

          <div className={styles.meta}>
            <span className={`${styles.metaItem} ${styles.wrappbackground}`}>
              <img src={CalendarIcon} alt="" className={styles.icon} /> {durationInDays} дней
            </span>
            <span className={`${styles.metaItem} ${styles.wrappbackground}`}>
              <img src={TimeIcon} alt="" className={styles.icon} /> {durationText}
            </span>
          </div>

          <div className={styles.footer}>
            <div className={`${styles.wrappbackground} ${styles.difficultyContainer}`}>
              <div className={styles.bars}>
                {[1, 2, 3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className={`${styles.bar} ${index <= level ? styles.active : ''}`}
                  />
                ))}
              </div>
              <span className={styles.difficultyText}>{label}</span>
            </div>
          </div>

          {pageProfile && isAuthenticated && (
            <>
              <div className={styles.progressBar}>
                <h3 className={styles.progressBar_title}>Прогресс {progressPercent}%</h3>
                <div className={styles.progressBar_bar}>
                  <div
                    className={styles.progressBar_fill}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <Button
                type="button"
                onClick={handleWorkoutButtonClick}
                size="lg"
                disabled={!courseProgress || isLoadingWorkouts}
              >
                {isLoadingWorkouts ? 'Загрузка...' : getWorkoutButtonText()}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 🔹 2. Панель списка тренировок (выезжает снизу) */}
      <div
        className={clsx(styles.workoutListPanel, isWorkoutListOpen && styles.workoutListPanelOpen)}
      >
        <div className={styles.listInner}>
          <div className={styles.listHeader}>
            <button className={styles.backBtn} onClick={handleBackToCard} type="button">
              ← Назад
            </button>
            <h4 className={styles.listTitle}>Выберите тренировку</h4>
          </div>

          <div className={styles.listScrollArea}>
            {workouts.map((workout) => {
              const isSelected = selectedWorkouts.has(workout._id);
              const progress = courseProgress?.workoutsProgress?.find(
                (wp) => wp.workoutId === workout._id
              );
              const isCompleted = progress?.workoutCompleted || false;
              const lessonNumber = extractLessonNumber(workout.name);

              return (
                <label
                  key={workout._id}
                  className={clsx(styles.listItem, isSelected && styles.listItemActive)}
                  onClick={(e) => {
                    e.stopPropagation(); // 🔹 Оставляем: блокируем переход на страницу курса
                    handleWorkoutToggle(workout._id); // 🔹 Добавляем: переключаем выбор
                  }}
                >
                  <div className={styles.checkboxContainer}>
                    {isSelected ? (
                      <img src={CheckIcon} alt="✓" className={styles.customCheck} />
                    ) : (
                      <div className={styles.emptyCheckbox} />
                    )}
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>
                      {isCompleted && <span className={styles.checkBadge}>✓</span>}
                      {workout.name}
                    </div>
                    <div className={styles.itemMeta}>
                      {lessonNumber ? `${lessonNumber} день` : 'День'}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          <Button
            type="button"
            onClick={handleStartWorkout}
            disabled={selectedWorkouts.size === 0}
            size="lg"
            className={styles.startBtn}
          >
            Начать ({selectedWorkouts.size})
          </Button>
        </div>
      </div>
    </div>
  );
};
