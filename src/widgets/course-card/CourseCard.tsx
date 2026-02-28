// import styles from './CourseCard.module.css';
// import CalendarIcon from '@/shared/assets/icon/Calendar.svg';
// import TimeIcon from '@/shared/assets/icon/Time.svg';
// import AddIcon from '@/shared/assets/icon/plus.svg';

// // import stepairobicImg from '@/shared/assets/courses/stepairobic.webp';
// // import yogaImg from '@/shared/assets/courses/yoga.webp';
// // import stretchingImg from '@/shared/assets/courses/stretching.webp';
// // import bodyflexImg from '@/shared/assets/courses/bodyflex.webp';
// // import fitnessImg from '@/shared/assets/courses/fitness.webp';


// import stepairobicImg from '@/shared/assets/courses/stepairobic_cr.webp';
// import yogaImg from '@/shared/assets/courses/yoga_cr.webp';
// import stretchingImg from '@/shared/assets/courses/stretching_cr.webp';
// import bodyflexImg from '@/shared/assets/courses/bodyflex_cr.webp';
// import fitnessImg from '@/shared/assets/courses/fitness_cr.webp';


// import { useState } from 'react';
// import { Link } from 'react-router-dom';

// const courseImages: Record<string, string> = {
//   stepairobic: stepairobicImg,
//   yoga: yogaImg,
//   stretching: stretchingImg,
//   bodyflex: bodyflexImg,
//   fitness: fitnessImg,
// };

// interface DailyDuration {
//   from: number;
//   to: number;
// }

// export interface CourseData {
//   _id: string;
//   nameRU: string;
//   nameEN?: string;
//   durationInDays: number;
//   dailyDurationInMinutes: DailyDuration;
//   difficulty: string;
//   description?: string;
//   directions?: string[];
//   image?: string;
//   color?: string;
//   fitting?: string[];
//   imageStyle: {
//     transform?: string;
//     top?: string;
//     left?: string;
//   };
// }

// interface CourseCardProps {
//   course: CourseData;
// }

// const getDifficultyLevel = (difficulty: string) => {
//   const d = difficulty.toLowerCase();
//   if (d.includes('начальн') || d.includes('легк')) return 1;
//   if (d.includes('средн')) return 3;
//   if (d.includes('сложн') || d.includes('тяжел')) return 5;
//   return 1;
// };

// const getDifficultyLabel = (level: number) => {
//   if (level === 1) return 'Легкий';
//   if (level === 3) return 'Средний';
//   return 'Сложный';
// };

// export const CourseCard = ({ course }: CourseCardProps) => {
//   const [isHovered, setIsHovered] = useState(false);

//   const {
//     nameRU,
//     nameEN,
//     durationInDays,
//     dailyDurationInMinutes,
//     difficulty,
//     color = '#f0f0f0',
//     imageStyle,
//   } = course;

//   const durationText = `${dailyDurationInMinutes.from}-${dailyDurationInMinutes.to} мин/день`;
//   const level = getDifficultyLevel(difficulty);
//   const label = getDifficultyLabel(level);

//   const imageName = nameEN ? nameEN.toLowerCase() : '';
//   const backgroundImage = courseImages[imageName] || course.image || '';

//   let finalTransform = 'none';

//   if (imageStyle?.transform) {
//     // Извлекаем число из строки "scale(X)"
//     const match = imageStyle.transform.match(/scale\(([\d.]+)\)/);
//     if (match) {
//       const baseScale = parseFloat(match[1]);
//       const hoverScale = isHovered ? baseScale : baseScale;
//       finalTransform = `scale(${hoverScale})`;
//     } else {
//       finalTransform = imageStyle.transform;
//     }
//   }

//   const computedStyle: React.CSSProperties = {
//     ...imageStyle,
//     transform: finalTransform,
//   };

//   return (
//     <div
//       className={styles.card}
//       onClick={() => console.log(nameEN)}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <Link to={`/course/${course.nameEN}`} style={{ textDecoration: 'none', color: 'inherit' }}>
//         <div className={styles.imageWrapper} style={{ backgroundColor: color }}>
//           {backgroundImage ? (
//             <img
//               src={backgroundImage}
//               alt={nameRU}
//               className={styles.image}
//               style={computedStyle}
//             />
//           ) : (
//             <div className={styles.placeholderImage}>
//               <span>{nameRU.charAt(0)}</span>
//             </div>
//           )}

//           <div className={styles.addButtonWrapper}>
//             <img
//               className={styles.addButton}
//               src={AddIcon}
//               alt="Добавить курс"
//               onClick={() => console.log('Нажата кнопка добавления', nameRU)}
//             />
//             <span className={styles.tooltip}>Добавить курс</span>
//           </div>
//         </div>

//         <div className={styles.content}>
//           <h3 className={styles.title}>{nameRU}</h3>

//           <div className={styles.meta}>
//             <span className={`${styles.metaItem} ${styles.wrappbackground}`}>
//               <img src={CalendarIcon} alt="" className={styles.icon} /> {durationInDays} дней
//             </span>
//             <span className={`${styles.metaItem} ${styles.wrappbackground}`}>
//               <img src={TimeIcon} alt="" className={styles.icon} /> {durationText}
//             </span>
//           </div>

//           <div className={styles.footer}>
//             <div className={`${styles.wrappbackground} ${styles.difficultyContainer}`}>
//               <div className={styles.bars}>
//                 {[1, 2, 3, 4, 5].map((index) => (
//                   <div
//                     key={index}
//                     className={`${styles.bar} ${index <= level ? styles.active : ''}`}
//                   />
//                 ))}
//               </div>
//               <span className={styles.difficultyText}>{label}</span>
//             </div>
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// };


import styles from './CourseCard.module.css';
import CalendarIcon from '@/shared/assets/icon/Calendar.svg';
import TimeIcon from '@/shared/assets/icon/Time.svg';
import AddIcon from '@/shared/assets/icon/plus.svg';

import stepairobicImg from '@/shared/assets/courses/stepairobic_cr.webp';
import yogaImg from '@/shared/assets/courses/yoga_cr.webp';
import stretchingImg from '@/shared/assets/courses/stretching_cr.webp';
import bodyflexImg from '@/shared/assets/courses/bodyflex_cr.webp';
import fitnessImg from '@/shared/assets/courses/fitness_cr.webp';

import { useState } from 'react';
import { Link } from 'react-router-dom';

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
  color?: string;
  // Добавили необязательные поля для страницы деталей
  description?: string;
  directions?: string[];
  fitting?: string[];
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
  const [isHovered, setIsHovered] = useState(false);

  const {
    nameRU,
    nameEN,
    durationInDays,
    dailyDurationInMinutes,
    difficulty,
    color = '#f0f0f0',
  } = course;

  const durationText = `${dailyDurationInMinutes.from}-${dailyDurationInMinutes.to} мин/день`;
  const level = getDifficultyLevel(difficulty);
  const label = getDifficultyLabel(level);

  const imageName = nameEN ? nameEN.toLowerCase() : '';
  const backgroundImage = courseImages[imageName] || '';

  return (
    <div
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/course/${course.nameEN}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className={styles.imageWrapper} style={{ backgroundColor: color }}>
          {backgroundImage ? (
            <img
              src={backgroundImage}
              alt={nameRU}
              className={styles.image}
            />
          ) : (
            <div className={styles.placeholderImage}>
              <span>{nameRU.charAt(0)}</span>
            </div>
          )}

          <div className={styles.addButtonWrapper}>
            <img
              className={styles.addButton}
              src={AddIcon}
              alt="Добавить курс"
              onClick={(e) => {
                e.preventDefault();
                console.log('Нажата кнопка добавления', nameRU);
              }}
            />
            <span className={styles.tooltip}>Добавить курс</span>
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
        </div>
      </Link>
    </div>
  );
};