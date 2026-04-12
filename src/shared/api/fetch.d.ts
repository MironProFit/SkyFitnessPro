// src/shared/api/fetch.d.ts

// Расширяем глобальный интерфейс RequestInit для добавления кастомных свойств
declare global {
  interface RequestInit {
    skipAuth?: boolean;
    skipErrorToast?: boolean;
    customSuccessMessage?: string;
  }
}

// Экспорт нужен, чтобы файл считался модулем
export {};
