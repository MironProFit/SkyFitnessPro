import styles from './CourseDetail.module.css';
import { CourseHero } from './CourseHero';
import { CourseFitting } from './CourseFitting';
import { CourseDirections } from './CourseDirections'; // Импортируем компонент направлений
import { CourseCta } from './CourseCta'; // Это финальный CTA с кнопкой
import { getCourseColor } from '@/shared/constans/courseConfig';
import type { Course } from '@/entities/course/model/types';

interface CourseDetailProps {
  course: Course;
}

export const CourseDetail = ({ course }: CourseDetailProps) => {
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

        {/* Финальный CTA с кнопкой и мужиком */}
        <section className={styles.section}>
          <CourseCta fitting={course.fitting} courseId={course._id} />
        </section>
      </div>
    </div>
  );
};
