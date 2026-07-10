import {gql} from "@apollo/client";

export const CREATE_COURSE = gql`
  mutation CreateCourse($name: String!, $price: Float!, $description: String, $state: String) {
    createCourse(name: $name, price: $price, description: $description, state: $state) {
      course {
        id
      }
    }
  }
`;

export const UPDATE_COURSE = gql`
  mutation UpdateCourse($id: ID!, $name: String, $price: Float, $description: String, $state: String) {
    updateCourse(id: $id, name: $name, price: $price, description: $description, state: $state) {
      course {
        id
      }
    }
  }
`;

export const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id) {
      success
    }
  }
`;

export const ENROLL_IN_COURSE = gql`
  mutation EnrollInCourse($courseId: ID!, $fullName: String!, $paymentMethod: String!, $amount: Float!, $carnet: String) {
    enrollInCourse(courseId: $courseId, fullName: $fullName, paymentMethod: $paymentMethod, amount: $amount, carnet: $carnet) {
      enrollment {
        id
      }
    }
  }
`;
