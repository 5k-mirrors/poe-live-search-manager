module Poe
  module Sniper
    module Poetrade
      class Whisper
        attr_accessor :ign, :item, :buyout, :league, :location, :tab, :x, :y

        def to_s
          whisper = "@#{ign} Hi, I would like to buy your #{item}"
          whisper += " listed for #{buyout}" if buyout?
          whisper += " in #{league}"
          whisper += get_item_location unless tab.nil?

          whisper
        end

        def buyout?
          not (buyout.nil? or buyout.empty?)
        end

      private

        def get_item_location
          message = " (stash tab #{tab}"
          if x >= 0 and y >= 0
            message += "; position: left #{x+1}, top #{y+1})"
          end
          message
        end
      end
    end
  end
end
