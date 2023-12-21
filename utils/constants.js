import { ethers } from 'ethers';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const HARMONY = '0x0551Ca9E33bada0355Dfce34685Ad3B73CF3Ad70';
const CORE = '0x0551Ca9E33bada0355Dfce34685Ad3B73CF3Ad70';
const MERKLY = '0x0E1f20075C90Ab31FC2Dd91E536e6990262CF76d';
export const MERKLY_ABI = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../abi/merkly.abi.json')),
);
export const CORE_ABI = JSON.parse(fs.readFileSync(path.join(__dirname, '../abi/core.abi.json')));
export const POLYGON_GAS_LIMIT = 238093;

export const polygonNetworkId = 137;
export const zoraNetworkId = 195;
export const POLYGON_PROVIDER = new ethers.providers.JsonRpcProvider(
  'https://rpc.ankr.com/polygon',
);
export const BNB_PROVIDER = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/bsc');

//Cotracts
// merkly
export const polygonContractAddress = '0xa184998eC58dc1dA77a1F9f1e361541257A50CF4';
// core
export const coreUSDTContract = '0x52e75D318cFB31f9A2EdFa2DFee26B161255B233';
