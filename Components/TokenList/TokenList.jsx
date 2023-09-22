import { useId } from "react";
import Image from "next/image";
import images from "./../../assets";
import { TokenListPortal } from "./index";

const TokenList = ({
  tokenData,
  setOpenTokenBox,
  tokenModalCoordinates: {
    parentCHeight,
    parentCLeftCoord,
    parentCTopCoord,
    parentCWidth,
  },
}) => {
  const data = [1, 2, 3, 4, 5];

  const finalTopCoord = parentCTopCoord + parentCHeight;
  return (
    <section className="grid justify-center max-w-3xl grid-cols-12 gap-2">
      {typeof window === "object" ? (
        <TokenListPortal>
          <section
            style={{ top: `${finalTopCoord}px`, left: `${parentCLeftCoord}px` }}
            className="absolute top-0 right-0 grid items-center justify-center max-w-xs grid-cols-12 gap-2 mx-auto"
          >
            <div className="col-span-8">Tokenlist</div>
            <div className="col-span-4">
              <Image
                src={images.close}
                height={50}
                width={50}
                alt="Close"
                className="cursor-pointer"
                onClick={() => setOpenTokenBox(false)}
              />
            </div>
            <div className="grid items-center grid-cols-12 col-span-12 gap-2">
              {/* symbol: 'Boo', name: 'LF', balance: */}
              {/* : */}
              {tokenData.map(({ symbol, name, balance }) => {
                const keyId = useId();
                return (
                  <div
                    className="flex flex-row flex-wrap items-center col-span-full gap-x-1"
                    key={`${keyId}`}
                  >
                    <div className="flex-1 font-bold bg-[#C7C7C7] text-base rounded-lg px-2 py-1">
                      {symbol}
                    </div>
                    <div className="flex-1">{balance}</div>
                    <div className="flex-1">{name}</div>
                    <div className="w-full mt-2 border-0 border-b-2 border-solid"></div>
                  </div>
                );
              })}
            </div>
          </section>
        </TokenListPortal>
      ) : null}
    </section>
  );
};

export default TokenList;
