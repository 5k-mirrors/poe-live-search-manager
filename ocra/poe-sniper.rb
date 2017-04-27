require_relative '../lib/poe/sniper.rb'
require 'timeout'

if File.file? 'config.ini'
  Poe::Sniper.run('config.ini')
else
  p 'Config not found. Place your config.ini file next to this executable.'
  p 'Press a key to exit (automatically exiting in 5 seconds)'
  p 'Ignore this message during OCRA build'
  # Exit timeout is needed so user can read this message but OCRA build will not hang
  begin
    Timeout::timeout(5) do
      gets
    end
  rescue Timeout::Error
  end
end
