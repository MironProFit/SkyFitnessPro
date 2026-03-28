// utils/toasts.ts ← создайте этот файл
import toast from 'react-hot-toast';

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
    style: {
      background: '#10b981',
      color: '#fff',
      fontWeight: '500',
      border: '2px solid #059669',
      borderRadius: '12px',
    },
    icon: '✅',
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 5000,
    style: {
      background: '#fee2e2',
      color: '#991b1b',
      borderLeft: '4px solid #ef4444',
      borderRadius: '12px',
    },
    icon: '🔥',
  });
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message, {
    style: {
      background: '#fff',
      color: '#1f2937',
      border: '1px solid #e5e7eb',
    },
  });
};
