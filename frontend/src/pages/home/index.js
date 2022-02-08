import React, { useState, useEffect } from 'react';
import { useTitle } from 'hookrouter';
import Loader from "react-loader-spinner";
import { getCryptoInfo } from '../../services/CryptoService';
import useInterval from '../../utils/useInterval';
import { FaSearch } from 'react-icons/fa';

import './index.css';


const Home = () => {
  useTitle('Mahoe - Home');

  const [isFetching, setIsFetching] = useState(true);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [pricesData, setPricesData] = useState([]);
  const [newsData, setNewssData] = useState([]);
  const [coinName, setCoinName] = useState("");

  useEffect(() => {
    loadCryptoInfo();
  }, []);

  const loadCryptoInfo = async () => {
    const { pricesResp, newsResp } = await getCryptoInfo(coinName);
    setPricesData(pricesResp);
    setNewssData(newsResp);
    setIsFetching(false);
  }

  const stopInterval = useInterval(loadCryptoInfo, 10000);

  const handleStopInterval = () => {
    stopInterval();
    setIsAutoRefresh(false);
  }

  return (
    <>
      <Loader
        type="Puff"
        color="#00BFFF"
        className="loader"
        height={100}
        width={100}
        visible={isFetching}
      />
      <div className="container-manage" >
        <h1>Mahoe</h1>
        <div className='home-header-btns'>
          <button
            style={{
              backgroundColor: isAutoRefresh ? "#696969" : "grey"
            }}
            disabled={!isAutoRefresh}
            onClick={handleStopInterval}
            className="home-header-btn">
            Parar Recarregamento Automático
          </button>
          <button
            onClick={loadCryptoInfo}
            className="home-header-btn">
            Recarregar
          </button>
        </div>
        <div className='search-div'>
          <input value={coinName} onChange={(e) => setCoinName(e.target.value)} className='search-input' placeholder='Digite o código completo da moeda para procurar...'></input>
          <button className='search-btn' onClick={loadCryptoInfo}>
            <FaSearch color='white' size={18} />
          </button>
        </div>
        <table className="table-striped" style={{ textAlign: 'center' }} cellSpacing="0" cellPadding="0">
          <thead>
            <tr>
              <th style={{ width: '20%' }}>código</th>
              <th style={{ width: '20%' }}>preço</th>
              <th style={{ width: '20%' }}>menor valor (24h)</th>
              <th style={{ width: '20%' }}>maior valor (24h)</th>
              <th style={{ width: '20%' }}>marketcap</th>
            </tr>
          </thead>
          <tbody>
            {pricesData && pricesData.map((prices, idx) => (
              <tr className='row-item' key={`price-${idx + 1}`}>
                <td>{prices.name}</td>
                <td>{prices.price}</td>
                <td>{prices.low}</td>
                <td>{prices.high}</td>
                <td>{prices.mktcap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <div className="row">
          {newsData && newsData.map((news, index) => (
            <div className="column" key={`news-${index}`}>
              <img src={news.imageurl} alt={news.source} />
              <div>
                <h4> {news.title} </h4>
                <p>{news.body}...</p>
                <a href={news.url}>Leia mais...</a>
              </div>
              <br />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;