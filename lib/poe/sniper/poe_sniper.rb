require 'uri'
require 'yaml'

require 'parseconfig'
# TODO remove this
require 'faye/websocket'

require_relative 'whisper'
require_relative 'alert'
require_relative 'alerts'
require_relative 'sockets'
require_relative 'poe_trade_parser'
require_relative 'json_helper'

module Poe
  module Sniper

    class PoeSniper

      def initialize(config_path)
        @config = ParseConfig.new(config_path)
        @alerts = Alerts.new(@config['notification_seconds'].to_f, @config['iteration_wait_time_seconds'].to_f)
        @sockets = Sockets.new(@alerts)
        @poe_trade_parser = PoeTradeParser.new(@config['api_url'])
      end

      def run
        Thread.new {@alerts.alert_loop}
        Thread.new {@sockets.keepalive_loop(@config['keepalive_timeframe_seconds'].to_f)}
        EM.run {
          JsonHelper.parse(@config['input_file_path']).each do |search_url, name|
            parsed_url = URI.parse(search_url)
            @sockets.socket_setup(parsed_url, @poe_trade_parser.get_api_search_url(parsed_url), name)
          end
        }
      end

      def offline_debug(socket_data_path)
        example_data = JsonHelper.parse(socket_data_path)
        whispers = PoeTradeParser.get_whispers(example_data['data'], example_data['uniqs'])
        whispers.each do |whisper|
          @alerts.push(Alert.new(whisper, 'thing'))
        end
        @alerts.alert_all
      end

    end
  end
end
