import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/Button/Button';
import logoIcon from '@/shared/assets/icons/logoIcon.svg';
import logoText from '@/shared/assets/icons/logoText.svg';
import styles from './Header.module.css';
import { useApp } from '@/context/AppContext';

export const Header = () => {
  const { toggleModalAuth } = useApp();
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logo}>
            <img src={logoIcon} alt="Logo" className={styles.logoIcon} />
            <img src={logoText} alt="Logo" className={styles.logoText} />
          </Link>
          <span className={styles.logoDescription}>Онлайн-тренировки для занятий дома</span>
        </div>

        <div className={styles.actions}>
          <Button color="green" onClick={() => toggleModalAuth()} variant="primary" size="sm">
            Войти
          </Button>
        </div>
      </div>
    </header>
  );
};
