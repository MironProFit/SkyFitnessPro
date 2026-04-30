import React from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'disabled';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type ButtonsColor = 'green' | 'white';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonsColor;
  isLoading?: boolean;
  isMobileAdaptive?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  color = 'green',
  isMobileAdaptive = false, // По умолчанию false
  className = '',
  ...props
}) => {
  const classNames = [
    styles.btn,
    styles[`btn--${variant}`],
    styles[`btn--${size}`],
    styles[`btn--${color}`],
    isMobileAdaptive ? styles['btn--mobile-adaptive'] : '', // Добавляем класс если проп true
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classNames} disabled={disabled || isLoading} {...props}>
      {isLoading ? 'Загрузка...' : children}
    </button>
  );
};
