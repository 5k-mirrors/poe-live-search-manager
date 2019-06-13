class ItemFetchError extends Error {
  constructor(...args) {
    super(...args);

    Error.captureStackTrace(this, ItemFetchError);

    this.name = this.constructor.name;
  }
}

export default ItemFetchError;
