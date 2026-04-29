
export const debug = {
  //Логирование запроса
  request: (label: string, url: string, options: RequestInit) => {
    console.group(`>>> ${label}`);
    console.log('URL:', url);
    console.log('Method:', options.method);
    console.log('Headers:', options.headers);
    console.log('Body:', options.body);
    console.groupEnd();
  },

  //Логирование ответа
  response: (label: string, url: string, status: number, data: unknown) => {
    console.group(`<<< ${label}`);
    console.log('URL:', url);
    console.log('Status:', status);
    console.log('Data:', data);
    console.groupEnd();
  },

  //Логирование ошибки
  error: (label: string, url: string, error: unknown) => {
    console.group(`❌ ${label}`);
    console.log('URL:', url);
    console.log('Error:', error);
    console.groupEnd();
  },

  //Логирование состояния токена
  token: (action: string, token: string | null) => {
    console.log(`🔐 Token ${action}:`, token ? `${token.slice(0, 20)}...` : 'null');
  },

  //Логирование состояния хранилища
  storage: () => {
    console.log('🗄️ localStorage:', {
      token: localStorage.getItem('token') ? '***' : null,
      refresh_token: localStorage.getItem('refresh_token') ? '***' : null,
      user_email: localStorage.getItem('user_email'),
    });
  },
};
