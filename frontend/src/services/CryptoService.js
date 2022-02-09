import axios from "axios";
import GenericService from "./GenericService";

const API_URL = "https://min-api.cryptocompare.com/data";
const defaultCoins = "BTC,ETH,XRP,EOS,LTC,ADA,MIOTA";

export const getCryptoPrice = async (coinName) => {
  try {
    if (coinName.includes(",")) {
      const { data: pricesResp } = await axios.get(`${API_URL}/pricemultifull?fsyms=${coinName}&tsyms=BRL`);
      return Object.keys(pricesResp.RAW)
        .map(i => {
          return { name: i, ...pricesResp.RAW[i] }
        })
        .map(data => {
          return {
            name: data.name,
            price: data.BRL.PRICE
          }
        })
    }
    const response = await axios.get(`${API_URL}/price?fsym=${coinName}&tsyms=BRL`);
    return [{
      name: coinName,
      price: response.data.BRL
    }];
  } catch (error) {
    console.log(error);
  }
}

export const getCryptoInfo = async (coin) => {
  try {
    const coins = coin || defaultCoins;
    const priceReq = axios.get(`${API_URL}/pricemultifull?fsyms=${coins}&tsyms=BRL`);
    const newsReq = axios.get(`${API_URL}/v2/news/?lang=PT`);
    const [{ data: pricesResp }, { data: newsRes }] = await Promise.all([priceReq, newsReq])

    const pricesData = Object.keys(pricesResp.DISPLAY)
      .map(i => {
        return { name: i, ...pricesResp.DISPLAY[i] }
      })
      .map(data => {
        return {
          price: data.BRL.PRICE,
          high: data.BRL.HIGHDAY,
          low: data.BRL.LOWDAY,
          mktcap: data.BRL.MKTCAP,
          name: data.name,
        }
      });
    return {
      pricesResp: pricesData,
      newsResp: newsRes.Data
    }
  } catch (error) {
    console.log(error);
  }
}

export const searchCrypto = async (name) => {

}

export const getWalletInfo = async (id) => {
  return await GenericService(`/wallet/${id}`, "GET");
}

export const buyCrypto = async (walletId, body) => {
  return await GenericService(`/user/${walletId}/buy-crypto`, "POST", body);
}

export const sellCrypto = async (walletId, body) => {
  return await GenericService(`/user/${walletId}/sell-crypto`, "POST", body);
}
