require 'faye/websocket'
require 'json'
require 'net/http'
require 'uri'
require 'nokogiri'
require 'rb-notifu'
require 'win32/clipboard'

require_relative 'whisper'
require_relative 'alert'

include Win32

NOTIFICATION_SECONDS = 10
API_URL = 'ws://live.poe.trade/'
OFFLINE_DEBUG = true
ITERATION_WAIT_TIME_SECONDS = 0.1
INPUT_FILE_PATH = 'example_input.json'

@alerts = []

def main
  Thread.new {alert_loop}
  EM.run {
    parse_json(INPUT_FILE_PATH).each do |search_url, name|
      parsed_url = URI.parse(search_url)
      search_id = get_search_id(parsed_url)
      socket_setup(parsed_url, get_api_search_url(search_id), name)
    end
  }
end

def alert_loop
  loop do
    alert_next(@alerts)
    sleep ITERATION_WAIT_TIME_SECONDS
  end
end

def get_search_id(url)
  path_parts = url.path.split '/'
  path_parts.last.eql?('live') ? path_parts[-2] : path_parts[-1]
end

def socket_setup(search_url, live_url, search_name)
  ws = Faye::WebSocket::Client.new(live_url)

  ws.on :open do |event|
    ws.send '{"type": "version", "value": 3}'
    ws.send 'ping'
  end

  ws.on :message do |event|
    json = JSON.parse(event.data)
    case json['type']
      when 'pong'
        p "connected to: #{live_url}"
      when 'notify'
        id = json['value']
        response = Net::HTTP.post_form(search_url, 'id' => id)
        response_data = JSON.parse(response.body)
        whispers = get_whispers(response_data['data'], response_data['uniqs'])
        whispers.each do |whisper|
          @alerts.push(Alert.new(whisper, search_name))
        end
      else
        p "WARNING: Unknown event type: #{json['type']}"
    end
  end

  ws.on :close do |event|
    p [:close, event.code, event.reason]
    ws = nil
  end
end

def get_api_search_url(search_id)
  API_URL + search_id
end

def get_whispers(html_item_data, ids)
  whispers = []
  html = Nokogiri::HTML(html_item_data)

  ids.each do |id|
    data_path = "tbody.item-live-#{id}"
    whispers << get_whisper(get_html_data_attributes(get_html_element_by_path(html, data_path)))
  end

  whispers
end

def get_html_element_by_path(html, path)
  html.css(path)[0]
end

def get_html_data_attributes(tbody)
  data = {}
  data_attributes = tbody.xpath("./@*[starts-with(name(), 'data-')]") # . relative path
  data_attributes.each { |x| data[x.name] = x.value }
  data
end

def get_whisper(data)
  whisper = Whisper.new
  whisper.ign = data['data-ign']
  whisper.item = data['data-name']
  whisper.buyout = data['data-buyout']
  whisper.league = data['data-league']
  whisper.tab = data['data-tab']
  whisper.x = data['data-x'].to_i
  whisper.y = data['data-y'].to_i

  whisper
end

def alert_next(alerts)
  cnt = alerts.length
  if cnt > 0
    alert(alerts.shift, cnt)
  end
end

def alert_all(alerts)
  cnt = alerts.length
  alerts.each do |alert|
    alert(alert, cnt)
    cnt -= 1
  end
end

def alert(alert, cnt)
  title = "New #{alert.search_name} listed"
  title += " (#{cnt -1} more)" if cnt > 1

  notification_thread = show_notification(title, alert.whisper)
  set_clipboard(alert.whisper.to_s)

  # TODO replace with wait until gem
  while ['run', 'sleep'].include? notification_thread.status
    sleep ITERATION_WAIT_TIME_SECONDS
  end
end

def show_notification title, message
  Notifu::show :title => title, :message => message, :type => :info, :time => NOTIFICATION_SECONDS, :noquiet => true
end

def set_clipboard message
  Clipboard.set_data(message, format = Clipboard::UNICODETEXT) # unicode for russian characters
end

def parse_json file_path
  JSON.parse(File.open(file_path).read)
end

if OFFLINE_DEBUG
  example_data = parse_json('example_socket_data.json')
  whispers = get_whispers(example_data['data'], example_data['uniqs'])
  whispers.each do |whisper|
    @alerts.push(Alert.new(whisper, 'thing'))
  end
  alert_all(@alerts)
else
  main
end
