require 'spec_helper'

RSpec.describe "ssl support" do
  it "EM.ssl? returns true" do
    expect(EM.ssl?).to be_truthy
  end

  it "can connect to wss" do
    EM.run {
      ws = Faye::WebSocket::Client.new('wss://echo.websocket.org')

      ws.on :open do |event|
        EM.stop
      end
    }
  end
end
