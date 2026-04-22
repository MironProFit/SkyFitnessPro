// features/course/course-list/ui/CourseList.tsx
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { clsx } from 'clsx';

import { CourseCard } from '../CourseCard';
import { getCourseColor } from '@/shared/constans/courseConfig';
import { courseApi } from '@/entities/course/api/courseApi';
import { userApi } from '@/entities/user/api/userApi';
import type { Course } from '@/entities/course/model/types';
import { Button } from '@/shared/components/Button/Button';

import styles from './CourseList.module.css';
import { useEffect, useState, useMemo } from 'react';
import type { User } from '@/shared/api/types';
import { ROUTES } from '@/shared/config/routes';

export const CourseList = () => {
  const location = useLocation();
  const pageProfile = location.pathname === '/profile';
  const [showScrollTop, setShowScrollTop] = useState(false);
  const SCROLL_THRESHOLD = 50;

  //Запрос всех курсов
  const {
    data: allCourses = [],
    isLoading: isLoadingCourses,
    isFetching: isFetchingCourses,
    isError: isErrorCourses,
    error: errorCourses,
    refetch: refetchCourses,
  } = useQuery<Course[], AxiosError>({
    queryKey: ['courses'],
    queryFn: () => courseApi.getCourses(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  //Запрос данных пользователя (только на странице профиля)
  const {
    data: userData,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useQuery<User, AxiosError>({
    queryKey: ['user'],
    queryFn: () => userApi.getMe(),
    enabled: pageProfile,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  //Фильтрация курсов: на профиле показываем только selectedCourses
  const courses = useMemo(() => {
    if (!pageProfile) return allCourses;

    const userSelectedCourses = userData?.user?.selectedCourses;
    const selectedIds = userSelectedCourses || [];
    return allCourses.filter((course) => selectedIds.includes(course._id));
  }, [pageProfile, allCourses, userData]);

  //Объединённое состояние загрузки
  const isLoading = pageProfile ? isLoadingCourses || isLoadingUser : isLoadingCourses;
  const isError = pageProfile ? isErrorCourses || isErrorUser : isErrorCourses;
  const error = errorCourses;

  // Обработчик скролла для кнопки "Наверх"
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > SCROLL_THRESHOLD);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  //Компонент скелетона для сетки курсов
  const CourseListSkeleton = () => (
    <div className={styles.grid}>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className={styles['card-skeleton']}>
          <div className={styles['skeleton__image-wrapper']}>
            {/* <div className={styles['skeleton__add-button']}>
              <Skeleton
                circle
                height={32}
                width={32}
                baseColor="#2a3138"
                highlightColor="#373e47"
              />
            </div> */}
          </div>

          <div className={styles['skeleton__content']}>
            <Skeleton
              className={styles['skeleton__title']}
              baseColor="#2a3138"
              highlightColor="#373e47"
            />

            <div className={styles['skeleton__meta']}>
              <Skeleton
                className={styles['skeleton__meta-item']}
                baseColor="#2a3138"
                highlightColor="#373e47"
              />
              <Skeleton
                className={styles['skeleton__meta-item']}
                baseColor="#2a3138"
                highlightColor="#373e47"
              />
            </div>

            <div className={styles['skeleton__difficulty']}>
              <div className={styles['skeleton__bars']}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton
                    key={i}
                    className={clsx(
                      styles['skeleton__bar'],
                      i <= 3 && styles['skeleton__bar--active']
                    )}
                    baseColor="#2a3138"
                    highlightColor="#373e47"
                  />
                ))}
              </div>
              <Skeleton
                className={styles['skeleton__difficulty-text']}
                baseColor="#2a3138"
                highlightColor="#373e47"
              />
            </div>

            {pageProfile && (
              <div className={styles['skeleton__progress']}>
                <Skeleton
                  className={styles['skeleton__progress-title']}
                  baseColor="#2a3138"
                  highlightColor="#373e47"
                />
                <Skeleton
                  className={styles['skeleton__progress-bar']}
                  baseColor="#2a3138"
                  highlightColor="#373e47"
                />
              </div>
            )}

            <Skeleton
              className={styles['skeleton__button']}
              baseColor="#2a3138"
              highlightColor="#373e47"
            />
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <section className={styles.section}>
        <CourseListSkeleton />
      </section>
    );
  }

  if (isError) {
    return (
      <section className={styles.section}>
        <div className={styles['error-state']}>
          <h2 className={styles['error-state__title']}>😔 Не удалось загрузить курсы</h2>
          <p className={styles['error-state__message']}>
            {error?.message || 'Произошла неизвестная ошибка'}
          </p>
          <button
            className={styles['error-state__retry-btn']}
            onClick={() => refetchCourses()}
            type="button"
          >
            🔄 Повторить
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles['section__header']}>
        {pageProfile ? (
          <h1 className={styles['main-title--profile']}>Мои курсы</h1>
        ) : (
          <>
            <h1 className={styles['main-title']}>
              Начните заниматься спортом
              <br />и улучшите качество жизни
            </h1>
            <div className={styles.badge}>Измени своё тело за полгода!</div>
          </>
        )}
      </div>

      {courses.length > 0 ? (
        <>
          <div className={styles.grid}>
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                pageProfile={pageProfile}
                backgroundColor={getCourseColor(course.nameEN)}
              />
            ))}
          </div>

          <div className={clsx(styles['scroll-top'], showScrollTop && styles['scroll-top--show'])}>
            <Button
              type="button"
              onClick={handleScrollToTop}
              aria-label="Прокрутить наверх"
              className={styles['scroll-top__btn']}
            >
              Наверх ↑
            </Button>
          </div>
        </>
      ) : pageProfile ? (
        <div className={styles['empty-message']}>
          <h2 className={styles['empty-message__title']}>У вас пока нет выбранных курсов</h2>
          <h3 className={styles['empty-message__hint']}>
            <a href={ROUTES.HOME} style={{ color: '#b8f33f', textDecoration: 'none' }}>
              Перейти в каталог →
            </a>
          </h3>
        </div>
      ) : (
        <div className={styles['empty-message']}>
          <h2 className={styles['empty-message__title']}>Курсы не найдены</h2>
          <h3 className={styles['empty-message__hint']}>Попробуйте позже</h3>
        </div>
      )}
    </section>
  );
};
