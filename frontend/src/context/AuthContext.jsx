import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/profile`);
      if (response.data) {
        setUser(response.data);
      } else {
        console.warn('Profile response was empty');
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      // Only remove token if it's an auth error
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed';
      
      if (error.response) {
        errorMessage = error.response.data?.message || 'Login failed';
      } else if (error.request) {
        const apiUrl = API_URL || 'http://localhost:5000';
        errorMessage = `Cannot connect to backend at ${apiUrl}. Is the backend running?`;
      } else {
        errorMessage = error.message || 'Login failed';
      }
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        username,
        email,
        password,
      });

      const { token, user, requiresVerification } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);

      return { success: true, requiresVerification: requiresVerification || false };
    } catch (error) {
      console.error('Registration error:', error);
      
      // Extract error message from response
      let errorMessage = 'Registration failed';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || error.response.data?.error || 'Registration failed';
        
        // Log detailed error for debugging
        if (error.response.status >= 500) {
          console.error('Server error:', error.response.data);
        }
      } else if (error.request) {
        // Request made but no response
        const apiUrl = API_URL || 'http://localhost:5000';
        errorMessage = `Cannot connect to backend server at ${apiUrl}. Make sure the backend is running (npm run dev in backend folder).`;
        console.error('Network error - Backend not reachable:', {
          url: apiUrl,
          error: error.code === 'ERR_NETWORK' ? 'Connection refused - Backend likely not running' : error.message
        });
      } else {
        // Error in request setup
        errorMessage = error.message || 'Registration failed';
        console.error('Error:', error.message);
      }
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

