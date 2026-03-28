import stepairobicImg from '@/shared/assets/courses/stepairobic_cr.webp';
import yogaImg from '@/shared/assets/courses/yoga_cr.webp';
import stretchingImg from '@/shared/assets/courses/stretching_cr.webp';
import bodyflexImg from '@/shared/assets/courses/bodyflex_cr.webp';
import fitnessImg from '@/shared/assets/courses/fitness_cr.webp';

export const courseColorMap: Record<string, string> = {
  Yoga: '#FFC700',
  Stretching: '#2491D2',
  Fitness: '#F7A012',
  StepAirobic: '#FF7E65',
  BodyFlex: '#7D458C',
};

export const getCourseColor = (nameEN: string): string => {
  return courseColorMap[nameEN] || '#CCCCCC';
};

export const courseImages: Record<string, string> = {
  stepairobic: stepairobicImg,
  yoga: yogaImg,
  stretching: stretchingImg,
  bodyflex: bodyflexImg,
  fitness: fitnessImg,
};


