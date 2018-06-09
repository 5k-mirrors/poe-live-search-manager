source 'https://rubygems.org'

# Because of `Gem.win_platform?`
# http://stackoverflow.com/a/21468976
ruby '>= 1.9'

# Because of `require_relative`
ruby '>= 1.9.2'

# OCRA is sensitive to Ruby version
# https://stackoverflow.com/a/44446172/2771889
ruby "2.3.3"

gem "eventmachine"
gem "faye-websocket"
gem "json"
gem "nokogiri"
gem "rb-notifu"
gem "win32-clipboard"
gem "waitutil"
gem "parseconfig"
gem "analytics-ruby", '~> 2.0.0'
gem "dotenv"

group :development, :test do
  gem "rake", "~> 12.3"
  gem "rspec", "~> 3.0"
  gem "ocra", "~> 1.3", ">= 1.3.10" # https://github.com/larsch/ocra/issues/124
  gem "coveralls"
  gem 'webmock' # Disable external connections
end
