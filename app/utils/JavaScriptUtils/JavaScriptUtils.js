export const isDefined = value => typeof value !== "undefined";

export const safeAccess = (properties, object) =>
  properties.reduce(
    (value, currentProperty) =>
      value && value[currentProperty] ? value[currentProperty] : null,
    object
  );
