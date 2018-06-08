# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Support for YAML format
- Issue template
- Fixed Ruby version to 2.3.3
- Rake tasks for development
- Own logger
- Many more tests
- Generation of release artifact in CI pipe

### Changed
- Input format default to YAML
- Improved generic error handling to be more user friendly
- Added handling of some specific errors (e.g. clipboard, input handling, redirect on fetching initial id)

### Removed
- Gemspec (because it's not compatible with OCRA in AppVeyor environment)

### Fixed
- OCRA build in AppVeyor pipe
- Namespacing

[Unreleased]: https://github.com/thisismydesign/poe-sniper/compare/v0.4.2...HEAD
