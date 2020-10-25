# Auto-update

The app is automatically updated from https://github.com/5k-mirrors/poe-live-search-manager/releases via [electron-builder](https://github.com/electron-userland/electron-builder)'s auto-update feature. [Automatic publishing of release drafts](https://www.electron.build/configuration/publish) is done via GH user [c-hive-bot](https://github.com/c-hive-bot)'s personal access token.

Known issues:
- https://github.com/electron-userland/electron-builder/issues/4233 (`publish` config must be set)
- https://github.com/electron-userland/electron-builder/issues/4469

Other resources:
- https://github.com/electron-userland/electron-builder/issues/3053
- https://stackoverflow.com/questions/51003995/how-can-i-test-electron-builder-auto-update-flow

## Testing

### Download and install test in dev mode

Customize steps in `app.js`.

```sh
yarn dev:update
```

### End-to-end test

Setup 2 repos:
- public one for hosting releases (e.g. fork of https://github.com/5k-mirrors/poe-live-search-manager)
- private one for hosting the code (e.g. checkout of this repo with the remote removed to avoid mistakes: `git remote remove origin`)

Setup steps:
- OS
  - remove the previous version of the app, if any
  - test install and uninstall one more time, clear registry if needed: https://github.com/5k-mirrors/poe-live-search-manager/issues/53#issuecomment-537375953
- Code repo:
  - set `autoUpdater.setFeedURL()` to the public repo
  - [optional] empty `release/` if exists
  - build and install the app locally

Make changes in the code, then make a new build:

- [optional] empty `release/`
- bump version in `package.json`
```sh
git add *
git commit --allow-empty -m "Bump version to $version" --no-verify
git tag $version
yarn package
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

Make sure:

- user data is still there
