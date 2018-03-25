require 'forwardable'
require 'singleton'
require 'logger'

module Poe
  module Sniper
    # Alias so we can use `Logger` classname later
    @@ruby_logger = Logger

    class Logger
      include Singleton
      extend Forwardable

      def_delegators :@logger, :info, :warn, :error, :debug

      def initialize
        @logger = @@ruby_logger.new(STDOUT)
        @logger.level = @@ruby_logger::INFO
      end
    end
  end
end
