import { gql } from "@apollo/client";


const UPDATE_BILLING_ADDRESS = gql`
mutation SetBillingAddress($checkoutToken: UUID!, $billingAddress: AddressInput!) {
    checkoutBillingAddressUpdate(token: $checkoutToken, billingAddress: $billingAddress) {
      checkout {
        id
        billingAddress {
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


export default UPDATE_BILLING_ADDRESS;