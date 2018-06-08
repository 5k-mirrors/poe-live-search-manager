# Poe::Sniper

**An important note before I add it to the app: be aware of formatting the input correctly. E.g. the last entry should not contain a comma at the end. You can learn more about the JSON format [here](https://www.w3schools.com/js/js_json.asp).**

Poe::Sniper is a desktop app that notifies you in-game when items you’re looking for are listed for trading in Path of Exile. It is an alternative to keeping several browser tabs open but it consumes far less resources and you don’t have to switch between the game and your browser all the time. You can use the same custom search criteria and can even message the seller instantly.

*You are viewing the README of the development version. You can find the README of the 0.4.2 release [here](https://github.com/thisismydesign/poe-sniper/tree/v0.4.2).*

| Branch | Status |
| ------ | ------ |
| Release | [![Build Status](https://travis-ci.org/thisismydesign/poe-sniper.svg?branch=release)](https://travis-ci.org/thisismydesign/poe-sniper/branches)   [![Build status](https://ci.appveyor.com/api/projects/status/7ft4qq0exr0nkr40/branch/master?svg=true)](https://ci.appveyor.com/project/thisismydesign/poe-sniper/branch/release)   [![Coverage Status](https://coveralls.io/repos/github/thisismydesign/poe-sniper/badge.svg?branch=release)](https://coveralls.io/github/thisismydesign/poe-sniper?branch=release) |
| Development | [![Build Status](https://travis-ci.org/thisismydesign/poe-sniper.svg?branch=master)](https://travis-ci.org/thisismydesign/poe-sniper/branches)   [![Build status](https://ci.appveyor.com/api/projects/status/7ft4qq0exr0nkr40/branch/master?svg=true)](https://ci.appveyor.com/project/thisismydesign/poe-sniper/branch/master)   [![Coverage Status](https://coveralls.io/repos/github/thisismydesign/poe-sniper/badge.svg?branch=master)](https://coveralls.io/github/thisismydesign/poe-sniper?branch=master)   [![Depfu](https://badges.depfu.com/badges/3e6a8a1eae324ce15a5e0f4d3dd81857/overview.svg)](https://depfu.com/github/thisismydesign/poe-sniper) |

## How does it work

- Copy search links from poe.trade
- [Wait for notification to appear ingame](http://i.imgur.com/RkTK4DN.png)
- [Press button](http://i.imgur.com/QpZqHJD.png)
- Enjoy

## Features

- 100% ToS compliant
- Queries new listsings instantly via poe.trade live mode
- Handles any custom search created via poe.trade
- Uses Windows notifications which:
  - don't remove focus from the game
  - have a configurable timeout
  - are easily dismissable anytime
- Places whisper message on clipboard for faster interaction
- Consumes far less resources than running poe.trade in browser
- Queues listings if more than one arrives within the configured notification timeframe (alerts that there are further items)

## Side effects

- PoE needs to run in windowed or windowed fullscreen mode for the notifications to show ingame
- Your clipboard will be altered with every new notification regardless whether you have any other content on it

## Installation and usage

Download the latest release (poe-sniper.zip) from the [releases page](https://github.com/thisismydesign/poe-sniper/releases).
Extract it, inside the poe-sniper folder you will find 3 files:
- poe-sniper.exe
- config.ini
- input/example_input.json

Modify `config.ini` and `example_input.json` according to your needs.

[`example_input.json`](https://github.com/thisismydesign/poe-sniper/blob/master/input/example_input.json) contains links to the searches you want to be notified about and a custom name for each search in [JSON format](https://www.w3schools.com/js/js_json.asp). Assuming the linked example you will receive notifications like: `New Tabula on BSC listed. ~b/o 10 chaos`. Be sure to include links in the same format as the example.

[`config.ini`](https://github.com/thisismydesign/poe-sniper/blob/master/input/config.ini) contains Poe::Sniper's configuration such as how long the notifications should last, where the input file is located, etc.

Run poe-sniper.exe

You're all set. Enjoy your interrupt free PoE.

Additionally [here's a modified version of the Lutbot AutoHotkey Macro](https://github.com/thisismydesign/poe-lutbot-ahk) where the 'Paste' option is added allowing you to hotkey sending messages from the clipboard. That's right. One click to set up a trade. It's awesome, I know!

## Disclaimer

This tool was created to improve the trading experience. We believe in creating a fair competition by making the best tools available to everyone. This is why we're releasing it to the public.

## Technical details

Written in Ruby, packaged as standalone Windows executable with [OCRA](https://github.com/larsch/ocra/).

*Please be aware that we're sending anonymous data to gather app usage statistics.*

### Usage from source

Create `.env` file as described in the [analytics chapter](#analytics). See default tasks in [`Rakefile`](Rakefile) for running tests and building the executable.

#### Start in normal mode

```
bundle
bundle exec rake start
```

#### Start in offline mode with example socket data

```
bundle
bundle exec rake start_offline_debug
```

#### Debug

- Test socket connection retry by providing an incorrect `api_url` in `config.ini`
- Test HTTP connection retry by going offline

### Analytics

The app is using [Segment](https://segment.com/) (via the [analytics-ruby](https://segment.com/docs/sources/server/ruby/) gem) to gather anonymous usage statistics. Open source client side key handling sucks, the current approach to maximize obscurity is to read the Base64 encoded write key from the uncommitted `ANALYTICS_KEY` environment variable stored in a `.env` file which is packaged with the build.

Certificates are stored in [config/cacert.pem](config/cacert.pem) and are referenced in the `SSL_CERT_FILE` env var in order to fix the `certificate verify failed` issue on Windows ([see](https://gist.github.com/fnichol/867550)).

### Known issues / Improvements / TODO

- Get rid of Nokogiri, find a non-native way to parse HTML
- Use a non-EM solution for websokets
  - Run sockets on their separate threads
    - Increase retry timeout freely since other sockets are no longer blocked

## Conventions

This app is developed using the following conventions:
- [Bundler's guide for developing a gem](http://bundler.io/v1.14/guides/creating_gem.html)
- [Better Specs](http://www.betterspecs.org/)
- [Semantic versioning](http://semver.org/)
- [RubyGems' guide on gem naming](http://guides.rubygems.org/name-your-gem/)
- [RFC memo about key words used to Indicate Requirement Levels](https://tools.ietf.org/html/rfc2119)
- [Bundler improvements](https://github.com/thisismydesign/bundler-improvements)

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/thisismydesign/poe-sniper.
