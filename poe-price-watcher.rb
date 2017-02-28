require 'faye/websocket'
require 'json'
require 'net/http'
require 'uri'
require 'nokogiri'
require 'rb-notifu'
require 'win32/clipboard' #gem install win32-clipboard
include Win32

NOTIFICATION_SECONDS = 10
API_URL = 'ws://live.poe.trade/'
OFFLINE_DEBUG = true

@whispers = []

def main
  Thread.new {alert_loop}
  EM.run {
    parse_json('example_input.json').each do |search_url, name|
      parsed_url = URI.parse(search_url)
      search_id = get_search_id(parsed_url)
      socket_setup(parsed_url, get_api_search_url(search_id), name)
    end
  }
end

def alert_loop
  loop do
    alert_next @whispers
  end
end

def get_search_id(url)
  path_parts = url.path.split '/'
  path_parts.last.eql?('live') ? path_parts[-2] : path_parts[-1]
end

def socket_setup(search_url, live_url, name)
  ws = Faye::WebSocket::Client.new(live_url)

  ws.on :open do |event|
    p [:open]
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
        res = Net::HTTP.post_form(search_url, 'id' => id)
        @whispers.concat(parse_socket_data_json(JSON.parse(res.body)))
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

def parse_socket_data_json(socket_data)
  get_whispers(socket_data['data'], socket_data['uniqs'])
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
  greeting = "@#{data['data-ign']} Hi, I would like to buy your "
  item = data['data-name']
  buyout = data['data-buyout'].nil? ? '' : " listed for #{data['data-buyout']}"
  league = " in #{data['data-league']}"
  location = data['data-tab'].nil? ? '' : get_item_location(data)

  greeting + item + buyout + league + location
end

def get_item_location(data)
  message = " (stash tab #{data['data-tab']}"
  x = data['data-x'].to_i
  y = data['data-y'].to_i
  if x >= 0 and y >= 0
    message += "; position: left #{x+1}, top #{y+1})"
  end
  message
end

def alert_next(whispers)
  cnt = whispers.length
  if cnt > 0
    alert(whispers.shift, cnt)
  end
end

def alert_all(whispers)
  cnt = whispers.length
  whispers.each do |whisper|
    alert(whisper, cnt)
    cnt -= 1
  end
end

def alert(whisper, cnt)
  title = 'New item listed'
  title += " (#{cnt -1} more)" if cnt > 1

  notification_thread = show_notification(title, whisper)
  set_clipboard(whisper)

  # TODO replace with wait until gem
  while ['run', 'sleep'].include? notification_thread.status
    sleep 0.1
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
  whispers = parse_socket_data_json(parse_json('example_socket_data.json'))
  alert_all whispers[0..5]
else
  main
end