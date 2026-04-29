import styles from './Logo.module.css';
import logoIcon from '@/shared/assets/icons/logoIcon.svg';
type LogoProps = {
  // добавьте пропсы, если нужно
};

export default function Logo({} /* пропсы */ : LogoProps) {
  return (
    <>
      <img src={logoIcon} alt="Logo" className={styles.logoIcon} />
      <div className={styles.logoText}>SkyFitnessPro</div>
    </>
  );
}
