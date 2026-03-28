import styles from './CourseDetail.module.css';
import { CourseHero } from './CourseHero';
import { CourseFitting } from './CourseFitting';
import { CourseDirections } from './CourseDirections';
import { CourseCta } from './CourseCta';
import type { ICourse } from '@/entities/course/types';
import { getCourseColor } from '@/shared/constans/courseConfig';

interface CourseDetailProps {
  course: ICourse;
}

export const CourseDetail = ({ course }: CourseDetailProps) => {
  return (
    <div className={styles.container}>
      <CourseHero
        title={course.nameRU}
        color={getCourseColor(course.nameEN)}
        nameEN={course.nameEN}
      />

      <div className={styles.contentWrapper}>
        {course.fitting && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Подойдет для вас, если:</h2>
            <CourseFitting items={course.fitting} />
          </section>
        )}

        {course.directions && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Направления</h2>
            <CourseDirections items={course.directions} />
          </section>
        )}

        <section className={styles.section}>
          <CourseCta fitting={course.fitting} />
        </section>
      </div>
    </div>
  );
};
