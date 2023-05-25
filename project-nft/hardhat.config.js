require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    //здесь указываем все сети, с которыми будем работать
    bnbtestnet: {
      url: "https://cool-sly-county.bsc-testnet.discover.quiknode.pro/6424b90e72571bc7d2f2451bb1b4e34ba7908163/", //RPC from my quicknode
      accounts: [
        "ba1a600e775f5de5042fc2b90c5e4cb0557e302de14b2d207641d3bf96cc8fa6",
      ],
      chainId: 97,
    },
  },
  etherscan: {
    apiKey: "K2GEMU8178XSR6QTXJMIC869R3P74MMPV5", // your Etherscan API key
  },
};
