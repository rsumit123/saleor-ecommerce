import { gql } from "@apollo/client";


const INIT_CHECKOUT_MUTATION = gql`
  mutation InitCheckout($email: String!) {
    checkoutCreate(
      input: { channel: "indian-channel", email: $email, lines: [] }
    ) {
      checkout {
        token
      }
      errors {
        field
        code
      }
    }
  }
`;


export default INIT_CHECKOUT_MUTATION;