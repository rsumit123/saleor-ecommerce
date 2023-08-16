import { gql } from "@apollo/client";

const GET_CART_ITEMS = gql`
query Get_Cart_Items($token: UUID!) {
  checkout(token: $token) {
    lines {
      variant {
        id
        product {
          thumbnail {
            url
          }
          name
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
      quantity
    }
  }
}

`;


export default GET_CART_ITEMS;