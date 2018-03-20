require 'digest'
require 'socket'

module Poe
  module Sniper
    class User
      def self.unique
        User.new(Socket.gethostname)
      end

      attr_reader :id

      def initialize(unique_id)
        @id = Digest::SHA1.hexdigest(unique_id)
      end
    end
  end
end
