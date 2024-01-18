const { DISABLE_CELO } = require('../config.js');
const angle = require('./angle.js');
const l2pass = require('./l2pass.js');
const stargate = require('./stargate.js');

module.exports = async function process(pkey) {
  const modules = [stargate, l2pass];
  if (!DISABLE_CELO) modules.push(angle);
  const rand = Math.floor(Math.random() * modules.length);
  await modules[rand](pkey);
};
