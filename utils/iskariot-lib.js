const readline=require("readline");
/**
 * CLI відлік часу в секундах
 * @param {number} time_s Звідки починати відлік.
 */function cliCountDown(time_s){return new Promise(resolve=>{function e(content,finished=!1){readline.clearLine(process.stdout,0),readline.cursorTo(process.stdout,0),finished||process.stdout.write(`Delay:${content}s`)}e(time_s);let t=setInterval(()=>{--time_s<=0?(clearInterval(t),e(0,!0),resolve()):e(time_s)},1e3)})}
/**
 * Очікувати на допустимий ETH gwei
 * @param {number} allowed_gwei Допустимий gwei.
 * @param {number} check_delay Інтервал між перевірками газу.
 */async function waitForGas(allowed_gwei,check_delay){const s=new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth");var e=parseValue(await s.getGasPrice(),9);if(!(e<=allowed_gwei)){console.log("Waiting for gas...");const o=content=>{readline.clearLine(process.stdout,0),readline.cursorTo(process.stdout,0),process.stdout.write(content)};return o("GWEI "+e.toFixed(2)),new Promise(r=>{let t=setInterval(async()=>{var e=parseValue(await s.getGasPrice(),9);o("GWEI "+e.toFixed(2)),e<=allowed_gwei&&(clearInterval(t),r())},1e3*check_delay)})}}
const ethers=require("ethers")["ethers"],ERC20_ABI=[{constant:!0,inputs:[],name:"decimals",outputs:[{internalType:"uint8",name:"",type:"uint8"}],payable:!1,stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"spender",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"approve",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"owner",type:"address"},{internalType:"address",name:"spender",type:"address"}],name:"allowance",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"account",type:"address"}],name:"balanceOf",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"}];
/**
 * Отримати баланс erc20 токена
 * @param {string} wallet Адреса evm гаманця.
 * @param {string} tokenContract Адреса контракту токена.
 * @param provider Провайдер мережі.
 */
async function getTokenBalance(wallet,tokenContract,provider){tokenContract=new ethers.Contract(tokenContract,ERC20_ABI,provider),provider=await tokenContract.balanceOf(wallet),wallet=await tokenContract.decimals();return ethers.utils.formatUnits(provider,wallet)}
/**
 * Перевірка allowance і апрув erc20 токена
 * @param signer
 * @param {string} router Адреса контракту роутера.
 * @param {string} tokenContract
 * @param {Object} approveData {amount, gasPrice, gasLimit}
 */async function approve(signer,router,tokenContract,approveData){var tokenContract=new ethers.Contract(tokenContract,ERC20_ABI,signer),signer=await tokenContract.allowance(signer.address,router);return!(parseInt(signer)>=parseInt(approveData.amount))&&(signer=await tokenContract.approve(router,approveData.amount,{gasPrice:approveData.gasPrice,gasLimit:approveData.gasLimit}),{transactionHash}=await signer.wait())}
const fs=require("fs"),path=require("path");function readWallets(filePath){var e=fs.readFileSync(filePath,{encoding:"utf-8"});return e.length?e.toString().split("\r\n"):(console.log(filePath+" is empty"),!1)}function readABI(filePath){return JSON.parse(fs.readFileSync(path.join(__dirname,filePath)))}
/**
 * Отримати останню ціну токенів
 * @param {string[]} tokens Імена токенів BTC, ETH, BNB...
 */
async function getTokensPrice(tokens){let t=await axios.get("https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol="+tokens.join(","),{headers:{"X-CMC_PRO_API_KEY":"dd712e75-4bcb-45cf-878e-fd3d36d57a2f"}}).then(r=>r.data.data);const e={};return tokens.forEach(tkn=>e[tkn]=t[tkn][0].quote.USD.price),e}

module.exports={cliCountDown:cliCountDown,waitForGas:waitForGas,getTokenBalance:getTokenBalance,approve:approve,readWallets:readWallets,readABI:readABI,getTokensPrice:getTokensPrice,shuffle:shuffle,getRandBetween:getRandBetween,getRandTo:getRandTo};
function shuffle(array){let a=array.length;for(;0<a;){var r=Math.floor(Math.random()*a);a--,[array[a],array[r]]=[array[r],array[a]]}return array}function getRandTo(max){return Math.random()*max}function getRandBetween(min,max){return Math.random()*(max-min)+min}