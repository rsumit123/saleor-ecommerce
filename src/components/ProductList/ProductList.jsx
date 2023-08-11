import React, { useEffect, useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import "./ProductList.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocalStorage } from "react-use";
import {
  ADD_TO_CART_MUTATION,
  PRODUCT_LIST_QUERY,
  INIT_CHECKOUT_MUTATION,
} from "../../graphql";

import { Link } from "react-router-dom";

function ProductList() {
  const { loading, error, data } = useQuery(PRODUCT_LIST_QUERY);
  const [addToCart] = useMutation(ADD_TO_CART_MUTATION);
  const [initCheckout] = useMutation(INIT_CHECKOUT_MUTATION);
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [token, setToken] = useLocalStorage("token");

  // const productUrl = import.meta.env.VITE_PRODUCT_URL;

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
      // Store this token in a state or context to be used when adding products to cart
    } catch (error) {
      console.error("Error initializing checkout:", error);
    }
  };

  useEffect(() => {
    const userEmail = "rsumit123@gmail.com";
    initializeCheckout(userEmail);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;

  const handleAddToCart = async (productId, variantId) => {
    console.log("productId", productId);
    console.log("variantId", variantId);
    try {
      const result = await addToCart({
        variables: {
          checkoutToken: checkoutToken, // You should fetch and use the user's checkout token here
          variantId: variantId,
          quantity: 1,
        },
      });
      if (result.data.checkoutLinesAdd.errors.length === 0) {
        console.log("Successfully added to cart", result);
        toast.success("Successfully added to cart");
      } else {
        console.log("Error adding to cart", result);
        toast.error(
          "Error adding to cart: ",
          result.data.checkoutLinesAdd.errors[0].message
        );
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const openCart = () => {
    window.location.href = "/cart";
  };

  return (
    <div>
      <div className="cart-button-container">
        
          <button className="cart-button" onClick={openCart}>Cart</button>
        
      </div>
      <div className="product-list">
        {data.products.edges.map(({ node: product }) => (
          <div className="product-item" key={product.id}>
            <img src={product.thumbnail.url} alt={product.name} />
            <p>{product.name}</p>
            <p>Price: Rs {product.pricing.priceRange.start.net.amount}</p>
            <button
              // className="snipcart-add-item"
              onClick={() =>
                handleAddToCart(product.id, product.variants[0].id)
              }
            >
              Add to cart
            </button>
            {/* <button
            className="snipcart-add-item"
            data-item-id={product.id}
            data-item-name={product.name}
            data-item-price={product.pricing.priceRange.start.net.amount} 
            data-item-image={product.thumbnail.url}
            data-item-url={`${productUrl}${product.id}`}
            onClick={() => handleAddToCart(product.id)}
          >
            Add to cart
          </button> */}
          </div>
        ))}
        {/* <ToastContainer /> */}
      </div>
    </div>
  );
}

export default ProductList;
