import { gql } from "@apollo/client";

const UPDATE_EMAIL = gql`
  mutation UpdateCheckoutEmail($checkoutId: ID!, $email: String!) {
    checkoutEmailUpdate(checkoutId: $checkoutId, email: $email) {
      checkout {
        id
        email
      }
      errors {
        field
        message
      }
    }
  }
`;

export default UPDATE_EMAIL;
