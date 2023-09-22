import Web3Modal from "web3modal";
import { Contract, ethers } from "ethers";
import { Token } from "@uniswap/sdk-core";
import { Pool, Position, nearestUsableTick } from "@uniswap/v3-sdk";

const WETHAddress = "0xf18774574148852771c2631d7d06E2A6c8b44fCA";
const factoryAddress = "0x9f62EE65a8395824Ee0821eF2Dc4C947a23F0f25";
const swapRouterAddress = "0x20BBE62B175134D21b10C157498b663F048672bA";
const nftDescriptorAddress = "0x3AeEBbEe7CE00B11cB202d6D0F38D696A3f4Ff8e";
const nonfungibleTokenPositionDescriptorAddress =
  "0xB2ff9d5e60d68A52cea3cd041b32f1390A880365";
const nonfungiblePositionManagerAddress =
  "0xa68E430060f74F9821D2dC9A9E2CE3aF7d842EBe";

const artifacts = {
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
  UniswapV3Pool: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"),
  WETH9: require("../Context/WETH9.json"),
};

async function getPoolData(poolContract) {
  const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
    poolContract.tickSpacing(),
    poolContract.fee(),
    poolContract.liquidity(),
    poolContract.slot0(),
  ]);

  return {
    tickSpacing,
    fee,
    liquidity,
    sqrtPricex96: slot0[0],
    tick: slot0[1],
  };
}

export const addLiquidityExternal = async (
  tokenAddress1,
  tokenAddress2,
  poolAddress,
  poolFee,
  tokenAmount1,
  tokenAmount2
) => {
  const web3modal = await new Web3Modal();
  const connection = await web3modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const accountAddress = await signer.getAddress();

  const token1Contract = new Contract(
    tokenAddress1,
    artifacts.WETH9.abi,
    provider
  );

  const token2Contract = new Contract(
    tokenAddress2,
    artifacts.WETH9.abi,
    provider
  );

  await token1Contract
    .connect(signer)
    .approve(
      nonfungiblePositionManagerAddress,
      ethers.utils.parseEther(tokenAmount1.toString())
    );

  await token2Contract
    .connect(signer)
    .approve(
      nonfungiblePositionManagerAddress,
      ethers.utils.parseEther(tokenAmount2.toString())
    );

  const poolContract = new Contract(
    poolAddress,
    artifacts.UniswapV3Pool.abi,
    provider
  );

  const { chainId } = await provider.getNetwork();

  // Token1
  const token1Name = await token1Contract.name();
  const token1Symbol = await token1Contract.symbol();
  const token1Decimals = await token1Contract.decimals();
  const token1Address = await token1Contract.address;

  // Token1
  const token2Name = await token2Contract.name();
  const token2Symbol = await token2Contract.symbol();
  const token2Decimals = await token2Contract.decimals();
  const token2Address = await token2Contract.address;

  const TokenA = new Token(
    chainId,
    token1Address,
    token1Decimals,
    token1Name,
    token1Symbol
  );
  console.log("TokenA: ", TokenA);

  const TokenB = new Token(
    chainId,
    token2Address,
    token2Decimals,
    token2Name,
    token2Symbol
  );
  console.log("TokenB: ", TokenB);

  const poolData = await getPoolData(poolContract);
  console.log("poolData", poolData);

  const pool = new Pool(
    TokenA,
    TokenB,
    poolData.fee,
    poolData.sqrtPricex96.toString(),
    poolData.liquidity.toString(),
    poolData.tick
  );
  console.log("pool", pool);

  const position = new Position({
    pool,
    liquidity: ethers.utils.parseEther("1"),
    tickLower:
      nearestUsableTick(poolData.tick, poolData.tickSpacing) -
      poolData.tickSpacing * 2,
    tickUpper:
      nearestUsableTick(poolData.tick, poolData.tickSpacing) +
      poolData.tickSpacing * 2,
  });
  console.log("position: ", position);

  const { amount0: amount0Desired, amount1: amount1Desired } =
    position.mintAmounts;

  const params = {
    token0: tokenAddress1,
    token1: tokenAddress2,
    fee: poolData.fee,
    tickLower:
      nearestUsableTick(poolData.tick, poolData.tickSpacing) -
      poolData.tickSpacing * 2,
    tickUpper:
      nearestUsableTick(poolData.tick, poolData.tickSpacing) +
      poolData.tickSpacing * 2,
    amount0Desired: amount0Desired.toString(),
    amount1Desired: amount1Desired.toString(),
    amount0Min: 0,
    amount1Min: 0,
    recipient: accountAddress,
    deadline: Math.floor(Date.now / 1000) + 60 * 10,
  };

  const nonfungiblePositionManager = new Contract(
    nonfungiblePositionManagerAddress,
    artifacts.NonfungiblePositionManager.abi,
    provider
  );
  console.log("nonfungiblePositionManager", nonfungiblePositionManager);

  const tx = await nonfungiblePositionManager.connect(signer).mint(params, {
    gasLimit: "1000000",
  });
  console.log("tx", tx);

  const receipt = await tx.wait();
  console.log("receipt", receipt);

  return receipt;
};
