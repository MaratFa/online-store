import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOrders } from '../store/thunks/orderThunks';
import { selectAllOrders } from '../store/slices/ordersSlice';
import './Orders.css';

export const Orders: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.orders);
  const orders = useAppSelector(selectAllOrders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) {
    return <div className="orders-loading">Loading your orders...</div>;
  }

  if (error) {
    return <div className="orders-error">Error: {error}</div>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="orders-empty">
        <h2>Your Orders</h2>
        <p>You haven't placed any orders yet.</p>
        <a href="/products" className="btn">Continue Shopping</a>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>Your Orders</h1>
      <div className="orders-list">
        {orders.map((order: any) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-id">Order #{order.id}</div>
              <div className="order-date">{new Date(order.date).toLocaleDateString()}</div>
              <div className={`order-status ${order.status.toLowerCase()}`}>{order.status}</div>
            </div>
            <div className="order-items">
              {order.items.map((item: any) => (
                <div key={item.id} className="order-item">
                  <img src={item.image} alt={item.name} className="order-item-image" />
                  <div className="order-item-details">
                    <div className="order-item-name">{item.name}</div>
                    <div className="order-item-quantity">Quantity: {item.quantity}</div>
                  </div>
                  <div className="order-item-price">${item.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="order-footer">
              <div className="order-total">Total: ${order.total.toFixed(2)}</div>
              <button className="btn btn-secondary">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
