import styles from './CourseCard.module.css';
import CalendarIcon from '@/shared/assets/icon/Calendar.svg';
import TimeIcon from '@/shared/assets/icon/Time.svg';
import AddIcon from '@/shared/assets/icon/plus.svg';

import stepairobicImg from '@/shared/assets/courses/stepairobic.webp';
import yogaImg from '@/shared/assets/courses/yoga.webp';
import stretchingImg from '@/shared/assets/courses/stretching.webp';
import bodyflexImg from '@/shared/assets/courses/bodyflex.webp';
import fitnessImg from '@/shared/assets/courses/fitness.webp';

const courseImages: Record<string, string> = {
  stepairobic: stepairobicImg,
  yoga: yogaImg,
  stretching: stretchingImg,
  bodyflex: bodyflexImg,
  fitness: fitnessImg,
};

interface DailyDuration {
  from: number;
  to: number; 
}

export interface CourseData {
  _id: string;
  nameRU: string;
  nameEN?: string;
  durationInDays: number;
  dailyDurationInMinutes: DailyDuration;
  difficulty: string;
  description?: string;
  image?: string;
  color?: string;
  imageStyle: {
    transform?: string;
    top?: string;
    left?: string;
  };
}

interface CourseCardProps {
  course: CourseData;
}

const getDifficultyLevel = (difficulty: string) => {
  const d = difficulty.toLowerCase();
  if (d.includes('начальн') || d.includes('легк')) return 1;
  if (d.includes('средн')) return 3;
  if (d.includes('сложн') || d.includes('тяжел')) return 5;
  return 1;
};

const getDifficultyLabel = (level: number) => {
  if (level === 1) return 'Легкий';
  if (level === 3) return 'Средний';
  return 'Сложный';
};

export const CourseCard = ({ course }: CourseCardProps) => {
  const {
    nameRU,
    nameEN,
    durationInDays,
    dailyDurationInMinutes,
    difficulty,
    color = '#f0f0f0',
    imageStyle,
  } = course;

  const durationText = `${dailyDurationInMinutes.from}-${dailyDurationInMinutes.to} мин/день`;
  const level = getDifficultyLevel(difficulty);
  const label = getDifficultyLabel(level);

  const imageName = nameEN ? nameEN.toLowerCase() : '';
  const backgroundImage = courseImages[imageName] || course.image || '';

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper} style={{ backgroundColor: color }}>
        {backgroundImage ? (
          <img src={backgroundImage} alt={nameRU} className={styles.image} style={imageStyle} />
        ) : (
          <div className={styles.placeholderImage}>
            <span>{nameRU.charAt(0)}</span>
          </div>
        )}

        <img
          aria-label="Добавить курс"
          className={styles.addButton}
          src={AddIcon}
          alt="Add"
          onClick={() => console.log('Нажата кнопка добавления', nameRU)}
        />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{nameRU}</h3>

        <div className={styles.meta}>
          <span className={`${styles.metaItem} ${styles.wrappbackground}`}>
            <img src={CalendarIcon} alt="" className={styles.icon} /> {durationInDays} дней
          </span>
          <span className={`${styles.metaItem} ${styles.wrappbackground}`}>
            <img src={TimeIcon} alt="" className={styles.icon} /> {durationText}
          </span>
        </div>

        <div className={styles.footer}>
          <div className={`${styles.wrappbackground} ${styles.difficultyContainer}`}>
            <div className={styles.bars}>
              {[1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  className={`${styles.bar} ${index <= level ? styles.active : ''}`}
                />
              ))}
            </div>
            <span className={styles.difficultyText}>{label}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
