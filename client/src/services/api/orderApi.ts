
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

export const createOrder = async (orderData: any, token: string) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, orderData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrderById = async (orderId: string, token: string) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const getUserOrders = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/user/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: string, token: string) => {
  try {
    const response = await axios.patch(`${API_URL}/orders/${orderId}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};
