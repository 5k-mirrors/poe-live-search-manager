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

3, Run `gem install bundler`

In project root directory:

4, Run `bundle install` to install dependencies

5, Run `rake install` to build and install gem

## Usage

In project root directory:

1, Set custom configuration in `config` file

2, Run `ruby -e "require 'poe/sniper'; Poe::Sniper::PoeSniper.new('config')"`

3, Stop with CTRL+C

## Development (on linux)

After checking out the repo, run `bin/setup` to install dependencies. Then, run `rake spec` to run the tests. You can also run `bin/console` for an interactive prompt that will allow you to experiment.

To install this gem onto your local machine, run `bundle exec rake install`. To release a new version, update the version number in `version.rb`, and then run `bundle exec rake release`, which will create a git tag for the version, push git commits and tags, and push the `.gem` file to [rubygems.org](https://rubygems.org).

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/thisismydesign/poe-sniper.
