import { ethers } from "ethers";
import Web3Modal from "web3modal";

import {
  BooTokenAddress,
  BooTokenABI,
  LifeTokenAddress,
  LifeTokenABI,
  SingleSwapTokenAddress,
  SingleSwapTokenABI,
  SwapMultiHopAddress,
  SwapMultiHopABI,
  IWETHAddress,
  IWETHABI,
} from "./../Context/constants";

// Check if wallet is connected or not
export const checkIfWalletConnected = async () => {
  try {
    if (!window.ethereum) return console.log("Install Metamask");

    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    const firstAccount = accounts[0];

    return firstAccount;
  } catch (error) {
    console.log("An error occured", error);
  }
};

// Connect wallet
export const connectWallet = async () => {
  try {
    if (!window.ethereum) return console.log("Install metamask");
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const firstAccount = accounts[0];
    console.log("firstAccount", firstAccount);
    return firstAccount;
  } catch (error) {
    console.log("An error occurred", error);
  }
};

/**
 * This function is used to fetch ERCBoo contract
 *
 * @param {} signerOrProvider
 * @returns
 */
export const fetchBooContract = (signerOrProvider) =>
  new ethers.Contract(BooTokenAddress, BooTokenABI, signerOrProvider);

// Connect with Boo token contract
export const connectingWithBooToken = async () => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchBooContract(signer);

    return contract;
  } catch (error) {
    console.log("An error occurred", error);
  }
};

/**
 * This function is used to fetch ERC20Life contract
 *
 * @param {} signerOrProvider
 * @returns
 */
export const fetchLifeContract = (signerOrProvider) =>
  new ethers.Contract(LifeTokenAddress, LifeTokenABI, signerOrProvider);

// Connect with Life token contract
export const connectingWithLifeToken = async () => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchLifeContract(signer);

    return contract;
  } catch (error) {
    console.log("An error occurred", error);
  }
};

/**
 * This function is used to fetch SingleSwap Token contract
 *
 * @param {} signerOrProvider
 * @returns
 */
export const fetchSingleSwapTokenContract = (signerOrProvider) =>
  new ethers.Contract(
    SingleSwapTokenAddress,
    SingleSwapTokenABI,
    signerOrProvider
  );

// Connect with SingleSwap Token contract
export const connectingWithSingleSwapToken = async () => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchSingleSwapTokenContract(signer);

    return contract;
  } catch (error) {
    console.log("An error occurred", error);
  }
};

/**
 * This function is used to fetch SwapMultiHop Token contract
 *
 * @param {} signerOrProvider
 * @returns
 */
export const fetchSwapMultiHopTokenContract = (signerOrProvider) =>
  new ethers.Contract(SwapMultiHopAddress, SwapMultiHopABI, signerOrProvider);

// Connect with SwapMultiHop Token contract
export const connectingWithSwapMultiHopToken = async () => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchSwapMultiHopTokenContract(signer);

    return contract;
  } catch (error) {
    console.log("An error occurred", error);
  }
};

/**
 * This function is used to fetch IWETH Token contract
 *
 * @param {} signerOrProvider
 * @returns
 */
export const fetchIWETHTokenContract = (signerOrProvider) =>
  new ethers.Contract(IWETHAddress, IWETHABI, signerOrProvider);

// Connect with IWETH Token contract
export const connectingWithIWETHToken = async () => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchIWETHTokenContract(signer);

    return contract;
  } catch (error) {
    console.log("An error occurred", error);
  }
};

/**
 * This function is used to fetch Dai Token contract
 *
 * @param {} signerOrProvider
 * @returns
 */
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
export const fetchDaiTokenContract = (signerOrProvider) =>
  new ethers.Contract(DAI_ADDRESS, IWETHABI, signerOrProvider);

// Connect with Dai Token contract
export const connectingWithDaiToken = async () => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchDaiTokenContract(signer);

    return contract;
  } catch (error) {
    console.log("An error occurred", error);
  }
};