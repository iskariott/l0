const { ethers } = require('ethers');
const { readABI, approve, getTokenBalance } = require('../utils/iskariot-lib');
const { CELO_GAS_LIMIT, CELO_PROVIDER } = require('../utils/constants');
const { AMOUNT_PERCENT } = require('../config');

const AGEUR_CTR = '0xC16B81Af351BA9e64C1a069E3Ab18c244A1E3049';
const ANGLE_CTR = '0xf1dDcACA7D17f8030Ab2eb54f2D9811365EFe123';
const ANGLE_ABI = readABI('../abi/angle.abi.json');
const ADPT_PARAMS = '0x00010000000000000000000000000000000000000000000000000000000000030d40';

module.exports = async function angle(pkey) {
  const signer = new ethers.Wallet(pkey, CELO_PROVIDER);
  const ageurBalance = await getTokenBalance(signer.address, AGEUR_CTR, CELO_PROVIDER);
  const amount = ageurBalance * (AMOUNT_PERCENT / 100);
  if (amount < 1 / Math.pow(10, 8)) {
    console.log('Not enough agEUR');
    return;
  }
  try {
    const contract = new ethers.Contract(ANGLE_CTR, ANGLE_ABI, signer);
    const amountWei = ethers.utils.parseEther(amount.toFixed(8));
    const estimatedGas = await contract.estimateSendFee(
      145, // gnosis
      signer.address,
      amountWei,
      false,
      ADPT_PARAMS,
    );
    const gasPrice = await CELO_PROVIDER.getGasPrice();
    const a = await approve(signer, ANGLE_CTR, AGEUR_CTR, {
      amount: amountWei,
      gasPrice,
      CELO_GAS_LIMIT,
    });
    const res = await contract.send(
      145, // gnosis
      signer.address,
      amountWei,
      signer.address,
      ethers.constants.AddressZero,
      ADPT_PARAMS,
      {
        value: estimatedGas.nativeFee,
        gasPrice,
        gasLimit: CELO_GAS_LIMIT,
      },
    );
    const { transactionHash } = await res.wait();
    console.log(`Angle # CELO ${amount} agEUR -> GNOSIS # Hash: ${transactionHash}`);
  } catch (e) {
    console.log(`ERROR Angle: ${e.code} # CELO ${amount} agEUR -> GNOSIS`);
  }
};
