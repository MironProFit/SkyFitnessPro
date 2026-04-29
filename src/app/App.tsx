import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { ROUTES } from '@/shared/config/routes';

import HomePage from '../pages/home/HomePage';
import CoursePage from '../pages/course/CoursePage';
import ProfilePage from '../pages/profile/ProfilePage';
import { WorkoutPage } from '../pages/workout/WorkoutPage';
import AuthPage from '../pages/auth/AuthPage';
import { NotFoundPage } from '@/pages/not-found/ui/NotFoundPage';

import { PrivateRoute } from '@/shared/components/PrivateRoute/PrivateRoute';
import { Header } from '@/widgets/header/Header'; 

function App() {
  return (
    <>
      {/* Глобальные уведомления */}
      <Toaster position="top-center" />

      {/* Шапка сайта */}
      <Header />
      

      {/* Маршруты приложения */}
      <Routes>
        {/* Публичные роуты */}
        <Route path={ROUTES.HOME} element={<HomePage />} />

        {/* Роуты для авторизации */}
        <Route path={ROUTES.LOGIN} element={<AuthPage />} />
        <Route path={ROUTES.REGISTER} element={<AuthPage />} />

        <Route path={ROUTES.COURSE_DETAIL(':nameEN')} element={<CoursePage />} />

        {/* Защищённые роуты */}
        <Route
          path={ROUTES.PROFILE}
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/course/:courseName/workout"
          element={
            <PrivateRoute>
              <WorkoutPage />
            </PrivateRoute>
          }
        />

        {/* Страница 404 */}
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>

      {/* Модальное окно авторизации */}
      <AuthPage />
    </>
  );
}

export default App;
