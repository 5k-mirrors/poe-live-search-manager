require 'uri'

class PoeTradeHelper

  def self.live_search_uri(search_url)
    URI.parse(search_url + '/live')
  end

  def self.live_ws_uri(api_url, search_url)
    URI.parse(api_url + search_id(URI.parse(search_url)))
  end

private

  def self.search_id(url)
    path_parts = url.path.split '/'
    path_parts.last.eql?('live') ? path_parts[-2] : path_parts[-1]
  end

end
