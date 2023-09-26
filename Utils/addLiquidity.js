import Web3Modal from "web3modal";
import { Contract, ethers } from "ethers";
import { Token } from "@uniswap/sdk-core";
import { Pool, Position, nearestUsableTick } from "@uniswap/v3-sdk";

const WETHAddress = "0x721d8077771Ebf9B931733986d619aceea412a1C";
const factoryAddress = "0x38c76A767d45Fc390160449948aF80569E2C4217";
const swapRouterAddress = "0xDC57724Ea354ec925BaFfCA0cCf8A1248a8E5CF1";
const nftDescriptorAddress = "0xfc073209b7936A771F77F63D42019a3a93311869";
const nonfungibleTokenPositionDescriptorAddress =
  "0xb4e9A5BC64DC07f890367F72941403EEd7faDCbB";
const nonfungiblePositionManagerAddress =
  "0xa8d297D643a11cE83b432e87eEBce6bee0fd2bAb";

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
  console.log("params", params);
  const nonfungiblePositionManager = new Contract(
    nonfungiblePositionManagerAddress,
    artifacts.NonfungiblePositionManager.abi,
    provider
  );
  console.log("nonfungiblePositionManager", nonfungiblePositionManager);

  const tx = await nonfungiblePositionManager.connect(signer).mint(params, {
    gasLimit: 1000000,
  });
  console.log("tx", tx);

  const receipt = await tx.wait();
  console.log("receipt", receipt);

  return receipt;
};
