class Runner

  def self.run_with_exception_handling(callback:, params: nil)
    begin
      call(callback, params)
    rescue Exception => e
      puts ruby_style_trace(e)
    end
  end

  def self.run_and_wait_for_interaction(callback:, params: nil)
    call(callback, params)
    puts 'Press any key to continue'
    gets
  end

private

  def self.call(callback, params = nil)
    params.nil? ? callback.call : callback.call(params)
  end

  def self.ruby_style_trace(exception)
    exception.backtrace.join("\n\t").sub("\n\t", ": #{exception}#{exception.class ? " (#{exception.class})" : ''}\n\t")
  end

end
