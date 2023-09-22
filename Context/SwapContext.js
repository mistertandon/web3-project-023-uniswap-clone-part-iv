import React, { useState, useEffect, createContext } from "react";
import { ethers, BigNumber } from "ethers";
import Web3Modal from "web3modal";
import { Token, CurrencyAmount, TradeType, Percent } from "@uniswap/sdk-core";
import { getPrice } from "./../Utils/fetchingPrice";
import { swapUpdatePrice } from "./../Utils/swapUpdatePrice";

import { BooTokenAddress, LifeTokenAddress, IWETHAddress } from "./constants";

import ERC20 from "./ERC20.json";
import { IWETHABI } from "./constants";

import {
  checkIfWalletConnected,
  connectWallet,
  connectingWithBooToken,
  connectingWithLifeToken,
  connectingWithSingleSwapToken,
  connectingWithSwapMultiHopToken,
  connectingWithIWETHToken,
  connectingWithDaiToken,
} from "./../Utils/appFeatures";

const SwapTokenContext = createContext({});

const SwapTokenContextProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [ether, setEther] = useState("");
  const [networkConnected, setNetworkConnected] = useState("");
  const [weth9, setWeth9] = useState("");
  const [dai, setDai] = useState("");
  const [tokenData, setTokenData] = useState([]);

  // BooToken Token deployed to 0xbFD3c8A956AFB7a9754C951D03C9aDdA7EC5d638
  // ERC20Life Token deployed to 0x38F6F2caE52217101D7CA2a5eC040014b4164E6C
  // SingleSwapToken Token deployed to 0xc075BC0f734EFE6ceD866324fc2A9DBe1065CBB1
  // SwapMultiHop Token deployed to 0x837a41023CF81234f89F956C94D676918b4791c1

  // const addToken = [BooTokenAddress, LifeTokenAddress, IWETHAddress];
  const addToken = [
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    "0x9534ad65fb398E27Ac8F4251dAe1780B989D136e",
    "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
    "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
    "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
    "0x163f8C2467924be0ae7B5347228CABF260318753",
    "0xd1d2Eb1B1e90B638588728b4130137D262C87cae",
    "0xaea46A60368A7bD060eec7DF8CBa43b7EF41Ad85",
    "0x4a220E6096B25EADb88358cb44068A3248254675",
    "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
  ];

  const fetchingData = async () => {
    try {
      // Get User Account
      const userAccount = await checkIfWalletConnected();
      setAccount(userAccount);

      // Create provider
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      console.log("connection", connection);
      console.log("ethers", ethers);

      const provider = new ethers.providers.Web3Provider(connection);

      const balance = await provider.getBalance(userAccount);
      const convertedBigInt = BigNumber.from(balance).toString();
      // console.log(balance);
      const convertedEth = ethers.utils.formatEther(convertedBigInt);

      setEther(convertedEth);
      console.log("convertedEth", convertedEth);

      const network = await provider.getNetwork();
      console.log("network", network);
      setNetworkConnected(network.name);

      let tokensTemp = [];
      addToken.map(async (token, idx) => {
        const contract = new ethers.Contract(token, ERC20.abi, provider);
        console.log("contract : ", contract);

        const userBalance = await contract.balanceOf(userAccount);
        const tokenLeft = BigNumber.from(userBalance).toString();
        const convertokenBalance = ethers.utils.formatEther(tokenLeft);

        const symbol = await contract.symbol();
        const name = await contract.name();

        tokensTemp.push({
          symbol,
          name,
          balance: convertokenBalance,
          address: token,
        });

        console.log("userBalance : ", userBalance);
        console.log("convertokenBalance : ", convertokenBalance);
        console.log("symbol : ", symbol);
        console.log("name : ", name);
      });

      setTokenData(tokensTemp);
      console.log("tokensTemp : ", tokensTemp);

      // DAI Balance
      const daiContract = await connectingWithDaiToken();
      const daiBalance = await daiContract.balanceOf(userAccount);
      const daiToken = BigNumber.from(daiBalance).toString();
      const convertedDaiTokenBalance = ethers.utils.formatEther(daiToken);
      setDai(convertedDaiTokenBalance);

      // WETH9 Balance
      const weth9Contract = await connectingWithDaiToken();
      const weth9Balance = await weth9Contract.balanceOf(userAccount);
      const weth9Token = BigNumber.from(weth9Balance).toString();
      const convertedweth9TokenBalance = ethers.utils.formatEther(weth9Token);
      setWeth9(convertedweth9TokenBalance);

      console.log("dai State : ", convertedDaiTokenBalance);
      console.log("weth9 State : ", convertedweth9TokenBalance);
    } catch (error) {
      console.log("An error occured", error);
    }
  };

  useEffect(() => {
    fetchingData();
  }, []);

  const singleSwapToken = async ({ token1, token2, swapAmount }) => {
    console.log("token 1: ", token1.address);
    console.log("token 2: ", token2.address);
    console.log("swapAmount: ", swapAmount);
    try {
      let singleSwapToken;
      let weth9Contract;
      let daiContract;

      singleSwapToken = await connectingWithSingleSwapToken();
      console.log("singleSwapToken", singleSwapToken);

      weth9Contract = await connectingWithIWETHToken();
      console.log("weth9Contract", weth9Contract);

      daiContract = await connectingWithDaiToken();
      console.log("daiContract", daiContract);

      // const amountIn = 10n ** 18n;
      const decimals0 = 18;
      const inputAmount = swapAmount;
      const amountIn = ethers.utils.parseUnits(
        inputAmount.toString(),
        decimals0
      );

      console.log("amountIn: ", amountIn);

      await weth9Contract.deposite({ value: amountIn });
      await weth9Contract.approve(singleSwapToken.address, amountIn);

      console.log("Transaction reaches 164");
      const transaction = await singleSwapToken.swapExactInputSingle(
        token1.address,
        token2.address,
        amountIn,
        {
          gasLimit: 300000,
        }
      );

      await transaction.wait();
      console.log("Transaction reaches 175");

      const balance = await daiContract.balanceOf(account);
      console.log("balance: ", balance);

      const transferAmount = BigNumber.from(balance).toString();
      console.log("transferAmount: ", transferAmount);

      const ethValue = ethers.utils.formatEther(transferAmount);
      console.log("ethValue", ethValue);

      setDai(ethValue);
    } catch (error) {
      console.log("Error", error);
    }
  };

  // useEffect(() => {
  //   singleSwapToken();
  // }, [singleSwapToken]);

  return (
    <SwapTokenContext.Provider
      value={{
        tokenName: "Parvesh",
        connectWallet,
        account,
        networkConnected,
        ether,
        weth9,
        dai,
        tokenData,
        singleSwapToken,
        getPrice,
        swapUpdatePrice,
      }}
    >
      {children}
    </SwapTokenContext.Provider>
  );
};

export { SwapTokenContext as default, SwapTokenContextProvider };
