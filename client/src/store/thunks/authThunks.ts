
import { createAsyncThunk } from '@reduxjs/toolkit';
import { userAPI } from '../../services/apiIntegration';

// Type definitions
interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role?: string;
    avatar?: string;
  };
}

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await userAPI.login(credentials.email, credentials.password);
      // Cast response data to AuthResponse
      const authData = response.data as AuthResponse;
      // Store token in localStorage
      localStorage.setItem('token', authData.token);
      localStorage.setItem('userEmail', authData.user.email);
      localStorage.setItem('userName', authData.user.name);
      localStorage.setItem('userRole', authData.user.role || 'user');
      return authData;
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await userAPI.register(userData);
      // Cast response data to AuthResponse
      const authData = response.data as AuthResponse;
      // Store token in localStorage
      localStorage.setItem('token', authData.token);
      localStorage.setItem('userEmail', authData.user.email);
      localStorage.setItem('userName', authData.user.name);
      localStorage.setItem('userRole', authData.user.role || 'user');
      return authData;
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // No API call needed for logout in our implementation
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      return true;
    } catch (error) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      return rejectWithValue((error as any).response?.data?.message || 'Logout failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token') || '';
      const response = await userAPI.getProfile(token);
      // Cast response data to User type
      const userData = response.data as AuthResponse['user'];
      // Update localStorage with user role
      if (userData.role) {
        localStorage.setItem('userRole', userData.role);
      }
      return userData;
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'Failed to fetch user');
    }
  }
);
