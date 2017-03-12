require 'rb-notifu'
require 'win32/clipboard'

include Win32

class Alert
  attr_accessor :whisper_message, :notification_message, :notification_title

  def initialize whisper, search_name
    @logger = Logger.new(STDOUT)
    @logger.level = Logger::INFO

    @notification_title = get_notification_title(search_name)
    @notification_message = get_bo_message(whisper)
    @whisper_message = whisper.to_s

    log_alert_created(whisper, search_name)
  end

  def show_notification length
    Notifu::show :title => @notification_title, :message => @notification_message, :type => :info, :time => length, :noquiet => true
  end

  def to_clipboard
    Clipboard.set_data(@whisper_message, format = Clipboard::UNICODETEXT) # unicode for russian characters
  end

private

  def log_alert_created(whisper, search_name)
    message = "New altert created for: #{search_name} || "
    message += "Buyout: #{whisper.buyout} || " if whisper.buyout?
    message += "Whisper: #{@whisper_message}"
    @logger.info(message)
  end

  def get_bo_message whisper
    whisper.buyout? ? "~b/o #{whisper.buyout}" : " "
  end

  def get_notification_title(search_name)
    "New #{search_name} listed"
  end

end
