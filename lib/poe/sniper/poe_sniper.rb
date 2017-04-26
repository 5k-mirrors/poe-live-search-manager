require 'uri'
require 'yaml'

require 'parseconfig'
# TODO remove this
require 'faye/websocket'

require_relative 'whisper'
require_relative 'alert'
require_relative 'alerts'
require_relative 'sockets'
require_relative 'poe_trade_helper'
require_relative 'json_helper'
require_relative 'runner'
require_relative 'reflection_util'

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
        Runner.run_and_wait_for_interaction(
          callback: Runner.method(:run_with_exception_handling), params: {
            callback: method(:start_online)})
      end

      def offline_debug(socket_data_path)
        Runner.run_and_wait_for_interaction(
          callback: Runner.method(:run_with_exception_handling), params: {
              callback: method(:start_offline_debug), params: {socket_data_path: socket_data_path}})
      end

    private

      def start_alert_thread
        Thread.new do
          alert_loop_method = ReflectionUtil.get_bound_instance_method(instance: @alerts, method_name: :alert_loop)
          Runner.run_with_exception_handling(callback: alert_loop_method)
        end
      end

      def start_offline_debug(socket_data_path:)
        example_data = JsonHelper.parse_file(socket_data_path)
        whispers = PoeTradeParser.get_whispers(example_data['data'], example_data['uniqs'])
        whispers.each do |whisper|
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
          keepalive_loop_method = ReflectionUtil.get_bound_instance_method(instance: @sockets, method_name: :keepalive_loop)
          Runner.run_with_exception_handling(callback: keepalive_loop_method, params: @config['keepalive_timeframe_seconds'].to_f)
        end
      end

    end
  end
end
