import Web3 from "web3";
import { getEthereum } from "./getEthereum";

export const getWeb3 = async () => {
  const ethereum = await getEthereum();
  let web3;

  if (ethereum) {
    web3 = new Web3(ethereum);
  } else if (window.web3) {
    web3 = window.web3;
  } else {
    const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
    web3 = new Web3(provider);
  }

  return web3;
};

export const getWeb3Eth = async () => {
  const provider = new Web3.providers.HttpProvider("https://eth-mainnet.gateway.pokt.network/v1/lb/60ec7081980d0b0034b3f2f2");
  return new Web3(provider);
};

export const getWeb3Dai = async () => {
    const provider = new Web3.providers.HttpProvider("https://poa-xdai.gateway.pokt.network/v1/lb/6103d8a5825e090034dce1ef");
    return new Web3(provider);
};

export const getWeb3Matic = async () => {
    const provider = new Web3.providers.HttpProvider("https://poly-mainnet.gateway.pokt.network/v1/lb/60ec706f980d0b0034b3f2f0");
    return new Web3(provider);
};
  