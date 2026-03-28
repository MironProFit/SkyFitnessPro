import { courseApi } from '@/shared/api/endpoints/courseApi';
import { useQuery } from '@tanstack/react-query';
import { useParams, Navigate } from 'react-router-dom';
import { LoadingAnimation } from '@/shared/components/LoadingAnimation/LoadingAnimation';
import { CourseDetail } from '@/widgets/course-card/course-list/course-detail/CourseDetail';

const CoursePage = () => {
  const { nameEN } = useParams<{ nameEN: string }>();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseApi.getAll(),
    staleTime: 1000 * 60 * 5,
  });

  const course = courses.find((c) => c.nameEN === nameEN);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (!course) {
    return <Navigate to="/404" replace />;
  }

  return <CourseDetail course={course} />;
};

export default CoursePage;
