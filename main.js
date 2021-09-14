const Web3 = require("web3");
const Tx = require("ethereumjs-tx").Transaction;
const Common = require('ethereumjs-common').default;

// wallet address (change to your own)
const walletAddr = "0x1D09...7fab";

// private key (change to your own)
// note: no 0x prefix
const privKey = new Buffer.from("61ae...8b36", "hex");

// contract address
const contractAddr = "0xce761d788df608bd21bdd59d6f4b54b2e27f25bb";

// blockchain info
const blockchain = Common.forCustomChain(
  'mainnet', {
      name: 'Fantom Opera',
      networkId: 250,
      chainId: 250
  },
  'petersburg'
)

// web3 provider
const web3Api = "https://rpc.fantom.network/"

// gas limit
const gasLimit = 40000;


const web3 = new Web3;
web3.setProvider(new Web3.providers.HttpProvider(web3Api));

const sendTransaction = async (fromAddr, toAddr, data) => {
  let nonce = await web3.eth.getTransactionCount(fromAddr);
  let gasPrice = await web3.eth.getGasPrice();
  let rawTransaction = {
      "from": fromAddr,
      "nonce": web3.utils.toHex(nonce),
      "gasPrice": web3.utils.toHex(gasPrice),
      "gasLimit": web3.utils.toHex(gasLimit),
      "to": toAddr,
      "value": "0x0",
      "data": data
  };

  let tx = new Tx(rawTransaction, {common: blockchain});
  tx.sign(privKey);
  let serializedTx = tx.serialize();

  web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'),
      function(err, hash) {
          if (!err) {
              console.log(hash);
          } else {
              console.log(err);
          }
      });
};

const adventure = async (id) => {
  let hexId = web3.utils.toHex(id).substr(2);
  sendTransaction(walletAddr, contractAddr, "0xb00b52f1" + "0".repeat(64 - hexId.length) + hexId);
}

