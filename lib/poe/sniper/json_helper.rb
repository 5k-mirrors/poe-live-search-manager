require 'json'

class JsonHelper
  include EasyLogging

  def self.parse_file file_path
    begin
      JSON.parse(File.open(file_path).read)
    rescue JSON::ParserError, Errno::ENOENT => e
      logger.error "Could not parse input JSON: #{e}"
    end
  end

  def self.parse json
    begin
      JSON.parse(json)
    rescue JSON::ParserError => e
      logger.error "Could not parse input JSON: #{e}"
    end
  end
end
