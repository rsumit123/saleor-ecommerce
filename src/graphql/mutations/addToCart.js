import { gql } from "@apollo/client";

const ADD_TO_CART_MUTATION = gql`
  mutation ProductAddVariantToCart(
    $checkoutToken: UUID!
    $variantId: ID!
    $quantity: Int!
  ) {
    checkoutLinesAdd(
      token: $checkoutToken
      lines: [{ quantity: $quantity, variantId: $variantId }]
    ) {
      checkout {
        id
        lines {
          id
          quantity
          variant {
            name
            product {
              name
              thumbnail {
                url
              }
            }
          }
        }
      }
      errors {
        message
      }
    }
  }
`;

export default ADD_TO_CART_MUTATION;
