import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';
import { ROUTES } from '@/shared/config/routes';

export const NotFoundPage = () => {
  return (
    <section className={styles.section}>
      <div className={styles.notFoundContainer}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>Страница не найдена</h1>
        <Link to={ROUTES.HOME} className={styles.primaryButton}>
          На главную
        </Link>
      </div>
    </section>
  );
};
