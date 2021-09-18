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
  SUBTASK_PREPARE_PACKAGE_ARTIFACTS,
  SUBTASK_PREPARE_PACKAGE_TYPECHAIN,
  SUBTASK_PREPARE_PACKAGE_TYPECHAIN_FACTORIES,
  TASK_PREPARE_PACKAGE,
} from "./constants";
import { PackagerConfig } from "./types";

extendConfig(function (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) {
  const defaultPackagerConfig: PackagerConfig = {
    contracts: [],
    includeFactories: false,
  };

  config.packager = {
    ...defaultPackagerConfig,
    ...userConfig.packager,
  };
});

subtask(SUBTASK_PREPARE_PACKAGE_ARTIFACTS).setAction(async function (_taskArgs: TaskArguments, { artifacts, config }) {
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

subtask(SUBTASK_PREPARE_PACKAGE_TYPECHAIN).setAction(async function (_taskArgs: TaskArguments, { config }) {
  const pathToBindings: string = path.join(config.paths.root, config.typechain.outDir);
  if (!fsExtra.existsSync(pathToBindings)) {
    throw new HardhatPluginError(PLUGIN_NAME, "Please generate the TypeChain bindings before running this plugin");
  }

  // TypeChain generates some files that are shared across all bindings.
  const excludedFiles: string[] = ["commons"];

  // Preclude the factories from being deleted only if the user opted in to keep them.
  if (config.packager.includeFactories) {
    excludedFiles.push("factories");
  }

  // Delete all bindings that were not allowlisted.
  const bindings: string[] = await fsExtra.readdir(pathToBindings);
  for (const binding of bindings) {
    const fileName: string = binding.replace(".d.ts", "").replace(".ts", "");
    if (excludedFiles.includes(fileName)) {
      continue;
    }
    if (!config.packager.contracts.includes(fileName)) {
      const pathToBinding: string = path.join(pathToBindings, binding);
      await fsExtra.remove(pathToBinding);
    }
  }
});

subtask(SUBTASK_PREPARE_PACKAGE_TYPECHAIN_FACTORIES).setAction(async function (_taskArgs: TaskArguments, { config }) {
  const pathToBindingsFactories: string = path.join(config.paths.root, config.typechain.outDir, "factories");
  if (!fsExtra.existsSync(pathToBindingsFactories)) {
    throw new HardhatPluginError(
      PLUGIN_NAME,
      "Please generate the TypeChain bindings factories before running this plugin",
    );
  }

  // Delete all bindings factories that were not allowlisted.
  const bindingFactories: string[] = await fsExtra.readdir(pathToBindingsFactories);
  for (const bindingFactory of bindingFactories) {
    const contract: string = path.parse(bindingFactory).name.replace("__factory", "");
    if (!config.packager.contracts.includes(contract)) {
      const pathToBindingFactory: string = path.join(pathToBindingsFactories, bindingFactory);
      await fsExtra.remove(pathToBindingFactory);
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
  await run(SUBTASK_PREPARE_PACKAGE_ARTIFACTS);

  // Prepare the TypeChain bindings.
  await run(SUBTASK_PREPARE_PACKAGE_TYPECHAIN);

  // Prepare the TypeChain bindings factories if the user decided to include them.
  if (config.packager.includeFactories) {
    await run(SUBTASK_PREPARE_PACKAGE_TYPECHAIN_FACTORIES);
  }

  // Let the user know that the package has been prepared successfully.
  console.log(`Successfully prepared ${config.packager.contracts.length} contracts for registry deployment!`);
});
