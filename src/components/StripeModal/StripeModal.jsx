import React from "react";
import {
  Elements,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "./StripeModal.css";
import { PaymentElement } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUB_KEY);

function StripeModal({ onClose, options }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm onClose={onClose} />
        </Elements>
      </div>
    </div>
  );
}

function CheckoutForm({ onClose }) {
  const stripe = useStripe();
  const elements = useElements();

  // Add your mutation to handle the payment in Saleor

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url:  `${import.meta.env.VITE_FRONTEND_URL}/payment-status`,
      },
    });

    if (!error) {
      // Use paymentMethod.id to handle payment in Saleor
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <div className="card-buttons">
      <button onClick={onClose} type="button" className="close-button">
        Close
      </button>
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
      </div>
    </form>
  );
}

export default StripeModal;
