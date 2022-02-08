import React from 'react';
import { useTitle } from 'hookrouter';

import './index.css';

const PageNotFound = () => {
  useTitle('Mahoe - 404');

  return (
    <div className='text-position'>
      <h1>Página Não Encontrada</h1>
    </div>
  );
}

export default PageNotFound;