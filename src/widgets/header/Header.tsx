import { Link } from 'react-router-dom';

import styles from './Header.module.css';
import { Button } from '../../shared/components/Button/Button';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          🏋️‍♂️ SkyFitnessPro
        </Link>

        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>
            Главная
          </Link>
          <Link to="/courses" className={styles.navLink}>
            Курсы
          </Link>
        </nav>

        <div className={styles.actions}>
          <Link to="/auth">
            <Button variant="black" size="sm">
              Войти
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
