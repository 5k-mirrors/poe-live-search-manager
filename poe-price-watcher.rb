require 'uri'

# TODO remove this
require 'faye/websocket'

require_relative 'whisper'
require_relative 'alert'
require_relative 'alerts'
require_relative 'sockets'
require_relative 'poe-trade-parser'
require_relative 'json_helper'

NOTIFICATION_SECONDS = 3
ITERATION_WAIT_TIME_SECONDS = 0.1
KEEPALIVE_TIMEFRAME_SECONDS = 60

API_URL = 'ws://live.poe.trade/'
OFFLINE_DEBUG = false
INPUT_FILE_PATH = 'input/example_input.json'

@alerts = Alerts.new(NOTIFICATION_SECONDS, ITERATION_WAIT_TIME_SECONDS)
@sockets = Sockets.new(@alerts)
@poe_trade_parser = PoeTradeParser.new(API_URL)

def main
  Thread.new {@alerts.alert_loop}
  Thread.new {@sockets.keepalive_loop(KEEPALIVE_TIMEFRAME_SECONDS)}
  EM.run {
    JsonHelper.parse(INPUT_FILE_PATH).each do |search_url, name|
      parsed_url = URI.parse(search_url)
      @sockets.socket_setup(parsed_url, @poe_trade_parser.get_api_search_url(parsed_url), name)
    end
  }
end

if OFFLINE_DEBUG
  example_data = parse_json('example_socket_data.json')
  whispers = PoeTradeParser.get_whispers(example_data['data'], example_data['uniqs'])
  whispers.each do |whisper|
    @alerts.push(Alert.new(whisper, 'thing'))
  end
  @alerts.alert_all
else
  main
end
