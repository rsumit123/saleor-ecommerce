import { gql } from "@apollo/client";


const CREATE_PAYMENT = gql`
mutation CreatePayment($checkoutId: ID!, $amount: PositiveDecimal!) {
    checkoutPaymentCreate(
      checkoutId: $checkoutId,
      input: { gateway: "saleor.payments.stripe", amount: $amount }
    ) {
      payment {
        id
        chargeStatus
      }
      errors {
        field
        message
      }
    }
  }
`;


export default CREATE_PAYMENT;