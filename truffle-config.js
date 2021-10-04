const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config({path: "./.env"});
const AccountIndex =0;

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: 5777 // Match any network id
    },
    ganache_local: {
      provider: function(){
        return new HDWalletProvider(process.env.MNEMONIC,"http://127.0.0.1:7545", AccountIndex)
      },
      network_id: 5777
    },
    gorli_infura: {
      provider: function(){
        return new HDWalletProvider(process.env.MNEMONIC,"https://goerli.infura.io/v3/d9a1381804034c9381a18baa78698d9c", AccountIndex)
      },
      network_id: 5
    },
    ropsten_infura: {
      provider: function(){
        return new HDWalletProvider(process.env.MNEMONIC,"wss://ropsten.infura.io/ws/v3/d9a1381804034c9381a18baa78698d9c", AccountIndex)
      },
      network_id: 3,
      networkCheckTimeout: 1000000
    }
  },
  compilers: {
    solc: {
      version: "0.6.1"
    }
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: process.env.etherscanAPI
  }
};
