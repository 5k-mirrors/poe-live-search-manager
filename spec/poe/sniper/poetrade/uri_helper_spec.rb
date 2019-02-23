require 'spec_helper'

RSpec.describe Poe::Sniper::Poetrade::UriHelper do

  describe '.live_search_uri' do
    context 'when provided with search URL' do
      it 'returns parsed live URI' do
        expect(described_class.live_search_uri('http://poe.trade/search/seridonomosure')).to eq(URI.parse('http://poe.trade/search/seridonomosure/live'))
      end
    end

    context 'when provided with search URL with trailing slash' do
      it 'returns parsed live URI without trailing slash' do
        expect(described_class.live_search_uri('http://poe.trade/search/seridonomosure/')).to eq(URI.parse('http://poe.trade/search/seridonomosure/live'))
      end
    end

    context 'when provided with live search URL' do
      it 'returns parsed live URI' do
        expect(described_class.live_search_uri('http://poe.trade/search/seridonomosure/live')).to eq(URI.parse('http://poe.trade/search/seridonomosure/live'))
      end
    end

    context 'when provided with live search URL with trailing slash' do
      it 'returns parsed live URI without trailing slash' do
        expect(described_class.live_search_uri('http://poe.trade/search/seridonomosure/live/')).to eq(URI.parse('http://poe.trade/search/seridonomosure/live'))
      end
    end
  end

  describe '.live_ws_uri' do
    context 'when provided with live search URL' do
      it 'returns parsed live websocket URI' do
        expect(described_class.live_ws_uri('ws://live.poe.trade/', 'http://poe.trade/search/seridonomosure/live')).to eq(URI.parse('ws://live.poe.trade/seridonomosure'))
      end
    end

    context 'when provided with live search URL with trailing slash' do
      it 'returns parsed live websocket URI without trailing slash' do
        expect(described_class.live_ws_uri('ws://live.poe.trade/', 'http://poe.trade/search/seridonomosure/live/')).to eq(URI.parse('ws://live.poe.trade/seridonomosure'))
      end
    end

    context 'when provided with search URL' do
      it 'returns parsed live websocket URI' do
        expect(described_class.live_ws_uri('ws://live.poe.trade/', 'http://poe.trade/search/seridonomosure')).to eq(URI.parse('ws://live.poe.trade/seridonomosure'))
      end
    end

    context 'when provided with search URL with trailing slash' do
      it 'returns parsed live websocket URI without trailing slash' do
        expect(described_class.live_ws_uri('ws://live.poe.trade/', 'http://poe.trade/search/seridonomosure/')).to eq(URI.parse('ws://live.poe.trade/seridonomosure'))
      end
    end
  end
end
