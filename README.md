# Poe::Sniper

#### Desktop tool for Path of Exile to make instant offers for listed items without leaving the game.


It is an alternative to keeping several browser tabs open but it consumes far less resources and you don’t need to switch between the game and the browser tabs all the time. You can use custom search criteria and message the seller instantly in-game.

Supported trade sites:
- [pathofexile.com/trade](https://www.pathofexile.com/trade/search/)

[According to GGG](https://www.poe-vault.com/news/2019/05/03/improvements-to-trading-in-path-of-exile-on-pc-are-they-coming), the current form of trading is not going to change. Still, it can be improved. We've been improving it [since Legacy league](https://github.com/5k-mirrors/poe-sniper/releases/tag/v0.1.0). Settle in for simpler, faster, in-game trading.

## Services

- [GitHub](https://github.com/5k-mirrors/poe-sniper) is used as a landing page and for tracking external issues
- [Test firebase instace](https://console.firebase.google.com/u/0/project/poe-sniper/overview)
- [Production firebase instace](https://console.firebase.google.com/u/0/project/poe-sniper-gateway/overview)

## Development

- Set up environment variables, see the hints in the [example](./.env.example) file.
- Set up notifications (if on Windows): https://electronjs.org/docs/tutorial/notifications#windows

```bash
yarn install
yarn dev
```

- Install location on win10: `C:\Users\streamer-rng\AppData\Local\Programs/<PoE Sniper | PoE Live Search Manager>`
- Data location on win10: `%APPDATA%/<PoE Sniper | PoE Live Search Manager>`
- electron-store data location on win10: `%APPDATA%/<PoE Sniper | PoE Live Search Manager>/config.json`

For Issues and PRs older than 2019.11.16 refer to: https://gitlab.com/c-hive/poe-sniper-electron and https://github.com/c-hive/poe-sniper/issues/108#issuecomment-554977101

## [Testing](doc/testing.md)

## [Auto-update](doc/auto-update.md)

## Known issues

- [Portable version - Windows notifications do not appear](https://github.com/electron-userland/electron-builder/issues/4054)
- [NSIS installer keeps hanging around when the app is not uninstalled properly](https://github.com/electron-userland/electron-builder/issues/4057#issuecomment-537684523)

## Caveats

- Specify which listeners should be detached with [`ipcRenderer.removeListener()`](https://electronjs.org/docs/api/ipc-renderer#ipcrendererremovelistenerchannel-listener) upon the component unmounts. Using [`ipcRenderer.removeAllListeners()`](https://electronjs.org/docs/api/ipc-renderer#ipcrendererremovealllistenerschannel) could cause side-effects because the function not only removes the component-specific listeners, but also the "global" ones.

## Rate limiting

Actions that count towards the rate limit:
- 1 per result for fetching item details

## QA

As a user, I can login, so that my subscription is recognized and can access gated content

- when logged out user visits either the trade or settings screen, it is redirected to the login screen
- when logged out user visits the input screen, it can see its searches
- when logged in user visits the account screen, it:
  - has access to its session id
  - has access to its current subscription state,
  - can refresh its subscription details
- when logged in user visits the settings screen, it can:
  - set the seconds elapsed between the appearance of each notification
  - send a test notification
  - turn on/off automatic whisper message copying

As a user, my settings are stored locally, so that I do not have to set them again

- when the user logs in, its previously stored settings are reloaded from the local storage
- when logged out user restarts the application, its input searches are reloaded
- when logged in user restarts the application, its input searches are reloaded and socket connections are executed
- when logged in user restarts the application, its session id is reloaded
- when the user logs out:
  - its session id is cleared
  - sockets are disconnected
  - it no longer receives OS notifications that are out of the queue
  - whisper messages do not alter clipboard

As a user, I can add a new search, so that I get notified for items matched by that search

- when the user tries to add a new row to the input table with wrong URL:
  - the save button does not react
  - a red line indicates it
- when logged out user adds a new row to the input table, socket connection does not happen
- when logged in user adds a new row to the input table without active subscription, socket connection does not happen
- when logged in user adds a new row to the input table with invalid session id, socket connection does not happen
- when logged in user adds a new row to the input table with active subscription and valid session id:
  - socket connection happens
  - whisper messages alter clipboard
  - it shows OS notifications in sequence
- when socket connection happens, the connection state is indicated in that row

As a user, I can delete searches, so that I do not get notified for items matched by that search

- when logged out user removes a search from the input table, the row is deleted
- when logged in user removes a disconnected search from the input table, the row is deleted
- when logged in user removes a connected search from the input table:
  - the socket is disconnected
  - the row is deleted
  - whisper messages do not alter clipboard
  - it no longer receives OS notifications that are out of the queue

As a user, I can reconnect to my searches, so that reinitialize my connections

- when the user clicks the reconnect button for a disconnected socket, it connects
- when the user clicks the reconnect button for a connected socket, it disconnects and then connects, which is visible to the user
- when the user reconnects to all of its sockets, the single socket reconnection is disabled
