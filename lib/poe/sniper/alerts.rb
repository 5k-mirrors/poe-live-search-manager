require 'waitutil'

require_relative 'logger'

module Poe
  module Sniper
    class Alerts
      attr_accessor :alerts

      def initialize(notification_seconds, iteration_wait_time_seconds)
        @alerts = []
        @iteration_wait_time_seconds = iteration_wait_time_seconds
        @notification_seconds = notification_seconds
        @alert_wait_exceeded_meesage = "Notification didn't clear in configured time."
      end

      def push(alert)
        @alerts.push(alert)
      end

      def alert_loop
        loop do
          alert_next
          sleep @iteration_wait_time_seconds
        end
      end

      def alert_next
        cnt = @alerts.length
        if cnt > 0
          alert(@alerts.shift, cnt)
        end
      end

    private

      def alert(alert, cnt)
        alert.notification_title += " (#{cnt -1} more)" if cnt > 1

        notification_thread = alert.show_notification(@notification_seconds)
        alert.to_clipboard

        begin
          WaitUtil.wait_for_condition("Notification to clear", :timeout_sec => @notification_seconds + 0.5, :delay_sec => @iteration_wait_time_seconds) do
            not alive?(notification_thread)
          end
        rescue WaitUtil::TimeoutError
          Logger.instance.warn("Notification timeout exceeded, something's not right. This will not cause immediate issues but threads might hang in the background.")
        end
      end

      def alive?(thread)
        !thread.nil? && ['run', 'sleep'].include?(thread.status)
      end

    end
  end
end
