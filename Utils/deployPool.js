import { ethers, BigNumber } from "ethers";
import { axios } from "axios";
import Web3Modal from "web3modal";

const bn = require("bignumber.js");
bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

// factory address
const UNISWAP_V3_FACTORY_ADDRESS = "";

// nonfungiblePositionMangerAddress
const NON_FUNGIBLE_POSITION_MANAGER_ADDRESS = "";

const artifacts = {
  UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
};

export const fetchPoolContract = (signerOrProvider) => {
  return new ethers.Contract(
    UNISWAP_V3_FACTORY_ADDRESS,
    artifacts.UniswapV3Factory.abi,
    signerOrProvider
  );
};

export const fetchPositionContract = (signerOrProvider) => {
  return new ethers.Contract(
    NON_FUNGIBLE_POSITION_MANAGER_ADDRESS,
    artifacts.NonfungiblePositionManager.abi,
    signerOrProvider
  );
};

const encodePriceSqrt = (reserve1, reserve0) => {
  return BigNumber.from(
    new bn(reserve1.toString())
      .div(reserve0.toString())
      .sqrt()
      .multipliedBy(new bn(2).pow(96))
      .integerValue(3)
      .toString()
  );
};

export const connectingWithPoolContract = async (
  address1,
  address2,
  fee,
  tokenFee1,
  tokenFee2
) => {
  const web3modal = new Web3Modal();
  const connection = await web3modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();

  console.log("signer", signer);

  const createPoolContract = fetchPositionContract(signer);
  console.log("createPoolContract", createPoolContract);

  const price = encodePriceSqrt(tokenFee1, tokenFee2);
  console.log("price", price);

  const transaction = await createPoolContract
    .connect(signer)
    .createAndInitializePoolIfNecessary(address1, address2, fee, price, {
      gasLimit: 30000000,
    });
  console.log("transaction", transaction);
  await transaction.wait();

  const factory = fetchPoolContract(signer);
  const poolAddress = await factory.getPool(address1, address2, fee);

  return poolAddress;
};
