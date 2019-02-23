require 'json'

require_relative 'logger'

module Poe
  module Sniper
    class JsonHelper
      def self.parse_file(file_path)
        begin
          JSON.parse(File.open(file_path).read)
        rescue JSON::ParserError, Errno::ENOENT => e
          Logger.instance.error("File (#{file_path}) content format is incorrect or file cannot be accessed. Make sure that it is a valid JSON and is accessible. You can use online validators such as jsonformatter.curiousconcept.com. Common mistakes: the last entry should not have a comma at the end, config.yaml should point to correct file.")
          raise e
        end
      end

      def self.parse(json)
        begin
          JSON.parse(json)
        rescue JSON::ParserError => e
          Logger.instance.error("Could not parse JSON #{json}: #{e}")
          raise e
        end
      end
    end
  end
end
