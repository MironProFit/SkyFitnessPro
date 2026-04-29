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
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  color = 'green',
  className = '',
  ...props
}) => {
  const classNames = [
    styles.btn,
    styles[`btn--${variant}`],
    styles[`btn--${size}`],
    styles[`btn--${color}`],
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
