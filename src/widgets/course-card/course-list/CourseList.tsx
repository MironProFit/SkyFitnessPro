// features/course/course-list/ui/CourseList.tsx

import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { CourseCard } from '../CourseCard';
import { LoadingAnimation } from '@/shared/components/LoadingAnimation/LoadingAnimation';
import { getCourseColor } from '@/shared/constans/courseConfig';
import { courseApi } from '@/entities/course/api/courseApi';
import type { Course } from '@/entities/course/model/types';

import styles from './CourseList.module.css';

export const CourseList = () => {
  const location = useLocation();
  const pageProfile = location.pathname === '/profile';

  const {
    data: courses = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<Course[], AxiosError>({
    queryKey: ['courses'],
    queryFn: () => courseApi.getCourses(), // ✅ Типы работают!
    staleTime: 1000 * 60 * 5, // Кэш на 5 минут
    retry: 1, // Одна попытка повтора при ошибке
  });

  // 🔴 Состояние: Первая загрузка
  if (isLoading) {
    return <LoadingAnimation />;
  }

  // 🔴 Состояние: Ошибка запроса
  if (isError) {
    return (
      <section className={styles.section}>
        <div className={styles.errorState}>
          <h2 className={styles.errorTitle}>😔 Не удалось загрузить курсы</h2>
          <p className={styles.errorMessage}>
            {error?.message || 'Произошла неизвестная ошибка'}
          </p>
          <button
            className={styles.retryButton}
            onClick={() => refetch()}
            type="button"
          >
            🔄 Повторить
          </button>
        </div>
      </section>
    );
  }

  // 🟢 Состояние: Успех (есть данные)
  return (
    <section className={styles.section}>
      <div className={styles.headerBlock}>
        {pageProfile ? (
          <h1 className={styles.mainTitle_profile}>Мои курсы</h1>
        ) : (
          <>
            <h1 className={styles.mainTitle}>
              Начните заниматься спортом
              <br />и улучшите качество жизни
            </h1>
            <div className={styles.badge}>Измени своё тело за полгода!</div>
          </>
        )}
      </div>

      {/* ⚡ Индикатор фонового обновления */}
      {isFetching && !isLoading && (
        <div className={styles.fetchingIndicator}>
          <span className={styles.spinner}>⚡</span>
          <span>Обновление...</span>
        </div>
      )}

      {courses.length > 0 ? (
        <>
          <div className={styles.grid}>
            {courses.map((course) => (
              <CourseCard
                key={course._id} // ✅ MongoDB _id
                course={course}
                pageProfile={pageProfile}
                backgroundColor={getCourseColor(course.nameEN)}
              />
            ))}
          </div>

          {/* 🔼 Кнопка "Наверх" */}
          <div className={styles.scrollTopContainer}>
            <button
              type="button"
              className={styles.scrollTopBtn}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Прокрутить наверх"
            >
              Наверх ↑
            </button>
          </div>
        </>
      ) : (
        // 🟡 Состояние: Пустой список
        <div className={styles.emptyMessage}>
          <h2>Курсы не найдены</h2>
          <h3 className={styles.hint}>Попробуйте позже</h3>
        </div>
      )}
    </section>
  );
};