import "@typechain/hardhat";
import "hardhat/types/config";

import { PackagerConfig, PackagerUserConfig } from "./types";

declare module "hardhat/types/config" {
  interface HardhatUserConfig {
    packager?: PackagerUserConfig;
  }

  interface HardhatConfig {
    packager: PackagerConfig;
  }
}
