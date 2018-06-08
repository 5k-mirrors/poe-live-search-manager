require 'spec_helper'

RSpec.describe Poe::Sniper::Alerts do
  describe '#alert_next' do
    let (:described_instance) { described_class.new(1, 1) }

    it 'tells alert to show notification and copy itself to the clipboard' do
      alert = double('alert')
      described_instance.push(alert)

      expect(alert).to receive(:show_notification).and_return(Thread.new {})
      expect(alert).to receive(:to_clipboard)

      described_instance.alert_next
    end
  end
end
