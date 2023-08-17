import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// 테스트용 계정 키
const PrivateKey = "zz";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/XCt-P3uDrr8dOFY6qn9vftrQ--p2PEO4",
      chainId: 5,
      accounts: [`0x${PrivateKey}`],
    },
  },
};

export default config;
