require 'json'

class JsonHelper
  def self.parse file_path
    JSON.parse(File.open(file_path).read)
  end
end
