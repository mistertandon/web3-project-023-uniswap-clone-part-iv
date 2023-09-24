import React, { useState } from "react";
import { Token, SearchToken } from "./../index";
import {
  CloseCircleSharp,
  AddCircleSharp,
  RemoveCircleSharp,
  WalletSharp,
  ArrowBackSharp,
  ArrowDownSharp,
} from "react-ionicons";

{
  /* <AddCircleSharp
  color={'#00000'} 
  title="Add"
  height="250px"
  width="250px"
/> */
}

const PoolAdd = () => {
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
    },
    {
      fee: "0.03%",
      info: "Best for stable pairs",
      number: "0% Select",
    },
    {
      fee: "1%",
      info: "Best for stable pairs",
      number: "0% Select",
    },
  ];

  const minPriceDecrease = () => {
    setMinPrice((val) => val - 1);
  };

  const minPriceIncrease = () => {
    setMinPrice((val) => val + 1);
  };

  const maxPriceDecrease = () => {
    setMaxPrice((val) => val - 1);
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
            />
          </div>
          <div className="">Add Liquidity</div>
          <div className="flex flex-row justify-between gap-4">
            <div className="">Clear All</div>
            <div className="">
              <CloseCircleSharp
                color={"#ffffff"}
                title={"Close"}
                height="1.25rem"
                width="1.25rem"
              />
            </div>
          </div>
        </div>

        <div className="col-start-1 col-end-7 grid grid-cols-12 gap-4">
          <div className="col-span-full">Select pair</div>
          <div className="col-start-1 col-end-7 flex flex-row justify-start gap-4">
            <div>Image</div>
            <div>Token A</div>
            <div>
              <ArrowDownSharp
                color={"#ffffff"}
                title="Down arrow"
                height="1.25rem"
                width="1.25rem"
              />
            </div>
          </div>
          <div className="col-start-7 col-end-13 flex flex-row justify-start gap-4">
            <div>Image</div>
            <div>Token B</div>
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
            <div className="col-start-8 col-end-12">Show</div>
            <div className="col-start-1 col-end-8">
              The % you will earn in fees
            </div>
          </div>
          <div className="col-span-full">Deposit amount</div>
          <div className="col-span-full grid grid-cols-12 gap-4">
            <div className="col-start-1 col-end-5">100000</div>
            <div className="col-start-5 col-end-9">T Symbol A</div>
            <div className="col-start-9 col-end-13">T Name A</div>
            <div className="col-start-5 col-end-13">T Balance A</div>
          </div>
          <div className="col-span-full grid grid-cols-12 gap-4">
            <div className="col-start-1 col-end-5">100000</div>
            <div className="col-start-5 col-end-9">T Symbol B</div>
            <div className="col-start-9 col-end-13">T Name B</div>
            <div className="col-start-5 col-end-13">T Balance B</div>
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
              <AddCircleSharp
                color={"#ffffff"}
                title="Add"
                height="1.5rem"
                width="1.5rem"
              />
            </div>
            <div className="col-start-3 col-end-5">VALUE</div>
            <div className="col-start-5 col-end-7">
              <RemoveCircleSharp
                color={"#ffffff"}
                title="Subtract"
                height="1.5rem"
                width="1.5rem"
              />
            </div>
            <div className="col-start-7 col-end-9">
              <AddCircleSharp
                color={"#ffffff"}
                title="Add"
                height="1.5rem"
                width="1.5rem"
              />
            </div>
            <div className="col-start-9 col-end-11">VALUE</div>
            <div className="col-start-11 col-end-13">
              <RemoveCircleSharp
                color={"#ffffff"}
                title="Subtract"
                height="1.5rem"
                width="1.5rem"
              />
            </div>
            <div className="col-span-full">Full Range</div>
            <div className="col-span-full">Enter a amount</div>
          </div>
        </div>
      </section>
    </article>
  );
};

export default PoolAdd;
