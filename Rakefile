require "bundler/gem_tasks"
require "rspec/core/rake_task"

RSpec::Core::RakeTask.new(:spec)

desc "Check if source can be required locally"
task :require do
  sh "ruby -e \"require '#{File.dirname __FILE__}/lib/poe/sniper'\""
end

task :start do
  sh "ruby -e \"require '#{File.dirname __FILE__}/lib/poe/sniper'; Poe::Sniper.run('#{File.dirname __FILE__}/input/config.ini')\""
end

task :start_offline_debug do
  sh "ruby -e \"require '#{File.dirname __FILE__}/lib/poe/sniper'; Poe::Sniper.offline_debug('#{File.dirname __FILE__}/input/config.ini', '#{File.dirname __FILE__}/spec/resources/example_socket_data.json')\""
end

desc "Create Windows executable"
task :ocra do
  if Gem.win_platform?
    sh "ocra #{File.dirname __FILE__}/ocra/poe-sniper.rb"
  else
    p 'Skipping OCRA build as system is not Windows'
  end
end

task :default => [:require, :spec, :ocra]
