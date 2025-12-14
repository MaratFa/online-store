
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api/v1';

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const registerUser = async (userData: any) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const getUserProfile = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (token: string, userData: any) => {
  try {
    const response = await axios.put(`${API_URL}/user/profile`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
