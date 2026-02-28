import { useParams } from 'react-router-dom';
import { CourseDetail } from '@/widgets/course-detail/CourseDetail';
import { Header } from '@/widgets/header/Header';
import { coursesData } from '@/widgets/course-list/CourseList';

const CoursePage = () => {
  const { nameEN} = useParams<{ nameEN: string }>();


  console.log(nameEN);

  const course = coursesData.find((c) => c.nameEN
   === nameEN);

  if (!course) {
    return <div>Курс не найден</div>;
  }

  return (
    <>
      <Header />
      <CourseDetail course={course} />
    </>
  );
};

export default CoursePage;
