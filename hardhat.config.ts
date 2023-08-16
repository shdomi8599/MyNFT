import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// 테스트용 계정 키
const PrivateKey =
  "d7e6b2426174282c0cde5cde7faef48f334b60350bea795a753e2c25955b0257";

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
    wemix_testnet: {
      url: "https://api.test.wemix.com",
      accounts: [`0x${PrivateKey}`],
      gasPrice: 101000000000,
    },
  },
};

export default config;
