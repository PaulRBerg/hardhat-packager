# Hardhat Packager [![Styled with Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io) [![Commitizen Friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![License: WTFPL](https://img.shields.io/badge/License-WTFPL-yellow.svg)](https://spdx.org/licenses/WTFPL.html)

Hardhat plugin for preparing the contract artifacts and the TypeChain bindings for registry deployment.

## Description

This plugin builds on top of TypeChain's [plugin](https://github.com/ethereum-ts/TypeChain/tree/master/packages/hardhat)
to prepare your contract artifacts and TypeChain bindings for being deployed to a package registry (e.g.
[npmjs.org](https://npmjs.org)). More specifically, it deletes all artifacts and bindings that are not in an allowlist of
contracts, minifying the folder structure in the process.

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

```
Prepares the contract artifacts and the TypeChain bindings for registry deployment
```

## Configuration

This plugin extends the `HardhatUserConfig` object with an optional `packager` object. This object contains one field,
`contracts`. This is an array of strings that represent the names of the smart contracts in your project. The plugin
uses this array as an allowlist for the artifacts and the bindings that should be kept for registry deployment.

An example for how to set it:

```js
module.exports = {
  packager: {
    contracts: ["MyToken", "ERC20"],
  },
};
```

## Usage

To use this plugin you need to decide which contracts you would like to be part of the package deployed to the registry.
Refer to the [configuration](/#configuration) section above.

Then, run it like this:

```sh
yarn hardhat prepare-package
```

Go look what you have in the `artifacts` and the `typechain` folders.

### Tips

- You may want to add the `artifacts/**/*.json`, `contracts/**/*.sol` and `typechain/**/*.d.ts` globs to the
  [files](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#files) field in your `package.json` file.
- You may want to blocklist some files, such as test contracts, which you can do with an
  [.npmignore](https://docs.npmjs.com/cli/v7/using-npm/developers#keeping-files-out-of-your-package) file.
- See how the plugin is integrated in [hifi-protocol](https://github.com/hifi-finance/hifi-protocol).

## License

The library is released under the [WTFPL License](./LICENSE.md).
