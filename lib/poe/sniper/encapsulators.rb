module Poe
  module Sniper
    class Encapsulators

      include EasyLogging

      def self.exception_handling
        begin
          yield
        rescue Exception => e
          logger.error(ruby_style_trace(e))
        end
      end

      def self.user_interaction_before(event)
        yield
        logger.info("Press any key to #{event}")
        gets
      end

      private

      def self.ruby_style_trace(exception)
        exception.backtrace.join("\n\t").sub("\n\t", ": #{exception}#{exception.class ? " (#{exception.class})" : ''}\n\t")
      end
    end
  end
end
