require 'rb-notifu'
require 'win32/clipboard'

include Win32

class Alert
  attr_accessor :whisper, :search_name

  def initialize whisper, search_name
    @whisper = whisper
    @search_name = search_name
  end

  def show_notification title, length
    Notifu::show :title => title, :message => get_message, :type => :info, :time => length, :noquiet => true
  end

  def to_clipboard
    Clipboard.set_data(@whisper.to_s, format = Clipboard::UNICODETEXT) # unicode for russian characters
  end

private

  def get_message
    @whisper.buyout? ? "~b/o #{@whisper.buyout}" : " "
  end

end
