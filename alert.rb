class Alert
	attr_accessor :whisper, :search_name

	def initialize whisper, search_name
		@whisper = whisper
		@search_name = search_name
	end
end
