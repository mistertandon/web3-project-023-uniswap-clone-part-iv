import axios from "axios";

const ETHERSCAN_API_KEY = "WVI56C7PPI77UKX9965BJYK5BJR5NNGDHI";

const getAbi = async (address) => {
  const url = "https://api.etherscan.io/api?module=contract&action=getabi&address="+address+"&apikey="+ETHERSCAN_API_KEY;

  const res = await axios.get(url);

  const abi = JSON.parse(res.data.result);
  return abi;
};

const getPoolImmutables = async (poolContract) => {
  const [token0, token1, fee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
  ]);

  return {
    token0,
    token1,
    fee,
  };
};

export { getAbi, getPoolImmutables };
