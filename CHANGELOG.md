# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Common Changelog](https://common-changelog.org/), and this project adheres to [Semantic
Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.2] - 2022-07-26

### Changed

- Adhere to Common Changelog in `CHANGELOG.md` (@paulrberg)
- Change license from "Unlicense" to "MIT" (@paulrberg)

## [1.4.1] - 2022-03-29

### Fixed

- Handle empty directories two or more levels deep (@paulrberg)

## [1.4.0] - 2022-03-29

### Changed

- Bump version of `@typechain/hardhat`, `hardhat` and `typechain` peer dependencies (@paulrberg)
- Change directory tree in generated types now reflects the directory tree in the contracts inputs (@paulrberg)
- Upgrade to `@typechain/hardhat` v6.0.0 (@paulrberg)
- Upgrade to `hardhat` v2.9.2 (@paulrberg)
- Upgrade to `typechain` v8.0.0 (@paulrberg)

## [1.3.0] - 2022-02-17

### Changed

- Bump version of `@typechain/hardhat`, `hardhat` and `typechain` peer dependencies ([#12](https://github.com/paulrberg/hardhat-packager/issues/12)) (@paulrberg)
- Upgrade to `@typechain/hardhat` v4.0.0 (@paulrberg)
- Upgrade to `hardhat` v2.8.4 (@paulrberg)

## [1.2.1] - 2021-09-23

### Fixed

- Exclude the "common" file in TypeChain subtask ([#11](https://github.com/paulrberg/hardhat-packager/issues/11)) (@paulrberg)

## [1.2.0] - 2021-09-18

### Changed

- Affix version of `tempy` to v1.0.1 (@paulrberg)
- Change license from "WTFPL" to "Unlicense" (@paulrberg)
- Change the `TASK_` prefix to `SUBTASK_` for subtask constant names (@paulrberg)
- Polish README (@paulrberg)
- Set the `includeFactories` setting to `false` by default (@paulrberg)
- Upgrade to `@typechain/hardhat` v2.3.0 (@paulrberg)
- Upgrade to `hardhat` v2.6.4 (@paulrberg)

## [1.1.0] - 2021-08-09

### Added

- Allow users to include the TypeChain factories in the output (@paulrberg)

### Changed

- Rename `SUBTASK_PREPARE_PACKAGE_TYPECHAIN` task (@paulrberg)
- Separate the TypeChain subtask in core bindings and factories subtasks (@paulrberg)

## [1.0.5] - 2021-08-04

### Added

- Include the `CHANGELOG.md` file in package (@paulrberg)

### Fixed

- Bump version of `hardhat` and `typechain` peer dependencies (@paulrberg)

## [1.0.4] - 2021-08-03

### Fixed

- Fix typos in README (@paulrberg)

### Fixed

- Prevent the TypeChain `common.ts` file from being deleted (@paulrberg)

## [1.0.3] - 2021-08-02

### Changed

- Change the order of messages logged in the console (@paulrberg)

## [1.0.2] - 2021-08-02

### Added

- Add new fields in `package.json`: bugs, keywords, homepage and repository (@paulrberg)
- Add peer dependencies sa required by `@typechain/ethers-v5` (@paulrberg)

### Fixed

- Fix name of task in `README.md` (@paulrberg)
- Fix path to types in `package.json` (@paulrberg)

## [1.0.1] - 2021-08-02

_This release was unpublished from npm_

## [1.0.0] - 2021-08-02

### Added

- First release of the plugin (@paulrberg)

[1.4.1]: https://github.com/paulrberg/hardhat-packager/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/paulrberg/hardhat-packager/compare/v1.3.0...v1.4.0
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
