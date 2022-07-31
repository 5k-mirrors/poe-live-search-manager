# Poe::Sniper

https://github.com/5k-mirrors/poe-live-search-manager

Stack: Electron + React based on [minelectreactist](https://github.com/gomorizsolt/minelectreactist) which is based on [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate).

## Dev

```bash
cp .env.example .env
# Fill values in .env file
yarn install
yarn lint
yarn test
yarn dev
```

## Build

```bash
yarn package
```

- Set up notifications on Windows: https://electronjs.org/docs/tutorial/notifications#windows

## App data

Data location is within `app.getPath("appData")` (on Win10 `%APPDATA%`, on WSL `/root/.config`). The name of the folder is `PoE Live Search Manager` for the packaged version or `Electron` for the dev version. `electron-store` data is in `config.json`.
