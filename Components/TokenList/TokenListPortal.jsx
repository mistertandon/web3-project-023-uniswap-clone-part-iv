import { createPortal } from "react-dom";
const TokenListPortal = ({ children }) =>
  createPortal(children, document.getElementById("token-list-portal"));

export default TokenListPortal;
