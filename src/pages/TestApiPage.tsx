// src/pages/TestApiPage.tsx
import { useEffect, useState } from 'react';
import { courseApi } from '@/entities/course/api/courseApi';
import type { Course } from '@/entities/course/model/types';

export const TestApiPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        console.log('🔄 Загрузка курсов...');
        const data = await courseApi.getCourses();
        console.log('✅ Курсы получены:', data.length);
        setCourses(data);
      } catch (err: any) {
        console.error('❌ Ошибка загрузки курсов:', err);
        setError(err?.message || 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div>
      <h1>Курсы ({courses.length})</h1>
      <ul>
        {courses.map((course) => (
          <li key={course._id}>
            {course.nameRU} — {course.difficulty}
          </li>
        ))}
      </ul>
    </div>
  );
};
