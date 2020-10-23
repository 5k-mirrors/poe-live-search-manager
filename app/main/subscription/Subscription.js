import User from "../user/user";
import authenticatedFetch from "../utils/authenticated-fetch/authenticated-fetch";
import {
  devErrorLog,
  isDefined,
  safeJsonResponse,
} from "../../shared/utils/JavaScriptUtils/JavaScriptUtils";

export default class Subscription {
  static data = {
    type: "",
    plan: null,
  };

  static query() {
    const userApiUrl = `${process.env.FIREBASE_API_URL}/user/${User.data.id}`;

    return authenticatedFetch(userApiUrl)
      .then(response => safeJsonResponse(response))
      .catch(error => {
        devErrorLog("Subscription.query", error);
        throw error;
      });
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
