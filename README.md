# Hardhat Packager ![Continuous Integration](https://github.com/paulrberg/hardhat-packager/actions/workflows/integration.yml/badge.svg) [![Coverage Status](https://coveralls.io/repos/github/paulrberg/hardhat-packager/badge.svg?branch=main)](https://coveralls.io/github/paulrberg/hardhat-packager?branch=main) [![Styled with Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io) [![License: Unlicense](https://img.shields.io/badge/License-Unlicense-blue.svg)](https://unlicense.org/)

Hardhat plugin for preparing the contract artifacts and the TypeChain bindings for registry deployment.

## Description

This plugin builds on top the [TypeChain plugin](https://github.com/ethereum-ts/TypeChain/tree/master/packages/hardhat)
to prepare the contract artifacts and TypeChain bindings for being deployed to a package registry (e.g.
[npmjs.org](https://npmjs.org)). More specifically, it deletes all artifacts and bindings that are not in an allowlist of
contracts, minifying the directory structure in the process.

## Installation

First, install the plugin and its peer dependencies. If you are using Ethers or Waffle, run:

```sh
yarn add --dev hardhat-packager typechain @typechain/hardhat @typechain/ethers-v5
```

Or if you are using Truffle, run:

```sh
yarn add --dev hardhat-packager typechain @typechain/hardhat @typechain/truffle-v5
```

Second, import the plugin in your `hardhat.config.js`:

```js
require("@typechain/hardhat");
require("hardhat-packager");
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "@typechain/hardhat";
import "hardhat-packager";
```

## Required plugins

- [@typechain/hardhat](https://github.com/ethereum-ts/TypeChain/tree/master/packages/hardhat)

## Tasks

This plugin adds the _prepare-package_ task to Hardhat:

```text
Prepares the contract artifacts and the TypeChain bindings for registry deployment
```

## Environment Extensions

This plugin does not extend the Hardhat Runtime Environment.

## Configuration

This plugin extends the `HardhatUserConfig` object with an optional `packager` object. This object contains one field,
`contracts`. This is an array of strings that represent the names of the smart contracts in your project. The plugin
uses this array as an allowlist for the artifacts and the bindings that should be kept for registry deployment.

An example for how to set it:

```js
module.exports = {
  packager: {
    // What contracts to keep the artifacts and the bindings for.
    contracts: ["MyToken", "ERC20"],
    // Whether to include the TypeChain factories or not.
    // If this is enabled, you need to compile the TypeChain files with the TypeScript compiler before shipping to the registry.
    includeFactories: true,
  },
};
```

## Usage

To use this plugin you need to decide which contracts you would like to be part of the package deployed to the registry.
Refer to the [configuration](./README.md#configuration) section above.

Then run this:

```sh
yarn hardhat prepare-package
```

And go look what you got in the `artifacts` and the `typechain` directory.

### Tips

- You may want to add the `/artifacts`, `/contracts` and `/typechain` globs to the
  [files](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#files) field in your `package.json` file.
- You may want to blocklist some files, such as test contracts. You can do this via an
  [.npmignore](https://docs.npmjs.com/cli/v7/using-npm/developers#keeping-files-out-of-your-package) file.
- See how the plugin is integrated in [@hifi/protocol](https://github.com/hifi-finance/hifi/tree/main/packages/protocol), and how the artifacts and
  the bindings are used in [@hifi/deployers](https://github.com/hifi-finance/hifi/tree/main/packages/deployers).

## License

[Unlicense](./LICENSE.md)
