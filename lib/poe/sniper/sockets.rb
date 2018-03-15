require 'faye/websocket'
require 'net/http'

require_relative 'whisper'
require_relative 'alert'
require_relative 'poe_trade_parser'

class Sockets
  include EasyLogging

  def initialize(alerts)
    @alerts = alerts
  end

  def socket_setup(search_url, live_url, search_name, keepalive_timeframe_seconds, retry_timeframe_seconds)
    begin
      last_displayed_id = get_initial_id(search_url);
    rescue SocketError => e
      log_connection_error(search_url, e)
      # Try again
      sleep(retry_timeframe_seconds)
      return socket_setup(search_url, live_url, search_name, keepalive_timeframe_seconds, retry_timeframe_seconds)
    end

    ws = Faye::WebSocket::Client.new(live_url, nil, ping: keepalive_timeframe_seconds)

    logger.info("Opening connection to #{get_log_url_signature(live_url, search_name)}")

    ws.on :open do |event|
      ws.send '{"type": "version", "value": 3}'
      ws.ping do
        log_connection_open(live_url, search_name)
      end
    end

    ws.on :message do |event|
      logger.debug("Message received from #{get_log_url_signature(live_url, search_name)}")
      json = JsonHelper.parse(event.data)
      unless json.is_a?(Hash)
        logger.warn("Unexpected message format: #{json}")
      else
        logger.debug("Message type: #{json['type']}")
        case json['type']
          when 'pong'
            logger.warn("Unhandled `pong` received from server")
          when 'notify'
            response = Net::HTTP.post_form(search_url, 'id' => last_displayed_id)
            poe_trade_parser = PoeTradeParser.new(JsonHelper.parse(response.body))
            last_displayed_id = poe_trade_parser.get_last_displayed_id
            if poe_trade_parser.get_count == 0
              logger.warn("Zero event count received, something's not right (query too early?)")
            end
            poe_trade_parser.get_whispers.each do |whisper|
              @alerts.push(Alert.new(whisper, search_name))
            end
          else
            logger.warn("Unknown event type: #{json['type']}")
        end
      end
    end

    ws.on :close do |event|
      log_connection_close(live_url, event)

      # Reopen on close: https://stackoverflow.com/a/22997338/2771889
      sleep(retry_timeframe_seconds)
      # TODO: Canot do return here because of `LocalJumpError`.
      # Does this lead to an inifitely deep stack on retries?
      socket_setup(search_url, live_url, search_name, keepalive_timeframe_seconds, retry_timeframe_seconds)
    end
  end

private

  def get_initial_id(search_url)
    response = Net::HTTP.post_form(search_url, 'id' => -1)
    # TODO PoeTradeParser should parse it
    response_data = JsonHelper.parse(response.body)
    response_data['newid']
  end

  def get_log_url_signature(live_url, search_name)
    "#{live_url} (#{search_name})"
  end

  def log_connection_open(url, search_name)
    logger.info("Connected to #{url} (#{search_name})")
  end

  def log_connection_error(url, error)
    logger.warn("Could not connect to #{url}: #{error}")
  end

  def log_connection_close(live_url, event)
    message = (event.reason.nil? or event.reason.empty?) ? "no reason specified" : event.reason
    logger.warn("Connection closed to #{live_url} (code #{event.code}): #{message}")
  end
end
