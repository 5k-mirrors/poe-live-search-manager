class InvalidInputError extends Error {
  constructor(...args) {
    super(...args);

    Error.captureStackTrace(this, InvalidInputError);

    this.name = this.constructor.name;
  }
}

export default InvalidInputError;
