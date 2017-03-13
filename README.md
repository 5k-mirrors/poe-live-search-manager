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

Additionally [here's a modified version of the Lutbot AutoHotkey Macro](https://github.com/thisismydesign/poe-lutbot-ahk) where the 'Paste' option is added allowing you to hotkey sending messages from the clipboard. That's right. One click to set up a trade. I know, it's awesome!

## Disclaimer

This tool (just like trade indexers) was created to improve the trading experience. As we saw in the past these great things used by the wrong people can quickly turn into bad things. With that said we believe the solution is creating a fair competition by making the best technology available to everyone. This is why we're releasing this to the public.

We also have a feature in mind that would help fighting price fixers. Stay tuned!

Some words regarding poe.trade:

Poe.trade sometimes doesn't keep up with listings real time. That sometimes nowadays means always. The dev claims that the indexer is capable of keeping up with the listings real time which is theoretically true, I remember times it did. He also claims that the problem is on GGG's side that they don't send the data fast enough. This would mean that people running private indexers have no advantage over everyone else. We've seen examples when this wasn't true but I wouldn't draw long term conclusions based on one experiment. It'd be nice to see a statement from GGG or live statistics on poe.trade. The latter could short this issue once and for all. 

We're currently using poe.trade's live API and hoping that the issues if any will be resolved. In that case Poe::Sniper is your best bet out there. With that said we're looking into supporting other indexers or maybe writing our own one. If you're developing an indexer with an API that we could make use of don't hesitate to contact us!

We've also talked with the dev of poe.trade about support for these kind of scripts. His understandable stance is that he will not support them as poe.trade revenue comes from ads on the site that we bypass while causing the same amount of load. We'd like to state that Poe::Sniper requires the same amount of interaction with poe.trade with the exception of idling on the live page. The load is also a lot less as we never query pictures and other resources, never subscribe to item updates, etc. With his support we would use less than 1% of current generated data and bandwidth.

## Development

This gem is developed using Bundler conventions. A good overview can be found [here](http://bundler.io/v1.14/guides/creating_gem.html).

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/thisismydesign/poe-sniper.
