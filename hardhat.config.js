/**
* @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");

// const HARMONY_PRIVATE_KEY = process.env;
const HARMONY_PRIVATE_KEY = "49eb0deb6029d969230ebd5ece9f012d35897017b94cc87bbb570f7dc9c74b60";

module.exports = {
   // solidity: "0.8.4",
   // defaultNetwork: "ropsten",
   // networks: {
   //    hardhat: {},
   //    ropsten: {
   //       url: API_URL,
   //       accounts: [`0x${PRIVATE_KEY}`]
   //    }
   // },
   solidity: "0.8.4",
   networks: {
      testnet: {
         url: `https://api.s0.b.hmny.io`,
         accounts: [`0x${HARMONY_PRIVATE_KEY}`]
      },
      mainnet: {
         url: `https://api.harmony.one`,
         accounts: [`0x${HARMONY_PRIVATE_KEY}`]
      }
   }
}

