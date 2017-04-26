require 'json'

class JsonHelper
  def self.parse_file file_path
    begin
      JSON.parse(File.open(file_path).read)
    rescue JSON::ParserError, Errno::ENOENT => e
      puts "Could not parse input JSON: #{e}"
    end
  end

  def self.parse json
    begin
      JSON.parse(json)
    rescue JSON::ParserError => e
      puts "Could not parse input JSON: #{e}"
    end
  end
end
