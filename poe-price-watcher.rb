require 'faye/websocket'
require 'json'
require 'net/http'
require 'uri'
require 'nokogiri'

uri = URI.parse("http://poe.trade/search/aasitahouokaka/live")

def socket
  EM.run {
    ws = Faye::WebSocket::Client.new('ws://live.poe.trade/aasitahouokaka')

    ws.on :open do |event|
      p [:open]
      ws.send '{"type": "version", "value": 3}'
      ws.send 'ping'
    end

    ws.on :message do |event|
      json = JSON.parse(event.data)
      p json
      case json['type']
        when 'pong'
          p 'connection up'
        when 'notify'
          id = json['value']
          res = Net::HTTP.post_form(uri, 'id' => id)
          # puts res.body
          parse_socket_data_json(res.body)
        # html = Nokogiri::HTML(res.body['data'])
        # p html

      end
    end

    ws.on :close do |event|
      p [:close, event.code, event.reason]
      ws = nil
    end
  }
end


def parse_socket_data_json socket_data
  parse_item_data_html(socket_data["data"])
end

def parse_item_data_html item_data
  data_path = 'tbody#item-container-0'
  html = Nokogiri::HTML(item_data)
  p get_whisper(html.css(data_path)[0])
end

def get_whisper data
  greeting = "@#{data['data-ign']} Hi, I would like to buy your "
  item = data['data-name']
  buyout = data['data-buyout'].empty? ? '' : " listed for #{data['data-buyout']}"
  league = " in #{data['data-league']}"
  location = data['data-tab'].empty? ? '' : get_item_location(data)

  greeting + item + buyout + league + location
end

def get_item_location data
  message = " (stash tab #{data['data-tab']}"
  x = data['data-x'].to_i
  y = data['data-y'].to_i
  if x >= 0 and y >= 0
    message += "; position: left #{x+1}, top #{y+1})"
  end
  message
end

parse_socket_data_json(JSON.parse(File.open('example_socket_data.json').read))
