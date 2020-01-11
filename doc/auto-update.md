# Auto-update

The app is automatically updated from https://github.com/5k-mirrors/poe-sniper/releases via [electron-builder](https://github.com/electron-userland/electron-builder)'s auto-update feature.

Known issues:
- https://github.com/electron-userland/electron-builder/issues/4233 (`publish` config must be set)
- https://github.com/electron-userland/electron-builder/issues/4469

## Testing

Setup 2 repos:
- public one for hosting releases (e.g. fork of https://github.com/5k-mirrors/poe-sniper)
- private one for hosting the code (e.g. checkout of this repo with the remote removed to avoid mistakes: `git remote remove origin`)

Setup steps:
- OS
  - remove the previous version of the app, if any
  - test install and uninstall one more time, clear registry if needed: https://github.com/5k-mirrors/poe-sniper/issues/53#issuecomment-537375953
- Code repo:
  - set `autoUpdater.setFeedURL()` to the public repo
  - add env vars from `.env.example` temporarily to scripts/`build.js`
  - [optional] remove `portable` build target from `package.json/build/win/target` to speed up builds
  - [optional] update `scripts/build.js` to use `yarn package:win:local` to speed up build
  - [optional] empty `release/` if exists
  - build and install the app locally

Make changes in the code, then make a new build:

- [optional] empty `release/`
- bump version in `package.json`
```sh
git add *
git commit --allow-empty -m "Bump version to $version" --no-verify
git tag $version
yarn win:package:win
```

Create a new release in the public repo:

```sh
git remote -v
git add *
git commit --allow-empty -m "Bump version to $version" --no-verify
git tag $version
git push
git push --tags
```

- upload `*.exe.blockmap`, `latest.yml` and `*.exe` artifacts to the release

Restart the app

- soon there should be a notification about the update (needs to be downloaded in the background first)
