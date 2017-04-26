require 'spec_helper'

# TODO Poe::Sniper::PoeTradeParser
RSpec.describe PoeTradeParser do

  before(:each) do
    @socket_data_path = "#{RSPEC_ROOT}/resources/example_socket_data.json"
  end

  describe '#get_whispers' do
    context '' do
      it 'should ' do
        example_data = JsonHelper.parse_file(@socket_data_path)
        whispers = PoeTradeParser.new(example_data).get_whispers
        expect(whispers.length).to eq(25)
      end
    end
  end
end
