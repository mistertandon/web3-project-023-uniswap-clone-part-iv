import React, { useReducer } from "react";
import {
  TOGGLE_TOKEN_COMPONENT,
  TOGGLE_SEARCH_TOKEN_A,
  TOGGLE_SEARCH_TOKEN_B,
} from "./tokenVisibilityReducer.constant";

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

const useTokenVisibilityReducer = () => {
  const [visibilityStatus, dispatch] = useReducer(componentVisibility, {
    swapComponent: true,
    TokenComponent: false,
    tokenAComponent: false,
    tokenBComponent: false,
  });

  return [visibilityStatus, dispatch];
};

export default useTokenVisibilityReducer;
