# Poe::Sniper

Poe::Sniper is a desktop app that notifies you in-game when items you’re looking for are listed for trading in Path of Exile. It is an alternative to keeping several browser tabs open but it consumes far less resources and you don’t have to switch between the game and your browser all the time. You can use the same custom search criteria and can even message the seller instantly.

Supported trade sites:
- [poe.trade](https://poe.trade/)
- [pathofexile.com/trade](https://www.pathofexile.com/trade/search/) (currently in closed beta)

*Important notice: We're currently revamping this project, making `pathofexile.com/trade` support available to everyone. This repository will host the new app as soon as it's ready. If you'd like to get notified, write me a mail at `git.thisismydesign@gmail.com`.*

*You are viewing the README of version [v0.6.0](https://github.com/thisismydesign/poe-sniper/releases/tag/v0.6.0). You can find other releases [here](https://github.com/thisismydesign/poe-sniper/releases).*

| Branch | Status |
| ------ | ------ |
| Release | [![Build Status](https://travis-ci.org/thisismydesign/poe-sniper.svg?branch=release)](https://travis-ci.org/thisismydesign/poe-sniper/branches)   [![Build status](https://ci.appveyor.com/api/projects/status/7ft4qq0exr0nkr40/branch/master?svg=true)](https://ci.appveyor.com/project/thisismydesign/poe-sniper/branch/release)   [![Coverage Status](https://coveralls.io/repos/github/thisismydesign/poe-sniper/badge.svg?branch=release)](https://coveralls.io/github/thisismydesign/poe-sniper?branch=release) |
| Development | [![Build Status](https://travis-ci.org/thisismydesign/poe-sniper.svg?branch=master)](https://travis-ci.org/thisismydesign/poe-sniper/branches)   [![Build status](https://ci.appveyor.com/api/projects/status/7ft4qq0exr0nkr40/branch/master?svg=true)](https://ci.appveyor.com/project/thisismydesign/poe-sniper/branch/master)   [![Coverage Status](https://coveralls.io/repos/github/thisismydesign/poe-sniper/badge.svg?branch=master)](https://coveralls.io/github/thisismydesign/poe-sniper?branch=master)   [![Depfu](https://badges.depfu.com/badges/3e6a8a1eae324ce15a5e0f4d3dd81857/overview.svg)](https://depfu.com/github/thisismydesign/poe-sniper) |

## How does it work

- Add a list of links to your searches
- [Wait for notification to appear ingame](http://i.imgur.com/RkTK4DN.png)
- [Press button](http://i.imgur.com/QpZqHJD.png)
- Enjoy

## Features

- 100% ToS compliant
- Queries new listsings instantly via live mode
- Handles any custom search
- Uses Windows notifications which:
  - don't remove focus from the game
  - have a configurable timeout
  - are easily dismissable anytime
- Places whisper message on clipboard for faster interaction (sending message from clipboard can be automated to 1 button press)
- Consumes far less resources than running browser tabs
- Queues listings if more than one arrives within the configured notification timeframe (alerts that there are further items)

## Side effects

- PoE needs to run in windowed or windowed fullscreen mode for the notifications to show while ingame
- Your clipboard will be altered with every new notification

## Installation and configuration

Download the latest release (poe-sniper-v*.zip) from the [releases page](https://github.com/thisismydesign/poe-sniper/releases).
Extract it (preferably into it's own folder). Inside the folder you will find 3 files:
- poe-sniper.exe
- config.yaml
- example_input.yaml

[`example_input.yaml`](./artifacts/example_input.yaml) contains links to the searches you want to be notified about and a custom name for each search. If you're unsure about the [YAML format]((https://learn.getgrav.org/advanced/yaml)) just follow the example. Assuming the linked example you will receive notifications like: `New Tabula on Standard listed. ~b/o 10 chaos`. If you prefer, you can remove a trade site entirely.

[`config.yaml`](./artifacts/config.yaml) contains Poe::Sniper's configuration such as how long the notifications should last, where the input file is located, etc. Most notably, in order to use [pathofexile.com/trade](https://www.pathofexile.com/trade/search/) you neeed to specify: `session_id` ([instructions on where to find it](https://github.com/Stickymaddness/Procurement/wiki/SessionID)), `user_email` and `user_password` (you received these if participating in the beta). *Note: these are not your PoE credentials, you should never give those out to a third party.*

Modify `config.yaml` and `example_input.yaml` according to your needs.

## Usage

Run poe-sniper.exe

Certain versions of Windows might warn against running unverified apps. If prompted click `More info` and `Run anyway`.

Additionally you can automate pasting the message via [PoE TradeMacro](https://github.com/PoE-TradeMacro/POE-TradeMacro). Add the following as a custom macro: `F2::SendInput {Enter}^v{Enter}` as described [here](https://github.com/PoE-TradeMacro/POE-TradeMacro/wiki/Custom-Macros). This maps sending message from the clipboard to the F2 button.

You're all set. Enjoy your interrupt free PoE.

## Technical details

Written in Ruby, packaged as standalone Windows executable with [OCRA](https://github.com/larsch/ocra/).

*Please be aware that the app sends anonymous data to gather app usage statistics.*

### Usage from source

See default tasks in [`Rakefile`](Rakefile) for running tests and building the executable.

#### Prerequisites

- Install `poe-sniper-pro` gem
- Create `.env` file as described in the [Environment config](#environment-config) chapter

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

- Test socket connection retry by providing an incorrect `api_url` in `Poe::Sniper::PoeSniper.CONFIG`
- Test HTTP connection retry by going offline

### Analytics

The app is using [Segment](https://segment.com/) (via the [analytics-ruby](https://segment.com/docs/sources/server/ruby/) gem) to gather anonymous usage statistics.

Certificates are stored in [config/cacert.pem](config/cacert.pem) and are referenced in the `SSL_CERT_FILE` env var in order to fix the `certificate verify failed` issue on Windows ([see](https://gist.github.com/fnichol/867550)).

### Authentication

The app is using Firebase to authenticate against using user provided email and password.

### Environment config

Open source client side key handling sucks. The current approach to maximize obscurity is to read Base64 encoded keys from uncommitted environment variables stored in a `.env` file which is packaged with the build. These variables will be added to `.env` automatically during the build (in `ocra` Rake task). However they need to be set manually when running the app locally from source:
- `ANALYTICS_KEY`: Base64 encoded Segment app key (can be anything Base64 encoded; analytics won't work but also won't produce errors)
- `AUTH_KEY`: Base64 encoded Firebase app key (can be anything Base64 encoded; `pathofexilecom` input won't work)

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
