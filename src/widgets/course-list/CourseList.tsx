import { CourseCard, type CourseData } from '../course-card/CourseCard';
import styles from './CourseList.module.css';

const coursesData: CourseData[] = [
  {
    _id: 'ab1c3f',
    nameRU: 'Йога',
    durationInDays: 20,
    dailyDurationInMinutes: { from: 10, to: 30 },
    difficulty: 'начальный',
    description: 'это философия здорового образа жизни...',
    color: '#FFC700',
  },
  {
    _id: 'kfpq8e',
    nameRU: 'Стретчинг',
    durationInDays: 40,
    dailyDurationInMinutes: { from: 30, to: 45 },
    difficulty: 'начальный',
    description: 'это система упражнений, целью которых является разогрев...',
    color: '#2491D2',
  },
  {
    _id: 'ypox9r',
    nameRU: 'Фитнес',
    durationInDays: 20,
    dailyDurationInMinutes: { from: 45, to: 60 },
    difficulty: 'сложный',
    description: 'Фитнес и танцы – что между ними общего?...',
    color: '#FFA500',
  },
  {
    _id: '6i67sm',
    nameRU: 'Степ-аэробика',
    durationInDays: 25,
    dailyDurationInMinutes: { from: 20, to: 50 },
    difficulty: 'средний',
    description: 'направление фитнеса, основанное на наборе аэробных упражнений...',
    color: '#FF7F50',
  },
  {
    _id: 'q02a6i',
    nameRU: 'Бодифлекс',
    durationInDays: 15,
    dailyDurationInMinutes: { from: 50, to: 70 },
    difficulty: 'сложный',
    description: 'BodyFlex – система, в которой особым образом сочетаются...',
    color: '#9370DB',
  },
];

export const CourseList = () => {
  return (
    <section className={styles.section}>
      <div className={styles.headerBlock}>
        <h1 className={styles.mainTitle}>
          Начните заниматься спортом
          <br />и улучшите качество жизни
        </h1>
        <div className={styles.badge}>Измени своё тело за полгода!</div>
      </div>

      <div className={styles.grid}>
        {coursesData.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>

      <div className={styles.scrollTopContainer}>
        <button
          className={styles.scrollTopBtn}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Наверх ↑
        </button>
      </div>
    </section>
  );
};
