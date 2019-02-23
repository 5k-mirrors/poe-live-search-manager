require 'faye/websocket'
require 'net/http'

require_relative 'whisper'
require_relative '../analytics'
require_relative '../analytics_data'
require_relative '../logger'

require_relative 'http_response_parser'

module Poe
  module Sniper
    module Poetrade
      class Socket
        attr_accessor :live_search_uri, :live_ws_uri, :search_name

        def initialize(live_search_uri, live_ws_uri, search_name, alerts, alert_class)
          @live_search_uri = live_search_uri
          @live_ws_uri = live_ws_uri
          @search_name = search_name
          @alerts = alerts
          @alert_class = alert_class
        end

        def setup(keepalive_timeframe_seconds, retry_timeframe_seconds, reconnecting = false)
          begin
            last_displayed_id = initial_id
          rescue SocketError => e
            log_connection_error(@live_search_uri, e)
            # Try again
            sleep(retry_timeframe_seconds)
            reconnecting = true
            return setup(keepalive_timeframe_seconds, retry_timeframe_seconds, reconnecting)
          end

          ws = Faye::WebSocket::Client.new(@live_ws_uri.to_s, nil, ping: keepalive_timeframe_seconds)
          Logger.instance.info("Connecting to #{get_log_url_signature}")

          ws.on :open do |event|
            ws.send '{"type": "version", "value": 3}'
            ws.ping do
              log_connection_open(@live_ws_uri)
              Analytics.instance.track(event: 'Socket reopened', properties: AnalyticsData.socket_reopened(@live_ws_uri)) if reconnecting
            end
          end

          ws.on :message do |event|
            Logger.instance.debug("Message received from #{get_log_url_signature}")
            json = JsonHelper.parse(event.data)
            unless json.is_a?(Hash)
              Logger.instance.warn("Unexpected message format: #{json}")
            else
              Logger.instance.debug("Message type: #{json['type']}")
              case json['type']
                when 'pong'
                  Logger.instance.warn("Unhandled `pong` received from server")
                when 'notify'
                  response = Net::HTTP.post_form(@live_search_uri, 'id' => last_displayed_id)
                  response_parser = HttpResponseParser.new(JsonHelper.parse(response.body))
                  last_displayed_id = response_parser.get_last_displayed_id
                  if response_parser.get_count == 0
                    Logger.instance.warn("Zero event count received, something's not right (query too early?)")
                  end
                  response_parser.get_whispers.each do |whisper|
                    @alerts.push(@alert_class.new(whisper, @search_name))
                  end
                else
                  Logger.instance.warn("Unknown event type: #{json['type']}")
              end
            end
          end

          ws.on :close do |event|
            Analytics.instance.track(event: 'Socket closed', properties: AnalyticsData.socket_closed(@live_ws_uri, event)) unless reconnecting
            log_connection_close(event)

            # Reopen on close: https://stackoverflow.com/a/22997338/2771889
            sleep(retry_timeframe_seconds)
            log_connection_reconnect_attempt
            reconnecting = true
            setup(keepalive_timeframe_seconds, retry_timeframe_seconds, reconnecting)
          end

          ws
        end

        private

        def initial_id
          response = Net::HTTP.post_form(@live_search_uri, 'id' => -1)
          raise redirect_error if response.body.include?("edirect")
          HttpResponseParser.new_id(response)
        end

        def get_log_url_signature
          "#{@live_ws_uri.host.gsub("www.", "")}#{@live_ws_uri.path} (#{@search_name})"
        end

        def log_connection_open(uri)
          Logger.instance.info("Connected to #{get_log_url_signature}")
        end

        def log_connection_error(url, error)
          Logger.instance.warn("Could not connect to #{url}: #{error}")
        end

        def log_connection_close(event)
          message = (event.reason.nil? or event.reason.empty?) ? "no reason specified" : event.reason
          Logger.instance.warn("Connection closed to #{@live_ws_uri} (will try to reconnect) (code #{event.code}): #{message}")
        end

        def log_connection_reconnect_attempt
          Logger.instance.info("Trying to recconect to #{@live_ws_uri}")
        end

        def redirect_error
          "Link #{@live_search_uri} is redirecting. Probably it's no longer valid. Create a new search with the same criteria (URL should be different) or remove this search."
        end
      end
    end
  end
end
