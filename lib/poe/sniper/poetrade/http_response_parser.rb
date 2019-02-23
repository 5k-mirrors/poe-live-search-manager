require 'nokogiri'

require_relative 'whisper'
require_relative '../json_helper'
require_relative '../logger'

module Poe
  module Sniper
    module Poetrade
      class HttpResponseParser
        def self.new_id(response)
          JsonHelper.parse(response.body)['newid']
        end

        def initialize(socket_response_body_json)
          @socket_response_body_json = socket_response_body_json
        end

        def get_last_displayed_id
          @socket_response_body_json['newid']
        end

        def get_count
          @socket_response_body_json['count']
        end

        def get_whispers
          whispers = []
          html = Nokogiri::HTML(@socket_response_body_json['data'])

          @socket_response_body_json['uniqs'].each do |id|
            data_path = "tbody.item-live-#{id}"
            tbody_element = get_html_element_by_path(html, data_path)
            if not tbody_element.nil?
              whispers << get_whisper(get_html_data_attributes(get_html_element_by_path(html, data_path)))
            else
              Logger.instance.warn "Element with unique id #{id} not found"
            end
          end

          whispers
        end

      private

        def get_html_element_by_path(html, path)
          html.css(path)[0]
        end

        def get_html_data_attributes(tbody)
          data = {}
          data_attributes = tbody.xpath("./@*[starts-with(name(), 'data-')]") # . relative path
          data_attributes.each { |x| data[x.name] = x.value }
          data
        end

        def get_whisper(data)
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
    end
  end
end
