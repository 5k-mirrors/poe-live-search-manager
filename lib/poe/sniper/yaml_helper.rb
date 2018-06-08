require 'yaml'

require_relative 'logger'

module Poe
  module Sniper
    class YamlHelper
      def self.parse_file(file_path)
        begin
          YAML.safe_load(File.read(file_path))
        rescue StandardError => e
          Logger.instance.error("File (#{file_path}) content format is incorrect or file cannot be accessed. Make sure that it is a valid YAML and is accessible. You can use online validators such as yaml-online-parser.appspot.com.")
          raise e
        end
      end
    end
  end
end
