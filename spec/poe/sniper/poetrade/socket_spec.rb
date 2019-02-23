require 'spec_helper'

RSpec.describe Poe::Sniper::Poetrade::Socket do
  describe "#socket_setup" do
    context "redirect on fetching initial ID" do
      before do
        allow(Net::HTTP).to receive(:post_form).and_return(double("response", body: "<h1>Redirecting...</h1>"))
      end

      it "raises error saying link is no longer valid" do
        expect do
          described_class.new("live_search_uri", "live_ws_uri", "search_name", [], Poe::Sniper::Alert).setup("keepalive_timeframe_seconds", "retry_timeframe_seconds")
        end.to raise_error(RuntimeError, /Link live_search_uri is redirecting/)
      end
    end
  end
end
