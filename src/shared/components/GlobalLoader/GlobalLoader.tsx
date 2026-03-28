import styles from './GlobalLoader.module.css';

export const GlobalLoader = () => {
  return (
    <div className={styles.globalLoader}>
      <div className={styles.spinner}></div>
      <p className={styles.text}>Загрузка приложения...</p>
    </div>
  );
};