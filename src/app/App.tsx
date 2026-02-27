import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/home/HomePage';
import AuthPage from '../pages/auth/AuthPage';
import CoursePage from '../pages/course/CoursePage';
import ProfilePage from '../pages/profile/ProfilePage';
import LessonPage from '../pages/lesson/LessonPage';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/course/:id" element={<CoursePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/lesson/:courseId/:lessonId" element={<LessonPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
