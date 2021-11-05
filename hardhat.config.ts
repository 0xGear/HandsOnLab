/**
 * @type import('hardhat/config').HardhatUserConfig
 */
import { task, HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
dotenvConfig({ path: resolve(__dirname, "./.env") });

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {version: "0.8.6"}
    ]
  },
  networks: {
    ropsten: {
      url: process.env.ropsten_url,
      accounts: [`0x${process.env.privateKey1}`, `0x${process.env.privateKey2}`, `0x${process.env.privateKey3}`, `0x${process.env.privateKey4}`]
    },
    /*
    hardhat: {
      forking: {
        url: ropsten_url, 
        // https://eth-ropsten.alchemyapi.io/v2/SECRET`,
        blockNumber: 9389313,
      },
      accounts: [`0x${privateKey}`],
    },
    */
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: `${process.env.etherscan_apy_key}`
  },
  mocha: {
    timeout: 300 * 1e5,
  }
}

export default config;
