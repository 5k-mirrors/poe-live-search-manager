# Poe::Sniper

https://github.com/5k-mirrors/poe-live-search-manager

Stack: Electron + React based on [minelectreactist](https://github.com/gomorizsolt/minelectreactist) which is based on [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate).

#### Setup

- Set up notifications (if on Windows): https://electronjs.org/docs/tutorial/notifications#windows
- Building portable executable: https://github.com/c-hive/poe-sniper/commit/5e15938f741d54206da0d582766513d88146a4bf

```bash
cp .env.example .env
yarn install
yarn dev
```

#### Installation

- Install location on win10: `%localappdata%\Programs\PoE Live Search Manager` (for old versions `PoE Sniper`)
- Data location on win10: `%APPDATA%\PoE Live Search Manager`
- `electron-store` data location on win10: `%APPDATA%\PoE Live Search Manager\config.json`
- `yarn dev` data on win10: `%APPDATA%\Electron`

## [Testing](doc/testing.md)

## [Auto-update](doc/auto-update.md)

## Known issues

- [NSIS installer keeps hanging around when the app is not uninstalled properly](https://github.com/electron-userland/electron-builder/issues/4057#issuecomment-537684523)
