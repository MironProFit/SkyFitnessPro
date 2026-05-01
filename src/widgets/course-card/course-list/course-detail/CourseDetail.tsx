import styles from './CourseDetail.module.css';
import { CourseHero } from './CourseHero';
import { CourseFitting } from './CourseFitting';
import { CourseDirections } from './CourseDirections';
import { CourseCta } from './CourseCta';
import { getCourseColor } from '@/shared/constans/courseConfig';
import type { Course } from '@/entities/course/model/types';
import { useApp } from '@/context/AppContext';

// Импортируем картинки для мобильной вставки
import AthleteImage from '@/shared/assets/courses/cta_img.png';
import AthleteLine from '@/shared/assets/courses/cta_line.png';

interface CourseDetailProps {
  course: Course;
}

export const CourseDetail = ({ course }: CourseDetailProps) => {
  const { isMobile } = useApp();

  return (
    <div className={styles.container}>
      <CourseHero
        title={course.nameRU}
        color={getCourseColor(course.nameEN)}
        nameEN={course.nameEN}
      />

      <div className={styles.content__wrapper}>
        {/* Блок "Подойдет для вас" */}
        {course.fitting && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Подойдет для вас, если:</h2>
            <CourseFitting items={course.fitting} />
          </section>
        )}

        {/* Блок "Направления" */}
        {course.directions && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Направления</h2>
            <CourseDirections items={course.directions} />
          </section>
        )}

        {/* --- МОБИЛЬНАЯ КАРТИНКА МЕЖДУ БЛОКАМИ --- */}
        {isMobile && (
          <div className={styles.athleteWrapperMobile}>
            <img src={AthleteLine} alt="" className={styles.athleteLineMobile} aria-hidden="true" />
            <img src={AthleteImage} alt="Athlete" className={styles.athleteImageMobile} />
          </div>
        )}

        {/* Финальный CTA */}
        <section className={styles.section}>
          <CourseCta fitting={course.fitting} courseId={course._id} />
        </section>
      </div>
    </div>
  );
};
