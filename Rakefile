require "bundler/gem_tasks"
require "rspec/core/rake_task"

RSpec::Core::RakeTask.new(:spec)

desc "Check if source can be required locally"
task :require do
  sh "ruby -e \"require '#{File.dirname __FILE__}/lib/poe/sniper'\""
end

task :default => [:require, :spec]
