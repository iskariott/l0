const { ethers } = require('ethers');
const { readABI, getRandBetween, getRandTo } = require('../utils/iskariot-lib.js');
const { POLYGON_PROVIDER, POLYGON_GAS_LIMIT } = require('../utils/constants.js');

const L2Pass_CTR = '0x222228060E7Efbb1D78BB5D454581910e3922222';
const L2Pass_ABI = readABI('../abi/l2pass.abi.json');

const DEST_DATA = {
  KAVA: { id: 177, minMax: [0.0001, 0.01] },
  CELO: { id: 125, minMax: [0.0001, 0.01] },
  HARMONY: { id: 116, minMax: [0.01, 0.5] },
  FUSE: { id: 138, minMax: [0.01, 0.05] },
  MOONRIVER: { id: 167, minMax: [0.00001, 0.0001] },
  KLAYTN: { id: 150, minMax: [0.001, 0.05] },
  GNOSIS: { id: 145, minMax: [0.0001, 0.001] },
};

module.exports = async function l2pass_ref(pkey) {
  const chains = Object.keys(DEST_DATA);
  const rand_chain = chains[Math.floor(getRandTo(chains.length))];
  const dest = DEST_DATA[rand_chain];
  const amount = getRandBetween(dest.minMax[0], dest.minMax[1]).toFixed(8);
  const amountWei = ethers.utils.parseEther(amount);
  try {
    const signer = new ethers.Wallet(pkey, POLYGON_PROVIDER);
    const contract = new ethers.Contract(L2Pass_CTR, L2Pass_ABI, signer);
    const estimatedGas = await contract.estimateGasRefuelFee(
      dest.id,
      amountWei,
      signer.address,
      false,
    );
    const res = await contract.gasRefuel(
      dest.id,
      ethers.constants.AddressZero,
      amountWei,
      signer.address,
      {
        value: estimatedGas.nativeFee,
        nonce: await POLYGON_PROVIDER.getTransactionCount(signer.address),
        gasPrice: await POLYGON_PROVIDER.getGasPrice(),
        gasLimit: POLYGON_GAS_LIMIT,
      },
    );
    const { transactionHash } = await res.wait();
    console.log(`L2Pass # ${rand_chain} ${amount} refuel # Hash: ${transactionHash}`);
  } catch (e) {
    console.log(`ERROR L2Pass: ${e.code} # ${rand_chain} ${amount} refuel`);
  }
};
