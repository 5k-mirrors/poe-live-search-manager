require 'base64'
require 'segment/analytics'

require_relative 'user'

module Poe
  module Sniper
    class Analytics
      def self.ensure_analytics_key!
        raise 'Analytics key missing' unless encoded_analytics_key
        raise 'Analytics key not Base64 encoded' unless base64?(encoded_analytics_key)
      end

      def self.ensure_certificates!
        raise 'Certificates missing' unless certificates
      end

      def initialize
        @api = Segment::Analytics.new({
            write_key: self.class.analytics_key,
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

      private

      def self.analytics_key
        Base64.decode64(ENV['ANALYTICS_KEY'])
      end

      def self.encoded_analytics_key
        ENV['ANALYTICS_KEY']
      end

      def self.certificates
        ENV['SSL_CERT_FILE']
      end

      def self.base64?(value)
        value.is_a?(String) && Base64.encode64(Base64.decode64(value)) == value
      end
    end
  end
end
