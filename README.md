# Poe::Sniper

https://github.com/5k-mirrors/poe-live-search-manager

Stack: Electron + React based on [minelectreactist](https://github.com/gomorizsolt/minelectreactist) which is based on [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate).

## Dev

```bash
cp .env.example .env
# Fill values in .env file
yarn install
yarn dev
```

## Build

```bash
yarn package
```

- Set up notifications on Windows: https://electronjs.org/docs/tutorial/notifications#windows

## Installation

- Install location on win10: `%localappdata%\Programs\PoE Live Search Manager`
- Data location on win10: `%APPDATA%\PoE Live Search Manager`
- `electron-store` data location on win10: `%APPDATA%\PoE Live Search Manager\config.json`
- `yarn dev` data on win10: `%APPDATA%\Electron`

## [Auto-update](doc/auto-update.md)
