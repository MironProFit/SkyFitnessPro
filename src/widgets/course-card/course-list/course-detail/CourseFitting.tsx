import styles from './CourseDetail.module.css';

interface CourseFittingProps {
  items: string[];
}

export const CourseFitting = ({ items }: CourseFittingProps) => {
  return (
    <div className={styles.fittingGrid}>
      {items.slice(0, 3).map((item, index) => (
        <div key={index} className={styles.fittingCard}>
          <span className={styles.fittingNumber}>{index + 1}</span>
          <p className={styles.fittingText}>{item}</p>
        </div>
      ))}
    </div>
  );
};
