class PoeTradeHelper

  def initialize(api_url)
      @api_url = api_url
    end

  def get_api_search_url(url)
    @api_url + self.class.get_search_id(url)
  end

private

  def self.get_search_id(url)
    path_parts = url.path.split '/'
    path_parts.last.eql?('live') ? path_parts[-2] : path_parts[-1]
  end

end
