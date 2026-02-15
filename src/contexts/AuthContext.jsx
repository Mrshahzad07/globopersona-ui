import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('globopersona_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('globopersona_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, remember = false) => {
    if (email && password) {
      const mockUser = {
        id: '1',
        email: email,
        name: email.split('@')[0],
        avatar: null,
      };
      
      setUser(mockUser);
      if (remember) {
        localStorage.setItem('globopersona_user', JSON.stringify(mockUser));
      } else {
        sessionStorage.setItem('globopersona_user', JSON.stringify(mockUser));
      }
      
      return { success: true };
    }
    
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('globopersona_user');
    sessionStorage.removeItem('globopersona_user');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh' 
      }}>
        <div className="animate-spin" style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #e5e7eb', 
          borderTopColor: '#6366f1', 
          borderRadius: '50%' 
        }}></div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};
