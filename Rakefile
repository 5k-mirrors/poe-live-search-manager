require "rspec/core/rake_task"

RSpec::Core::RakeTask.new(:spec)

desc "Check if source can be required locally"
task :require do
  sh "ruby -e \"require '#{File.dirname __FILE__}/lib/poe/sniper'\""
end

desc "Create Windows executable"
task :ocra do
  p 'Skipping OCRA build as system is not Windows' && exit unless Gem.win_platform?

  sh "echo export ANALYTICS_KEY=%ANALYTICS_KEY% >> .env"
  sh "echo export AUTH_KEY=%AUTH_KEY% >> .env"
  sh "ocra ocra/poe-sniper.rb .env config/cacert.pem --output artifacts/poe-sniper.exe --gem-full"
  sh "cd artifacts && 7z a poe-sniper-#{version}.zip *"
end

def version
  current_commit_tag = `git describe --tags --exact-match`.chomp
  current_commit_tag.empty? ? `git describe --tags`.chomp : current_commit_tag
end

task :start do
  puts "When started via rake task the 'user interaction before exit' functionality is broken upon interrupt because it also interrupts the rake task."
  require_relative 'lib/poe/sniper'
  Poe::Sniper.run('spec/resources/local_test_config/config.yaml')
end

task :start_offline_debug do
  puts "When started via rake task the 'user interaction before exit' functionality is broken upon interrupt because it also interrupts the rake task."
  require_relative 'lib/poe/sniper'
  Poe::Sniper.offline_debug('spec/resources/local_test_config/config.yaml', 'spec/resources/example_socket_data.json')
end

task :default => [:require, :spec, :ocra]
