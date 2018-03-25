require 'dotenv'
# `$0` trick is needed because we need to reference files in OCRA temp directory
# See: https://github.com/larsch/ocra#running-your-application
# Files need to be referenced relative to this file
Dotenv.load("#{File.dirname($0)}/../.env")
ENV['SSL_CERT_FILE'] = "#{File.dirname($0)}/../#{ENV['SSL_CERT_FILE']}"


require_relative 'sniper/poe_sniper'
require_relative 'sniper/analytics'

module Poe
  module Sniper
    def self.run(config_path)
      Analytics.ensure_analytics_key!
      Analytics.ensure_certificates!
      unless defined?(Ocra)
        PoeSniper.new(config_path).run
      end
    end

    def self.offline_debug(config_path, socket_data_path)
      PoeSniper.new(config_path).offline_debug(socket_data_path)
    end
  end
end
