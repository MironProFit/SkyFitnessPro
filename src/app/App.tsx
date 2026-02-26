import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/home/ui/HomePage';
import AuthPage from '@/pages/auth/ui/AuthPage';
import CoursePage from '@/pages/course/ui/CoursePage';
import ProfilePage from '@/pages/profile/ui/ProfilePage';
import LessonPage from '@/pages/lesson/ui/LessonPage';

function App() {
  return (
    <BrowserRouter>
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