/* eslint-disable @typescript-eslint/no-empty-function, no-empty-pattern */
import path from "path";

import { TASK_TYPECHAIN } from "@typechain/hardhat/dist/constants";
import { Mock, expect, mockFn } from "earljs";
import fsExtra from "fs-extra";
import { TASK_COMPILE } from "hardhat/builtin-tasks/task-names";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { TASK_PREPARE_PACKAGE } from "../src/constants";
import { useEnvironment } from "./helpers";

const pathToArtifacts = path.join(__dirname, "fixture-projects/hardhat-project/artifacts");
const pathToBindings = path.join(__dirname, "fixture-projects/hardhat-project/typechain");

describe("Hardhat Packager", function () {
  useEnvironment("hardhat-project");

  let originalConsoleLog: any;
  let consoleLogMock: Mock<any, any>;

  beforeEach(async function () {
    await this.hre.run("clean");
    consoleLogMock = mockFn().returns(undefined);
    originalConsoleLog = console.log;
    console.log = consoleLogMock;
  });

  context("when the list of contracts to prepare is empty", function () {
    beforeEach(function () {
      this.hre.config.packager.contracts = [];
    });

    it("does nothing", async function () {
      await this.hre.run(TASK_PREPARE_PACKAGE);
      expect(consoleLogMock).toHaveBeenCalledWith([
        'No contracts to prepare. List them in the "packager" field of your Hardhat config file.',
      ]);
    });
  });

  context("when the list of contracts to prepare is not empty", function () {
    beforeEach(function () {
      this.hre.config.packager.contracts = ["A", "B"];
    });

    context("when the contract artifacts do not exist", function () {
      beforeEach(async function () {
        task(TASK_TYPECHAIN, "Disable the TypeChain task").setAction(async function (): Promise<void> {});
      });

      it("throws an error", async function () {
        await expect(this.hre.run(TASK_PREPARE_PACKAGE)).toBeRejected(
          "Please generate the contract artifacts before running this plugin",
        );
      });
    });

    context("when the contract artifacts exist", function () {
      context("when the TypeChain bindings do not exist", function () {
        beforeEach(async function () {
          task(TASK_COMPILE, "Override the Hardhat compile subtask").setAction(async function (
            taskArgs: TaskArguments,
            {},
            runSuper,
          ) {
            await runSuper({ ...taskArgs, noTypechain: true });
          });
        });

        it("throws an error", async function () {
          if (fsExtra.existsSync(pathToBindings)) {
            const bindings: string[] = await fsExtra.readdir(pathToBindings);
            console.log("it", { bindings });
          }
          await expect(this.hre.run(TASK_PREPARE_PACKAGE)).toBeRejected(
            "Please generate the TypeChain bindings before running this plugin",
          );
        });
      });

      context("when the TypeChain bindings exist", function () {
        it("prepares the contracta artifacts and the TypeChain bindings for registry deployment", async function () {
          await this.hre.run(TASK_PREPARE_PACKAGE);

          expect(fsExtra.existsSync(pathToArtifacts)).toEqual(true);
          expect(fsExtra.existsSync(pathToBindings)).toEqual(true);
          expect(fsExtra.existsSync(path.join(pathToBindings, "commons.ts"))).toEqual(true);

          expect(consoleLogMock).toHaveBeenCalledWith(["Preparing 2 contracts ..."]);
          expect(consoleLogMock).toHaveBeenCalledWith([`Successfully prepared 2 contracts for registry deployment!`]);
        });
      });
    });
  });

  afterEach(() => {
    console.log = originalConsoleLog;
  });
});
