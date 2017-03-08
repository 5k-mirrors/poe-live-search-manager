require 'json'
require 'uri'

# TODO remove this
require 'faye/websocket'

require_relative 'whisper'
require_relative 'alert'
require_relative 'alerts'
require_relative 'sockets'
require_relative 'poe-trade-parser.rb'

NOTIFICATION_SECONDS = 3
API_URL = 'ws://live.poe.trade/'
OFFLINE_DEBUG = false
ITERATION_WAIT_TIME_SECONDS = 0.1
INPUT_FILE_PATH = 'example_input.json'

@alerts = Alerts.new(NOTIFICATION_SECONDS, ITERATION_WAIT_TIME_SECONDS)
@sockets = Sockets.new(@alerts)

def main
  Thread.new {@alerts.alert_loop}
  EM.run {
    parse_json(INPUT_FILE_PATH).each do |search_url, name|
      parsed_url = URI.parse(search_url)
      search_id = get_search_id(parsed_url)
      @sockets.socket_setup(parsed_url, get_api_search_url(search_id), name)
    end
  }
end

def get_search_id(url)
  path_parts = url.path.split '/'
  path_parts.last.eql?('live') ? path_parts[-2] : path_parts[-1]
end

def get_api_search_url(search_id)
  API_URL + search_id
end

def parse_json file_path
  JSON.parse(File.open(file_path).read)
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
