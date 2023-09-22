import { useState, useReducer, useContext } from "react";
import Image from "next/image";
import images from "./../../assets";
import {
  TOGGLE_TOKEN_COMPONENT,
  TOGGLE_SEARCH_TOKEN_A,
  TOGGLE_SEARCH_TOKEN_B,
} from "./HeroSection.constant";

import SwapTokenContext from "./../../Context/SwapContext";
import { SearchToken, Token } from "./../index";

function debounce(normalFunc, delay) {
  var timer;

  return function () {
    var context = this;
    var args = arguments;

    clearTimeout(timer);

    timer = setTimeout(function () {
      normalFunc.apply(context, args);
    }, delay);
  };
}

const componentVisibility = (state, action) => {
  let _state;
  switch (action) {
    case TOGGLE_TOKEN_COMPONENT:
      _state = {
        swapComponent: false,
        TokenComponent: true,
        tokenAComponent: false,
        tokenBComponent: false,
      };
      break;

    case TOGGLE_SEARCH_TOKEN_A:
      _state = {
        swapComponent: false,
        TokenComponent: false,
        tokenAComponent: true,
        tokenBComponent: false,
      };
      break;

    case TOGGLE_SEARCH_TOKEN_B:
      _state = {
        swapComponent: false,
        TokenComponent: false,
        tokenAComponent: false,
        tokenBComponent: true,
      };
      break;

    default:
      _state = {
        swapComponent: true,
        TokenComponent: false,
        tokenAComponent: false,
        tokenBComponent: false,
      };
  }

  return _state;
};

const HeroSection = () => {
  const [visibilityStatus, dispatch] = useReducer(componentVisibility, {
    swapComponent: true,
    TokenComponent: false,
    tokenAComponent: false,
    tokenBComponent: false,
  });

  const {
    connectWallet,
    account,
    singleSwapToken,
    tokenData,
    ether,
    dai,
    getPrice,
    swapUpdatePrice,
  } = useContext(SwapTokenContext);

  console.log("account in Hero", account);

  const [tokenOne, setTokenOne] = useState({
    name: "",
    symbol: "",
    image: "",
    balance: "",
    address: "",
  });

  const [tokenTwo, setTokenTwo] = useState({
    name: "",
    symbol: "",
    image: "",
    balance: "",
    address: "",
  });

  const [tokenSwapOutput, setTokenSwapOutput] = useState(0);
  const [poolMessage, setPoolMessage] = useState("");
  const [search, setSearch] = useState(false);
  const [swapAmount, setSwapAmount] = useState(0);

  const callOutput = async (value) => {
    const yourAccount = "0x28C6c06298d514Db089934071355E5743bf21d60";
    const deadline = 20;
    const slippageAmount = 25;

    const data = await swapUpdatePrice(
      value,
      slippageAmount,
      deadline,
      yourAccount
    );
    console.log("data", data);
    setTokenSwapOutput(data[1]);
    setSearch(false);

    const poolAddress = "0xc2e9f25be6257c210d7adf0d4cd6e3e881ba25f8";
    const poolData = await getPrice(value, poolAddress);
    const message = `${value} ${poolData[2]} = ${poolData[0]}${poolData[1]}`;
    setPoolMessage(message);
  };

  const debouncedCallOutput = debounce(callOutput, 500);
  return (
    <section className="grid grid-cols-12">
      {visibilityStatus["swapComponent"] && (
        <>
          <div className="col-start-4 col-end-7">Swap</div>
          {/* Token One */}
          <div className="col-start-7 col-end-9">
            <Image
              src={images.close}
              alt="Image"
              width={50}
              height={50}
              className="cursor-pointer"
              onClick={() => dispatch(TOGGLE_TOKEN_COMPONENT)}
            />
          </div>
          <div className="col-start-4 col-end-9">
            <input
              type="number"
              placeholder="0"
              onChange={(event) => {
                const {
                  target: { value },
                } = event;

                if (!value) return;

                setSearch(true);
                debouncedCallOutput(value);
                setSwapAmount(value);
              }}
            />
            <button onClick={() => dispatch(TOGGLE_SEARCH_TOKEN_A)}>
              <Image
                src={tokenOne.image || images.etherlogo}
                height={20}
                width={20}
                alt="ether"
              />
              {tokenOne.name || "ETH"}
              <small>{tokenOne?.balance?.slice(0, 7) || "0.0"}</small>
            </button>
          </div>
          {/* Token Two */}
          <div className="col-start-4 col-end-9">
            {/* <input type="text" placeholder="0" /> */}
            {search ? <span>Loading...</span> : <span>{tokenSwapOutput}</span>}
            <button onClick={() => dispatch(TOGGLE_SEARCH_TOKEN_B)}>
              <Image
                src={tokenTwo.image || images.etherlogo}
                alt="Token two"
                width={20}
                height={20}
              />
              {tokenTwo.name || "ETH"}
              <small>{tokenTwo?.balance?.slice(0, 7) || "0.0"}</small>
            </button>
          </div>
          {search ? <span>Loading...</span> : <span>{poolMessage}</span>}
          <div className="col-start-4 col-end-9">
            {account ? (
              <button
                onClick={() =>
                  singleSwapToken({
                    token1: tokenOne,
                    token2: tokenTwo,
                    swapAmount,
                  })
                }
              >
                Swap
              </button>
            ) : (
              <button onClick={() => connectWallet()}>Connect wallet</button>
            )}
          </div>
        </>
      )}
      {visibilityStatus["TokenComponent"] && <Token dispatch={dispatch} />}
      {visibilityStatus["tokenAComponent"] && (
        <SearchToken
          tokens={setTokenOne}
          tokenData={tokenData}
          dispatch={dispatch}
        />
      )}
      {visibilityStatus["tokenBComponent"] && (
        <SearchToken
          tokens={setTokenTwo}
          tokenData={tokenData}
          dispatch={dispatch}
        />
      )}
    </section>
  );
};

export default HeroSection;
