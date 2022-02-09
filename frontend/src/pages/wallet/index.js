import React, { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import { FaSearch } from 'react-icons/fa';
import { useTitle } from 'hookrouter';
import './index.css';
import { getWalletId } from "../../hooks/auth";
import { buyCrypto, getCryptoInfo, getCryptoPrice, getWalletInfo, sellCrypto } from "../../services/CryptoService";
import Modal from "../../components/modal";

const Wallet = () => {
  useTitle("Mahoe - Carteira");

  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const formatDate = (dateStr) => (new Date(dateStr))
    .toLocaleString('pt-BR').split(" ").reverse().join(" ");

  const initialCoin = {
    name: "",
    priceUnit: 0.0,
    buy: 0.0,
    receive: 0.0
  }

  const walletId = getWalletId();
  const [showModal, setShowModal] = useState(false);
  const [coinName, setCoinName] = useState("");
  const [coin, setCoin] = useState(null);
  const [wallet, setWallet] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setMessage] = useState("");
  const [isSelling, setIsSelling] = useState(false);

  const [purchaseCoins, setPurchaseCoins] = useState({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadUserWallet();
  }, []);

  const loadUserWallet = async () => {
    try {
      const { data: response } = await getWalletInfo(walletId);
      const { moneyAmount, purchaseHistory, ownedCryptos, ..._ } = response;
      const coinsName = ownedCryptos.map(oc => oc.cryptoCode).join(",");
      const coinsPrice = await getCryptoPrice(coinsName);
      setPurchaseCoins(coinsPrice);
      ownedCryptos.forEach(oc => oc.currentPrice = coinsPrice.find(c => c.name === oc.cryptoCode).price);
      const total = moneyAmount + ownedCryptos.reduce((a, b) => a + b.amount * b.currentPrice, 0);
      setTotal(total);
      setWallet({ moneyAmount, purchaseHistory, ownedCryptos });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setMessage(("Erro ao carregar a carteira"));
      setShowModal(true);
    }
  }

  const handleSearchCrypto = async () => {
    if (!coinName.length) {
      return;
    }
    setMessage("");
    try {
      setIsLoading(true);
      const name = coinName.toLocaleUpperCase();
      const price = await getCryptoPrice(name);
      if (!price.length) {
        throw new Error();
      }
      setCoin({
        ...initialCoin,
        name: name,
        priceUnit: price[0].price,
      });
      setIsLoading(false);
      setShowModal(true);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setMessage("Erro ao procurar moeda/ Moeda inexistente");
      setShowModal(true);
    }
  }

  const openSellCryptoModal = async (crypto) => {
    setIsSelling(true);
    console.log(console.log(crypto))
    setCoin({
      ...crypto,
      sell: 0.0,
      receive: 0.0
    });
    setShowModal(true);
  }

  const handleSellCrypto = async () => {
    if (coin.sell > coin.amount) {
      setMessage("Saldo Indisponível");
      return;
    }
    try {
      const payload = {
        code: coin.cryptoCode,
        price: coin.currentPrice,
        amount: coin.sell,
      }
      await sellCrypto(walletId, payload);
      await loadUserWallet();
      setMessage("Moeda Vendida Com Sucesso");
    } catch (error) {
      console.log(error)
      closeModal(`Erro: ${error.response.data}`);
    }
  }

  const handleBuyCrypto = async () => {
    try {
      if (coin.buy > wallet.moneyAmount) {
        setMessage("Saldo Indisponível");
        return;
      }
      const payload = {
        code: coin.name,
        amount: coin.buy,
        price: coin.priceUnit
      };
      await buyCrypto(walletId, payload);
      await loadUserWallet();
      setMessage("Moeda Comprada Com Sucesso")
    } catch (error) {
      console.log(error)
      closeModal(`Erro: ${error.response.data}`);
    }
  }

  const closeModal = () => {
    setMessage("");
    setCoin(initialCoin);
    setIsLoading(false);
    setIsSelling(false);
    setShowModal(false);
  }

  const modalHandler = () =>
    errorMessage ?
      <Modal
        onConfirm={closeModal}
      >
        <h2>{errorMessage}</h2>
      </Modal> :
      isSelling ?
        <Modal
          onCancel={closeModal}
          onConfirm={handleSellCrypto}
        >
          <h3>Vender Moeda</h3><br />
          <div>
            <div style={{ marginBottom: 12 }}><h4 style={{ display: 'inline', marginBottom: 12 }}>Código: </h4>{coin.cryptoCode}</div>
            <div style={{ marginBottom: 12 }}><h4 style={{ display: 'inline', marginBottom: 12 }}>Preço Unidade: </h4>{currencyFormatter.format(coin.currentPrice)}</div>
            <div style={{ marginBottom: 12 }}><h4 style={{ display: 'inline', marginBottom: 12 }}>Receber em Moeda: </h4>{currencyFormatter.format(coin.receive)}</div>
            <div style={{ marginBottom: 12 }}><h4 style={{ display: 'inline', marginBottom: 12 }}>Saldo Disponível: </h4>{coin.amount}</div>
            <div>
              <h4 style={{ display: 'inline', marginBottom: 12 }}>Vender em Modea:</h4>
              <input style={{ marginLeft: 10, height: 22, width: 80 }} type="number" value={coin.sell}
                onChange={(e) => setCoin({ ...coin, sell: e.target.value, receive: e.target.value * coin.currentPrice })}>
              </input>
            </div>
          </div>
        </Modal>
        :
        <Modal
          onCancel={closeModal}
          onConfirm={handleBuyCrypto}
        >
          <h3>Comprar Moeda</h3><br />
          <div>
            <div style={{ marginBottom: 12 }}><h4 style={{ display: 'inline', marginBottom: 12 }}>Código: </h4>{coin.name}</div>
            <div style={{ marginBottom: 12 }}><h4 style={{ display: 'inline', marginBottom: 12 }}>Preço Unidade: </h4>{currencyFormatter.format(coin.priceUnit)}</div>
            <div style={{ marginBottom: 12 }}><h4 style={{ display: 'inline', marginBottom: 12 }}>Receber em Moeda: </h4>{coin.receive}</div>
            <div style={{ marginBottom: 12 }}><h4 style={{ display: 'inline', marginBottom: 12 }}>Saldo Disponível: </h4>{currencyFormatter.format(wallet.moneyAmount)}</div>
            <div>
              <h4 style={{ display: 'inline', marginBottom: 12 }}>Pagar em Real:</h4>
              <input style={{ marginLeft: 10, height: 22, width: 80 }} type="number" value={coin.buy}
                onChange={(e) => setCoin({ ...coin, buy: e.target.value, receive: e.target.value / coin.priceUnit })}>
              </input>
            </div>
          </div>
        </Modal>
    ;

  return (
    <>
      {showModal && modalHandler()}
      <Loader
        type="Puff"
        color="#00BFFF"
        className="loader"
        height={100}
        width={100}
        visible={isLoading}
      />
      <div className="container-manage" >
        <h1>Carteira</h1>
        <div className='home-header-btns'>
          <h5 style={{ display: 'inline', fontSize: '1em' }}>
            Total Na Carteira:
          </h5>
          {currencyFormatter.format(total)}
          <br />
          <br />
          <h5 style={{ display: 'inline', fontSize: '1em', marginRight: 19 }}>
            Saldo Disponível:
          </h5>
          {currencyFormatter.format(wallet.moneyAmount)}
        </div>
        <br />
        <div className='search-div'>
          <input onChange={(e) => setCoinName(e.target.value)} className='search-input'
            placeholder='Digite o código completo da moeda que deseja comprar...'></input>
          <button className='search-btn' onClick={handleSearchCrypto}>
            <FaSearch color='white' size={18} />
          </button>
        </div>
        <br /><br />
        <h3>Minhas moedas</h3>
        <table className="table-striped" style={{ textAlign: 'center' }} cellSpacing="0" cellPadding="0">
          <thead>
            <tr>
              <th style={{ width: '10%' }}>código</th>
              <th style={{ width: '20%' }}>quantidade</th>
              <th style={{ width: '20%' }}>valor de compra</th>
              <th style={{ width: '20%' }}>valor atual</th>
              <th style={{ width: '20%' }}>data de compra</th>
              <th style={{ width: '10%' }}></th>
            </tr>
          </thead>
          <tbody>
            {wallet?.ownedCryptos?.map((crypto, idx) => (
              <tr className='row-item' key={`crypto-${idx}`}>
                <td>{crypto.cryptoCode}</td>
                <td>{crypto.amount}</td>
                <td>{currencyFormatter.format(crypto.purchasePrice)}</td>
                <td>{currencyFormatter.format(crypto.currentPrice)}</td>
                <td>{formatDate(crypto.purchaseTime)}</td>
                <td>
                  <button style={{ height: 24 }} className="btn del-item-btn"
                    onClick={() => openSellCryptoModal(crypto)}
                  >
                    Vender
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br /><br />
        <h3>Histórico de Transação</h3>
        <table className="table-striped" style={{ textAlign: 'center' }} cellSpacing="0" cellPadding="0">
          <thead>
            <tr>
              <th style={{ width: '20%' }}>código</th>
              <th style={{ width: '20%' }}>quantidade</th>
              <th style={{ width: '20%' }}>valor de compra</th>
              <th style={{ width: '20%' }}>Tipo de Transação</th>
              <th style={{ width: '20%' }}>data de compra</th>
            </tr>
          </thead>
          <tbody>
            {wallet?.purchaseHistory?.map((ph, idx) => (
              <tr className='row-item' key={`ph-${idx}`}>
                <td>{ph.cryptoCode}</td>
                <td>{ph.amount}</td>
                <td>{currencyFormatter.format(ph.purchasePrice)}</td>
                <td>{ph.isBuy ? 'Compra' : 'Venda'}</td>
                <td>{formatDate(ph.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Wallet;