class MissingXRateLimitAccountHeaderError extends Error {
  constructor(...args) {
    super(...args);

    Error.captureStackTrace(this, MissingXRateLimitAccountHeaderError);

    this.name = this.constructor.name;
  }
}

export default MissingXRateLimitAccountHeaderError;
