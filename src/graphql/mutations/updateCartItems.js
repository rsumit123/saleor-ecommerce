import { gql } from "@apollo/client";

const UPDATE_CART_ITEMS = gql`
  mutation UpdateCartItemQuantity(
    $checkoutToken: UUID!
    $variantId: ID!
    $quantity: Int!
  ) {
    checkoutLinesUpdate(
      token: $checkoutToken
      lines: [{ variantId: $variantId, quantity: $quantity }]
    ) {
      checkout {
        id
        lines {
          id
          quantity
          variant {
            id
            name
            product {
              name
              thumbnail {
                url
              }
            }
            pricing {
              price {
                net {
                  amount
                  currency
                }
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

export default UPDATE_CART_ITEMS;
