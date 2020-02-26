export default class User {
  static data = {
    id: null,
    jwt: null,
  };

  static update(nextData) {
    this.data = {
      ...this.data,
      ...nextData,
    };
  }

  static clear() {
    this.data = {
      id: null,
      jwt: null,
    };
  }
}
