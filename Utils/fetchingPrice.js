import { ethers } from "ethers";
import { abi as IUniswapV3PoolABI } from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { abi as QuoterABI } from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";

import { getAbi, getPoolImmutables } from "./priceHelper";

const MAINNET_URL =
  "https://eth-mainnet.g.alchemy.com/v2/d_i2rx_Ia6GaI5sQPI3I7tXhCdwEfTxQ";

const provider = new ethers.providers.JsonRpcProvider(MAINNET_URL);
const quoterAddress = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";

const getPrice = async (inputAmount, poolAddress) => {
  const poolContract = new ethers.Contract(
    poolAddress,
    IUniswapV3PoolABI,
    provider
  );

  const tokenAddress0 = await poolContract.token0();
  const tokenAddress1 = await poolContract.token1();
  console.log("tokenAddress0 : ", tokenAddress0);
  console.log("tokenAddress1 : ", tokenAddress1);

  const tokenABI0 = await getAbi(tokenAddress0);
  const tokenABI1 = await getAbi(tokenAddress1);

  const tokenContract0 = new ethers.Contract(
    tokenAddress0,
    tokenABI0,
    provider
  );
  const tokenContract1 = new ethers.Contract(
    tokenAddress1,
    tokenABI1,
    provider
  );

  const tokenSymbol0 = await tokenContract0.symbol();
  const tokenSymbol1 = await tokenContract1.symbol();

  const tokenDecimals0 = await tokenContract0.decimals();
  const tokenDecimals1 = await tokenContract1.decimals();

  const quoterContract = new ethers.Contract(
    quoterAddress,
    QuoterABI,
    provider
  );

  const immutables = await getPoolImmutables(poolContract);
  const amountIn = ethers.utils.parseUnits(
    inputAmount.toString(),
    tokenDecimals0
  );

  const quoterAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
    immutables.token0,
    immutables.token1,
    immutables.fee,
    amountIn,
    0
  );

  const amountOut = ethers.utils.formatUnits(quoterAmountOut, tokenDecimals1);

  return [amountOut, tokenSymbol0, tokenSymbol1];
};

export { getPrice };
