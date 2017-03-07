# PoE Price Watcher

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

1, Download and install Ruby from http://rubyinstaller.org/downloads/

2, Donwload and install Ruby Development Kit from http://rubyinstaller.org/downloads/ (follow instructions on https://github.com/oneclick/rubyinstaller/wiki/Development-Kit#installation-instructions)

3, Run `gem install bundler`

4, In project directory run `bundle install`

5, Set configuration in poe-price-watcher.rb (NOTIFICATION_SECONDS, INPUT_FILE_PATH, etc.)

## Usage

Run from cmd / Powershell with command:

`ruby poe-price-watcher.rb`

Stop with CTRL+C
