require 'json'

class JsonHelper
  def self.parse file_path
    begin
      JSON.parse(File.open(file_path).read)
    rescue JSON::ParserError, Errno::ENOENT => e
      puts "Could not parse input JSON: #{e}"
    end
  end
end
