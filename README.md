# Poe::Sniper

[![Build Status](https://travis-ci.org/thisismydesign/poe-sniper.svg?branch=master)](https://travis-ci.org/thisismydesign/poe-sniper)
[![Coverage Status](https://coveralls.io/repos/github/thisismydesign/poe-sniper/badge.svg?branch=master)](https://coveralls.io/github/thisismydesign/poe-sniper?branch=master)

### Make instant offers for items listed for trading in Path of Exile without any interruptions to the game

Written in Ruby, packaged as Windows executable with [OCRA](https://github.com/larsch/ocra/).

*__We no longer maintain this project.__ It should still be functional but we have no plans for fixing current or future issues. Feel free to create a fork and make improvements, if you decide to continue the project I'm more than happy to reference it here.*

## How it works

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

[`example_input.json`](https://github.com/thisismydesign/poe-sniper/blob/master/input/example_input.json) contains links to the searches you want to be notified about and a custom name for each search in [JSON format](https://www.w3schools.com/js/js_json.asp). Assuming the linked example you will receive notifications like: `New OP HOWA listed. ~b/o 10 chaos`. Be sure to include links in the same format as the example.

[`config.ini`](https://github.com/thisismydesign/poe-sniper/blob/master/input/config.ini) contains Poe::Sniper's configuration such as how long the notifications should last, where is the input file located, etc.

Run poe-sniper.exe

You're all set. Enjoy your interrupt free PoE.

Additionally [here's a modified version of the Lutbot AutoHotkey Macro](https://github.com/thisismydesign/poe-lutbot-ahk) where the 'Paste' option is added allowing you to hotkey sending messages from the clipboard. That's right. One click to set up a trade. It's awesome, I know!

## Debugging

In project root

`rake install`

`ruby -e "require 'poe/sniper'; Poe::Sniper.run('input/config.ini')"`

`ruby -e "require 'poe/sniper'; Poe::Sniper.offline_debug('input/config.ini', 'spec/resources/example_socket_data.json')"`

## Disclaimer

This tool (just like trade indexers) was created to improve the trading experience. As we saw in the past these great things used by the wrong people can quickly turn into bad things. With that said we believe the solution is creating a fair competition by making the best technology available to everyone. This is why we're releasing this to the public.

We also have a feature in mind that would help fighting price fixers. Stay tuned!

We're currently using poe.trade's live API which is capable of processing new listings in real time. With that said we're looking into supporting other indexers or maybe writing our own one. If you're developing an indexer with an API that we could make use of don't hesitate to contact us!

## Development

This gem is developed using Bundler conventions. A good overview can be found [here](http://bundler.io/v1.14/guides/creating_gem.html).

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/thisismydesign/poe-sniper.
