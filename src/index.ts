import "./type-extensions";

import path from "path";

import { TASK_TYPECHAIN } from "@typechain/hardhat/dist/constants";
import fsExtra from "fs-extra";
import { extendConfig, subtask, task } from "hardhat/config";
import { HardhatPluginError } from "hardhat/plugins";
import { Artifact, HardhatConfig, HardhatUserConfig, TaskArguments } from "hardhat/types";
import tempy from "tempy";

import {
  PLUGIN_NAME,
  TASK_PREPARE_PACKAGE,
  TASK_PREPARE_PACKAGE_ARTIFACTS,
  TASK_PREPARE_PACKAGE_TYPECHAIN,
} from "./constants";
import { PackagerConfig } from "./types";

extendConfig(function (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) {
  const defaultPackagerConfig: PackagerConfig = {
    contracts: [],
  };

  config.packager = {
    ...defaultPackagerConfig,
    ...userConfig.packager,
  };
});

subtask(TASK_PREPARE_PACKAGE_ARTIFACTS).setAction(async function (_taskArgs: TaskArguments, { artifacts, config }) {
  if (!fsExtra.existsSync(config.paths.artifacts)) {
    throw new HardhatPluginError(PLUGIN_NAME, "Please generate the contract artifacts before running this plugin");
  }

  // Aggregate the chosen contracts in a temporary directory.
  const temporaryPathToArtifacts: string = tempy.directory();
  for (const contract of config.packager.contracts) {
    const artifact: Artifact = await artifacts.readArtifact(contract);
    await fsExtra.writeJson(path.join(temporaryPathToArtifacts, contract + ".json"), artifact, { spaces: 2 });
  }

  // Replace the previous artifacts directory.
  await fsExtra.remove(config.paths.artifacts);
  await fsExtra.move(temporaryPathToArtifacts, config.paths.artifacts);
});

subtask(TASK_PREPARE_PACKAGE_TYPECHAIN).setAction(async function (taskArgs: TaskArguments, { config }) {
  const pathToBindings: string = path.join(config.paths.root, config.typechain.outDir);
  if (!fsExtra.existsSync(pathToBindings)) {
    throw new HardhatPluginError(PLUGIN_NAME, "Please generate the TypeChain bindings before running this plugin");
  }

  // Delete all bindings that were not allowlisted.
  // CAVEAT: this will delete the "factories" folder.
  const bindings: string[] = await fsExtra.readdir(pathToBindings);
  for (const binding of bindings) {
    const contract: string = binding.replace(".d.ts", "");
    if (!config.packager.contracts.includes(contract)) {
      const fullPath: string = path.join(pathToBindings, binding);
      await fsExtra.remove(fullPath);
    }
  }
});

task(
  TASK_PREPARE_PACKAGE,
  "Prepares the contract artifacts and the TypeChain bindings for registry deployment",
).setAction(async function (_taskArgs: TaskArguments, { config, run }): Promise<void> {
  if (config.packager.contracts.length === 0) {
    console.log(`No contracts to prepare. List them in the "packager" field of your Hardhat config file.`);
    return;
  }

  // Run the TypeChain task first. This runs the "compile" task internally, so the contract artifacts are generated too.
  await run(TASK_TYPECHAIN);

  // Let the user know that the package is being prepared.
  console.log(`Preparing ${config.packager.contracts.length} contracts ...`);

  // Prepare the contract artifacts.
  await run(TASK_PREPARE_PACKAGE_ARTIFACTS);

  // Prepare the TypeChain bindings.
  await run(TASK_PREPARE_PACKAGE_TYPECHAIN);

  // Let the user know that the package has been prepared successfully.
  console.log(`Successfully prepared ${config.packager.contracts.length} contracts for registry deployment!`);
});
