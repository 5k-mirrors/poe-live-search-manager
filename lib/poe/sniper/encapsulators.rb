require_relative 'analytics'
require_relative 'analytics_data'
require_relative 'logger'

module Poe
  module Sniper
    class Encapsulators
      def self.exception_handling(analytics: true)
        begin
          yield if block_given?
        rescue Exception => e
          Analytics.instance.track(event: 'Exception occured', properties: AnalyticsData.exception(e)) if analytics
          Analytics.instance.flush if analytics
          Logger.instance.error("")
          Logger.instance.error("Something went wrong here, someone must've Vaal'd the app! No worries though. You might find some information above on how to fix this. If that's not the case please check out the issues for the project (github.com/5k-mirrors/poe-sniper/issues) and create a new one if needed. You can find some gibberish below which you should include because it's helpful for developers.")
          Logger.instance.error("\"If you are going to lose, at least lose with style!\" - Vagan, Weaponmaster")
          sorround_gibberish do
            Logger.instance.error(ruby_style_trace(e))
          end
        end
      end

      def self.user_interaction_before(event)
        begin
          yield if block_given?
        ensure
          Logger.instance.info("Press any key to #{event}")
          gets
        end
      end

      private

      def self.sorround_gibberish
        Logger.instance.error("")
        Logger.instance.error("############# HELPFUL GIBBERISH BELOW #############")
        Logger.instance.error("")
        yield
        Logger.instance.error("")
        Logger.instance.error("############# HELPFUL GIBBERISH ABOVE #############")
        Logger.instance.error("")
      end

      def self.ruby_style_trace(exception)
        exception.backtrace.join("\n\t").sub("\n\t", ": #{exception}#{exception.class ? " (#{exception.class})" : ''}\n\t")
      end
    end
  end
end
