import styles from './CourseDetail.module.css';
import Sparcle from '@/shared/assets/icons/sparcle.svg';
import CtaImage from '@/shared/assets/courses/cta_img.png';
import CtaImageLine from '@/shared/assets/courses/cta_line.png';
import { useApp } from '@/context/AppContext';

interface CourseDirectionsProps {
  items: string[];
}

export const CourseDirections = ({ items }: CourseDirectionsProps) => {
  // Если на мобильном нужно скрыть какие-то элементы внутри списка, можно использовать isMobile
  // Но обычно CSS grid сам справляется с адаптацией колонок
  const { isMobile } = useApp();

  return (
    <div className={styles.directionsBox}>
      <ul className={styles.directionsList}>
        {items.map((item, index) => (
          <li key={index} className={styles.directionsItem}>
            <img src={Sparcle} alt="Sparcle" className={styles.plusIcon} />
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </li>
        ))}
      </ul>
      {isMobile && (
        <div className={styles.ctaImageWrapper}>
          <img src={CtaImageLine} className={styles.ctaImageLine} alt="" aria-hidden="true" />
          <img src={CtaImage} alt="Athlete" className={styles.ctaImage} />
        </div>
      )}
    </div>
  );
};
