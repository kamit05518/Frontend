import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartLoading, setIsCartLoading] = useState(false);

  const API_BASE_URL = "http://localhost:5001/api/cart/cart";

  // ✅ Fetch Cart
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCartItems([]);
        return;
      }

      const { data } = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems(data.items || []);
    } catch (error) {
      console.error("❌ Failed to load cart:", error);
      toast.error("Failed to load cart.");
    }
  };

  // ✅ Add Item to Cart
  const addToCart = async (item, quantity = 1) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to add items to cart");
        return;
      }

      setIsCartLoading(true);

      // Optimistic UI update
      setCartItems((prev) => {
        const existingItem = prev.find((cartItem) => cartItem.itemId === item._id);
        if (existingItem) {
          return prev.map((cartItem) =>
            cartItem.itemId === item._id
              ? { ...cartItem, quantity: cartItem.quantity + quantity }
              : cartItem
          );
        }
        return [
          ...prev,
          {
            itemId: item._id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity,
          },
        ];
      });

      // API request
      await axios.post(
        API_BASE_URL,
        { itemId: item._id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`${item.name} added to cart! ✅`);
    } catch (error) {
      fetchCart(); // revert sync
      toast.error(error.response?.data?.message || "Failed to add item.");
    } finally {
      setIsCartLoading(false);
    }
  };

  // ✅ Remove Item
  const removeFromCart = async (itemId) => {
    try {
      setCartItems((prev) => prev.filter((item) => item.itemId !== itemId));

      await axios.delete(`${API_BASE_URL}/item/${itemId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast.success("Item removed ❌");
    } catch (error) {
      fetchCart();
      toast.error("Failed to remove item");
    }
  };

  // ✅ Clear Cart
  const clearCart = async () => {
    try {
      setCartItems([]);

      await axios.delete(API_BASE_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast.info("Cart cleared 🗑️");
    } catch (error) {
      fetchCart();
      toast.error("Failed to clear cart.");
    }
  };

  // ✅ Update Quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    try {
      setCartItems((prev) =>
        prev.map((item) =>
          item.itemId === itemId ? { ...item, quantity: newQuantity } : item
        )
      );

      await axios.put(
        `${API_BASE_URL}/item/${itemId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
    } catch (error) {
      fetchCart();
      toast.error("Failed to update quantity");
    }
  };

  // ✅ Derived Values
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // ✅ Auto-fetch on login
  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchCart();
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        totalPrice,
        totalItems,
        fetchCart,
        isCartLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
