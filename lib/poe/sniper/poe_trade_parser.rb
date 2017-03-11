require 'nokogiri'

class PoeTradeParser

  def initialize(api_url)
    @api_url = api_url
  end

  def get_api_search_url(url)
    @api_url + self.class.get_search_id(url)
  end

  def self.get_whispers(html_item_data, ids)
    whispers = []
    html = Nokogiri::HTML(html_item_data)

    ids.each do |id|
      data_path = "tbody.item-live-#{id}"
      whispers << get_whisper(get_html_data_attributes(get_html_element_by_path(html, data_path)))
    end

    whispers
  end

private

  def self.get_search_id(url)
    path_parts = url.path.split '/'
    path_parts.last.eql?('live') ? path_parts[-2] : path_parts[-1]
  end

  def self.get_html_element_by_path(html, path)
    html.css(path)[0]
  end

  def self.get_html_data_attributes(tbody)
    data = {}
    data_attributes = tbody.xpath("./@*[starts-with(name(), 'data-')]") # . relative path
    data_attributes.each { |x| data[x.name] = x.value }
    data
  end

  def self.get_whisper(data)
    whisper = Whisper.new
    whisper.ign = data['data-ign']
    whisper.item = data['data-name']
    whisper.buyout = data['data-buyout']
    whisper.league = data['data-league']
    whisper.tab = data['data-tab']
    whisper.x = data['data-x'].to_i
    whisper.y = data['data-y'].to_i

    whisper
  end

end
