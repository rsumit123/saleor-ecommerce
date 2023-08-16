import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import "./ProductList.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocalStorage } from "react-use";
import {
  ADD_TO_CART_MUTATION,
  PRODUCT_LIST_QUERY,
  INIT_CHECKOUT_MUTATION,
} from "../../graphql";

function ProductList() {
  const { loading, error, data } = useQuery(PRODUCT_LIST_QUERY);
  const [addToCart] = useMutation(ADD_TO_CART_MUTATION);
  const [initCheckout] = useMutation(INIT_CHECKOUT_MUTATION);
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [token, setToken] = useLocalStorage("token");

  const initializeCheckout = async (userEmail) => {
    try {
      if (token) {
        setCheckoutToken(token);
        return;
      }
      const result = await initCheckout({
        variables: { email: userEmail },
      });
      const checkoutToken = result.data.checkoutCreate.checkout.token;
      setCheckoutToken(checkoutToken);
      setToken(checkoutToken);
      // Storing this token in state and localStorage
    } catch (error) {
      console.error("Error initializing checkout:", error);
    }
  };

  useEffect(() => {
    const userEmail = "rsumit123@gmail.com"; //default checkout email is overridden later
    initializeCheckout(userEmail);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;

  const restoreData = () => {
    // Clear data from localStorage

    localStorage.removeItem("cartTotalAmount");
    localStorage.removeItem("checkoutId");
    localStorage.removeItem("token");
  };

  const handleAddToCart = async (productId, variantId) => {
    // Adding products to saleor cart

    console.log("productId", productId);
    console.log("variantId", variantId);
    try {
      const result = await addToCart({
        variables: {
          checkoutToken: checkoutToken,
          variantId: variantId,
          quantity: 1,
        },
      });
      if (result.data.checkoutLinesAdd.errors.length === 0) {
        console.log("Successfully added to cart", result);
        toast.success("Successfully added to cart");
      } else {
        console.log("Error adding to cart", result);
        restoreData();
        toast.error(
          "Error adding to cart: ",
          result.data.checkoutLinesAdd.errors[0].message
        );
      }
    } catch (error) {
      restoreData();
      console.error("Error adding to cart:", error);
    }
  };

  const openCart = () => {
    window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/cart`;
  };

  return (
    <div>
      <div className="cart-button-container">
        <button className="cart-button" onClick={openCart}>
          Cart
        </button>
      </div>
      <div className="product-list">
        {data.products.edges.map(({ node: product }) => (
          <div className="product-item" key={product.id}>
            <img src={product.thumbnail.url} alt={product.name} />
            <p>{product.name}</p>
            <p>Price: Rs {product.pricing.priceRange.start.net.amount}</p>
            <button
              onClick={() =>
                handleAddToCart(product.id, product.variants[0].id)
              }
            >
              Add to cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
