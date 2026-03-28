import { CourseList } from '@/widgets/course-card/course-list/CourseList';
import UserProfile from '@/widgets/user-profile/UserProfile';

export default function ProfilePage() {
  return (
    <>
      <UserProfile />
      <CourseList />
    </>
  );
}
