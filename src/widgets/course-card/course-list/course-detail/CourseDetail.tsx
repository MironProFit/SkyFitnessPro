import styles from './CourseDetail.module.css';
import { CourseHero } from './CourseHero';
import { CourseFitting } from './CourseFitting';
import { CourseDirections } from './CourseDirections';
import { CourseCta } from './CourseCta';
import { type CourseData } from '../course-card/CourseCard';

interface CourseDetailProps {
  course: CourseData;
}

export const CourseDetail = ({ course }: CourseDetailProps) => {
  return (
    <div className={styles.container}>
      <CourseHero title={course.nameRU} color={course.color} nameEN={course.nameEN} />

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
