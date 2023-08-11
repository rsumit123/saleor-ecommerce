import React, { useEffect, useState } from "react";

import { useQuery, gql, useMutation } from "@apollo/client";
import { useLocalStorage } from "react-use";
import GET_CART_ITEMS from "../../graphql/queries/getCartItems";

import "./CartPage.css";
import StripeModal from "../StripeModal/StripeModal";
import { Link } from "react-router-dom";

function CartPage() {
  const [token] = useLocalStorage("token");
  

  // const [cartTotal, setCartTotal] = useLocalStorage("cartTotalAmount");

  

  const { loading, error, data } = useQuery(GET_CART_ITEMS, {
    variables: { token: token },
  });

  // const [isModalOpen, setModalOpen] = useState(false);

  if (loading) return <p>Loading Cart...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Calculate total cart price
  const totalAmount = data.checkout.lines.reduce(
    (total, line) =>
      total + line.quantity * line.variant.pricing.price.net.amount,
    0
  );
  // setCartTotal(totalAmount);

  localStorage.setItem("cartTotalAmount", totalAmount);
  const currency = data.checkout.lines[0]?.variant.pricing.price.net.currency;

  

  return (
    <div className="center-content">
      <div className="cart-container">
        <h2>Your Cart</h2>
        <ul>
          {data.checkout.lines.map((line, index) => (
            <li className="cart-item" key={index}>
              <img
                src={
                  line.variant.product.thumbnail?.url || "default_image_url.jpg"
                }
                alt={line.variant.product.name}
              />
              <span>{line.variant.product.name}</span>
              <span>Quantity: {line.quantity}</span>
              <span>
                Price: {line.variant.pricing.price.net.amount}{" "}
                {line.variant.pricing.price.net.currency}
              </span>
            </li>
          ))}
        </ul>
        <div className="total-price">
          Total: {totalAmount} {currency}
        </div>
        <Link to="/checkout">
          <button className="checkout-button">Checkout</button>
        </Link>
        {/* <button onClick={handleCheckoutClick}>Checkout</button> */}
      </div>
    </div>
  );
}

export default CartPage;
