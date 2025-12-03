import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import './Cart.css';

export const Cart: React.FC = () => {
  const { items, totalAmount, totalItems } = useAppSelector(state => state.cart);
  const dispatch = useAppDispatch();

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    // In a real app, you would redirect to checkout page
    alert('Proceeding to checkout...');
  };

  const tax = totalAmount * 0.08;
  const shipping = totalAmount > 100 ? 0 : 10; // Free shipping for orders over $100
  const finalTotal = totalAmount + tax + shipping;

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})</h1>

        {items.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <div className="cart-header">
                <h3>Products</h3>
                <button className="clear-cart-btn" onClick={handleClearCart}>
                  Clear Cart
                </button>
              </div>

              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="item-details">
                    <Link to={`/product/${item.id}`} className="item-name">
                      {item.name}
                    </Link>
                    <p className="item-category">{item.category}</p>
                    <p className="item-stock">In Stock: {item.stock}</p>
                    {item.discountPrice && (
                      <div className="item-discount">
                        <span className="original-price">${item.price}</span>
                        <span className="discount-badge">Save ${(item.price - item.discountPrice).toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="item-price">
                    ${item.discountPrice || item.price}
                  </div>

                  <div className="item-quantity">
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    ${(item.discountPrice || item.price) * item.quantity}
                  </div>

                  <button
                    className="remove-item-btn"
                    onClick={() => handleRemoveItem(item.id)}
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
                <span>${totalAmount.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>

              <div className="summary-row">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              {totalAmount > 100 && (
                <div className="summary-row discount">
                  <span>Free Shipping Applied</span>
                  <span>-$10.00</span>
                </div>
              )}

              <div className="summary-row total">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>

              <div className="promo-code">
                <input type="text" placeholder="Promo code" />
                <button className="apply-btn">Apply</button>
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
