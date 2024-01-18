const { ethers } = require('ethers');
const { readABI, getTokenBalance } = require('../utils/iskariot-lib.js');
const { POLYGON_PROVIDER, POLYGON_GAS_LIMIT } = require('../utils/constants.js');
const { AMOUNT_PERCENT } = require('../config.js');

const STARGATE_CTR = '0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590';
const STARGATE_ABI = readABI('../abi/stg.abi.json');
const ADAPTER_PARAMS = '0x00010000000000000000000000000000000000000000000000000000000000014c08';
const KAVA_NID = 177;

module.exports = async function stargate(pkey) {
  const signer = new ethers.Wallet(pkey, POLYGON_PROVIDER);
  const stgBalance = await getTokenBalance(signer.address, STARGATE_CTR, POLYGON_PROVIDER);
  const amount = (stgBalance * AMOUNT_PERCENT) / 100;
  if (amount < 0.0000000001) {
    console.log('Not enough stg');
    return;
  }
  try {
    const contract = new ethers.Contract(STARGATE_CTR, STARGATE_ABI, signer);
    const amountWei = ethers.utils.parseEther(amount.toFixed(10));
    let adapterParams = ethers.utils.solidityPack(
      ['uint16', 'uint', 'uint', 'address'],
      [2, 200000, amountWei, signer.address],
    );
    const fee = await contract.estimateSendTokensFee(KAVA_NID, false, adapterParams);

    const res = await contract.sendTokens(
      KAVA_NID,
      signer.address,
      amountWei,
      ethers.constants.AddressZero,
      ADAPTER_PARAMS,
      {
        nonce: await POLYGON_PROVIDER.getTransactionCount(signer.address),
        value: fee.nativeFee,
        gasPrice: await POLYGON_PROVIDER.getGasPrice(),
        gasLimit: POLYGON_GAS_LIMIT,
      },
    );
    const { transactionHash } = await res.wait();
    console.log(`Stargate # POLYGON ${amount} stg -> KAVA # Hash: ${transactionHash}`);
  } catch (e) {
    console.log(`ERROR Stargate: ${e.code} # POLYGON ${amount} stg -> KAVA`);
  }
};
