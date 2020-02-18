export default class RecordNotExists extends Error {
  constructor(...args) {
    super(...args);

    Error.captureStackTrace(this, RecordNotExists);

    this.name = this.constructor.name;
  }
}
