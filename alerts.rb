require_relative 'alert'

class Alerts
  attr_accessor :alerts

  def initialize(notification_seconds, iteration_wait_time_seconds)
    @alerts = []
    @iteration_wait_time_seconds = iteration_wait_time_seconds
    @notification_seconds = notification_seconds
  end

  def push(alert)
    @alerts.push(alert)
  end

  def alert_next
    cnt = @alerts.length
    if cnt > 0
      alert(@alerts.shift, cnt)
    end
  end

  def alert_all
    cnt = @alerts.length
    @alerts.each do |alert|
      alert(alert, cnt)
      cnt -= 1
    end
  end

private

  def alert(alert, cnt)
    title = "New #{alert.search_name} listed"
    title += " (#{cnt -1} more)" if cnt > 1

    notification_thread = alert.show_notification(title, @notification_seconds)
    alert.to_clipboard

    # TODO replace with wait until gem
    while ['run', 'sleep'].include? notification_thread.status
      sleep @iteration_wait_time_seconds
    end
  end

end
