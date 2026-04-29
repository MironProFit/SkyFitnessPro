import { Link, useLocation } from 'react-router-dom'; // 🔹 Добавили useLocation
import { Button } from '@/shared/components/Button/Button';
import profileIcon from '@/shared/assets/icons/profile.svg';

import styles from './Header.module.css';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import ProfileModal from '../profile-modal/ProfileModal';
import { ThemeToggle } from '@/shared/components/ThemeToggle/ThemeToggle';
import Logo from '@/shared/components/Logo/Logo';
import clsx from 'clsx';

export const Header = () => {
  const location = useLocation(); // 🔹 Получаем текущий путь
  const { user, isAuthenticated } = useAuth();
  const { toggleModalAuth, openModalProfile, toggleModalProfile } = useApp();

  const userName = user?.email?.split('@')[0] || 'Пользователь';

  // 🔹 Проверяем условия:
  // 1. Главная страница: '/'
  // 2. Страница курса: начинается с '/courses/'
  const isHomeOrCoursePage = location.pathname === '/' || location.pathname.startsWith('/courses/');

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <div className={styles.logo}>
          <Link to="/" className={styles.logo__link}>
            <Logo />
          </Link>

          {/* 🔹 Условный рендеринг */}
          {isHomeOrCoursePage && (
            <span className={styles.logo__tagline}>Онлайн-тренировки для занятий дома</span>
          )}
        </div>

        <div className={styles.buttonsWrap}>
          <ThemeToggle />

          <div className={styles.actions}>
            {isAuthenticated ? (
              <>
                <img
                  className={styles.actions__profile_avatar}
                  src={profileIcon}
                  alt="Icon profile"
                />
                <p className={styles.actions__profile_name}>{userName}</p>

                <div
                  className={clsx(styles.actions__profile_arrow, {
                    [styles['actions__profile-arrow_open']]: openModalProfile,
                  })}
                  onClick={() => toggleModalProfile()}
                  role="button"
                  tabIndex={0}
                >
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L6 6L11 1"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <ProfileModal />
              </>
            ) : (
              <Button color="green" onClick={() => toggleModalAuth()} variant="primary" size="sm">
                Войти
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
