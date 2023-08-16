import React from "react";

import { useQuery } from "@apollo/client";
import { useLocalStorage } from "react-use";
import GET_CART_ITEMS from "../../graphql/queries/getCartItems";
import { useMutation } from "@apollo/client";

import UPDATE_CART_QUANTITY from "../../graphql/mutations/updateCartItems";

import { toast } from "react-toastify";

import "./CartPage.css";
import { Link } from "react-router-dom";

function CartPage() {
  const [token] = useLocalStorage("token");

  const [updateQuantity] = useMutation(UPDATE_CART_QUANTITY, {
    //When the cache data changes (thanks to refetchQueries), the useQuery hook's internal state updates, which triggers a re-render of this component with the new data.
    refetchQueries: [
      {
        query: GET_CART_ITEMS,
        variables: { token: token },
      },
    ],
  });

  const { loading, error, data } = useQuery(GET_CART_ITEMS, {
    variables: { token: token },
  });

  const handleQuantityChange = async (variantId, currentQuantity, increment) => {
    console.log("Increment quantity of variantId: ", variantId);
    try {
      const newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;
      const { data, errors } = await updateQuantity({
        variables: {
          checkoutToken: token, // using token from above
          variantId: variantId,
          quantity: newQuantity, // incrementing or decrementing the current quantity by 1
        },
      });

      if (errors && errors.length) {
        console.error("Failed to update cart item quantity:", errors);
        toast.error("Failed to update cart item quantity");
      } else {
        console.log("Quantity updated successfully:", data);
        toast.success("Cart Updated.");
      }
    } catch (error) {
      console.error("Error executing mutation:", error);
      toast.error("Failed to update cart item quantity");
    }
  };

 
  if (loading) return <p>Loading Cart...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Calculate total cart price
  const totalAmount = data.checkout.lines.reduce(
    (total, line) =>
      total + line.quantity * line.variant.pricing.price.net.amount,
    0
  );

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
                  line.variant.product.thumbnail?.url ||
                  "https://i.imgur.com/krctF5J.png"
                }
                alt={line.variant.product.name}
              />
              <span>{line.variant.product.name}</span>
              <span>Quantity: {line.quantity}</span>
              <div className="quantity-control">
                <button
                  onClick={() =>
                    handleQuantityChange(line.variant.id, line.quantity, false)
                  }
                >
                  -
                </button>
                <span>Quantity: {line.quantity}</span>
                <button
                  onClick={() =>
                    handleQuantityChange(line.variant.id, line.quantity, true)
                  }
                >
                  +
                </button>
              </div>
              {console.log(
                typeof line.variant.pricing.price.net.amount,
                typeof line.quantity,
                line.variant,
                line.quantity
              )}
              <span>
                Price:{" "}
                {Number(line.variant.pricing.price.net.amount) *
                  Number(line.quantity)}
                {line.variant.pricing.price.net.currency}
              </span>
            </li>
          ))}
        </ul>
        <div className="total-price">
          Total: {totalAmount} {currency}
        </div>
        <Link to="/checkout">
          <button className="checkout-button" disabled={totalAmount < 50}>Checkout</button>
        </Link>
      </div>
    </div>
  );
}

export default CartPage;
