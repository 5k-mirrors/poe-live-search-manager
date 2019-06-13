export const safeGet = (object, properties) =>
  properties.reduce(
    (value, currentProperty) =>
      value && value[currentProperty] ? value[currentProperty] : null,
    object
  );
export const isDefined = value =>
  typeof value !== "undefined" && value !== null;
