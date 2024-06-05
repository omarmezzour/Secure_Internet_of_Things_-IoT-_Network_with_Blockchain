require('dotenv').config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

// const private_keys = [
//   process.env.PRIVATE_KEY_0,
//   process.env.PRIVATE_KEY_1,
// ];

// const mnemonic = process.env.MNEMONIC;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    // sepolia: {
    //   provider: () => new HDWalletProvider({
    //     privateKeys: private_keys,
    //     seedPhrase: mnemonic,
    //     providerOrUrl: 'https://sepolia.infura.io/v3/3fd9d1d06b7b4da79eb774b8b2661e13',
    //     numberOfAddresses: 2
    //   }),
    //   network_id: 11155111,
    //   gas: 5500000,
    //   confirmations: 2,
    //   timeoutBlocks: 200,
    //   skipDryRun: true
    // },
    dashboard: {
    }
  },
  compilers: {
    solc: {
      version: "0.8.18",
    }
  },
  db: {
    enabled: false,
    host: "127.0.0.1",
  }
};
