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

export const safeJsonResponse = response =>
  response.text().then(textResponse => {
    if (response.ok) {
      try {
        return JSON.parse(textResponse);
      } catch (err) {
        throw new Error(
          `Could not JSON parse reponse: ${textResponse}. Error: ${err}`
        );
      }
    } else {
      throw new Error(`HTTP error: ${response.status} - ${textResponse}`);
    }
  });

export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const retryIn = (cb, delay) =>
  setTimeout(() => {
    cb();
  }, delay);
