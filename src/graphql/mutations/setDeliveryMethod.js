import { gql } from "@apollo/client";


const SET_DELIVERY_METHOD = gql`
mutation SetDeliveryMethod($checkoutToken: UUID!, $deliveryMethodId: ID!) {
    checkoutDeliveryMethodUpdate(token: $checkoutToken, deliveryMethodId: $deliveryMethodId) {
      checkout {
        id
        shippingMethod {
          name
          price {
            amount
          }
        }
      }
      errors {
        field
        message
      }
    }
  }
`;


export default SET_DELIVERY_METHOD;