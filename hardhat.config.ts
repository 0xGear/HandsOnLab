/**
 * @type import('hardhat/config').HardhatUserConfig
 */
import { task, HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
const ropsten_url = `https://eth-ropsten.alchemyapi.io/v2/LMb2vEzDIaCTnwz8A-JZtUgXbloZ-Xaq`;
const privateKey1 = `697404b751bcee032489adcf92ce67cff2c7d6428eda72d823edc20060960f08`;
const privateKey2 = `9af1e691e3db692cc9cad4e87b6490e099eb291e3b434a0d3f014dfd2bb747cc`;
const privateKey3 = `d26a199ae5b6bed1992439d1840f7cb400d0a55a0c9f796fa67d7c571fbb180e`;
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {version: "0.8.6"}
    ]
  },
  networks: {
    ropsten: {
      url: ropsten_url,
      accounts: [`0x${privateKey1}`, `0x${privateKey2}`, `0x${privateKey3}`]
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
    apiKey: "FX2K4B125IFXFSSQAW1QTUSUPDYE3UN4F1"
  },
  mocha: {
    timeout: 300 * 1e5,
  }
}

export default config;
