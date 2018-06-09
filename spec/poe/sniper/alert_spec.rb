require 'spec_helper'

RSpec.describe Poe::Sniper::Alert do
  describe '#to_clipboard' do
    let (:described_instance) { described_class.new(double("whisper", buyout?: false), "search_name") }

    context "when setting clipboard fails" do
      before do
        # Need to define it in non-windows env
        class Clipboard; end

        allow(Gem).to receive(:win_platform?).and_return(true)
        allow(Clipboard).to receive(:set_data).and_raise(StandardError)

        allow(Poe::Sniper::Logger.instance).to receive(:warn)
        allow(Poe::Sniper::Logger.instance).to receive(:info)
        allow(Poe::Sniper::Analytics).to receive(:instance).and_return(double("alytics_instance", track: nil))
      end

      it "does not fail" do
        expect { described_instance.to_clipboard }.not_to raise_error
      end

      it "logs warning" do
        expect(Poe::Sniper::Logger.instance).to receive(:warn).with(/Could not place whisper on clipboard/)
        described_instance.to_clipboard
      end

      it "tracks exception" do
        expect(Poe::Sniper::Analytics.instance).to receive(:track).with(hash_including({ event: 'Exception occured' }))
        described_instance.to_clipboard
      end
    end
  end
end
