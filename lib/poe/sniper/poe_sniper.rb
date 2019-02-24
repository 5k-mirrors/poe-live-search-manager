require 'yaml'
require 'eventmachine'
require 'poe/sniper/pro'

require_relative 'alert'
require_relative 'alerts'
require_relative 'json_helper'
require_relative 'yaml_helper'
require_relative 'encapsulators'
require_relative 'analytics'
require_relative 'analytics_data'
require_relative 'logger'
require_relative 'environment_config'

require_relative 'poetrade/socket'
require_relative 'poetrade/uri_helper'

module Poe
  module Sniper
    class PoeSniper
      CONFIG = {
        "api_url" => 'ws://live.poe.trade/',
        "iteration_wait_time_seconds" => 0.5,
        "keepalive_timeframe_seconds" => 60,
        "retry_timeframe_seconds" => 1,
      }

      def initialize(config_path)
        self.class.ensure_config_file!(config_path)
        @config = CONFIG.merge(parse_config(config_path))
        @alerts = Alerts.new(@config['notification_seconds'].to_f, @config['iteration_wait_time_seconds'].to_f)
        @sockets = []
        @auth = {
          user_email: @config["auth"]["user_email"],
          user_password: @config["auth"]["user_password"],
          api_key: EnvironmentConfig.auth_key
        }
      end

      def run
        Analytics.instance.identify
        start_alert_thread
        Encapsulators.user_interaction_before('exit') do
          Encapsulators.exception_handling do
            start_online
          end
        end
      end

      def offline_debug(socket_data_path)
        alert_thread = start_alert_thread(analytics: false)
        Encapsulators.user_interaction_before('exit') do
          Encapsulators.exception_handling(analytics: false) do
            start_offline_debug(socket_data_path, alert_thread)
          end
        end
      end

    private

      def self.ensure_config_file!(config_path)
        unless File.file?(config_path)
          Encapsulators.user_interaction_before('exit') do
            Logger.instance.error("Config file (#{config_path}) not found.")
          end
          exit
        end
      end

      def start_alert_thread(analytics: true)
        Thread.new do
          Encapsulators.exception_handling(analytics: analytics) do
            @alerts.alert_loop
          end
        end
      end

      def start_offline_debug(socket_data_path, alert_thread)
        example_data = JsonHelper.parse_file(socket_data_path)
        poe_trade_parser = Poetrade::HttpResponseParser.new(example_data)
        poe_trade_parser.get_whispers.each do |whisper|
          @alerts.push(Alert.new(whisper, 'thing'))
        end
        alert_thread.join
      end

      def start_online
        input_hash = load_input(@config['input_file_path'])
        Analytics.instance.track(event: 'App started', properties: AnalyticsData.app_start(input_hash))

        input_hash.each do |provider, input|
          next unless input
          if provider.eql?("poetrade")
            input.each do |search_url, name|
              @sockets << Poetrade::Socket.new(
                Poetrade::UriHelper.live_search_uri(search_url),
                Poetrade::UriHelper.live_ws_uri(@config['api_url'], search_url),
                name,
                @alerts,
                Alert
              )
            end
          elsif provider.eql?("pathofexilecom")
            input.each do |search_url, name|
              socket = begin
                Pro::Ggg::Socket.new(Pro::Ggg::UriHelper.live_ws_uri(search_url), name, @alerts, @config["pathofexilecom"]['session_id'], Alert, @auth)
              rescue RuntimeError => e
                if ["INVALID_PASSWORD", "EMAIL_NOT_FOUND", "INVALID_EMAIL"].any? { |error| e.message == error } 
                  Logger.instance.error("Could not authenticate: #{e.message} (#{name})")
                  false
                else
                  raise e
                end
              end
              @sockets << socket if socket
            end
          else
            raise "Provider unknown: #{provider}"
          end
        end

        return if @sockets.empty?

        # TODO: retry_timeframe_seconds blocks execution of other sockets
        # Multiple EMs in one process is not possible: https://stackoverflow.com/q/8247691/2771889
        # Alternatives would be iodine, plezi as pointed out here: https://stackoverflow.com/a/42522649/2771889
        EM.run do
          event_machines = @sockets.map do |socket|
            socket.setup(@config['keepalive_timeframe_seconds'].to_f, @config['retry_timeframe_seconds'].to_f)
          end
          EM.stop if event_machines.reject(&:nil?).empty?
        end
      end

      def parse_config(config_path)
        load_input(config_path)
      end

      def load_input(file_path)
        if file_path.end_with?("json")
          JsonHelper.parse_file(file_path)
        elsif file_path.end_with?("yml") || file_path.end_with?("yaml")
          YamlHelper.parse_file(file_path)
        else
          raise "Unknown input format #{file_path.split(".").last}"
        end
      end
    end
  end
end
