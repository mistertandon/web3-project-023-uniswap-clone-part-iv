import Image from "next/image";
import images from "./../../assets";
import { TOGGLE_SWAP_COMPONENT, Toggle } from "./../index";

const Token = ({ dispatch }) => {
  return (
    <section className="grid grid-flow-row grid-cols-12 col-span-full">
      <div className="col-start-4 col-end-7">Title</div>
      <div className="col-start-7 col-end-9">
        <Image
          src={images.close}
          alt="image"
          width={50}
          height={50}
          className="cursor-pointer"
          // onClick={() => setOpenSetting(false)}
          onClick={() => dispatch(TOGGLE_SWAP_COMPONENT)}
        />
      </div>
      <div className="col-start-4 col-end-9">
        Slippage tolerance
        <Image
          src={images.lock}
          alt="Slippage tolerance"
          width={20}
          height={20}
        />
      </div>
      <div className="col-start-4 col-end-9">
        <button>Auto</button>
        <input
          type="text"
          placeholder="0.10%"
        />
      </div>
      <div className="col-start-4 col-end-9">
        Slippage tolerance
        <Image
          src={images.lock}
          alt="Slippage tolerance"
          width={20}
          height={20}
        />
      </div>
      <div className="col-start-4 col-end-9">
        <input
          type="text"
          placeholder="0.10%"
        />
        <button>Minutes</button>
      </div>
      <h2 className="col-start-4 col-end-9">Interface setting</h2>
      <div className="col-start-4 col-end-9">
        Transaction Deadline
        <Toggle
          parentWidth={50}
          parentHeight={25}
          toggleBtnBgColor="#1AFFFF"
        />
      </div>
    </section>
  );
};

export default Token;
