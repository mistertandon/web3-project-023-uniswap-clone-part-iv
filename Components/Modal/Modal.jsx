import { useState, useEffect } from "react";
import Image from "next/image";
import images from "./../../assets";

// const WALLET_MENU = ["Metamask", "Coinbase", "Wallet", "Wallet Connection"];
const WALLET_MENU = ["Metamask"];
const Modal = ({ setOpenModal, connectWallet }) => {
  return (
    <section className="absolute grid items-start grid-cols-12 gap-2 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <div className="self-center col-span-8 justify-self-center">
        Connect a wallet
      </div>
      <div className="col-span-4 justify-self-end">
        <Image
          className="cursor-pointer"
          src={images.close}
          width={48}
          height={48}
          onClick={() => setOpenModal(false)}
          alt="Close button"
        />
      </div>
      {WALLET_MENU.map((_walletName, idx) => (
        <div
          className="col-span-full bg-[#CFF80B] rounded-xl px-2"
          key={`_walletName_${idx}`}
        >
          <p onClick={() => connectWallet(_walletName)}>{_walletName}</p>
        </div>
      ))}
      <div className="px-2 col-span-full">
        By using this service, you acknowledge and agree that we are not
        responsible for any losses or damages that may arise from the use of
        this service or the use of any third-party wallet provider.
      </div>
    </section>
  );
};

export default Modal;
