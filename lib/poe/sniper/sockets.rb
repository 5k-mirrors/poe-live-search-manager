require 'faye/websocket'
require 'net/http'
require 'memoist'
require 'logger'

require_relative 'whisper'
require_relative 'alert'
require_relative 'poe_trade_parser'

class Sockets extend Memoist

  def initialize(alerts)
    @sockets = []
    @alerts = alerts
    @logger = Logger.new(STDOUT)
    @logger.level = Logger::INFO
  end

  def socket_setup(search_url, live_url, search_name)
    ws = Faye::WebSocket::Client.new(live_url)
    last_displayed_id = get_initial_id(search_url);

    @logger.info("Opening connection to #{get_log_url_signature(live_url, search_name)}")

    ws.on :open do |event|
      ws.send '{"type": "version", "value": 3}'
      ws.send 'ping'
    end

    ws.on :message do |event|
      @logger.debug("Message received from #{get_log_url_signature(live_url, search_name)}")
      json = JsonHelper.parse(event.data)
      unless json.is_a?(Hash)
        @logger.warn("Unexpected message format: #{json}")
      else
        @logger.debug("Message type: #{json['type']}")
        case json['type']
          when 'pong'
            log_connection_open(live_url, search_name)
          when 'notify'
            response = Net::HTTP.post_form(search_url, 'id' => last_displayed_id)
            response_data = JsonHelper.parse(response.body)
            last_displayed_id = response_data['newid']
            if response_data['count'] == 0
              @logger.warn("Zero event count received, something's not right (query too early?)")
            end
            whispers = PoeTradeParser.get_whispers(response_data['data'], response_data['uniqs'])
            whispers.each do |whisper|
              @alerts.push(Alert.new(whisper, search_name))
            end
          else
            @logger.warn("Unknown event type: #{json['type']}")
        end
      end
    end

    ws.on :close do |event|
      log_connection_close(live_url, event)
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

  def get_initial_id(search_url)
    response = Net::HTTP.post_form(search_url, 'id' => -1)
    response_data = JsonHelper.parse(response.body)
    response_data['newid']
  end

  def get_log_url_signature(live_url, search_name)
    "#{live_url} (#{search_name})"
  end

  def log_connection_open(url, search_name)
    @logger.info("Connected to #{url} (#{search_name})")
  end
  memoize :log_connection_open

  def log_connection_close(live_url, event)
    message = (event.reason.nil? or event.reason.empty?) ? "no reason specified" : event.reason
    @logger.warn("Connection closed to #{live_url} (code #{event.code}): #{message}")
  end

  def keepalive_all
    @sockets.each do |socket|
      send_keepalive(socket)
    end
  end

  def send_keepalive(ws)
    ws.send 'ping'
  end

end
