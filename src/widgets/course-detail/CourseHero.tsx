import styles from './CourseDetail.module.css';
import stepairobicImg from '@/shared/assets/courses/stepairobic_cr.webp';
import yogaImg from '@/shared/assets/courses/yoga_cr.webp';
import stretchingImg from '@/shared/assets/courses/stretching_cr.webp';
import bodyflexImg from '@/shared/assets/courses/bodyflex_cr.webp';
import fitnessImg from '@/shared/assets/courses/fitness_cr.webp';

const courseImages: Record<string, string> = {
  stepairobic: stepairobicImg,
  yoga: yogaImg,
  stretching: stretchingImg,
  bodyflex: bodyflexImg,
  fitness: fitnessImg,
};

interface CourseHeroProps {
  title: string;
  color: string | undefined;
  nameEN?: string;
}

export const CourseHero = ({ title, color, nameEN }: CourseHeroProps) => {
  const imageName = nameEN ? nameEN.toLowerCase() : '';
  const backgroundImage = courseImages[imageName] || '';

  return (
    <div className={styles.hero} style={{ backgroundColor: color }}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>{title}</h1>
      </div>
      {backgroundImage && <img src={backgroundImage} alt={title} className={styles.heroImage} />}
    </div>
  );
};
