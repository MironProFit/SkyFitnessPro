// src/widgets/course-card/CourseCard.tsx
import styles from './CourseCard.module.css';
import CalendarIcon from '@/shared/assets/icons/Calendar.svg';
import TimeIcon from '@/shared/assets/icons/Time.svg';
import PlusIcon from '@/shared/assets/icons/plus.svg';
import MinusIcon from '@/shared/assets/icons/minus.svg';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/Button/Button';
import { courseImages } from '@/shared/constans/courseConfig';
import type { Course } from '@/entities/course/model/types';
import { ROUTES } from '@/shared/config/routes';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { useQuery } from '@tanstack/react-query';
import type { User } from '@/shared/api/types';
import { userApi } from '@/entities/user/api/userApi';
import clsx from 'clsx';

interface CourseCardProps {
  course: Course;
  pageProfile: boolean;
  backgroundColor: string | undefined;
}

const getDifficultyLevel = (difficulty: string) => {
  const d = difficulty.toLowerCase();
  if (d.includes('начальн') || d.includes('легк')) return 1;
  if (d.includes('средн')) return 3;
  if (d.includes('сложн') || d.includes('тяжел')) return 5;
  return 1;
};

const getDifficultyLabel = (level: number) => {
  if (level === 1) return 'Легкий';
  if (level === 3) return 'Средний';
  return 'Сложный';
};

export const CourseCard = ({ pageProfile, course, backgroundColor }: CourseCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addCourseForUser, removeCourseForUser } = useApp();
  const [isToogle, setisToogle] = useState(true);

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

  // 🔹 ВОССТАНОВЛЕНО: Твой исходный код с isLoadingUpdateCouses
  const { data: userData, isLoading: isLoadingUpdateCouses } = useQuery<User>({
    queryKey: ['user'],
    queryFn: () => userApi.getMe(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  // 🔹 Проверяем, выбран ли этот курс у пользователя
  const isSelected = isAuthenticated
    ? (userData?.user?.selectedCourses || []).includes(courseId)
    : false;

  const handleToggleCourse = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 🔹 Блокируем повторные клики, если запрос уже выполняется
    if (isToogle) return;

    setisToogle(true);
    try {
      if (isSelected) {
        await removeCourseForUser(courseId);
      } else {
        await addCourseForUser(courseId);
      }
    } catch (error) {
      console.error('Не удалось переключить курсы:', error);
    } finally {
      // 🔹 ИСПРАВЛЕНО: сбрасываем статус загрузки, а не ховер
      setisToogle(false);
    }
  };

  const imageNameLower = nameEN?.toLowerCase() || '';
  const courseBackgroundImage = courseImages[imageNameLower];

  return (
    <div
      className={styles.card}
      style={{ order: course.order }}
      onMouseEnter={() => {
        if (!isToogle) setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={ROUTES.COURSE_DETAIL(course.nameEN)}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div className={styles.imageWrapper} style={{ backgroundColor: backgroundColor }}>
          {courseBackgroundImage ? (
            <img className={styles.image} src={courseBackgroundImage} alt={nameRU} />
          ) : (
            <div className={styles.placeholderImage}>
              <span>{nameRU.charAt(0)}</span>
            </div>
          )}

          {/* 🔹 Кнопка +/- показывается только авторизованным */}
          {isAuthenticated && (
            <div className={styles.addButtonWrapper}>
              <img
                // 🔹 Добавлен класс styles.loading при загрузке
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

          {pageProfile ? (
            <>
              <div className={styles.progressBar}>
                <h3 className={styles.progressBar_title}>Прогресс 40%</h3>
                <div className={styles.progressBar_bar}></div>
              </div>
              <Button size="lg">Продолжить тренировку</Button>
            </>
          ) : null}
        </div>
      </Link>
    </div>
  );
};
