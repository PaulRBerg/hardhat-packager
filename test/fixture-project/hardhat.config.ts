// We load the plugin here.
import { HardhatUserConfig } from "hardhat/types";

import "../../src";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: "0.8.13",
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
};

export default config;
