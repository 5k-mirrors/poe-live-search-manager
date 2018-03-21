require 'spec_helper'

RSpec.describe Poe::Sniper::AnalyticsData do
  describe '.exception' do
    it 'omits personal data from origin field' do
      begin
        raise ArgumentError.new('error message')
      rescue Exception => e
        expect(described_class.exception(e)[:origin]).to eq(["analytics_data_spec.rb:7:in `block (3 levels) in <top (required)>'"])
      end
    end
  end
end
