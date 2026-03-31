import styles from './CourseCard.module.css';
import CalendarIcon from '@/shared/assets/icons/Calendar.svg';
import TimeIcon from '@/shared/assets/icons/Time.svg';
import PlusIcon from '@/shared/assets/icons/plus.svg';
import MinusIcon from '@/shared/assets/icons/minus.svg';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/Button/Button';
import type { ICourse } from '@/entities/course/model/types';
import { courseImages } from '@/shared/constans/courseConfig';

interface CourseCardProps {
  course: ICourse;
  pageProfile: boolean;
  backgroundColor: string | undefined;
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

export const CourseCard = ({ pageProfile, course, backgroundColor }: CourseCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const { nameRU, nameEN, durationInDays, dailyDurationInMinutes, difficulty } = course;

  const durationText = `${dailyDurationInMinutes.from}-${dailyDurationInMinutes.to} мин/день`;
  const level = getDifficultyLevel(difficulty);
  const label = getDifficultyLabel(level);

  const imageName = nameEN ? nameEN.toLowerCase() : '';
  const backgroundImage = courseImages[imageName] || '';

  return (
    <div
      className={styles.card}
      style={{ order: course.order }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/course/${course.nameEN}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className={styles.imageWrapper} style={{ backgroundColor: backgroundColor }}>
          {backgroundImage ? (
            <img src={backgroundImage} alt={nameRU} className={styles.image} />
          ) : (
            <div className={styles.placeholderImage}>
              <span>{nameRU.charAt(0)}</span>
            </div>
          )}

          <div className={styles.addButtonWrapper}>
            <img
              className={styles.addButton}
              src={pageProfile ? MinusIcon : PlusIcon}
              alt="Добавить курс"
              onClick={(e) => {
                e.preventDefault();
                console.log('Нажата кнопка добавления', nameRU);
              }}
            />
            <span className={styles.tooltip}>{`Добавить курс`}</span>
          </div>
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

          {pageProfile ? (
            <>
              <div className={styles.progressBar}>
                <h3 className={styles.progressBar_title}>{`Прогресс 40%`}</h3>
                <div className={styles.progressBar_bar}></div>
              </div>
              <Button size="lg">Продолжить тренировку</Button>
            </>
          ) : (
            ''
          )}
        </div>
      </Link>
    </div>
  );
};
