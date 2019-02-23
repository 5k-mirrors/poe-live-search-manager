require 'uri'

module Poe
  module Sniper
    module Poetrade
      class UriHelper
        def self.live_search_uri(search_url)
          search_url = search_url[0..-2] if search_url.end_with?('/')
          search_url += '/live' unless search_url.end_with?('/live')
          URI.parse(search_url)
        end

        def self.live_ws_uri(api_url, search_url)
          search_url = search_url[0..-2] if search_url.end_with?('/')
          URI.parse(api_url + search_id(URI.parse(search_url)))
        end

      private

        def self.search_id(url)
          path_parts = url.path.split '/'
          path_parts.last.eql?('live') ? path_parts[-2] : path_parts[-1]
        end
      end
    end
  end
end
