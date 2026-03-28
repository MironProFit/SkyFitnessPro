import styles from './LoadingAnimation.module.css';
import spritePath from '@/shared/assets/icons/sprite.svg';

export const LoadingAnimation = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.loader__content}>
        <div className={styles.loader__scene}>
          <svg
            className={`${styles.loader__icon} ${styles['loader__icon--dumbbell']}`}
            viewBox="0 0 22 16"
            preserveAspectRatio="xMidYMid meet"
          >
            <use href={`${spritePath}#icon-dumbbell`} />
          </svg>
          <svg
            className={`${styles.loader__icon} ${styles['loader__icon--bike']}`}
            viewBox="0 0 12 20"
            preserveAspectRatio="xMidYMid meet"
          >
            <use href={`${spritePath}#icon-bike`} />
          </svg>
          <svg
            className={`${styles.loader__icon} ${styles['loader__icon--mat']}`}
            viewBox="0 0 21 21"
            preserveAspectRatio="xMidYMid meet"
          >
            <use href={`${spritePath}#icon-mat`} />
          </svg>
          <svg
            className={`${styles.loader__icon} ${styles['loader__icon--scale']}`}
            viewBox="0 0 22 16"
            preserveAspectRatio="xMidYMid meet"
          >
            <use href={`${spritePath}#icon-scale`} />
          </svg>
          <svg
            className={`${styles.loader__icon} ${styles['loader__icon--pulse']}`}
            viewBox="0 0 20 22"
            preserveAspectRatio="xMidYMid meet"
          >
            <use href={`${spritePath}#icon-pulse`} />
          </svg>
        </div>
        <div className={styles.loader__text}>
          <span className={styles.loader__label}>Загрузка </span>
          <span className={styles.loader__dots}></span>
        </div>
      </div>
    </div>
  );
};
