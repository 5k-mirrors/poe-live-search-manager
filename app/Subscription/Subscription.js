import * as javaScriptUtils from "../utils/JavaScriptUtils/JavaScriptUtils";
import baseApiUrl from "../frontend/resources/BaseApiUrl/BaseApiUrl";

class Subscription {
  constructor() {
    this.data = {};
  }

  refresh(id) {
    const userApiUrl = `${baseApiUrl}/user/${id}`;

    return fetch(userApiUrl)
      .then(subscriptionData => subscriptionData.json())
      .then(parsedSubscriptionData => {
        this.update(parsedSubscriptionData);
      });
  }

  update(updatedData) {
    this.data = {
      ...this.data,
      ...updatedData
    };
  }

  all() {
    return { ...this.data };
  }

  active() {
    if (javaScriptUtils.isDefined(this.data.paying)) {
      return this.data.paying;
    }

    return false;
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

export default SingletonSubscription;
