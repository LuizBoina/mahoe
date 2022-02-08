import React, { useContext } from 'react';
import { A } from 'hookrouter';
import { getUsername, logout, isAuthenticated } from '../../hooks/auth';
import AuthContext from '../../hooks/auth';

import './index.css';
import { FaBitcoin } from 'react-icons/fa';

const Header = () => {
  const { isSigned, setIsSigned } = useContext(AuthContext);


  return (
    <header className='header'>
      <div className='banner'>
        <div>
          <h2>Mahoe <FaBitcoin style={{ marginLeft: 4 }} size={20} /></h2>
        </div>
        {isSigned || isAuthenticated() ?
          <h4>
            Olá, {getUsername()} <A className="white-link" onClick={() => { logout(); setIsSigned(false) }} href='/login'>(Sair)</A>
          </h4>
          :
          <h4>
            <A className="white-link" href='/login'>Login</A>
          </h4>}
      </div>
    </header>
  );
};

export default Header;