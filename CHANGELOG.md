# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic
Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2022-02-17

### Changed

- Bump version of `@typechain/hardhat`, `hardhat` and `typechain` peer dependencies.
- Upgrade to `@typechain/hardhat` v4.0.0.
- Upgrade to `hardhat` v2.8.4.

## [1.2.1] - 2021-09-23

### Fixed

- Exclude "common" file in TypeChain subtask.

## [1.2.0] - 2021-09-18

### Changed

- Affix version of `tempy` to v1.0.1.
- License from "WTFPL" to "Unlicense".
- Polish README.
- Set the `includeFactories` setting to `false` by default.
- The `TASK_` prefix to `SUBTASK_` for subtask constant names.
- Upgrade to `@typechain/hardhat` v2.3.0.
- Upgrade to `hardhat` v2.6.4.

## [1.1.0] - 2021-08-09

### Added

- Allow users to include the TypeChain factories in the output.

### Changed

- Rename `SUBTASK_PREPARE_PACKAGE_TYPECHAIN` task.
- Separate the TypeChain subtask in core bindings and factories subtasks.

## [1.0.5] - 2021-08-04

### Added

- Include the `CHANGELOG.md` file in package.

### Fixed

- Bump version of `hardhat` and `typechain` peer dependencies.

## [1.0.4] - 2021-08-03

### Changed

- Fix typos in README.

### Fixed

- Do not delete the TypeChain `common.ts` file.

## [1.0.3] - 2021-08-02

### Changed

- The order of console logged messages.

## [1.0.2] - 2021-08-02

### Added

- New fields in `package.json`: bugs, keywords, homepage and repository.
- Peer dependencies required by `@typechain/ethers-v5`.

### Fixed

- Name of task in `README.md`.
- Path to types in `package.json`.

## [1.0.1] - 2021-08-02

YANKED.

## [1.0.0] - 2021-08-02

### Added

- First release of the plugin.

[1.3.0]: https://github.com/paulrberg/hardhat-packager/compare/v1.2.1...v1.3.0
[1.2.1]: https://github.com/paulrberg/hardhat-packager/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/paulrberg/hardhat-packager/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/paulrberg/hardhat-packager/compare/v1.0.5...v1.1.0
[1.0.5]: https://github.com/paulrberg/hardhat-packager/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/paulrberg/hardhat-packager/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/paulrberg/hardhat-packager/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/paulrberg/hardhat-packager/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/paulrberg/hardhat-packager/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/paulrberg/hardhat-packager/releases/tag/v1.0.0
