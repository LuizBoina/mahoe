import React, { useState } from 'react';
import { FaBars, FaTimes, FaWallet, FaUserEdit, FaHome } from 'react-icons/fa';
import { A } from 'hookrouter';

import './index.css';
import { isAuthenticated } from '../../hooks/auth';

export const SidebarData = [
  {
    title: 'Home',
    path: '/',
    icon: <FaHome />,
    cName: 'nav-text'
  },
  {
    title: 'Carteira',
    path: '/wallet',
    icon: <FaWallet />,
    cName: 'nav-text',
    protected: true
  },
  {
    title: 'Configurações',
    path: '/settings',
    icon: <FaUserEdit />,
    cName: 'nav-text',
    protected: true
  },
];

const SideBar = () => {
  const [sidebar, setSidebar] = useState(false);
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  const showSidebar = () => {
    if (!sidebar) {
      setIsAuth(isAuthenticated());
    }
    setSidebar(!sidebar)
  };

  return (
    <>
      <div className='navbar'>
        <A href='#' className='menu-bars'>
          <FaBars onClick={showSidebar} />
        </A>
      </div>
      <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
        <ul className='nav-menu-items' onClick={showSidebar}>
          <li className='navbar-toggle'>
            <A href='#' className='menu-bars'>
              <FaTimes />
            </A>
          </li>
          {SidebarData.filter(el => !el.protected || isAuth).map((item, index) => {
            return (
              <li key={index} className={item.cName}>
                <A href={item.path}>
                  {item.icon}
                  <span>{item.title}</span>
                </A>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

export default SideBar;