import styles from './CourseDetail.module.css';
import { CourseHero } from './CourseHero';
import { CourseFitting } from './CourseFitting';
import { CourseDirections } from './CourseDirections';
import { CourseCta } from './CourseCta';
import { getCourseColor } from '@/shared/constans/courseConfig';
import type { Course } from '@/entities/course/model/types';
import { useEffect } from 'react';

interface CourseDetailProps {
  course: Course;
}

export const CourseDetail = ({ course }: CourseDetailProps) => {

  useEffect(() => { console.log(course); }, [course])

  return (
    <div className={styles.container}>
      <CourseHero
        title={course.nameRU}
        color={getCourseColor(course.nameEN)}
        nameEN={course.nameEN}
      />

      <div className={styles.content__wrapper}>
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
          <CourseCta fitting={course.fitting} courseId ={course._id} />
        </section>
      </div>
    </div>
  );
};
