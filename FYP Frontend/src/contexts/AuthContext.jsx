import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (apiService.isAuthenticated()) {
        try {
          const response = await apiService.getProfile();
          if (response.success) {
            const userData = response.user;
            setUser({
              full_name: userData.full_name || userData.user_metadata?.full_name || userData.email?.split('@')[0],
              email: userData.email,
              profile_picture: userData.profile_picture || userData.user_metadata?.profile_picture
            });
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          apiService.clearToken();
          setUser(null);
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []); // Remove the !user condition - ALWAYS check auth on mount

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    apiService.clearToken();
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      updateUser,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);