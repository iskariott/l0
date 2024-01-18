const { ethers } = require('ethers');

// Providers
const CELO_PROVIDER = new ethers.providers.JsonRpcProvider('https://1rpc.io/celo');
const POLYGON_PROVIDER = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/polygon');
// const BNB_PROVIDER = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/bsc');
// const FTM_PROVIDER = new ethers.providers.JsonRpcProvider('https://1rpc.io/ftm');

// GasLimits
const POLYGON_GAS_LIMIT = 314018;
const CELO_GAS_LIMIT = 550563;

module.exports = {
  POLYGON_PROVIDER,
  POLYGON_GAS_LIMIT,
  CELO_PROVIDER,
  CELO_GAS_LIMIT,
};
