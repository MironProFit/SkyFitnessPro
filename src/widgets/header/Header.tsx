import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/Button/Button';
import logoIcon from '@/shared/assets/icons/logoIcon.svg';
import logoText from '@/shared/assets/icons/logoText.svg';
import profileIcon from '@/shared/assets/icons/profile.svg';
import rectangle from '@/shared/assets/icons/rectangle.svg';

import styles from './Header.module.css';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import ProfileModal from '../profile-modal/ProfileModal';

export const Header = () => {
  const { isAuthenticated } = useAuth();
  const { toggleModalAuth, openModalProfile, toggleModalProfile } = useApp();

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <div className={styles.logo}>
          <Link to="/" className={styles.logo__link}>
            <img src={logoIcon} alt="Logo" className={styles.logo__icon} />
            <img src={logoText} alt="Logo" className={styles.logo__text} />
          </Link>
          <span className={styles.logo__tagline}>Онлайн-тренировки для занятий дома</span>
        </div>

        <div className={styles.actions}>
          {isAuthenticated ? (
            <>
              <img
                className={styles.actions__profile_avatar}
                src={profileIcon}
                alt="Icon profile"
              />
              <p className={styles.actions__profile_name}>Мирон</p>
              <img
                className={`${styles.actions__profile_arrow} ${
                  openModalProfile ? styles[`actions__profile-arrow_open`] : ''
                }`}
                onClick={() => toggleModalProfile()}
                src={rectangle}
                alt="rectangle"
              />

              {/* {openModalProfile && <div className={styles.overlay} onClick={toggleModalProfile} />} */}

              <ProfileModal
                
              />
            </>
          ) : (
            <Button color="green" onClick={() => toggleModalAuth()} variant="primary" size="sm">
              Войти
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
