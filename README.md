# Poe::Sniper

## Features

- Queries new listsings instantly just like poe.trade
- Uses windows notifications which:
  - don't remove focus from the game
  - have a configurable timeout
  - are easily dismissable anytime
- Places whisper message on clipboard for faster interaction
- Consumes far less resources than running poe.trade in browser
- Queues listings if more than one arrives within the configured notification timeframe (alerts that there are further items)

## Installation

*To run commands in Windows use cmd or Powershell*

1, Download and install Ruby from http://rubyinstaller.org/downloads/

2, Donwload and install Ruby Development Kit from http://rubyinstaller.org/downloads/ (follow instructions on https://github.com/oneclick/rubyinstaller/wiki/Development-Kit#installation-instructions)

3, Download the latest version of the gem from https://github.com/thisismydesign/poe-sniper/releases

4, Run `gem install <path to poe-sniper-*.gem>`

## Usage

1, Create a local copy of [config](https://github.com/thisismydesign/poe-sniper/blob/master/config) and [input json](https://github.com/thisismydesign/poe-sniper/blob/master/input/example_input.json) files. Modify values accoding to your needs.

2, Run `ruby -e "require 'poe/sniper'; Poe::Sniper.run('< path to your config file >')"`

E.g.
`ruby -e "require 'poe/sniper'; Poe::Sniper.run('C:\poe-sniper\config')"`

3, Stop with CTRL+C

You can also try the alerting functionality with test data without actually connecting to [poe.trade](poe.trade):

1, Create a local copy of [example_socket_data.json](https://github.com/thisismydesign/poe-sniper/blob/master/spec/example_socket_data.json).

2, Run ruby -e "require 'poe/sniper'; Poe::Sniper.offline_debug('< path to your config file >', '< path to your your cope of example socket data >')"

3, Stop with CTRL+C

## Development

This gem is developed using Bundler conventions. A good overview can be found [here](http://bundler.io/v1.14/guides/creating_gem.html).

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/thisismydesign/poe-sniper.
