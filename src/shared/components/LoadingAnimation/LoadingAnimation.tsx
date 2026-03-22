import styles from './LoadingAnimation.module.css';
import spritePath from '@/shared/assets/icons/sprite.svg';

export const LoadingAnimation = () => {
  return (
    // <div className={styles.}></div>
    <div className={styles.container}>
      <div className={styles.scene}>
        {/* 1. Гантель */}
        <svg
          className={`${styles.icon} ${styles.iconDumbbell}`}
          viewBox="0 0 22 16"
          preserveAspectRatio="xMidYMid meet"
        >
          <use href={`${spritePath}#icon-dumbbell`} />
        </svg>

        {/* 2. Велосипед */}
        <svg
          className={`${styles.icon} ${styles.iconBike}`}
          viewBox="0 0 12 20"
          preserveAspectRatio="xMidYMid meet"
        >
          <use href={`${spritePath}#icon-bike`} />
        </svg>

        {/* 3. Коврик */}
        <svg
          className={`${styles.icon} ${styles.iconMat}`}
          viewBox="0 0 21 21"
          preserveAspectRatio="xMidYMid meet"
        >
          <use href={`${spritePath}#icon-mat`} />
        </svg>

        {/* 4. Весы */}
        <svg
          className={`${styles.icon} ${styles.iconScale}`}
          viewBox="0 0 22 16"
          preserveAspectRatio="xMidYMid meet"
        >
          <use href={`${spritePath}#icon-scale`} />
        </svg>

        {/* 5. Пульс */}
        <svg
          className={`${styles.icon} ${styles.iconPulse}`}
          viewBox="0 0 20 22"
          preserveAspectRatio="xMidYMid meet"
        >
          <use href={`${spritePath}#icon-pulse`} />
        </svg>
      </div>

      <div className={styles.textContainer}>
        <span className={styles.loadingText}>Загрузка </span>
        <span className={styles.dots}></span>
      </div>
    </div>
  );
};
