import logoIcon from '@/shared/assets/icons/logoIcon.svg';
import logoText from '@/shared/assets/icons/logoText.svg';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

// ✅ ВАЖНО: Импортируем стили из той же папки, где лежит этот файл
import styles from './AuthModal.module.css';
import { useApp } from '@/context/AppContext';

export const AuthModal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { openModalAuth: isOpen, toggleModalAuth } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { login, register, isLoading } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      alert('Пароли не совпадают!');
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email.split('@')[0], email, password);
      }
      toggleModalAuth();
    } catch (error) {
      alert('Ошибка авторизации');
    }
  };

  return (
    <div className={styles.overlay} onClick={() => toggleModalAuth()}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <Link to="/" className={styles.logo}>
          <img src={logoIcon} alt="Logo" className={styles.logoIcon} />
          <img src={logoText} alt="Logo" className={styles.logoText} />
        </Link>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder={isLogin ? 'Логин' : 'Эл. почта'}
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Пароль"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="Повторите пароль"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <button
          className={styles.secondaryButton}
          onClick={() => setIsLogin(!isLogin)}
          type="button"
        >
          {isLogin ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </div>
    </div>
  );
};
