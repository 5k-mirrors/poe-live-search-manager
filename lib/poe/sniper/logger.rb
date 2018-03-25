require 'forwardable'
require 'singleton'
require 'logger'

module Poe
  module Sniper
    # Alias so we can use `Logger` classname later
    def self.ruby_logger
      @logger ||= Logger
    end
  end
end

# Load STDLIB `Logger` before we define our own
Poe::Sniper.ruby_logger

module Poe
  module Sniper
    class Logger
      include Singleton
      extend Forwardable

      def_delegators :@logger, :info, :warn, :error, :debug

      def initialize
        @logger = Poe::Sniper.ruby_logger.new(STDOUT)
        @logger.level = Poe::Sniper.ruby_logger::INFO
      end
    end
  end
end
