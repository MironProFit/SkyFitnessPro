// App.tsx

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Импорт роутов из конфига
import { ROUTES } from '@/shared/config/routes';

// Страницы
import HomePage from '../pages/home/HomePage';
import CoursePage from '../pages/course/CoursePage';
import ProfilePage from '../pages/profile/ProfilePage';
import LessonPage from '../pages/lesson/LessonPage';
import AuthPage from '../pages/auth/AuthPage';
import { NotFoundPage } from '@/pages/not-found/ui/NotFoundPage';

// Компоненты
import { PrivateRoute } from '@/shared/components/PrivateRoute/PrivateRoute';
import { Header } from '@/widgets/header/Header';
import { GlobalLoader } from '@/shared/components/GlobalLoader/GlobalLoader';

// Контекст
import { useApp } from '@/context/AppContext';

function App() {
  const { isAppLoading, openModalAuth } = useApp();

  // Показываем глобальный лоадер во время инициализации
  if (isAppLoading) {
    return <GlobalLoader />;
  }

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {/* Глобальные уведомления */}
      <Toaster position="top-right" />

      {/* Шапка сайта */}
      <Header />

      {/* Маршруты приложения */}
      <Routes>
        {/* Публичные роуты */}
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.COURSE_DETAIL(':nameEN')} element={<CoursePage />} />

        {/* Защищённые роуты (требуют авторизации) */}
        <Route
          path={ROUTES.PROFILE}
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTES.WORKOUT_DETAIL(':courseId/:lessonId')}
          element={
            <PrivateRoute>
              <LessonPage />
            </PrivateRoute>
          }
        />

        {/* Страница 404 */}
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>

      {/* Модальное окно авторизации */}
      {openModalAuth && <AuthPage />}
    </BrowserRouter>
  );
}

export default App;
