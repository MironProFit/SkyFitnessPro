import styles from './CourseDetail.module.css';
import Sparcle from '@/shared/assets/icon/sparcle.svg';

interface CourseDirectionsProps {
  items: string[];
}

export const CourseDirections = ({ items }: CourseDirectionsProps) => {
  return (
    <div className={styles.directionsBox}>
      <ul className={styles.directionsList}>
        {items.map((item, index) => (
          <li key={index} className={styles.directionsItem}>
            <img src={Sparcle} alt='Sparcle' className={styles.plusIcon}/> {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
