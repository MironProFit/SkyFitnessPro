import { useLocation } from 'react-router-dom';
import { CourseCard } from '../CourseCard';
import styles from './CourseList.module.css';
import { courseApi } from '@/shared/api/endpoints/courseApi';
import { useQuery } from '@tanstack/react-query';
import type { ICourse } from '@/entities/course/types';
import { getCourseColor } from '@/shared/constans/courseConfig';
import { LoadingAnimation } from '@/shared/components/LoadingAnimation/LoadingAnimation';

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
  } = useQuery<ICourse[], Error>({
    queryKey: ['courses'],
    queryFn: () => courseApi.getAll(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

if (isLoading) {
 return <LoadingAnimation/>
}

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

      <div className={styles.grid}>
        {courses.map((course) => (
          <CourseCard
            pageProfile={pageProfile}
            key={course._id}
            course={course}
            backgroundColor={getCourseColor(course.nameEN)}
          />
        ))}
      </div>
      {courses && <div className={styles.scrollTopContainer}>
        <button
          className={styles.scrollTopBtn}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Наверх ↑
        </button>
      </div>}

    </section>
  );
};
