if Gem.win_platform?
  require 'rb-notifu'
  require 'win32/clipboard'
  include Win32
end

require_relative 'logger'
require_relative 'analytics'
require_relative 'analytics_data'

module Poe
  module Sniper
    class Alert
      attr_accessor :whisper_message, :notification_message, :notification_title

      def initialize whisper, search_name
        @notification_title = get_notification_title(search_name)
        @notification_message = get_bo_message(whisper)
        @whisper_message = whisper.to_s

        log_alert_created(whisper, search_name)
      end

      def show_notification length
        Notifu::show :title => @notification_title, :message => @notification_message, :type => :info, :time => length, :noquiet => true if Gem.win_platform?
      end

      def to_clipboard
        begin
          # unicode for russian characters
          Clipboard.set_data(@whisper_message, format = Clipboard::UNICODETEXT) if Gem.win_platform?
        rescue StandardError => e
          error_description = "Could not place whisper on clipboard: #{@whisper_message}"
          Logger.instance.warn error_description
          Analytics.instance.track(event: 'Exception occured', properties: AnalyticsData.exception(e, description: error_description, fatal: false))
        end
      end

    private

      def log_alert_created(whisper, search_name)
        message = "New snipe for #{search_name} || "
        message += "Buyout: #{whisper.buyout} || " if whisper.buyout?
        message += "Whisper: #{@whisper_message}"
        Logger.instance.info(message)
      end

      def get_bo_message whisper
        whisper.buyout? ? "~b/o #{whisper.buyout}" : " "
      end

      def get_notification_title(search_name)
        "New #{search_name} listed"
      end

    end
  end
end
