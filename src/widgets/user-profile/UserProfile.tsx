import { Button } from '@/shared/components/Button/Button';
import styles from './UserProfile.module.css';
import imgProfile from '@/shared/assets/profile/profile.png';

type UserProfileProps = {
  // добавьте пропсы, если нужно
};

export default function UserProfile({} /* пропсы */ : UserProfileProps) {
  return (
    <>
      <section className={styles.section}>
        <div className={styles.profile}>
          <h1 className={styles.profile_title}>Профиль</h1>
          <div className={styles.profile_container}>
            <div className={styles.profile_box}>
              <img src={imgProfile} alt="" />
              <div className={styles.profile_container__info}>
                <div className={styles.info_name}>Мирон</div>
                <div className={styles.info_login}>Логин: mpf@mpf.mpf</div>
                <Button color="white"  className={styles.info_button} >
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
