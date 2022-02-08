import React from 'react';
import Home from './pages/home';
import Login from './pages/login';
import Wallet from './pages/wallet';
import Settings from './pages/settings';
import SignUp from './pages/signUp';

const routes = {
  '/': () => <Home />,
  '/login': () => <Login />,
  '/sign-up': () => <SignUp />,
  '/settings': () => <Settings />,
  '/wallet': () => <Wallet />,
};

export default routes;