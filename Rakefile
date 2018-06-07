require "rspec/core/rake_task"

RSpec::Core::RakeTask.new(:spec)

desc "Check if source can be required locally"
task :require do
  sh "ruby -e \"require '#{File.dirname __FILE__}/lib/poe/sniper'\""
end

desc "Create Windows executable"
task :ocra do
  p 'Skipping OCRA build as system is not Windows' && exit unless Gem.win_platform?

  sh "ocra ocra/poe-sniper.rb .env config/cacert.pem --output artifacts/poe-sniper.exe"
  sh "cd artifacts && 7z a poe-sniper-#{version}.zip *"
end

def version
  current_commit_tag = `git describe --tags --exact-match`
  current_commit_tag.empty? ? sh("git describe --tags") : current_commit_tag
end

task :start do
  puts "When started via rake task the 'user interaction before exit' functionality is broken upon interrupt because it also interrupts the rake task."
  require_relative 'lib/poe/sniper'
  Poe::Sniper.run('input/config.ini')
end

task :start_offline_debug do
  puts "When started via rake task the 'user interaction before exit' functionality is broken upon interrupt because it also interrupts the rake task."
  require_relative 'lib/poe/sniper'
  Poe::Sniper.offline_debug('input/config.ini', 'spec/resources/example_socket_data.json')
end

task :default => [:require, :spec, :ocra]
