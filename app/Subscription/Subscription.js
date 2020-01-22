// => `fetch` is not defined in the main process.
import fetch from "node-fetch";
import { isDefined } from "../utils/JavaScriptUtils/JavaScriptUtils";

export default class Subscription {
  static data = {
    type: "",
    plan: null,
  };

  static query(id) {
    const userApiUrl = `${process.env.FIREBASE_API_URL}/user/${id}`;

    return fetch(userApiUrl).then(subscriptionData => subscriptionData.json());
  }

  static update(nextData) {
    this.data = {
      ...this.data,
      type: nextData.type,
      plan: nextData.subscription,
    };
  }

  static active() {
    return isDefined(this.data.plan);
  }

  static clear() {
    this.data = {
      ...this.data,
      type: "",
      plan: null,
    };
  }
}
