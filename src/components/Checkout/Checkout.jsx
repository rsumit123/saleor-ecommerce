import React, { useState } from "react";
import "./Checkout.css";

import { useMutation } from "@apollo/client";
import { useLocalStorage } from "react-use";

import StripeModal from "../StripeModal/StripeModal";

import UPDATE_SHIPPING_ADDRESS from "../../graphql/mutations/updateShippingAddress";
import UPDATE_BILLING_ADDRESS from "../../graphql/mutations/updateBillingAddress";
import SET_DELIVERY_METHOD from "../../graphql/mutations/setDeliveryMethod";
import CREATE_PAYMENT from "../../graphql/mutations/createPayment";
import UPDATE_EMAIL from "../../graphql/mutations/updateEmail";
import COMPLETE_CHECKOUT from "../../graphql/mutations/completeCheckout";

import { toast } from "react-toastify";

function Checkout() {
  const [formData, setFormData] = useState({
    email: "",
    line1: "",
    line2: "",
    country: "IN",
    postalCode: 831015,
    city: "",
    countryArea: "",
    firstName: "",
    lastName: "",
  });

  const [paymentClientSecret, setPaymentClientSecret] = useState(null);

  const [token] = useLocalStorage("token");
  const [checkoutId, setCheckoutId] = useLocalStorage("checkoutId");
  //   const [cartTotal] = useLocalStorage("cartTotalAmount");
  const cartTotal = localStorage.getItem("cartTotalAmount");

  const totalAmount = parseFloat(cartTotal) + 50; // Add shipping cost

  const [updateShippingAddress] = useMutation(UPDATE_SHIPPING_ADDRESS);
  const [setDeliveryMethod] = useMutation(SET_DELIVERY_METHOD);
  const [createPayment] = useMutation(CREATE_PAYMENT);
  const [updateBillingAddress] = useMutation(UPDATE_BILLING_ADDRESS);
  const [completeCheckout] = useMutation(COMPLETE_CHECKOUT);
  const [updateEmail] = useMutation(UPDATE_EMAIL);

  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setModalOpen] = useState(false);

  const stripeOptions = {
    // passing the client secret obtained
    clientSecret: paymentClientSecret,

    // Fully customizable with appearance API.
    appearance: {
      /*...*/
    },
  };

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckoutClick = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("formData", formData);

    try {
      setIsLoading(true);

      // 1. Call updateShippingAddress mutation
      const addressResponse = await updateShippingAddress({
        variables: {
          checkoutToken: token,
          // Use formData for the required variables
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            streetAddress1: formData.line1,
            streetAddress2: formData.line2,
            city: formData.city,
            postalCode: parseInt(formData.postalCode),
            country: formData.country,
            countryArea: formData.countryArea,
          },
        },
      });

      console.log("Address response -> ", addressResponse);

      if (
        addressResponse.data.checkoutShippingAddressUpdate.errors.length > 0
      ) {
        setIsLoading(false);
        toast.error("Error while updating shipping address");
        return;
      }

      // Extract the checkout id from the response
      const checkoutId =
        addressResponse.data.checkoutShippingAddressUpdate.checkout.id;

      setCheckoutId(checkoutId);

      // 2. Call updateBillingAddress mutation

      const billingAddressResponse = await updateBillingAddress({
        variables: {
          checkoutToken: token,
          // Use formData for the required variables
          billingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            streetAddress1: formData.line1,
            streetAddress2: formData.line2,
            city: formData.city,
            postalCode: parseInt(formData.postalCode),
            country: formData.country,
            countryArea: formData.countryArea,
          },
        },
      });

      console.log("Address response -> ", billingAddressResponse);

      if (
        billingAddressResponse.data.checkoutBillingAddressUpdate.errors.length >
        0
      ) {
        setIsLoading(false);
        toast.error("Error while updating billing address");
        return;
      }

      //3. Update email
      const emailResponse = await updateEmail({
        variables: { checkoutId: checkoutId, email: formData.email },
      });

      if (emailResponse.data.checkoutEmailUpdate.errors.length > 0) {
        toast.error("Error while updating the Email");
        return;
      }

      // 4. Call setDeliveryMethod mutation
      const deliveryMethodResponse = await setDeliveryMethod({
        variables: {
          checkoutToken: token,
          deliveryMethodId: import.meta.env.VITE_DELIVERY_METHOD_ID,
        },
      });

      if (
        deliveryMethodResponse.data.checkoutDeliveryMethodUpdate.errors.length >
        0
      ) {
        setIsLoading(false);
        toast.error("Error while updating delivery method");
        return;
      }

      console.log("Delivery method response -> ", deliveryMethodResponse);

      // 5. Call createPayment mutation
      const paymentResponse = await createPayment({
        variables: {
          checkoutId: checkoutId,
          amount: totalAmount,
        },
      });

      if (paymentResponse.data.checkoutPaymentCreate.errors.length > 0) {
        setIsLoading(false);
        toast.error("Error while creating payment");
        return;
      }

      console.log("Create Payment response -> ", paymentResponse);

      // Check paymentResponse for success and redirect or show error as necessary

      // 6. Call completeCheckout mutation

      const completeCheckoutResponse = await completeCheckout({
        variables: {
          checkoutId: checkoutId,
        },
      });

      if (completeCheckoutResponse.data.checkoutComplete.errors.length > 0) {
        toast.error("Error while completing checkout");
        return;
      }

      console.log("Complete checkout response -> ", completeCheckoutResponse);

      const generatedPaymentJson =
        completeCheckoutResponse.data.checkoutComplete.confirmationData;
      const confirmationData = JSON.parse(generatedPaymentJson);

      setPaymentClientSecret(confirmationData.client_secret);

      console.log("Create Payment response -> ", confirmationData);

      // 7. Call Stripe modal

      handleCheckoutClick();
      setIsLoading(false);
    } catch (error) {
      console.error("Error during checkout process:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout-form-container">
      <form className="checkout-form" onSubmit={handleSubmit}>
        <h3>Personal Information</h3>
        <input
          type="text"
          name="firstName"
          required
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          required
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <h3>Shipping Address</h3>
        <input
          type="text"
          name="line1"
          required
          placeholder="Shipping Address Line 1"
          value={formData.line1}
          onChange={handleChange}
        />
        <input
          type="text"
          name="line2"
          required
          placeholder="Shipping Address Line 2"
          value={formData.line2}
          onChange={handleChange}
        />

        <input
          type="text"
          name="city"
          required
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
        />
        <input
          type="text"
          name="country"
          required
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          readOnly
        />
        <input
          type="text"
          name="postalCode"
          required
          placeholder="Postal code"
          value={formData.postalCode}
          onChange={handleChange}
        />
        <select
          name="countryArea"
          value={formData.countryArea}
          onChange={handleChange}
        >
          {indianStates.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : `Pay ${totalAmount} INR`}
        </button>
      </form>
      {isModalOpen && (
        <StripeModal onClose={closeModal} options={stripeOptions} />
      )}
    </div>
  );
}

export default Checkout;
