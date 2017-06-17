require 'uri'
require 'yaml'

require 'parseconfig'
require 'reflection_utils'
require 'encapsulate'
require 'encapsulators'

# TODO remove this
require 'faye/websocket'

require_relative 'whisper'
require_relative 'alert'
require_relative 'alerts'
require_relative 'sockets'
require_relative 'poe_trade_helper'
require_relative 'json_helper'

module Poe
  module Sniper

    class PoeSniper

      def initialize(config_path)
        @config = ParseConfig.new(config_path)
        @alerts = Alerts.new(@config['notification_seconds'].to_f, @config['iteration_wait_time_seconds'].to_f)
        @sockets = Sockets.new(@alerts)
        @poe_trade_helper = PoeTradeHelper.new(@config['api_url'])

        start_alert_thread
      end

      def run
        Encapsulate.run callback: method(:start_online),
          with: [Encapsulators.method(:user_interaction_before_return), Encapsulators.method(:exception_handling)]
      end

      def offline_debug(socket_data_path)
        Encapsulate.run callback: method(:start_offline_debug), 
          with: [Encapsulators.method(:user_interaction_before_return), Encapsulators.method(:exception_handling)], 
          params: {socket_data_path: socket_data_path}
      end

    private

      def start_alert_thread
        Thread.new do
          alert_loop_method = ReflectionUtils.get_bound_instance_method(instance: @alerts, method_name: :alert_loop)
          Encapsulate.run callback: alert_loop_method, with: [Encapsulators.method(:exception_handling)]
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
        start_keepalive_thread

        input_json = JsonHelper.parse_file(@config['input_file_path'])
        EM.run do
          input_json.each do |search_url, name|
            search_url += '/live'
            parsed_url = URI.parse(search_url)
            @sockets.socket_setup(parsed_url, @poe_trade_helper.get_api_search_url(parsed_url), name)
          end
        end unless input_json.nil?
      end

      def start_keepalive_thread
        Thread.new do
          keepalive_loop_method = ReflectionUtils.get_bound_instance_method(instance: @sockets, method_name: :keepalive_loop)
          Encapsulate.run callback: keepalive_loop_method, 
            with: [Encapsulators.method(:exception_handling)], 
            params: @config['keepalive_timeframe_seconds'].to_f
        end
      end

    end
  end
end
