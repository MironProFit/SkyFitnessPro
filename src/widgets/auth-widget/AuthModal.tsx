// src/widgets/auth-widget/AuthModal.tsx
import logoIcon from '@/shared/assets/icons/logoIcon.svg';
import logoText from '@/shared/assets/icons/logoText.svg';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom'; //  Добавили useNavigate
import toast from 'react-hot-toast';

import styles from './AuthModal.module.css';
import { useApp } from '@/context/AppContext';
import { ROUTES } from '@/shared/config/routes'; //  Импортируем ROUTES

const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (password.length < 6) {
    return { valid: false, error: 'Минимум 6 символов' };
  }
  const specialChars = (password.match(/[^a-zA-Z0-9]/g) || []).length;
  if (specialChars < 2) {
    return { valid: false, error: 'Минимум 2 спецсимвола' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Минимум 1 заглавная буква' };
  }
  return { valid: true };
};

const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const AuthModal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { openModalAuth: isOpen, toggleModalAuth } = useApp();
  const navigate = useNavigate(); //  Создаём навигатор

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const { login, register, isAuthenticating } = useAuth();

  useEffect(() => {
    setLocalError('');
  }, [isLogin]);

  const isFormValid = () => {
    if (!email || !password) return false;
    if (!validateEmail(email)) return false;

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) return false;

    if (!isLogin && password !== confirmPassword) return false;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!isFormValid()) return;

    try {
      if (isLogin) {
        await login(email, password);
        toggleModalAuth(); // Закрываем модалку
        navigate(ROUTES.HOME, { replace: true }); //  Переходим на главную
      } else {
        await register(email, password);
        toggleModalAuth(); // Закрываем модалку
        navigate(ROUTES.HOME, { replace: true }); //  Переходим на главную
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Произошла ошибка';
      setLocalError(message);
      toast.error(message);
    }
  };

  const passwordStatus = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    special: (password.match(/[^a-zA-Z0-9]/g) || []).length >= 2,
  };
  const allPasswordCriteriaMet =
    passwordStatus.length && passwordStatus.uppercase && passwordStatus.special;

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={toggleModalAuth}>
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
            onChange={(e) => {
              setEmail(e.target.value);
              if (localError) setLocalError('');
            }}
            required
            disabled={isAuthenticating}
          />

          <input
            type="password"
            placeholder="Пароль"
            className={styles.input}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (localError) setLocalError('');
            }}
            required
            disabled={isAuthenticating}
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="Повторите пароль"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (localError) setLocalError('');
              }}
              required
              disabled={isAuthenticating}
            />
          )}

          {!isLogin && password && !allPasswordCriteriaMet && (
            <div className={styles.passwordHints}>
              <span className={passwordStatus.length ? styles.valid : styles.invalid}>
                {passwordStatus.length ? '✓' : '○'} 6+ символов
              </span>
              <span className={passwordStatus.uppercase ? styles.valid : styles.invalid}>
                {passwordStatus.uppercase ? '✓' : '○'} Заглавная буква
              </span>
              <span className={passwordStatus.special ? styles.valid : styles.invalid}>
                {passwordStatus.special ? '✓' : '○'} 2 спецсимвола
              </span>
            </div>
          )}

          {localError && <div className={styles.error}>{localError}</div>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isAuthenticating || !isFormValid()}
          >
            {isAuthenticating ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <button
          className={styles.secondaryButton}
          onClick={() => setIsLogin(!isLogin)}
          type="button"
          disabled={isAuthenticating}
        >
          {isLogin ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </div>
    </div>
  );
};
