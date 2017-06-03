require 'easy_logging'

require_relative 'sniper/poe_sniper'

module Poe
  module Sniper
    def self.run(config_path)
      PoeSniper.new(config_path).run
    end

    def self.offline_debug(config_path, socket_data_path)
      PoeSniper.new(config_path).offline_debug(socket_data_path)
    end
  end
end
