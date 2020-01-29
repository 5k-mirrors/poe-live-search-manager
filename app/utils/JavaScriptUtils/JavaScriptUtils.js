export const safeGet = (object, properties) =>
  properties.reduce(
    (value, currentProperty) =>
      value && value[currentProperty] ? value[currentProperty] : null,
    object
  );

export const isDefined = value =>
  typeof value !== "undefined" && value !== null;

export const envIs = env => process.env.NODE_ENV === env;

export const devLog = (...args) => {
  if (envIs("development")) {
    // eslint-disable-next-line no-console
    console.log(`${new Date().toLocaleString()} | `, ...args);
  }
};

export const devErrorLog = (...args) => {
  if (envIs("development")) {
    // eslint-disable-next-line no-console
    console.error(`${new Date().toLocaleString()} | `, ...args);
  }
};

export const cloneDeep = obj => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (err) {
    devErrorLog("Object deep clone error: ", err);

    return {};
  }
};

export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};
