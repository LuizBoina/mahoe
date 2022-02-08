import React, { createContext } from 'react';
import { navigate } from 'hookrouter';

export const isAuthenticated = () => localStorage.getItem('token') !== null;
export const getToken = () => localStorage.getItem('token');
export const getUsername = () => localStorage.getItem('username');
export const getUserId = () => localStorage.getItem('userId');
export const getWalletId = () => localStorage.getItem('walletId');

export const login = data => {
  for (let prop in data) {
    localStorage.setItem(prop, data[prop]);
  }
};

export const logout = () => {
  localStorage.clear();
  navigate('/login');
};

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isSigned, setIsSigned] = React.useState(false);
  return (
    <AuthContext.Provider value={{ isSigned, setIsSigned }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;