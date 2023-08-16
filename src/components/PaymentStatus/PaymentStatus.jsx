import React, { useState, useEffect } from "react";
// import { useStripe } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import COMPLETE_CHECKOUT from "../../graphql/mutations/completeCheckout";
import { useMutation } from "@apollo/client";
import { useLocalStorage } from "react-use";

import "./PaymentStatus.css";

const PaymentStatus = () => {
  //   const stripe = useStripe();
  const [message, setMessage] = useState(null);
  const [order, setOrder] = useState({});

  const [completeCheckout] = useMutation(COMPLETE_CHECKOUT);

  const [checkoutId] = useLocalStorage("checkoutId");

  const price = localStorage.getItem("cartTotalAmount");

  const returnToHome = () => {
    localStorage.removeItem("cartTotalAmount");
    localStorage.removeItem("checkoutId");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const tryRetrievePaymentIntent = (clientSecret, retries = 3) => {
    if (window.Stripe) {
      window
        .Stripe(import.meta.env.VITE_STRIPE_PUB_KEY)
        .retrievePaymentIntent(clientSecret)
        .then(({ paymentIntent }) => {
          switch (paymentIntent.status) {
            case "succeeded":
              setMessage("Success! Payment received.");
              break;

            case "processing":
              setMessage(
                "Payment processing. We'll update you when payment is received."
              );
              break;

            case "requires_payment_method":
              // Redirect your user back to your payment page to attempt collecting
              // payment again
              setMessage("Payment failed. Please try another payment method.");
              break;

            default:
              setMessage("Something went wrong.");
              break;
          }
        });
    } else if (retries > 0) {
      setTimeout(
        () => tryRetrievePaymentIntent(clientSecret, retries - 1),
        1000
      );
    } else {
      console.error("Failed to load Stripe after multiple attempts");
    }
  };

  useEffect(() => {
    // if (!stripe) {
    //   return;
    // }

    const fetchOrderDetails = async () => {
      const completeCheckoutResponse = await completeCheckout({
        variables: {
          checkoutId: checkoutId,
        },
      });

      if (completeCheckoutResponse.data.checkoutComplete.errors.length > 0) {
        toast.error("Error while completing checkout");
        return;
      } else {
        setOrder(completeCheckoutResponse.data.checkoutComplete.order);
      }
    };

    fetchOrderDetails();

    // Retrieve the "payment_intent_client_secret" query parameter appended to
    // your return_url by Stripe.js
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );
    tryRetrievePaymentIntent(clientSecret);
  }, []);

  return (
    <div className="payment-status-container">
      <p className="payment-status-message">{message}</p>
      {/* render order details */}
      <div className="order-details">
        <h2 className="order-details-title">Order Details</h2>
        {/* For each order item: */}

        <div className="order-item" key={order.id}>
          <div className="order-item-header">
            <span>
              <label>ID: </label>
              {order.id}
            </span>
            <span>
              <label>Date: </label>
              {order.created}
            </span>
            <span>
              <label>User Email: </label>
              {order.userEmail}
            </span>
          </div>
          <div className="total-price">Order Amount: {price} INR</div>
          <div className="total-price">Shipping Fee: 50 INR</div>
        </div>
      </div>
      <button className="return-home-btn" onClick={returnToHome}>
        Return To Home
      </button>
    </div>
  );
};

export default PaymentStatus;
