require 'spec_helper'

RSpec.describe Poe::Sniper::PoeSniper do
  let(:logger) { double("logger", info: nil, warn: nil, error: nil) }

  before do
    # We're essentially testing the application here so some initial setup is needed
    ENV['ANALYTICS_KEY'] = Base64.encode64('key')
    allow(Poe::Sniper::Analytics.instance).to receive(:identify)
    allow(Poe::Sniper::Analytics.instance).to receive(:track)
    allow(described_class).to receive(:ensure_config_file!)
    allow(ParseConfig).to receive(:new).and_return({ 'notification_seconds' => 1, 'iteration_wait_time_seconds' => 1, 'input_file_path' => 'input_file.json' })
    allow(Poe::Sniper::Encapsulators).to receive(:user_interaction_before).and_yield
    allow(Poe::Sniper::Logger).to receive(:instance).and_return(logger)
  end

  describe 'input handling' do
    let(:file) { Tempfile.new('input.json') }

    before do
      expect(File).to receive(:open).and_return(file)
    end

    after do
      file.close
      file.unlink
    end

    context 'invalid JSON' do
      before do
        file.write("not a valid JSON")
      end

      it "raises meaningful error" do
        expect(logger).to receive(:error).with(/File (.+) content format is incorrect or file cannot be accessed. Make sure that it is a valid JSON and accessible. You can use online validators such as jsonformatter.curiousconcept.com. Common mistakes: the last entry should not have a comma at the end, wrong file name in config.ini./)
        described_class.new('config_path').run
      end

      it "doesn't start EventMachine" do
        expect(EM).to_not receive(:run)
        described_class.new('config_path').run
      end

      it "send error analytics" do
        expect(Poe::Sniper::Analytics.instance).to receive(:track).with(hash_including({ event: 'Exception occured' }))
        described_class.new('config_path').run
      end
    end
  end
end
