import styles from './Logo.module.css';
import logoIcon from '@/shared/assets/icons/logoIcon.svg';

export default function Logo({}) {
  return (
    <>
      <img src={logoIcon} alt="Logo" className={styles.logoIcon} />
      <div className={styles.logoText}>SkyFitnessPro</div>
    </>
  );
}
