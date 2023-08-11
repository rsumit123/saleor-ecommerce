import { gql } from "@apollo/client";


const CHECKOUT_PAYMENT_CREATE = gql`mutation CreatePayment($checkoutId: ID!, $paymentInput: PaymentInput!) {
    checkoutPaymentCreate(checkoutId: $checkoutId, input: $paymentInput) {
      payment {
        id
        gateway
        creditCard {
          brand
          firstDigits
          lastDigits
          expMonth
          expYear
        }
      }
      errors {
        field
        message
      }
    }
  }
  `

export default CHECKOUT_PAYMENT_CREATE;
  