import path from "path";

import { resetHardhatContext } from "hardhat/plugins-testing";
import { HardhatRuntimeEnvironment } from "hardhat/types";

declare module "mocha" {
  interface Context {
    hre: HardhatRuntimeEnvironment;
  }
}

export function useEnvironment(fixtureProjectName: string): void {
  beforeEach("Loading Hardhat environment", async function () {
    process.chdir(path.join(__dirname, "fixture-projects", fixtureProjectName));
    this.hre = await import("hardhat");
  });

  afterEach("Resetting Hardhat", function () {
    resetHardhatContext();
  });
}
