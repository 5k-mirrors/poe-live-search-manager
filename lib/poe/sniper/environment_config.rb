require 'base64'

module Poe
  module Sniper
    class EnvironmentConfig
      def self.ensure_analytics_key!
        raise 'Analytics key missing' unless encoded_analytics_key
        raise 'Analytics key not Base64 encoded' unless base64?(encoded_analytics_key)
      end

      def self.ensure_auth_key!
        raise 'Auth key missing' unless encoded_auth_key
        raise 'Auth key not Base64 encoded' unless base64?(encoded_auth_key)
      end

      def self.ensure_certificates!
        raise 'Certificates missing' unless certificates
      end

      def self.analytics_key
        Base64.decode64(ENV['ANALYTICS_KEY'])
      end

      def self.auth_key
        Base64.decode64(ENV['AUTH_KEY'])
      end

      private

      def self.encoded_analytics_key
        ENV['ANALYTICS_KEY']
      end

      def self.encoded_auth_key
        ENV['AUTH_KEY']
      end

      def self.certificates
        ENV['SSL_CERT_FILE']
      end

      def self.base64?(value)
        value.is_a?(String) && Base64.encode64(Base64.decode64(value)) == "#{value}\n"
      end
    end
  end
end
