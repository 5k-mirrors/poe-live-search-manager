// => `fetch` is not defined in the main process.
import fetch from "node-fetch";
import * as baseUrls from "../resources/BaseUrls/BaseUrls";

class Subscription {
  constructor() {
    this.data = {
      paying: false
    };
  }

  getData = id => {
    const userApiUrl = `${baseUrls.firebaseUserAPI}/user/${id}`;

    return fetch(userApiUrl).then(subscriptionData => subscriptionData.json());
  };

  update(updatedData) {
    this.data = {
      ...this.data,
      ...updatedData
    };
  }

  active() {
    return this.data.paying;
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
