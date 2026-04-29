
export const runAxiosTest = async () => {
  console.log('🔍 Запуск теста axios...');

  try {
    const axiosModule = await import('axios');
    const axios = axiosModule.default;

    const payload = JSON.stringify({
      email: 'test@example.com',
      password: 'Test@!123',
    });

    // Создаем конфигурацию с минимальными заголовками
    const config = {
      headers: {} as Record<string, string>,
      transformRequest: [(data: any) => data],
      transformResponse: [(data: any) => {
        try {
          return JSON.parse(data);
        } catch {
          return data;
        }
      }],
    };

    // Явно не устанавливаем никакие заголовки
    // Пустой объект headers не добавит Content-Type

    console.log('Отправка запроса...');
    console.log('Payload:', payload);
    console.log('Headers config:', config.headers);

    const response = await axios.post(
      'https://wedev-api.sky.pro/api/fitness/auth/login',
      payload,
      config
    );

    console.log('✅ SUCCESS:', {
      status: response.status,
      data: response.data,
    });

  } catch (error: any) {
    // Логируем детали ошибки
    console.log('❌ ОШИБКА:', {
      status: error?.response?.status,
      data: error?.response?.data,
      // Важно: преобразуем AxiosHeaders в обычный объект для просмотра
      headersSent: error?.config?.headers 
        ? Object.fromEntries(
            Object.entries(error.config.headers).filter(
              ([, v]) => v !== undefined && v !== null
            )
          )
        : null,
      dataType: typeof error?.config?.data,
      dataSent: error?.config?.data,
    });
  }
};