module Poe
  module Sniper
    class AnalyticsData
      def self.input_data(input_hash)
        {
          search_provider: {
            'poe.trade': {
              count: input_hash.size,
              items: input_hash.keys
            }
          }
        }
      end
    end
  end
end
