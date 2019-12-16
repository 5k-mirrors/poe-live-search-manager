export const safeGet = (object, properties) =>
  properties.reduce(
    (value, currentProperty) =>
      value && value[currentProperty] ? value[currentProperty] : null,
    object
  );

export const isDefined = value =>
  typeof value !== "undefined" && value !== null;

export const devLog = message => {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    // eslint-disable-next-line no-console
    console.log(message);
  }
};

export const envIs = env => process.env.NODE_ENV === env;

export const isObj = value => typeof value === "object" && value !== null;
