import { ethers } from 'ethers';
import { BNB_PROVIDER, coreUSDTContract, CORE_ABI } from '../utils/constants.js';

const signer = new ethers.Wallet(
  'aa3cb467560c3a76eed233ba5129445710607e1f00a13ef63cd99d09b14c8ac2',
  BNB_PROVIDER,
);

const contract = new ethers.Contract(coreUSDTContract, CORE_ABI, signer);

const amountWei = ethers.utils.parseUnits('0.00001', 6);

const callparams = [signer.address, '0x0000000000000000000000000000000000000000'];

let adapterParams = ethers.utils.solidityPack(
  ['uint16', 'uint', 'uint', 'address'],
  [2, 200000, amountWei, signer.address],
);

// const feeData = await BNB_PROVIDER.getFeeData();
// console.log(parseInt(feeData.gasPrice) / Math.pow(10, 6));
// console.log(parseInt(feeData.maxPriorityFeePerGas) / Math.pow(10, 6));
// console.log(parseInt(feeData.maxFeePerGas) / Math.pow(10, 6));

// const f = await contract.estimateBridgeFee(true, adapterParams);
// console.log(parseInt(f.nativeFee) / Math.pow(10, 18));
// console.log(parseInt(f.zroFee) / Math.pow(10, 18));

const r = await contract.bridge(
  '0x55d398326f99059fF775485246999027B3197955',
  15100000000000,
  signer.address,
  callparams,
  adapterParams,
  {
    // maxPriorityFeePerGas: 1000,
    // maxFeePerGas: 1000,
    value: 15100000000000,
    gasLimit: 263692,
  },
);

console.log(r);
console.log(await r.wait());
