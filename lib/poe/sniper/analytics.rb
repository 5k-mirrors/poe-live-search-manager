require 'segment/analytics'
require 'singleton'

require_relative 'user'
require_relative 'environment_config'

module Poe
  module Sniper
    class Analytics
      include Singleton

      def initialize
        @api = Segment::Analytics.new({
            write_key: EnvironmentConfig.analytics_key,
            on_error: Proc.new { |status, msg| logger.error("Could not log analitycs: #{msg}") }
        })
        @user = User.unique
      end

      def identify
        @api.identify(user_id: @user.id)
      end

      def track(options)
        @api.track(options.merge({ user_id: @user.id }))
      end

      def flush
        @api.flush
      end
    end
  end
end
