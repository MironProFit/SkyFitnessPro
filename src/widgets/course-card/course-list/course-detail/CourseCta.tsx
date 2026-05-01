import styles from './CourseDetail.module.css';
import CtaImage from '@/shared/assets/courses/cta_img.png';
import CtaImageLine from '@/shared/assets/courses/cta_line.png';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/entities/user/api/userApi';
import { Button } from '@/shared/components/Button/Button';
import type { User } from '@/shared/api/types';
import { useApp } from '@/context/AppContext';

interface CourseCtaProps {
  fitting?: string[];
  courseId?: string;
}

export const CourseCta = ({ fitting, courseId }: CourseCtaProps) => {
  const { toggleModalAuth, addCourseForUser, removeCourseForUser } = useApp();
  const { isAuthenticated, isAuthenticating } = useAuth();
  const { isMobile } = useApp(); // Используем хук
  const [isToggling, setIsToggling] = useState(false);

  const { data: userData } = useQuery<User>({
    queryKey: ['user'],
    queryFn: () => userApi.getMe(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  const isSelected = isAuthenticated
    ? (userData?.user?.selectedCourses || []).includes(courseId!)
    : false;

  const benefits =
    fitting && fitting.length > 0
      ? fitting
      : ['проработка всех групп мышц', 'тренировка суставов', 'улучшение циркуляции крови'];

  const handleToggleCourse = async () => {
    if (!courseId) return;
    setIsToggling(true);
    try {
      if (isSelected) {
        await removeCourseForUser(courseId);
      } else {
        await addCourseForUser(courseId);
      }
    } catch (error) {
      console.error('Ошибка переключения курса:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleClick = () => {
    if (!isAuthenticated) {
      toggleModalAuth();
    } else {
      handleToggleCourse();
    }
  };

  return (
    <div className={styles.ctaBlock}>
      {!isMobile && (
        <div className={styles.ctaImageWrapperDesktop}>
          <img
            src={CtaImageLine}
            className={styles.ctaImageLineDesktop}
            alt=""
            aria-hidden="true"
          />
          <img src={CtaImage} alt="Athlete" className={styles.ctaImageDesktop} />
        </div>
      )}

      <div className={styles.ctaContent}>
        <h1 className={styles.ctaTitle}>Начните путь к новому телу</h1>

        <ul className={styles.benefitsList}>
          {benefits.map((item, index) => (
            <li key={index}>{item.toLowerCase()}</li>
          ))}
        </ul>

        <Button
          onClick={handleClick}
          size="lg"
          disabled={isAuthenticating || isToggling}
          className={styles.ctaButton}
        >
          {isAuthenticating ? (
            'Загрузка...'
          ) : !isAuthenticated ? (
            'Войдите, чтобы добавить курс'
          ) : isToggling ? (
            'Загрузка...'
          ) : (
            <>{isSelected ? 'Удалить курс' : 'Добавить курс'}</>
          )}
        </Button>
      </div>
    </div>
  );
};
