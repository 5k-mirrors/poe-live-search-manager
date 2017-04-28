# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'poe/sniper/version'

Gem::Specification.new do |spec|
  spec.name          = "poe-sniper"
  spec.version       = Poe::Sniper::VERSION
  spec.authors       = ["thisismydesign"]
  spec.email         = ["thisismydesign@users.noreply.github.com"]

  spec.summary       = %q{Path of Exile utility to snipe listed items}
  spec.homepage      = "https://github.com/thisismydesign/poe-sniper"

  # Prevent pushing this gem to RubyGems.org. To allow pushes either set the 'allowed_push_host'
  # to allow pushing to a single host or delete this section to allow pushing to any host.
  if spec.respond_to?(:metadata)
    spec.metadata['allowed_push_host'] = "TODO: Set to 'http://mygemserver.com'"
  else
    raise "RubyGems 2.0 or newer is required to protect against public gem pushes."
  end

  spec.files         = `git ls-files -z`.split("\x0").reject do |f|
    f.match(%r{^(test|spec|features)/})
  end
  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  # Because of `Gem.win_platform?`
  # http://stackoverflow.com/a/21468976
  spec.required_ruby_version = '>= 1.9'

  # Because of `require_relative`
  spec.required_ruby_version = '>= 1.9.2'

  spec.add_development_dependency "bundler", "~> 1.14"
  spec.add_development_dependency "rake", "~> 10.0"
  spec.add_development_dependency "rspec", "~> 3.0"
  spec.add_development_dependency "ocra"
  # spec.add_development_dependency "coveralls"
  spec.add_development_dependency "codecov"

  spec.add_dependency "faye-websocket"
  spec.add_dependency "json"
  spec.add_dependency "nokogiri"
  spec.add_dependency "rb-notifu"
  spec.add_dependency "win32-clipboard"
  spec.add_dependency "waitutil"
  spec.add_dependency "parseconfig"
  spec.add_dependency "memoist"
end
