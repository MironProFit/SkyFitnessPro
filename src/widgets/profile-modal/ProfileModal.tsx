import { Button } from '@/shared/components/Button/Button';
import styles from './ProfileModal.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useEffect } from 'react';
import { ROUTES } from '@/shared/config/routes';
import { useAuth } from '@/context/AuthContext';

export default function ProfileModal() {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const { openModalProfile, setOpenModalProfile, toggleModalProfile } = useApp();

  const { user, logout } = useAuth();

  useEffect(() => {
    setOpenModalProfile(false);
  }, [pathname, setOpenModalProfile]);

  const userName = user?.email?.split('@')[0] || 'Гость';
  const userEmail = user?.email || '';

  const handleExitProfile = () => {
    logout();

    navigate(ROUTES.HOME, { replace: true });
    toggleModalProfile();
  };

  const goProfilePage = () => {
    navigate(ROUTES.PROFILE, { replace: true });

    toggleModalProfile();
  };

  if (!openModalProfile) return null;

  return (
    <div
      className={`${styles.profileModal} ${openModalProfile ? styles[`profileModal--open`] : ''}`}
    >
      <div className={styles.profileModal__text}>
        <p className={styles.profileModal__name}>{userName}</p>
        <p className={styles.profileModal__email}>{userEmail}</p>
      </div>

      <Button
        onClick={() => goProfilePage()}
        size="lg"
        color="green"
        className={styles.profileModal__button}
      >
        Мой профиль
      </Button>
      <Button
        size="lg"
        onClick={() => handleExitProfile()}
        color="white"
        className={styles.profileModal__buttonlogout}
      >
        Выйти
      </Button>
    </div>
  );
}
