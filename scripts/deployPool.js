// npx hardhat run scripts/deployPool.js --network localhost

const WETHAddress = "0xf18774574148852771c2631d7d06E2A6c8b44fCA";
const factoryAddress = "0x9f62EE65a8395824Ee0821eF2Dc4C947a23F0f25";
const swapRouterAddress = "0x20BBE62B175134D21b10C157498b663F048672bA";
const nftDescriptorAddress = "0x3AeEBbEe7CE00B11cB202d6D0F38D696A3f4Ff8e";
const nonfungibleTokenPositionDescriptorAddress =
  "0xB2ff9d5e60d68A52cea3cd041b32f1390A880365";
const nonfungiblePositionMangerAddress =
  "0xa68E430060f74F9821D2dC9A9E2CE3aF7d842EBe";

const parveshAddress = "0x8B64968F69E669faCc86FA3484FD946f1bBE7c91";
const payalAddress = "0x9A86494Ba45eE1f9EEed9cFC0894f6C5d13a1F0b";
const jiyanshiAddress = "0xC0340c0831Aa40A0791cF8C3Ab4287EB0a9705d8";

const artifacts = {
  UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
};

const { Contract, BigNumber } = require("ethers");
const bn = require("BigNumber.js");
bn.config({
  EXPONENTIAL_AT: 999999,
  DECIMAL_PLACES: 40,
});

const MAINNET_URL =
  "https://eth-mainnet.g.alchemy.com/v2/d_i2rx_Ia6GaI5sQPI3I7tXhCdwEfTxQ";

const provider = new ethers.providers.JsonRpcProvider(MAINNET_URL);

function encodePriceSqrt(reserve1, reserve0) {
  return BigNumber.from(
    new bn(reserve1.toString())
      .div(reserve0.toString())
      .sqrt()
      .multipliedBy(new bn(2).pow(96))
      .integerValue(3)
      .toString()
  );
}

const nonfungiblePositionmanager = new Contract(
  nonfungiblePositionMangerAddress,
  artifacts.NonfungiblePositionManager.abi,
  provider
);

const factory = new Contract(
  factoryAddress,
  artifacts.UniswapV3Factory.abi,
  provider
);

async function deployPool(token0, token1, fee, price) {
  const [owner] = await ethers.getSigners();

  console.log(`Creating pool for ${token0} / ${token1}`);
  console.log("Creating pool...");
  const poolTx = await nonfungiblePositionmanager
    .connect(owner)
    .createAndInitializePoolIfNecessary(token0, token1, fee, price, {
      gasLimit: 5000000,
    });
  console.log("Pool created");
  console.log("Pool tx: ", poolTx);

  const poolAddress = await factory.connect(owner).getPool(token0, token1, fee);
  console.log(`Pool address is ${poolAddress}`);
  return poolAddress;
}

async function main() {
  const ppjPool = await deployPool(
    parveshAddress,
    payalAddress,
    500,
    encodePriceSqrt(1, 1)
  );

  console.log("ppjPool: ", ppjPool);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log("error", error);
    process.exit(1);
  });
/**
 * 
 console.log("Pool tx: ", poolTx);
 {
  type: 2,
  accessList: [],
  blockHash: '0x0274f0b19a8a3d9add58640fa56980df3259c68914173a7bc3dcc5d7ee6b6fa6',
  blockNumber: 18185067,
  transactionIndex: 0,
  confirmations: 1,
  from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  gasPrice: BigNumber { value: "23212612" },
  maxPriorityFeePerGas: BigNumber { value: "5564005" },
  maxFeePerGas: BigNumber { value: "23212612" },
  gasLimit: BigNumber { value: "5000000" },
  to: '0xa68E430060f74F9821D2dC9A9E2CE3aF7d842EBe',
  value: BigNumber { value: "0" },
  nonce: 572,
  data: '0x13ead5620000000000000000000000008b64968f69e669facc86fa3484fd946f1bbe7c910000000000000000000000009a86494ba45ee1f9eeed9cfc0894f6c5d13a1f0b00000000000000000000000000000000000000000000000000000000000001f4000000000000000000000000000000000  r: '0x23ff44854e710c5815a7685037ec2368c4ac3faa715f8871c571e520a2a11ed6',
  v: 0,
  creates: null,
  chainId: 31337,
}
Pool address is 0x4fc0f416Dc7676620C49F2e96FEBa9644E6865EA
 */
