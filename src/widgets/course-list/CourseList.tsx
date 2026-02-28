import { CourseCard, type CourseData } from '../course-card/CourseCard';
import styles from './CourseList.module.css';

const coursesData: CourseData[] = [
  {
    _id: 'ab1c3f',
    nameRU: 'Йога',
    nameEN: 'Yoga',
    durationInDays: 20,
    dailyDurationInMinutes: { from: 10, to: 30 },
    difficulty: 'начальный',
    color: '#FFC700',
    imageStyle: {  transform: 'scale(2)'  },
  },
  {
    _id: 'kfpq8e',
    nameRU: 'Стретчинг',
    nameEN: 'Stretching',
    durationInDays: 40,
    dailyDurationInMinutes: { from: 30, to: 45 },
    difficulty: 'начальный',
    color: '#2491D2',
    imageStyle: { transform: 'scale(1.5)', top: '80px' },
  },
  {
    _id: 'ypox9r',
    nameRU: 'Фитнес',
    nameEN: 'Fitness',
    durationInDays: 20,
    dailyDurationInMinutes: { from: 45, to: 60 },
    difficulty: 'сложный',
    color: '#F7A012',
    imageStyle: { transform: 'scale(2.5)', top: '120px' },
  },
  {
    _id: '6i67sm',
    nameRU: 'Степ-аэробика',
    nameEN: 'StepAirobic',
    durationInDays: 25,
    dailyDurationInMinutes: { from: 20, to: 50 },
    difficulty: 'средний',
    color: '#FF7E65',
    imageStyle: { transform: 'scale(3)', top: '-300px', left: '20px'},
  },
  {
    _id: 'q02a6i',
    nameRU: 'Бодифлекс',
    nameEN: 'BodyFlex',
    durationInDays: 15,
    dailyDurationInMinutes: { from: 50, to: 70 },
    difficulty: 'сложный',
    color: '#7D458C',
    imageStyle: { transform: 'scale(1.8)', top: '-30px' },
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
