import React, { useState } from "react";
import Image from "next/image";
import { TokenGrid } from "./../Components";

const Tokens = () => {
  const [tokenList, setTokenList] = useState([
    {
      number: 1,
      image: "Image phldr",
      name: "Ether",
      symbol: "ETH",
      price: "$1616",
      change: "+ 50.4",
      tvl: "$4468 M",
      volume: "$488 M",
    },
    {
      number: 2,
      image: "Image phldr",
      name: "USDC Coin",
      symbol: "USDC",
      price: "$1616",
      change: "+ 50.4",
      tvl: "$4468 M",
      volume: "$488 M",
    },
    {
      number: 1,
      image: "Image phldr",
      name: "Wrapped BTC",
      symbol: "WBTC",
      price: "$1616",
      change: "+ 50.4",
      tvl: "$4468 M",
      volume: "$488 M",
    },
    {
      number: 1,
      image: "Image phldr",
      name: "Uniswap",
      symbol: "UNI",
      price: "$12,345",
      change: "+ 50.4",
      tvl: "$4468 M",
      volume: "$488 M",
    },
  ]);

  const [tokenListRef] = useState(tokenList);

  const [search, setSearch] = useState("");

  const [searchItem, setSearchItem] = useState(search);

  const searchHandler = (event) => {
    let {
      target: { value: searchKey },
    } = event;

    searchKey = searchKey.trim();

    if (searchKey) {
      const filteredTokens = tokenListRef.filter(({ name }) => {
        return name.toLowerCase().includes(searchKey.toLowerCase());
      });

      setTokenList(filteredTokens);
    } else {
      setTokenList(tokenListRef);
    }
  };

  return (
    <section className="max-w-[1440px] mx-[auto]">
      <section className="flex flex-row gap-4">
        <div>Ethereum</div>
        <div>
          <input
            placeholder="Search Token"
            onChange={(event) => searchHandler(event)}
          />
        </div>
      </section>
      <TokenGrid
        tokens={tokenList}
        headerListRef={{"image":"col-span-2", "name":"col-span-2", "symbol":"col-span-1", "price":"col-span-2", "change":"col-span-1", "tvl":"col-span-2", "volume":"col-span-2"}}
      />
    </section>
  );
};

export { Tokens as default };
