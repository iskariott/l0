import { ethers } from 'ethers';
import {
  POLYGON_PROVIDER,
  polygonContractAddress,
  MERKLY_ABI,
  zoraNetworkId,
  polygonNetworkId,
  POLYGON_GAS_LIMIT,
} from '../utils/constants.js';

const signer = new ethers.Wallet(
  'aa3cb467560c3a76eed233ba5129445710607e1f00a13ef63cd99d09b14c8ac2',
  POLYGON_PROVIDER,
);

const contract = new ethers.Contract(polygonContractAddress, MERKLY_ABI, signer);
const ethAmountToReceive = (0.001 / 2000).toFixed(5);
const amountWei = ethers.utils.parseEther(ethAmountToReceive.toString());
let adapterParams = ethers.utils.solidityPack(
  ['uint16', 'uint', 'uint', 'address'],
  [2, 200000, amountWei, signer.address],
);
const estimateGasBridgeFeeResponse = await contract.functions.estimateGasBridgeFee(
  zoraNetworkId,
  false,
  adapterParams,
);
const sendValue = estimateGasBridgeFeeResponse.nativeFee;
const data = contract.interface.encodeFunctionData('bridgeGas', [
  zoraNetworkId,
  signer.address,
  adapterParams,
]);

const feeData = await POLYGON_PROVIDER.getFeeData();

const tx = {
  type: 2,
  chainId: polygonNetworkId,
  to: polygonContractAddress,
  data: data,
  nonce: await POLYGON_PROVIDER.getTransactionCount(signer.address),
  gasLimit: POLYGON_GAS_LIMIT,
  value: sendValue,
  maxFeePerGas: Number(feeData.maxFeePerGas) * 1.5,
  maxPriorityFeePerGas: 50500000000,
};
const signedTx = await signer.signTransaction(tx);
const txResponse = await POLYGON_PROVIDER.sendTransaction(signedTx);
console.log(await txResponse.wait());
