import { gql } from "@apollo/client";


const UPDATE_SHIPPING_ADDRESS = gql`
mutation SetShippingAddress($checkoutToken: UUID!, $shippingAddress: AddressInput!) {
    checkoutShippingAddressUpdate(token: $checkoutToken, shippingAddress: $shippingAddress) {
      checkout {
        id
        shippingAddress {
          firstName
          lastName
          streetAddress1
          postalCode
          countryArea
          
          city
        }
      }
      errors {
        field
        message
      }
    }
  }
`;


export default UPDATE_SHIPPING_ADDRESS;