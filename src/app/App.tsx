import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/home/HomePage';
import CoursePage from '../pages/course/CoursePage';
import ProfilePage from '../pages/profile/ProfilePage';
import LessonPage from '../pages/lesson/LessonPage';
import AuthPage from '../pages/auth/AuthPage';
import { PrivateRoute } from '@/shared/components/PrivateRoute/PrivateRoute';
import { Header } from '@/widgets/header/Header';

function App() {


  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Header/>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/course/:nameEN" element={<CoursePage />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/lesson/:courseId/:lessonId"
          element={
            <PrivateRoute>
              <LessonPage />
            </PrivateRoute>
          }
        />
      </Routes>

      <AuthPage/>
    </BrowserRouter>
  );
}

export default App;
