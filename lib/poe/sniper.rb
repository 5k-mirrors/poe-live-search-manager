require 'dotenv/load'
require 'easy_logging'

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
