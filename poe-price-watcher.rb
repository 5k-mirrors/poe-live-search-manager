require 'faye/websocket'
require 'json'
require 'net/http'
require 'uri'
require 'nokogiri'

uri = URI.parse("http://poe.trade/search/aasitahouokaka/live")

p 'hi'
p 'there'

EM.run {
  ws = Faye::WebSocket::Client.new('ws://live.poe.trade/aasitahouokaka')

  ws.on :open do |event|
    p [:open]
    # not sure if needed
    ws.send '{"type": "version", "value": 3}'
    # nedded to get keepalive signal
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
        # res.body has otehr fields as well...
        html = Nokogiri::HTML(res.body['data'])
        p html
    end
  end

  ws.on :close do |event|
    p [:close, event.code, event.reason]
    ws = nil
  end
}

p 'u bitxch'
