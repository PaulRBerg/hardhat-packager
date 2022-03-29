import { TASK_TYPECHAIN } from "@typechain/hardhat/dist/constants";
import fsExtra from "fs-extra";
import { extendConfig, subtask, task } from "hardhat/config";
import { HardhatPluginError } from "hardhat/plugins";
import { Artifact, HardhatConfig, HardhatUserConfig, TaskArguments } from "hardhat/types";
import { basename, extname, join, parse } from "path";
import tempy from "tempy";

import {
  PLUGIN_NAME,
  SUBTASK_PREPARE_PACKAGE_ARTIFACTS,
  SUBTASK_PREPARE_PACKAGE_TYPECHAIN,
  SUBTASK_PREPARE_PACKAGE_TYPECHAIN_FACTORIES,
  TASK_PREPARE_PACKAGE,
} from "./constants";
import { getEmptyDirectoriesRecursively, getFilesRecursively } from "./helpers";
import "./type-extensions";
import type { PackagerConfig } from "./types";

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
    await fsExtra.writeJson(join(temporaryPathToArtifacts, contract + ".json"), artifact, { spaces: 2 });
  }

  // Replace the previous artifacts directory.
  await fsExtra.remove(config.paths.artifacts);
  await fsExtra.move(temporaryPathToArtifacts, config.paths.artifacts);
});

subtask(SUBTASK_PREPARE_PACKAGE_TYPECHAIN).setAction(async function (_taskArgs: TaskArguments, { config }) {
  const pathToBindings: string = join(config.paths.root, config.typechain.outDir);
  if (!fsExtra.existsSync(pathToBindings)) {
    throw new HardhatPluginError(PLUGIN_NAME, "Please generate the TypeChain bindings before running this plugin");
  }

  // TypeChain generates some files that are shared across all bindings.
  const excludedFiles: string[] = ["common"];

  // Delete all bindings that have not been allowlisted.
  for await (const pathToBinding of getFilesRecursively(pathToBindings)) {
    const fileName: string = basename(pathToBinding, extname(pathToBinding));
    if (excludedFiles.includes(fileName)) {
      continue;
    }
    if (!config.packager.contracts.includes(fileName)) {
      await fsExtra.remove(pathToBinding);
    }
  }

  // Delete any remaining empty directories.
  for await (const pathToEmptyBindingDirectory of getEmptyDirectoriesRecursively(pathToBindings)) {
    await fsExtra.remove(pathToEmptyBindingDirectory);
  }
});

subtask(SUBTASK_PREPARE_PACKAGE_TYPECHAIN_FACTORIES).setAction(async function (_taskArgs: TaskArguments, { config }) {
  const pathToBindingsFactories: string = join(config.paths.root, config.typechain.outDir, "factories");
  if (!fsExtra.existsSync(pathToBindingsFactories)) {
    throw new HardhatPluginError(
      PLUGIN_NAME,
      "Please generate the TypeChain bindings factories before running this plugin",
    );
  }

  // Delete all bindings factories that have not been not allowlisted.
  for await (const pathToBindingFactory of getFilesRecursively(pathToBindingsFactories)) {
    const contract: string = parse(pathToBindingFactory).name.replace("__factory", "");
    if (!config.packager.contracts.includes(contract)) {
      await fsExtra.remove(pathToBindingFactory);
    }
  }

  // Delete any remaining empty directories.
  for await (const pathToEmptyBindingFactoryDirectory of getEmptyDirectoriesRecursively(pathToBindingsFactories)) {
    await fsExtra.remove(pathToEmptyBindingFactoryDirectory);
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

  // Prepare the TypeChain bindings factories if the user decided to include them.
  // This task is run first so we don't have to parse the factories twice.
  if (config.packager.includeFactories) {
    await run(SUBTASK_PREPARE_PACKAGE_TYPECHAIN_FACTORIES);
  }
  // Or otherwise remove them.
  else {
    const pathToBindingsFactories: string = join(config.paths.root, config.typechain.outDir, "factories");
    await fsExtra.remove(pathToBindingsFactories);
  }

  // Prepare the TypeChain bindings.
  await run(SUBTASK_PREPARE_PACKAGE_TYPECHAIN);

  // Let the user know that the package has been prepared successfully.
  console.log(`Successfully prepared ${config.packager.contracts.length} contracts for registry deployment!`);
});
