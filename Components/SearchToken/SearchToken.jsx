import { useState, useId } from "react";
import images from "./../../assets";

import Image from "next/image";
import { TOGGLE_SWAP_COMPONENT } from "./../index";

const SearchToken = ({ tokens, tokenData, dispatch }) => {
  const [activeToken, setActiveToken] = useState(null);

  return (
    <section className="grid grid-flow-row grid-cols-12 col-span-full">
      <div className="col-start-4 col-end-8 pl-2 justify-self-start">
        Select a token
      </div>
      <div className="col-start-8 col-end-10 pr-2 justify-self-end">
        <Image
          src={images.close}
          alt="image"
          width={50}
          height={50}
          className="cursor-pointer"
          onClick={() => dispatch(TOGGLE_SWAP_COMPONENT)}
        />
      </div>
      <div className="flex flex-row items-center justify-start col-start-4 col-end-10 pl-2 gap-x-2">
        <Image src={images.search} alt="search" width={20} height={20} />

        <input
          type="text"
          placeholder="Search name or pass Token address"
          className="bg-transparent border-none outline-none color-white"
        />
      </div>
      <div className="grid grid-cols-12 col-start-4 col-end-10 gap-2 col-span-full">
        {tokenData.map(({ name, symbol, image: tokenImage, address }) => {
          const uidRef = useId();
          return (
            <div
              key={uidRef}
              className="flex flex-row items-center col-span-3 row-span-1 pt-2 border-2 justify-evenly border-[#ffffff] rounded-md"
            >
              <p
                className="p-0 m-0"
                onClick={() =>
                  tokens({ name, symbol, image: tokenImage, address })
                }
              >
                {symbol}
              </p>
              <Image
                src={tokenImage || images.ether}
                width={30}
                height={30}
                alt="Token Image"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SearchToken;
