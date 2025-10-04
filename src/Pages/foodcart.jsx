import React, { useState } from "react";
import Items from "./Items";

const ParentComponent = () => {
  const [cart, setCart] = useState([]);

  const handleAddToCart = (item, quantity) => {
    const existingItem = cart.find(cartItem => cartItem._id === item._id);
    
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity }]);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="flex gap-8">
      {/* Items Section */}
      <div className="flex-1">
        <Items 
          subcategoryId="your-subcategory-id"
          subcategoryName="Your Subcategory"
          onAddToCart={handleAddToCart}
        />
      </div>

      {/* Cart Section */}
      <div className="w-80 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">🛒 Your Cart</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty</p>
        ) : (
          <>
            {cart.map(item => (
              <div key={item._id} className="border-b py-3">
                <div className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>₹{calculateTotal()}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ParentComponent;