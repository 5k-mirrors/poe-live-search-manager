# PoE Live Search Manager

#### Desktop tool for Path of Exile for managing live item searches and making instant offers without leaving the game.

It is an alternative to keeping several trade site tabs open in the browser and having to leave the game to check new items. It consumes far less resources and lets you message the seller instantly in-game.

Featured in:
- [POE: Easy Money Making - AUTO WHISPER - 5 Exalts PER HOUR - Multi-live search - Auto Whisper](https://youtu.be/dBqJ8-N5Ygs?t=1903) by Tripolar Bear
- [🔨 Exile's Toolkit 🔨 - How Live Search Manager Boosts League Start And Makes You Rich On The Fly](https://www.youtube.com/watch?v=KVgP5ZGZITc) by PoE Academy
- [Aura Stacker Build Diary: #24 (FREE Exalts w/ this 3rd Party TOOL)](https://youtu.be/DxHyKtJs-2Y?t=514) by KOBEBLACKMAMBA
- [[3.11] PoE: How To Trade EASY MODE - 87 LIVE SEARCHES - AUTO WHISPER - TRADE SETUP READY FOR USE](https://www.youtube.com/watch?v=8PDjzG5ZkcQ) by Tripolar Bear
- [[3.10] POE: Double Your Money - Multi-live search - Auto Whisper - 20 Live trade searches](https://www.youtube.com/watch?v=ArAKOWXZtU0) by Tripolar Bear
- [EASY EXALTED ORBS WITH ONLY TRADING // currency tipp // POE LURKER + POE LIVE SEARCH MANAGE](https://www.youtube.com/watch?v=O3oRpEdLTmY) by Justarockstarr
- [Path of Exile 3.10 Delirium - Как фармить валюту - микрогайд по флипу(50+екзов в день)](https://www.youtube.com/watch?v=Nw7ZDnLabkg) by poe bota
- and many more...

[According to GGG](https://www.poe-vault.com/news/2019/05/03/improvements-to-trading-in-path-of-exile-on-pc-are-they-coming), the current form of trading is not going to change. Still, it can be improved. We've been improving it [since Legacy league](/../../releases/tag/v0.1.0). Settle in for simpler, faster, in-game trading.

![demo](demo.gif)

## Features

- Queries new listings instantly via live mode
- Gathers all results in one screen
- Handles any custom search
- Uses Windows notifications which:
  - don't remove focus from the game
  - are easily dismissable anytime
  - can be turned off
- Places whisper message on clipboard for faster interaction (can be turned off)
- Consumes far less resources than running browser tabs
- Manage and import searches from YAML files (see [example file](doc/example-import-input.yml))
- Queues notifications if there are multiple ones

## Usage

- Download and run the latest portable [release](/../../releases).
- Add your [Session ID](https://github.com/Stickymaddness/Procurement/wiki/SessionID) in the Account tab.
- [Windows 10] [Disable Focus Assistant](https://www.howtogeek.com/fyi/windows-10s-next-update-will-hide-notifications-while-you-watch-videos/)
- Enjoy!

Note:
- For the notifications to show while in-game PoE needs to run in windowed or windowed fullscreen mode
- Your clipboard will be altered with every new whisper message (can be disabled)

## Troubleshooting

*If you encounter an issue, [report it](/../../issues/new/choose). Restarting the app can help resolve it.*

#### Searches not connecting?

- Make sure `pathofexile.com/trade` live search service works: open search in browser, click `Activate Live Search`, make sure new items are showing up.
- Your session ID can change. Make sure it's up-to-date. Logging in and out re-sets your session ID.
- There's a limit of 20 simultaneous connections. This is `pathofexile.com/trade` limitation, you can't connect more in the browser either.
- Restart the app, try reconnecting to all sockets and sockets 1-by-1.
- Make sure rate limit indicator is green while connecting.
- Search links can become invalid. If a few searches are not connecting make sure they are valid via checking them in the browser.
- You can have an IP which is blacklisted by Cloudflare ([1](https://www.reddit.com/r/pathofexile/comments/aw2p9j/trying_to_visit_pathofexilecom_and_i_get_this/), [2](https://www.reddit.com/r/pathofexile/comments/awscxe/anyone_issues_with_poe_website_captcha/)). You'll know this by getting a captcha when visiting `pathofexile.com`. Getting a new IP will resolve the issue.

#### Notifications not showing up?

*The app uses standard Windows notifications. If they don't show up the solution almost certainly has to do with your system settings.*

- Make sure Path of Exile runs in Windowed mode
- See if the "Test notification" on the Settings screen works
- Turn off "Focus assist" or add the app to priority apps
- Turn on "Get notifications from apps and other senders" in Notification settings
- Turn on notifications for the app in Notification settings
- Enable notification sound in Sound settings
- Search for further notification settings according to your Windows version

#### Notification settings

- Windows allows you to [change or turn off notification sounds](https://www.google.com/search?q=windows+notification+sound)
- Windows allows you to [change notification length](https://www.google.com/search?q=windows+notification+length). This is _not_ supported currently. Changing it from the default 5 seconds will cause the clipboard to be out of sync with the notifications.

## Development

Stack: Electron + React based on [minelectreactist](https://github.com/gomorizsolt/minelectreactist) which is based on [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate).

```bash
cp .env.example .env
# Fill values in .env file
yarn install
yarn lint
yarn test
yarn dev
```

### Build

```bash
yarn package
```

- Set up notifications on Windows: https://electronjs.org/docs/tutorial/notifications#windows

### App data

Data location is within `app.getPath("appData")` (on Win10 `%APPDATA%`, on WSL `/root/.config`). The name of the folder is `PoE Live Search Manager` for the packaged version or `Electron` for the dev version. `electron-store` data is in `config.json`.
