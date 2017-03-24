class ReflectionUtil
  def self.get_bound_instance_method(instance:, method_name:)
    get_class_constant(instance: instance).instance_method(method_name).bind(instance)
  end

  def self.get_class_constant(instance:)
    Object.const_get(instance.class.name)
  end
end
