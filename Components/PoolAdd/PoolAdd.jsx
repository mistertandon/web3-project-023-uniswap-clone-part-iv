import React, { useState, useContext } from "react";
import SwapTokenContext from "./../../Context/SwapContext";
import {
  TOGGLE_TOKEN_COMPONENT,
  TOGGLE_SEARCH_TOKEN_A,
  TOGGLE_SEARCH_TOKEN_B,
} from "./../../reducers/tokenVisibilityReducer.constant";
import { useTokenVisibilityReducer } from "./../../reducers";
import { Token, SearchToken } from "./../index";
import {
  CloseCircleSharp,
  AddCircleSharp,
  RemoveCircleSharp,
  WalletSharp,
  ArrowBackSharp,
  ArrowDownSharp,
} from "react-ionicons";

import { CheckmarkCircleSharp } from "react-ionicons";
import { addLiquidityExternal } from "@/Utils/addLiquidity";

const PoolAdd = ({ setClosePool }) => {
  const {
    connectWallet,
    account,
    singleSwapToken,
    tokenData,
    ether,
    dai,
    getPrice,
    swapUpdatePrice,
    createLiquidityAndPool,
  } = useContext(SwapTokenContext);

  // ============================================================
  const [fee, setFee] = useState(0);
  const [slippage, setSlippage] = useState(25);
  const [deadline, setDeadline] = useState(10);
  const [tokenAmountOne, setTokenAmountOne] = useState(0);
  const [tokenAmountTwo, setTokenAmountTwo] = useState(0);
  // ============================================================
  const [visibilityStatus, dispatch] = useTokenVisibilityReducer();
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

  const [openModal, setOpenModal] = useState(false);
  const [openTokenModal, setOpenTokenModal] = useState(false);
  const [active, setActive] = useState(1);
  const [openFee, setOpenFee] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const feePairs = [
    {
      fee: "0.05%",
      info: "Best for stable pairs",
      number: "0% Select",
      feeSystem: 500,
    },
    {
      fee: "0.3%",
      info: "Best for stable pairs",
      number: "0% Select",
      feeSystem: 3000,
    },
    {
      fee: "1%",
      info: "Best for stable pairs",
      number: "0% Select",
      feeSystem: 10000,
    },
  ];

  const minPriceDecrease = () => {
    if (minPrice > 0) {
      setMinPrice((val) => val - 1);
    }
  };

  const minPriceIncrease = () => {
    setMinPrice((val) => val + 1);
  };

  const maxPriceDecrease = () => {
    if (maxPrice > 0) {
      setMaxPrice((val) => val - 1);
    }
  };

  const maxPriceIncrease = () => {
    setMaxPrice((val) => val + 1);
  };

  return (
    <article>
      <section className="max-w-[1220px] mx-auto grid grid-cols-12 grid-flow-row gap-4">
        <div className="col-span-full flex flex-row justify-between gap-4">
          <div className="">
            <ArrowBackSharp
              color={"#ffffff"}
              title="Back"
              height="1rem"
              width="4rem"
              onClick={() => {
                console.log("close");
                setClosePool(false);
              }}
            />
          </div>
          <div className="">Add Liquidity</div>
          <div className="flex flex-row justify-between gap-4">
            <div className="">
              {tokenOne?.name || ""}
              {tokenOne?.tokenBalance?.slice(0, 7) || ""}
              {tokenTwo?.name || ""}
              {tokenTwo?.tokenBalance?.slice(0, 7) || ""}
            </div>
            <div className="">
              <CloseCircleSharp
                color={"#ffffff"}
                title={"Close"}
                height="1.25rem"
                width="1.25rem"
                onClick={() => {
                  dispatch(TOGGLE_TOKEN_COMPONENT);
                }}
              />
            </div>
          </div>
        </div>

        <div className="col-start-1 col-end-7 grid grid-cols-12 gap-4">
          <div className="col-span-full">Select pair</div>
          <div
            className="col-start-1 col-end-7 flex flex-row justify-start gap-4"
            onClick={() => {
              console.log("93");
              setOpenTokenModal(true);
              dispatch(TOGGLE_SEARCH_TOKEN_A);
            }}
          >
            <div>Image</div>
            <div>{tokenOne.name || "ETH"}</div>
            <div>
              <ArrowDownSharp
                color={"#ffffff"}
                title="Down arrow"
                height="1.25rem"
                width="1.25rem"
              />
            </div>
          </div>
          <div
            className="col-start-7 col-end-13 flex flex-row justify-start gap-4"
            onClick={() => {
              console.log("93");
              setOpenTokenModal(true);
              dispatch(TOGGLE_SEARCH_TOKEN_B);
            }}
          >
            <div>Image</div>
            <div>{tokenTwo.name || "Select"}</div>
            <div>
              <ArrowDownSharp
                color={"#ffffff"}
                title="Down arrow"
                height="1.25rem"
                width="1.25rem"
              />
            </div>
          </div>
          <div className="col-span-full grid grid-cols-12 gap-4">
            <div className="col-start-1 col-end-8">Fee tier</div>
            {openFee ? (
              <div
                className="col-start-8 col-end-12 row-start-1 row-end-3"
                onClick={() => setOpenFee(false)}
              >
                Hide
              </div>
            ) : (
              <div
                className="col-start-8 col-end-12 row-start-1 row-end-3"
                onClick={() => setOpenFee(true)}
              >
                Show
              </div>
            )}

            <div className="col-start-1 col-end-8">
              The % you will earn in fees
            </div>
            {openFee &&
              feePairs.map(({ fee, info, number, feeSystem }, idx) => (
                <div
                  className="col-span-3 grid grid-cols-2 grid-flow-row"
                  key={`${idx}`}
                >
                  <div className="col-start-1 col-end-2">{fee}</div>
                  <div className="col-start-2 col-end-3">
                    {idx === active && (
                      <CheckmarkCircleSharp
                        color={"#ffffff"}
                        title={info}
                        height="1rem"
                        width="1rem"
                      />
                    )}
                  </div>
                  <div className="col-span-full">{info}</div>
                  <div className="col-span-full">
                    <button onClick={() => (setActive(idx), setFee(feeSystem))}>
                      {number}
                    </button>
                  </div>
                </div>
              ))}
          </div>
          <div className="col-span-full">Deposit amount</div>
          <div className="col-span-full grid grid-cols-12 gap-4">
            <div className="col-start-1 col-end-5">
              <input
                type="number"
                placeholder={tokenOne?.balance?.slice(0, 7) || ""}
                onChange={(e) => setTokenAmountOne(e.target.value)}
              />
            </div>
            <div className="col-start-5 col-end-9">
              {tokenOne?.symbol || "ETH"}
            </div>
            <div className="col-start-9 col-end-13">
              {tokenOne?.name || "N/A"}
            </div>
            <div className="col-start-5 col-end-13">
              {tokenOne?.balance || "N/A"}
            </div>
          </div>
          <div className="col-span-full grid grid-cols-12 gap-4">
            <div className="col-start-1 col-end-5">
              {" "}
              <input
                type="number"
                placeholder={tokenTwo?.balance?.slice(0, 7) || ""}
                onChange={(e) => setTokenAmountTwo(e.target.value)}
              />
            </div>
            <div className="col-start-5 col-end-9">
              {tokenTwo?.symbol || "SYB N/A"}
            </div>
            <div className="col-start-9 col-end-13">
              {tokenTwo?.name || "N/A"}
            </div>
            <div className="col-start-5 col-end-13">
              {tokenTwo?.balance || "N/A"}
            </div>
          </div>
        </div>
        <div className="col-start-7 col-end-13 grid grid-cols-12 gap-4">
          <div className="col-span-full">Set Price Range</div>
          <div className="col-span-full">Current price 41.494 Test V4 WETH</div>
          <div className="col-span-full">
            <WalletSharp
              color={"#ffffff"}
              title="Wallet sharp"
              height="250px"
              width="250px"
            />
          </div>
          <div className="col-span-full">Your position will appear here</div>
          <div className="col-span-full grid grid-cols-12 gap-2">
            <div className="col-start-1 col-end-7">Min Price</div>
            <div className="col-start-7 col-end-13">Max Price</div>
            <div className="col-start-1 col-end-3">
              <input
                type="number"
                placeholder="0.000"
                min="0.00"
                step="0.001"
                onChange={(e) => setMinPrice(e.target.value)}
              />
              {tokenOne.name || "ETH"} per {tokenTwo.name || "Select"}
            </div>
            <div className="col-start-3 col-end-5">{minPrice}</div>
            <div className="col-start-5 col-end-7">
              {/* <AddCircleSharp
                color={"#ffffff"}
                title="Add"
                height="1.5rem"
                width="1.5rem"
                onClick={() => minPriceIncrease()}
              /> */}
            </div>
            <div className="col-start-7 col-end-9">
              <input
                type="number"
                placeholder="0.000"
                min="0.00"
                step="0.001"
                onChange={(e) => setMaxPrice(e.target.value)}
              />
              {tokenOne.name || "ETH"} per {tokenTwo.name || "Select"}
            </div>
            <div className="col-start-9 col-end-11">{maxPrice}</div>
            <div className="col-start-11 col-end-13">
              <AddCircleSharp
                color={"#ffffff"}
                title="Add"
                height="1.5rem"
                width="1.5rem"
                onClick={() => maxPriceIncrease()}
              />
            </div>
            <div className="col-span-full">Full Range Delete it</div>
            <div className="col-span-full">
              <button
                onClick={() =>
                  createLiquidityAndPool({
                    tokenAddress0: tokenOne.address,
                    tokenAddress1: tokenTwo.address,
                    fee: fee,
                    tokenPrice1: minPrice,
                    tokenPrice2: maxPrice,
                    slippage,
                    deadline,
                    tokenAmountOne,
                    tokenAmountTwo,
                  })
                }
              >
                Add Liquidity
              </button>
            </div>
          </div>
        </div>
        {visibilityStatus["TokenComponent"] && (
          <Token
            dispatch={dispatch}
            slippage={slippage}
            setSlippage={setSlippage}
            deadline={deadline}
            setDeadline={setDeadline}
          />
        )}
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
    </article>
  );
};

export default PoolAdd;
