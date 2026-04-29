import { useApp } from '@/context/AppContext';
import styles from './CourseDetail.module.css'; 
import CtaImage from '@/shared/assets/courses/cta_img.png';
import CtaImageLine from '@/shared/assets/courses/cta_line.png';

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { User } from '@/shared/api/types';
import { userApi } from '@/entities/user/api/userApi';
import { Button } from '@/shared/components/Button/Button';

interface CourseCtaProps {
  fitting?: string[];
  courseId?: string;
}

export const CourseCta = ({ fitting, courseId }: CourseCtaProps) => {
  const { toggleModalAuth, addCourseForUser, removeCourseForUser } = useApp();
  const { isAuthenticated, isAuthenticating } = useAuth();

  //Состояние для анимации кнопки (загрузка)
  const [isToggling, setIsToggling] = useState(false);

  const { data: userData } = useQuery<User>({
    queryKey: ['user'],
    queryFn: () => userApi.getMe(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  //Проверяем, добавлен ли курс пользователем
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
      console.error('Не удалось переключить статус курса:', error);
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
      <div className={styles.ctaContent}>
        <h2 className={styles.ctaTitle}>Начните путь к новому телу</h2>

        <ul className={styles.benefitsList}>
          {benefits.map((item, index) => (
            <li key={index}>{item.toLowerCase()}</li>
          ))}
        </ul>

        {/* Кнопка с логикой добавления/удаления и загрузкой */}
        <Button onClick={handleClick} size="lg" disabled={isAuthenticating || isToggling}>
          {isAuthenticating ? (
            'Загрузка...'
          ) : !isAuthenticated ? (
            'Войдите, чтобы добавить курс'
          ) : isToggling ? (
            //Показываем спиннер или текст при загрузке
            <span className={styles.spinner}>Загрузка...</span>
          ) : (
            <>{isSelected ? 'Удалить курс' : 'Добавить курс'}</>
          )}
        </Button>
      </div>

      <img src={CtaImageLine} className={styles.ctaImageLine} alt="" />
      <img src={CtaImage} alt="Athlet" className={styles.ctaImage} />
    </div>
  );
};
