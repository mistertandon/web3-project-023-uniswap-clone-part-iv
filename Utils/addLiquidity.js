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
    deadline: Math.floor(Date.now() / 1000) + 60 * 10,
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
/**
 * 
console.log("TokenA: ", TokenA);
{
    "chainId": 31337,
    "decimals": 18,
    "symbol": "Parvesh",
    "name": "PINNU",
    "isNative": false,
    "isToken": true,
    "address": "0x6Da3D07a6BF01F02fB41c02984a49B5d9Aa6ea92"
}

console.log("TokenB: ", TokenB);
{
    "chainId": 31337,
    "decimals": 18,
    "symbol": "Jiyanshi",
    "name": "JISH",
    "isNative": false,
    "isToken": true,
    "address": "0x9D3999af03458c11C78F7e6C0fAE712b455D4e33"
}

console.log("poolData", poolData);
{
    "tickSpacing": 60,
    "fee": 3000,
    "liquidity": {
        "type": "BigNumber",
        "hex": "0x00"
    },
    "sqrtPricex96": {
        "type": "BigNumber",
        "hex": "0x01000000000000000000000000"
    },
    "tick": 0
}

console.log("pool", pool);
{
    "token0": {
        "chainId": 31337,
        "decimals": 18,
        "symbol": "Parvesh",
        "name": "PINNU",
        "isNative": false,
        "isToken": true,
        "address": "0x6Da3D07a6BF01F02fB41c02984a49B5d9Aa6ea92"
    },
    "token1": {
        "chainId": 31337,
        "decimals": 18,
        "symbol": "Jiyanshi",
        "name": "JISH",
        "isNative": false,
        "isToken": true,
        "address": "0x9D3999af03458c11C78F7e6C0fAE712b455D4e33"
    },
    "fee": 3000,
    "sqrtRatioX96": [
        0,
        0,
        0,
        64
    ],
    "liquidity": [],
    "tickCurrent": 0,
    "tickDataProvider": {}
}

console.log("position: ", position);
{
    "_token0Amount": null,
    "_token1Amount": null,
    "_mintAmounts": null,
    "pool": {
        "token0": {
            "chainId": 31337,
            "decimals": 18,
            "symbol": "Parvesh",
            "name": "PINNU",
            "isNative": false,
            "isToken": true,
            "address": "0x6Da3D07a6BF01F02fB41c02984a49B5d9Aa6ea92"
        },
        "token1": {
            "chainId": 31337,
            "decimals": 18,
            "symbol": "Jiyanshi",
            "name": "JISH",
            "isNative": false,
            "isToken": true,
            "address": "0x9D3999af03458c11C78F7e6C0fAE712b455D4e33"
        },
        "fee": 3000,
        "sqrtRatioX96": [
            0,
            0,
            0,
            64
        ],
        "liquidity": [],
        "tickCurrent": 0,
        "tickDataProvider": {}
    },
    "tickLower": -120,
    "tickUpper": 120,
    "liquidity": [
        660865024,
        931322574
    ]
}

console.log("params", params);
{
    "token0": "0x6Da3D07a6BF01F02fB41c02984a49B5d9Aa6ea92",
    "token1": "0x9D3999af03458c11C78F7e6C0fAE712b455D4e33",
    "fee": 3000,
    "tickLower": -120,
    "tickUpper": 120,
    "amount0Desired": "5981737760509663",
    "amount1Desired": "5981737760509663",
    "amount0Min": 0,
    "amount1Min": 0,
    "recipient": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "deadline": 1695720751
}


console.log("nonfungiblePositionManager", nonfungiblePositionManager);
N/A


console.log("tx", tx);
{
    "hash": "0x8f465dc4b4fce6c4f3d314313dc27a6898b09ca47d6be696265091564dd13e82",
    "type": 2,
    "accessList": null,
    "blockHash": null,
    "blockNumber": null,
    "transactionIndex": null,
    "confirmations": 0,
    "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "gasPrice": {
        "type": "BigNumber",
        "hex": "0x5cb60171"
    },
    "maxPriorityFeePerGas": {
        "type": "BigNumber",
        "hex": "0x59682f00"
    },
    "maxFeePerGas": {
        "type": "BigNumber",
        "hex": "0x5cb60171"
    },
    "gasLimit": {
        "type": "BigNumber",
        "hex": "0x0f4240"
    },
    "to": "0xa8d297D643a11cE83b432e87eEBce6bee0fd2bAb",
    "value": {
        "type": "BigNumber",
        "hex": "0x00"
    },
    "nonce": 572,
    "data": "0x883164560000000000000000000000006da3d07a6bf01f02fb41c02984a49b5d9aa6ea920000000000000000000000009d3999af03458c11c78f7e6c0fae712b455d4e330000000000000000000000000000000000000000000000000000000000000bb8ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8800000000000000000000000000000000000000000000000000000000000000780000000000000000000000000000000000000000000000000015405bda5acedf0000000000000000000000000000000000000000000000000015405bda5acedf00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000000000000000000000000000000000006512a52f",
    "r": "0xc05900f029b70f9fce4ceb9b780d10974858da097388a713eabab54f80640b88",
    "s": "0x0b369cf963f79cb2fb8b1e34868222aeeae88e4dc36d78ab133b019102afdbe6",
    "v": 0,
    "creates": null,
    "chainId": 0
}

console.log("receipt", receipt);
{
    "to": "0xa8d297D643a11cE83b432e87eEBce6bee0fd2bAb",
    "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "contractAddress": null,
    "transactionIndex": 0,
    "gasUsed": {
        "type": "BigNumber",
        "hex": "0x096be7"
    },
    "logsBloom": "0x0000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000024000000000000000200400000000800000000000000000004000002000000000000000000000002000004020000090000080000000100081000000000001000000000000000000c000000000000000000000000000200000000000000000020000000020000000000000000000002000002000000000000004000000000000000000000000002000000200000080000000000000000002000000000000400000060000010000000000000800000001000040000001000041000000040000080000800",
    "blockHash": "0x176537c59027d89cbca136f02e804e9b8255eb6e74f7fb2754e3b3eea0abf77a",
    "transactionHash": "0x8f465dc4b4fce6c4f3d314313dc27a6898b09ca47d6be696265091564dd13e82",
    "logs": [
        {
            "transactionIndex": 0,
            "blockNumber": 18217841,
            "transactionHash": "0x8f465dc4b4fce6c4f3d314313dc27a6898b09ca47d6be696265091564dd13e82",
            "address": "0x6Da3D07a6BF01F02fB41c02984a49B5d9Aa6ea92",
            "topics": [
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266",
                "0x0000000000000000000000004aa2e838a6555a4f8d5380e1b4ed96cb0588b742"
            ],
            "data": "0x0000000000000000000000000000000000000000000000000015405bda5acedf",
            "logIndex": 0,
            "blockHash": "0x176537c59027d89cbca136f02e804e9b8255eb6e74f7fb2754e3b3eea0abf77a"
        },
        {
            "transactionIndex": 0,
            "blockNumber": 18217841,
            "transactionHash": "0x8f465dc4b4fce6c4f3d314313dc27a6898b09ca47d6be696265091564dd13e82",
            "address": "0x6Da3D07a6BF01F02fB41c02984a49B5d9Aa6ea92",
            "topics": [
                "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
                "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266",
                "0x000000000000000000000000a8d297d643a11ce83b432e87eebce6bee0fd2bab"
            ],
            "data": "0x00000000000000000000000000000000000000000000000ad7797bfeebc53121",
            "logIndex": 1,
            "blockHash": "0x176537c59027d89cbca136f02e804e9b8255eb6e74f7fb2754e3b3eea0abf77a"
        },
        {
            "transactionIndex": 0,
            "blockNumber": 18217841,
            "transactionHash": "0x8f465dc4b4fce6c4f3d314313dc27a6898b09ca47d6be696265091564dd13e82",
            "address": "0x9D3999af03458c11C78F7e6C0fAE712b455D4e33",
            "topics": [
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266",
                "0x0000000000000000000000004aa2e838a6555a4f8d5380e1b4ed96cb0588b742"
            ],
            "data": "0x0000000000000000000000000000000000000000000000000015405bda5acedf",
            "logIndex": 2,
            "blockHash": "0x176537c59027d89cbca136f02e804e9b8255eb6e74f7fb2754e3b3eea0abf77a"
        },
        {
            "transactionIndex": 0,
            "blockNumber": 18217841,
            "transactionHash": "0x8f465dc4b4fce6c4f3d314313dc27a6898b09ca47d6be696265091564dd13e82",
            "address": "0x9D3999af03458c11C78F7e6C0fAE712b455D4e33",
            "topics": [
                "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
                "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266",
                "0x000000000000000000000000a8d297d643a11ce83b432e87eebce6bee0fd2bab"
            ],
            "data": "0x00000000000000000000000000000000000000000000000ad7797bfeebc53121",
            "logIndex": 3,
            "blockHash": "0x176537c59027d89cbca136f02e804e9b8255eb6e74f7fb2754e3b3eea0abf77a"
        },
        {
            "transactionIndex": 0,
            "blockNumber": 18217841,
            "transactionHash": "0x8f465dc4b4fce6c4f3d314313dc27a6898b09ca47d6be696265091564dd13e82",
            "address": "0x4AA2E838a6555A4F8D5380E1B4ED96Cb0588b742",
            "topics": [
                "0x7a53080ba414158be7ec69b987b5fb7d07dee101fe85488f0853ae16239d0bde",
                "0x000000000000000000000000a8d297d643a11ce83b432e87eebce6bee0fd2bab",
                "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff88",
                "0x0000000000000000000000000000000000000000000000000000000000000078"
            ],
            "data": "0x000000000000000000000000a8d297d643a11ce83b432e87eebce6bee0fd2bab0000000000000000000000000000000000000000000000000de0b6b3a76400430000000000000000000000000000000000000000000000000015405bda5acedf0000000000000000000000000000000000000000000000000015405bda5acedf",
            "logIndex": 4,
            "blockHash": "0x176537c59027d89cbca136f02e804e9b8255eb6e74f7fb2754e3b3eea0abf77a"
        },
        {
            "transactionIndex": 0,
            "blockNumber": 18217841,
            "transactionHash": "0x8f465dc4b4fce6c4f3d314313dc27a6898b09ca47d6be696265091564dd13e82",
            "address": "0xa8d297D643a11cE83b432e87eEBce6bee0fd2bAb",
            "topics": [
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                "0x0000000000000000000000000000000000000000000000000000000000000000",
                "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266",
                "0x0000000000000000000000000000000000000000000000000000000000000001"
            ],
            "data": "0x",
            "logIndex": 5,
            "blockHash": "0x176537c59027d89cbca136f02e804e9b8255eb6e74f7fb2754e3b3eea0abf77a"
        },
        {
            "transactionIndex": 0,
            "blockNumber": 18217841,
            "transactionHash": "0x8f465dc4b4fce6c4f3d314313dc27a6898b09ca47d6be696265091564dd13e82",
            "address": "0xa8d297D643a11cE83b432e87eEBce6bee0fd2bAb",
            "topics": [
                "0x3067048beee31b25b2f1681f88dac838c8bba36af25bfb2b7cf7473a5847e35f",
                "0x0000000000000000000000000000000000000000000000000000000000000001"
            ],
            "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a76400430000000000000000000000000000000000000000000000000015405bda5acedf0000000000000000000000000000000000000000000000000015405bda5acedf",
            "logIndex": 6,
            "blockHash": "0x176537c59027d89cbca136f02e804e9b8255eb6e74f7fb2754e3b3eea0abf77a"
        }
    ],
    "blockNumber": 18217841,
    "confirmations": 1,
    "cumulativeGasUsed": {
        "type": "BigNumber",
        "hex": "0x096be7"
    },
    "effectiveGasPrice": {
        "type": "BigNumber",
        "hex": "0x5b40cb85"
    },
    "status": 1,
    "type": 2,
    "byzantium": true,
    "events": [
        {
            "transactionIndex": 0,
            "blockNumber": 18217841,
            "transactionHash": "0x8f465dc4b4fce6c4f3d314313dc27a6898b09ca47d6be696265091564dd13e82",
            "address": "0x6Da3D07a6BF01F02fB41c02984a49B5d9Aa6ea92",
            "topics": [
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266",
                "0x0000000000000000000000004aa2e838a6555a4f8d5380e1b4ed96cb0588b742"
            ],
            "data": "0x0000000000000000000000000000000000000000000000000015405bda5acedf",
            "logIndex": 0,
            "blockHash": "0x176537c59027d89cbca136f02e804e9b8255eb6e74f7fb2754e3b3eea0abf77a"
        },
        {
            "transactionIndex": 0,
            "blockNumber": 18217841,
            "transactionHash": "0x8f465dc4b4fce6c4f3d314313dc27a6898b09ca47d6be696265091564dd13e82",
            "address": "0x6Da3D07a6BF01F02fB41c02984a49B5d9Aa6ea92",
            "topics": [
                "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
                "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266",
                "0x000000000000000000000000a8d297d643a11ce83b432e87eebce6bee0fd2bab"
            ],
            "data": "0x00000000000000000000000000000000000000000000000ad7797bfeebc53121",
            "logIndex": 1,
            "blockHash": "0x176537c59027d89cbca136f02e804e9b8255eb6e74f7fb2754e3b3eea0abf77a"
        },
        {
            "transactionIndex": 0,
            "blockNumber": 18217841,
            "transactionHash": "0x8f465dc4b4fce6c4f3d314313dc27a6898b09ca47d6be696265091564dd13e82",
            "address": "0x9D3999af03458c11C78F7e6C0fAE712b455D4e33",
            "topics": [
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266",
                "0x0000000000000000000000004aa2e838a6555a4f8d5380e1b4ed96cb0588b742"
            ],
            "data": "0x0000000000000000000000000000000000000000000000000015405bda5acedf",
            "logIndex": 2,
            "blockHash": "0x176537c59027d89cbca136f02e804e9b8255eb6e74f7fb2754e3b3eea0abf77a"
        },
        {
            "transactionIndex": 0,
            "blockNumber": 18217841,
            "transactionHash": "0x8f465dc4b4fce6c4f3d314313dc27a6898b09ca47d6be696265091564dd13e82",
            "address": "0x9D3999af03458c11C78F7e6C0fAE712b455D4e33",
            "topics": [
                "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
                "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266",
                "0x000000000000000000000000a8d297d643a11ce83b432e87eebce6bee0fd2bab"
            ],
            "data": "0x00000000000000000000000000000000000000000000000ad7797bfeebc53121",
            "logIndex": 3,
            "blockHash": "0x176537c59027d89cbca136f02e804e9b8255eb6e74f7fb2754e3b3eea0abf77a"
        },
        {
            "transactionIndex": 0,
            "blockNumber": 18217841,
            "transactionHash": "0x8f465dc4b4fce6c4f3d314313dc27a6898b09ca47d6be696265091564dd13e82",
            "address": "0x4AA2E838a6555A4F8D5380E1B4ED96Cb0588b742",
            "topics": [
                "0x7a53080ba414158be7ec69b987b5fb7d07dee101fe85488f0853ae16239d0bde",
                "0x000000000000000000000000a8d297d643a11ce83b432e87eebce6bee0fd2bab",
                "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff88",
                "0x0000000000000000000000000000000000000000000000000000000000000078"
            ],
            "data": "0x000000000000000000000000a8d297d643a11ce83b432e87eebce6bee0fd2bab0000000000000000000000000000000000000000000000000de0b6b3a76400430000000000000000000000000000000000000000000000000015405bda5acedf0000000000000000000000000000000000000000000000000015405bda5acedf",
            "logIndex": 4,
            "blockHash": "0x176537c59027d89cbca136f02e804e9b8255eb6e74f7fb2754e3b3eea0abf77a"
        },
        {
            "transactionIndex": 0,
            "blockNumber": 18217841,
            "transactionHash": "0x8f465dc4b4fce6c4f3d314313dc27a6898b09ca47d6be696265091564dd13e82",
            "address": "0xa8d297D643a11cE83b432e87eEBce6bee0fd2bAb",
            "topics": [
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                "0x0000000000000000000000000000000000000000000000000000000000000000",
                "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266",
                "0x0000000000000000000000000000000000000000000000000000000000000001"
            ],
            "data": "0x",
            "logIndex": 5,
            "blockHash": "0x176537c59027d89cbca136f02e804e9b8255eb6e74f7fb2754e3b3eea0abf77a",
            "args": [
                "0x0000000000000000000000000000000000000000",
                "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                {
                    "type": "BigNumber",
                    "hex": "0x01"
                }
            ],
            "event": "Transfer",
            "eventSignature": "Transfer(address,address,uint256)"
        },
        {
            "transactionIndex": 0,
            "blockNumber": 18217841,
            "transactionHash": "0x8f465dc4b4fce6c4f3d314313dc27a6898b09ca47d6be696265091564dd13e82",
            "address": "0xa8d297D643a11cE83b432e87eEBce6bee0fd2bAb",
            "topics": [
                "0x3067048beee31b25b2f1681f88dac838c8bba36af25bfb2b7cf7473a5847e35f",
                "0x0000000000000000000000000000000000000000000000000000000000000001"
            ],
            "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a76400430000000000000000000000000000000000000000000000000015405bda5acedf0000000000000000000000000000000000000000000000000015405bda5acedf",
            "logIndex": 6,
            "blockHash": "0x176537c59027d89cbca136f02e804e9b8255eb6e74f7fb2754e3b3eea0abf77a",
            "args": [
                {
                    "type": "BigNumber",
                    "hex": "0x01"
                },
                {
                    "type": "BigNumber",
                    "hex": "0x0de0b6b3a7640043"
                },
                {
                    "type": "BigNumber",
                    "hex": "0x15405bda5acedf"
                },
                {
                    "type": "BigNumber",
                    "hex": "0x15405bda5acedf"
                }
            ],
            "event": "IncreaseLiquidity",
            "eventSignature": "IncreaseLiquidity(uint256,uint128,uint256,uint256)"
        }
    ]
}
 */
