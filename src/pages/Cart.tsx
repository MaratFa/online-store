import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products, Product } from '../data';
import './Cart.css';

interface CartItem {
  product: Product;
  quantity: number;
}

export const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);

  useEffect(() => {
    // In a real app, you would fetch cart items from an API or local storage
    // For demo purposes, we'll use some sample cart items
    const sampleCartItems: CartItem[] = [
      { product: products[0], quantity: 1 },
      { product: products[2], quantity: 2 }
    ];
    setCartItems(sampleCartItems);
  }, []);

  useEffect(() => {
    // Calculate total price
    const total = cartItems.reduce((sum, item) => {
      const price = item.product.discountPrice || item.product.price;
      return sum + (price * item.quantity);
    }, 0);
    setCartTotal(total);
  }, [cartItems]);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove item from cart if quantity is 0
      setCartItems(cartItems.filter(item => item.product.id !== id));
    } else {
      // Update quantity
      setCartItems(cartItems.map(item => 
        item.product.id === id 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.product.id !== id));
  };

  const handleCheckout = () => {
    // In a real app, you would redirect to checkout page
    alert('Proceeding to checkout...');
  };

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <Link to="/products" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.product.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.product.image} alt={item.product.name} />
                  </div>

                  <div className="item-details">
                    <Link to={`/product/${item.product.id}`} className="item-name">
                      {item.product.name}
                    </Link>
                    <p className="item-category">{item.product.category}</p>
                  </div>

                  <div className="item-price">
                    ${item.product.discountPrice || item.product.price}
                  </div>

                  <div className="item-quantity">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    ${(item.product.discountPrice || item.product.price) * item.quantity}
                  </div>

                  <button 
                    className="remove-item-btn"
                    onClick={() => handleRemoveItem(item.product.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="summary-row">
                <span>Tax</span>
                <span>${(cartTotal * 0.08).toFixed(2)}</span>
              </div>

              <div className="summary-row total">
                <span>Total</span>
                <span>${(cartTotal * 1.08).toFixed(2)}</span>
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>

              <Link to="/products" className="continue-shopping-link">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
