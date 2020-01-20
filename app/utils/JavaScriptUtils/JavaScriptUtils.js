export const safeGet = (object, properties) =>
  properties.reduce(
    (value, currentProperty) =>
      value && value[currentProperty] ? value[currentProperty] : null,
    object
  );

export const isDefined = value =>
  typeof value !== "undefined" && value !== null;

export const envIs = env => process.env.NODE_ENV === env;

export const devLog = message => {
  if (envIs("development")) {
    // eslint-disable-next-line no-console
    console.log(`${new Date().toLocaleString()} | ${message}`);
  }
};

export const devErrorLog = message => {
  if (envIs("development")) {
    // eslint-disable-next-line no-console
    console.error(`${new Date().toLocaleString()} | ${message}`);
  }
};

export const cloneDeep = obj => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (err) {
    devLog(`Object deep clone error: ${err}`);

    return {};
  }
};
