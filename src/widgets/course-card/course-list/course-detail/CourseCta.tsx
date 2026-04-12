// src/widgets/course-cta/CourseCta.tsx
import { useApp } from '@/context/AppContext';
import styles from './CourseDetail.module.css';
import CtaImage from '@/shared/assets/courses/cta_img.png';
import CtaImageLine from '@/shared/assets/courses/cta_line.png';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

interface CourseCtaProps {
  fitting?: string[];
  courseId?: string;
}

export const CourseCta = ({ fitting, courseId }: CourseCtaProps) => {
  const { toggleModalAuth } = useApp();

 
  const { isAuthenticated, isAuthenticating } = useAuth();

  useEffect(() => {
    console.log('🔍 CourseCta auth state:', {
      isAuthenticated,
      isAuthenticating,
    });
  }, [isAuthenticated, isAuthenticating]);

  const addCourseForUser = () => {
    console.log('Adding course:', courseId);
  };

  const benefits =
    fitting && fitting.length > 0
      ? fitting
      : ['проработка всех групп мышц', 'тренировка суставов', 'улучшение циркуляции крови'];

  return (
    <div className={styles.ctaBlock}>
      <div className={styles.ctaContent}>
        <h2 className={styles.ctaTitle}>Начните путь к новому телу</h2>

        <ul className={styles.benefitsList}>
          {benefits.map((item, index) => (
            <li key={index}>{item.toLowerCase()}</li>
          ))}
        </ul>

        {/* 🔹 Проверяем isAuthenticated для показа правильной кнопки */}
        <button
          onClick={isAuthenticated ? () => addCourseForUser() : () => toggleModalAuth()}
          className={styles.ctaButton}
          disabled={isAuthenticating}
        >
          {isAuthenticating
            ? 'Загрузка...'
            : isAuthenticated
              ? 'Добавить курс'
              : 'Войдите, чтобы добавить курс'}
        </button>
      </div>

      <img src={CtaImageLine} className={styles.ctaImageLine} alt="" />
      <img src={CtaImage} alt="Athlet" className={styles.ctaImage} />
    </div>
  );
};
