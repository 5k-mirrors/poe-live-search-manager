require 'faye/websocket'
require 'json'
require 'net/http'

require_relative 'whisper'
require_relative 'alert'
require_relative 'poe_trade_parser'

class Sockets

  def initialize(alerts)
    @sockets = []
    @alerts = alerts
  end

  def socket_setup(search_url, live_url, search_name)
    ws = Faye::WebSocket::Client.new(live_url)
    last_displayed_id = -1;

    ws.on :open do |event|
      ws.send '{"type": "version", "value": 3}'
      ws.send 'ping'
    end

    ws.on :message do |event|
      json = JSON.parse(event.data)
      case json['type']
        when 'pong'
          # TODO put connected message once
        when 'notify'
          response = Net::HTTP.post_form(search_url, 'id' => last_displayed_id)
          response_data = JSON.parse(response.body)
          last_displayed_id = response_data['newid']
          whispers = PoeTradeParser.get_whispers(response_data['data'], response_data['uniqs'])
          whispers.each do |whisper|
            @alerts.push(Alert.new(whisper, search_name))
          end
        else
          p "WARNING: Unknown event type: #{json['type']}"
      end
    end

    ws.on :close do |event|
      p ["Connection to #{live_url} closed", event.code, event.reason]
      ws = nil
    end

    @sockets.push(ws)
  end

  def keepalive_loop(keepalive_timeframe_seconds)
    loop do
      keepalive_all
      sleep keepalive_timeframe_seconds
    end
  end

private

  def keepalive_all
    @sockets.each do |socket|
      send_keepalive(socket)
    end
  end

  def send_keepalive(ws)
    ws.send 'ping'
  end

end
