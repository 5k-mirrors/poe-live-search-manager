# Poe::Sniper

### Utility to snipe items listed for trading in Path of Exile without any interruptions to the game.

Written in Ruby, packaged as Windows executable with [OCRA](https://github.com/larsch/ocra/).

## Features

- Queries new listsings instantly via poe.trade live mode
- Uses Windows notifications which:
  - don't remove focus from the game
  - have a configurable timeout
  - are easily dismissable anytime
- Places whisper message on clipboard for faster interaction
- Consumes far less resources than running poe.trade in browser
- Queues listings if more than one arrives within the configured notification timeframe (alerts that there are further items)

## Installation and usage

Download the latest release (poe-sniper.zip) from the [releases page](https://github.com/thisismydesign/poe-sniper/releases).
Extract it, inside the poe-sniper folder you will find 3 files:
- poe-sniper.exe
- config.ini
- input/example_input.json

Modify `config.ini` and `example_input.json` according to your needs.

Run poe-sniper.exe

You're all set. Enjoy your interrupt free PoE.

Additionally [here's a modified version of Lutbot's ahk script](https://github.com/thisismydesign/poe-lutbot-ahk) where the 'Paste' option is added allowing you to hotkey sending messages from the clipboard. That's right. One click to set up a trade. I know, it's awesome!

## Development

This gem is developed using Bundler conventions. A good overview can be found [here](http://bundler.io/v1.14/guides/creating_gem.html).

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/thisismydesign/poe-sniper.
