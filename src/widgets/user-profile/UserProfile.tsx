import { useState } from 'react';
import { Button } from '@/shared/components/Button/Button';
import styles from './UserProfile.module.css';
import imgProfile from '@/shared/assets/profile/profile.png';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { ROUTES } from '@/shared/config/routes';
import { userApi } from '@/entities/user/api/userApi';
import toast from 'react-hot-toast';
import type { User } from '@/shared/api/types';
// Импортируем UserResponse, так как API возвращает { user: UserData }

export default function UserProfile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isResetting, setIsResetting] = useState(false);

  // Загружаем данные пользователя
  const { data: userData, isLoading } = useQuery<User>({
    queryKey: ['user'],
    queryFn: () => userApi.getMe(),
    staleTime: 1000 * 60 * 5,
  });

  const userObj = userData?.user;

  // Формируем имя: берем часть до @, делаем первую букву заглавной
  const userName = userObj?.email
    ? userObj.email.split('@')[0].charAt(0).toUpperCase() + userObj.email.split('@')[0].slice(1)
    : 'Пользователь';

  const userEmail = userObj?.email || '';
  const selectedCourses = userObj?.selectedCourses || [];

  const handleLogout = () => {
    navigate(ROUTES.HOME, { replace: true });
    logout();
  };

  const handleResetAllCourses = async () => {
    if (selectedCourses.length === 0) {
      toast('У вас нет выбранных курсов');
      return;
    }

    if (
      !window.confirm(
        'Вы уверены, что хотите удалить ВСЕ курсы из вашего профиля? Прогресс также будет потерян.'
      )
    ) {
      return;
    }

    setIsResetting(true);
    try {
      const deletePromises = selectedCourses.map((courseId: string) =>
        userApi.removeCourse(courseId)
      );
      await Promise.all(deletePromises);
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Все курсы успешно удалены');
    } catch (error) {
      console.error('Ошибка при удалении курсов:', error);
      toast.error('Не удалось удалить некоторые курсы');
    } finally {
      setIsResetting(false);
    }
  };

  if (isLoading) {
    return <div className={styles.section}>Загрузка профиля...</div>;
  }

  return (
    <section className={styles.section}>
      <div className={styles.profile}>
        <h1 className={styles.profile_title}>Профиль</h1>
        <div className={styles.profile_container}>
          <div className={styles.profile_box}>
            <img src={imgProfile} alt="Profile" />
            <div className={styles.profile_container__info}>
              <div className={styles.info_name}>{userName}</div>
              <div className={styles.info_login}>Логин: {userEmail}</div>

              <div className={styles.buttonsWrapper}>
                <Button color="white" size="xl" onClick={handleLogout}>
                  Выйти
                </Button>

                {selectedCourses.length > 0 && (
                  <Button
                    size="xl"
                    className={styles.resetBtn}
                    onClick={handleResetAllCourses}
                    disabled={isResetting}
                  >
                    {isResetting ? 'Удаление...' : 'Сбросить все курсы'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
