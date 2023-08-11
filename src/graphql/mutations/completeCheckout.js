import { gql } from "@apollo/client";


const COMPLETE_CHECKOUT = gql`
mutation CompleteCheckout($checkoutId: ID!) {
    checkoutComplete(checkoutId: $checkoutId) {
      order {
        id
        userEmail
        created
      }
      confirmationNeeded
      confirmationData
      errors {
        field
        message
        code
      }
    }
  }
  
`;


export default COMPLETE_CHECKOUT;