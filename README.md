# PoE Live Search Manager

#### Desktop tool for Path of Exile for managing live item searches and making instant offers without leaving the game.

It is an alternative to keeping several trade site tabs open in the browser and having to leave the game to check new items. It consumes far less resources and let's you message the seller instantly in-game.

Supported trade sites:
- [pathofexile.com/trade](https://www.pathofexile.com/trade/search/)

[According to GGG](https://www.poe-vault.com/news/2019/05/03/improvements-to-trading-in-path-of-exile-on-pc-are-they-coming), the current form of trading is not going to change. Still, it can be improved. We've been improving it [since Legacy league](/../../releases/tag/v0.1.0). Settle in for simpler, faster, in-game trading.

*You are viewing the README of version [v1.10.2](/../../releases/tag/v1.10.2). GitHub is only used to host releases and issues. You can find the old app and other releases [here](/../../releases).*

## Usage

![demo](demo.gif)

## Features

- ToS compliant, not breaking any rules
- Queries new listings instantly via live mode
- Handles any custom search
- Gathers all results in one screen
- Manage and import searches from YAML files (see [example file](example-import-input.yml))
- Uses Windows notifications which:
  - don't remove focus from the game
  - are easily dismissable anytime
  - can be turned off
- Places whisper message on clipboard for faster interaction (can be turned off)
- Consumes far less resources than running browser tabs
- Queues notifications if there are multiple ones

## Installation

- Download and run the latest [release](/../../releases).
- Windows sometimes warns you about installing unsigned apps. If prompted, click `More info` and `Run anyway`.
- The app will install and start.
- A destop shortcut is created and updates are installed on app start.
- Enjoy!

![install](install.gif)

## Troubleshooting

*If you encounter an issue, [report it](/../../issues/new/choose). Restarting the app can help resolve it.*

#### Searches not connecting?

- Make sure `pathofexile.com/trade` live search service works: open search in browser, click `Activate Live Search`, make sure new items are showing up.
- Your session ID can change. Make sure it's up-to-date.
- There's a limit of 80 simultaneous connections. This is `pathofexile.com/trade` limitation, you can't connect more in the browser either.
- Restart the app, try reconnecting to all sockets and sockets 1-by-1.
- Make sure rate limit indicator is green while connecting.
- Search links can become invalid. If a few searches are not connecting make sure they are valid via checking them in the browser.
- You can have an IP which is blacklisted by Cloudflare ([1](https://www.reddit.com/r/pathofexile/comments/aw2p9j/trying_to_visit_pathofexilecom_and_i_get_this/), [2](https://www.reddit.com/r/pathofexile/comments/awscxe/anyone_issues_with_poe_website_captcha/)). You'll know this by getting a captcha when visiting `pathofexile.com`. Getting a new IP will resolve the issue.

#### Notifications not showing up?

- Make sure Path of Exile runs in Windowed mode
- See if the "Test notification" on the Settings screen works. If it does, it's most likely an issue with Windows notification settings.
- Turn off "Focus assist" or add the app to priority apps
- Turn on "Get notifications from apps and other senders" in Notification settings
- Turn on notifications for the app in Notification settings
- Enable notification sound in Sound settings
- Search for further notification settings according to your Windows version

#### Notification settings

- Windows allows you to [change or turn off notification sounds](https://www.google.com/search?q=windows+notification+sound)
- Windows allows you to [change notification length](https://www.google.com/search?q=windows+notification+length). This is _not_ supported currently. Changing it from the default 5 seconds will cause the clipboard to be out of sync with the notifications.

#### Installation

- Installer hangs during re-installation: in special cases (e.g. manually touching files) the installation can be left in an inconsistent state and therefore broken. Follow steps [here](/../../issues/53#issuecomment-537375953).

## Caveats

- For the notifications to show while in-game PoE needs to run in windowed or windowed fullscreen mode
- When enabled, your clipboard will be altered with every new whisper message
