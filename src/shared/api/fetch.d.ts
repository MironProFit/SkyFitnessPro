declare global {
  interface RequestInit {
    skipAuth?: boolean;
    skipErrorToast?: boolean;
    customSuccessMessage?: string;
  }
}

export {};
