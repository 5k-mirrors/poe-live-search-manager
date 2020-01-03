// => `fetch` is not defined in the main process.
import fetch from "node-fetch";
import { isDefined } from "../utils/JavaScriptUtils/JavaScriptUtils";

class Subscription {
  constructor() {
    this.data = {
      type: "",
      plan: null,
    };
  }

  query = id => {
    const userApiUrl = `${process.env.FIREBASE_API_URL}/user/${id}`;

    return fetch(userApiUrl).then(subscriptionData => subscriptionData.json());
  };

  update = updatedData => {
    this.data = {
      ...this.data,
      type: updatedData.type,
      plan: updatedData.subscription,
    };
  };

  active = () => {
    return isDefined(this.data.plan);
  };
}

class SingletonSubscription {
  constructor() {
    if (!SingletonSubscription.instance) {
      SingletonSubscription.instance = new Subscription();
    }

    return SingletonSubscription.instance;
  }
}

const singletonSubscription = new SingletonSubscription();

export default singletonSubscription;
