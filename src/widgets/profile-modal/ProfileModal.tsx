import { Button } from '@/shared/components/Button/Button';
import styles from './ProfileModal.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useEffect } from 'react';

export default function ProfileModal() {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const { openModalProfile, setOpenModalProfile, toggleModalProfile } = useApp();

  useEffect(() => {
    setOpenModalProfile(false);
  }, [pathname]);

  const handleExitProfile = () => {
    navigate('/', { replace: true });
    toggleModalProfile();
  };

  return (
    <div
      className={`${styles.profileModal} ${openModalProfile ? styles[`profileModal--open`] : ''}`}
    >
      <div className={styles.profileModal__text}>
        <p className={styles.profileModal__name}>Мирон</p>
        <p className={styles.profileModal__email}>vbhjy@dfgdfg.sdf</p>
      </div>

      <Button
        onClick={() => toggleModalProfile()}
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
