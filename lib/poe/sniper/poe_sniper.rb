require 'yaml'
require 'parseconfig'

# TODO remove this
# `EM` comes from this
require 'faye/websocket'

require_relative 'whisper'
require_relative 'alert'
require_relative 'alerts'
require_relative 'sockets'
require_relative 'poe_trade_helper'
require_relative 'json_helper'
require_relative 'encapsulators'

module Poe
  module Sniper
    class PoeSniper

      def initialize(config_path)
        @config = ParseConfig.new(config_path)
        @alerts = Alerts.new(@config['notification_seconds'].to_f, @config['iteration_wait_time_seconds'].to_f)
        @sockets = Sockets.new(@alerts)

        start_alert_thread
      end

      def run
        Encapsulators.user_interaction_before_return do
          Encapsulators.exception_handling do
            start_online
          end
        end
      end

      def offline_debug(socket_data_path)
        Encapsulators.user_interaction_before_return do
          Encapsulators.exception_handling do
            start_offline_debug(socket_data_path)
          end
        end
      end

    private

      def start_alert_thread
        Thread.new do
          Encapsulators.exception_handling do
            @alerts.alert_loop
          end
        end
      end

      def start_offline_debug(socket_data_path:)
        example_data = JsonHelper.parse_file(socket_data_path)
        poe_trade_parser = PoeTradeParser.new(example_data)
        poe_trade_parser.get_whispers.each do |whisper|
          @alerts.push(Alert.new(whisper, 'thing'))
        end
      end

      def start_online
        input_json = JsonHelper.parse_file(@config['input_file_path'])
        # TODO: retry_timeframe_seconds blocks execution of other sockets
        # Multiple EMs in one process is not possible: https://stackoverflow.com/q/8247691/2771889
        # Alternatives would be iodine, plezi as pointed out here: https://stackoverflow.com/a/42522649/2771889
        EM.run do
          input_json.each do |search_url, name|
            @sockets.socket_setup(
              PoeTradeHelper.live_search_uri(search_url),
              PoeTradeHelper.live_ws_uri(@config['api_url'], search_url),
              name,
              @config['keepalive_timeframe_seconds'].to_f,
              @config['retry_timeframe_seconds'].to_f
            )
          end
        end unless input_json.nil?
      end
    end
  end
end
