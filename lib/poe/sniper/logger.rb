require 'singleton'
require 'logger'
# Alias so we can use `Logger` classname later
@@ruby_logger = Logger

module Poe
  module Sniper
    class Logger
      include Singleton
      extend Forwardable

      def_delegators :@logger, :info, :warn, :error

      def initialize
        @logger = @@ruby_logger.new(STDOUT)
      end
    end
  end
end
