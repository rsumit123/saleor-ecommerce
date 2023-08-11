import { gql } from "@apollo/client";

const PRODUCT_LIST_QUERY = gql`
  query ProductList {
    products(first: 20, channel: "indian-channel") {
      edges {
        node {
          id
          name
          pricing {
            priceRange {
              start {
                net {
                  amount
                }
              }
            }
          }
          thumbnail {
            url
          }
          variants {
            id
          }
        }
      }
    }
  }
`;


export default PRODUCT_LIST_QUERY;