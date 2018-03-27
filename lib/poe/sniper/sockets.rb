require 'faye/websocket'
require 'net/http'

require_relative 'whisper'
require_relative 'alert'
require_relative 'poe_trade_parser'
require_relative 'analytics'
require_relative 'analytics_data'
require_relative 'logger'

module Poe
  module Sniper
    class Sockets
      def initialize(alerts)
        @alerts = alerts
      end

      def socket_setup(live_search_uri, live_ws_uri, search_name, keepalive_timeframe_seconds, retry_timeframe_seconds, reconnect = false)
        begin
          last_displayed_id = get_initial_id(live_search_uri);
        rescue SocketError => e
          log_connection_error(live_search_uri, e)
          # Try again
          sleep(retry_timeframe_seconds)
          reconnect = true
          return socket_setup(live_search_uri, live_ws_uri, search_name, keepalive_timeframe_seconds, retry_timeframe_seconds, reconnect)
        end

        ws = Faye::WebSocket::Client.new(live_ws_uri.to_s, nil, ping: keepalive_timeframe_seconds)
        Logger.instance.info("Opening connection to #{get_log_url_signature(live_ws_uri, search_name)}")

        ws.on :open do |event|
          ws.send '{"type": "version", "value": 3}'
          ws.ping do
            log_connection_open(live_ws_uri, search_name)
            Analytics.instance.track(event: 'Socket reopened', properties: AnalyticsData.socket_reopened(live_ws_uri)) if reconnect
          end
        end

        ws.on :message do |event|
          Logger.instance.debug("Message received from #{get_log_url_signature(live_ws_uri, search_name)}")
          json = JsonHelper.parse(event.data)
          unless json.is_a?(Hash)
            Logger.instance.warn("Unexpected message format: #{json}")
          else
            Logger.instance.debug("Message type: #{json['type']}")
            case json['type']
              when 'pong'
                Logger.instance.warn("Unhandled `pong` received from server")
              when 'notify'
                response = Net::HTTP.post_form(live_search_uri, 'id' => last_displayed_id)
                poe_trade_parser = PoeTradeParser.new(JsonHelper.parse(response.body))
                last_displayed_id = poe_trade_parser.get_last_displayed_id
                if poe_trade_parser.get_count == 0
                  Logger.instance.warn("Zero event count received, something's not right (query too early?)")
                end
                poe_trade_parser.get_whispers.each do |whisper|
                  @alerts.push(Alert.new(whisper, search_name))
                end
              else
                Logger.instance.warn("Unknown event type: #{json['type']}")
            end
          end
        end

        ws.on :close do |event|
          Analytics.instance.track(event: 'Socket closed', properties: AnalyticsData.socket_closed(live_ws_uri, event)) unless reconnect
          log_connection_close(live_ws_uri, event)

          # Reopen on close: https://stackoverflow.com/a/22997338/2771889
          sleep(retry_timeframe_seconds)
          log_connection_reconnect_attempt(live_ws_uri)
          reconnect = true
          socket_setup(live_search_uri, live_ws_uri, search_name, keepalive_timeframe_seconds, retry_timeframe_seconds, reconnect)
        end

        ws
      end

    private

      def get_initial_id(live_search_uri)
        response = Net::HTTP.post_form(live_search_uri, 'id' => -1)
        # TODO PoeTradeParser should parse it
        response_data = JsonHelper.parse(response.body)
        response_data['newid']
      end

      def get_log_url_signature(live_ws_uri, search_name)
        "#{live_ws_uri} (#{search_name})"
      end

      def log_connection_open(url, search_name)
        Logger.instance.info("Connected to #{url} (#{search_name})")
      end

      def log_connection_error(url, error)
        Logger.instance.warn("Could not connect to #{url}: #{error}")
      end

      def log_connection_close(live_ws_uri, event)
        message = (event.reason.nil? or event.reason.empty?) ? "no reason specified" : event.reason
        Logger.instance.warn("Connection closed to #{live_ws_uri} (code #{event.code}): #{message}")
      end

      def log_connection_reconnect_attempt(live_ws_uri)
        Logger.instance.info("Trying to recconect to #{live_ws_uri}")
      end
    end
  end
end
