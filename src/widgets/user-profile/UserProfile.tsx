// src/widgets/user-profile/UserProfile.tsx
import { Button } from '@/shared/components/Button/Button';
import styles from './UserProfile.module.css';
import imgProfile from '@/shared/assets/profile/profile.png';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';

type UserProfileProps = {
  // добавьте пропсы, если нужно
};

export default function UserProfile({}: UserProfileProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Берём имя из email или дефолтное
  const userName = user?.email?.split('@')[0] || 'Пользователь';
  const userEmail = user?.email || '';

  const handleLogout = () => {
    navigate(ROUTES.HOME, { replace: true });
    logout();
  };

  return (
    <>
      <section className={styles.section}>
        <div className={styles.profile}>
          <h1 className={styles.profile_title}>Профиль</h1>
          <div className={styles.profile_container}>
            <div className={styles.profile_box}>
              <img src={imgProfile} alt="" />
              <div className={styles.profile_container__info}>
                <div className={styles.info_name}>{userName}</div>
                <div className={styles.info_login}>Логин: {userEmail}</div>
                <Button color="white" className={styles.info_button} onClick={handleLogout}>
                  Выйти
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
