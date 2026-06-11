import { gql } from '@apollo/client';

export const GET_COURSES = gql`
  query GetCourses($state: String) {
    courses(state: $state) {
      id
      name
      description
      price
      state
      studentsCount
      totalIncome
    }
  }
`;

export const GET_COURSE_ENROLLMENTS = gql`
  query GetCourseEnrollments($courseId: ID) {
    courseEnrollments(courseId: $courseId) {
      id
      fullName
      carnet
      enrolledAt
      payment {
        id
        amount
        paymentMethod
        paymentStatus
      }
    }
  }
`;
