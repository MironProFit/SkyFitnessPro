import styles from './CourseDetail.module.css';
import CtaImage from '@/shared/assets/courses/cta_img.png';
import CtaImageLine from '@/shared/assets/courses/cta_line.png';

interface CourseCtaProps {
  fitting?: string[];
}

export const CourseCta = ({ fitting }: CourseCtaProps) => {
  const benefits =
    fitting && fitting.length > 0
      ? fitting
      : ['проработка всех групп мышц', 'тренировка суставов', 'улучшение циркуляции крови'];

  return (
    <div className={styles.ctaBlock}>
      <div className={styles.ctaContent}>
        <h2 className={styles.ctaTitle}>Начните путь к новому телу</h2>

        <ul className={styles.benefitsList}>
          {benefits.map((item, index) => (
            <li key={index}>{item.toLowerCase()}</li>
          ))}
        </ul>

        <button className={styles.ctaButton}>Войдите, чтобы добавить курс</button>
      </div>

      <img src={CtaImageLine} className={styles.ctaImageLine} />
      <img src={CtaImage} alt="Athlet" className={styles.ctaImage} />
    </div>
  );
};
