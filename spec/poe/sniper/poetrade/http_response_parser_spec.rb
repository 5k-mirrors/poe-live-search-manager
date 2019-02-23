require 'spec_helper'

RSpec.describe Poe::Sniper::Poetrade::HttpResponseParser do

  before(:each) do
    @socket_data_path = "#{RSPEC_ROOT}/resources/example_socket_data.json"
  end

  describe '#get_whispers' do
    context 'When provided with socket data in JSON format' do
      it 'should create `Whisper` object with corresponding fields' do
        example_data = Poe::Sniper::JsonHelper.parse_file("#{RSPEC_ROOT}/resources/socket_data_single_item.json")
        whispers = described_class.new(example_data).get_whispers

        expect(whispers.length).to eq(1)

        whisper = whispers[0]

        expect(whisper.ign).to eq('StarDubswithBow')
        expect(whisper.item).to eq("Wrath Charm Gold Amulet")
        expect(whisper.buyout).to eq("2 exalted")
        expect(whisper.league).to eq("Breach")
        expect(whisper.tab).to eq("30c+")
        expect(whisper.x).to eq(0)
        expect(whisper.y).to eq(0)
      end
    end
  end

  describe '#get_whispers' do
    context 'When provided with socket data in JSON format conataining multiple items' do
      it 'should create corresponding number of `Whisper` objects' do
        example_data = Poe::Sniper::JsonHelper.parse_file("#{RSPEC_ROOT}/resources/example_socket_data.json")
        whispers = described_class.new(example_data).get_whispers
        expect(whispers.length).to eq(25)
      end
    end
  end
end
