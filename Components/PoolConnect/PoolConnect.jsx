import React, { useContext } from "react";
import {
  CloseCircleSharp,
  AddCircleSharp,
  RemoveCircleSharp,
  WalletSharp,
  ArrowBackSharp,
  ArrowDownSharp,
} from "react-ionicons";
import SwapTokenContext from "./../../Context/SwapContext";

const PoolConnect = ({ setClosePool }) => {
  const { account, createLiquidityAndPool, getAllLiquidity } =
    useContext(SwapTokenContext);
  return (
    <article>
      <section className="max-w-[1220px] mx-auto grid grid-cols-12 gap-4">
        <div className="col-start-1 col-end-7">
          <h3>Pool</h3>
        </div>
        <div
          className="col-start-7 col-end-13"
          onClick={() => {
            console.log("gotcha"), setClosePool(true);
          }}
        >
          New Position
        </div>
        {account ? (
          <div className="col-span-full">
            {getAllLiquidity.map((el, idx) => (
              <div key={`${idx}_`}>
                <div>{el.poolExample.token0.name}</div>
                <div>{el.poolExample.token1.name}</div>
                <div>
                  {el.poolExample.token0.name}/{el.poolExample.token1.name}
                </div>
                <div>
                  {`${el.poolExample.token0.name} Per ${el.poolExample.token1.name}`}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center">
            <WalletSharp
              color={"#ffffff"}
              title="Wallet sharp"
              height="250px"
              width="250px"
            />
          </div>
        )}

        <div className="col-span-full text-center">
          Your active V3 liquid positions will appear here
        </div>
        <div className="col-span-full text-center">Connect wallet</div>
        <div className="col-start-1 col-end-7 grid grid-flow-row gap-2">
          <div className="col-span-full">Learn about providing liquidity</div>
          <div className="col-span-full">
            Check out our V3 LP walkthorugh and migrate guide
          </div>
        </div>
        <div className="col-start-7 col-end-13 grid grid-flow-row gap-2">
          <div className="col-span-full">Top pools</div>
          <div className="col-span-full">Explore Uniswap Analytics</div>
        </div>
      </section>
    </article>
  );
};

export default PoolConnect;
