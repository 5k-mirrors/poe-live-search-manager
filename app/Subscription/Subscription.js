import User from "../main/user/user";
import authenticatedFetch from "../main/utils/authenticated-fetch/authenticated-fetch";
import {
  isDefined,
  safeJsonResponse,
} from "../utils/JavaScriptUtils/JavaScriptUtils";

class Subscription {
  constructor() {
    this.data = {
      type: "",
      plan: null,
    };
  }

  query = () => {
    const userApiUrl = `${process.env.FIREBASE_API_URL}/user/${User.data.id}`;

    return authenticatedFetch(userApiUrl).then(response =>
      safeJsonResponse(response)
    );
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

  clear() {
    this.data = {
      ...this.data,
      type: "",
      plan: null,
    };
  }
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
