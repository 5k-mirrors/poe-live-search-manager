export default class SessionAlreadyExists extends Error {
  constructor(...args) {
    super(...args);

    Error.captureStackTrace(this, SessionAlreadyExists);

    this.name = this.constructor.name;
  }
}
