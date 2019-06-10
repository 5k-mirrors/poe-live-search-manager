// => `fetch` is not defined in the main process.
import fetch from "node-fetch";
import baseApiUrl from "../frontend/resources/BaseApiUrl/BaseApiUrl";

class Subscription {
  constructor() {
    this.data = {
      paying: false
    };
  }

  // => ESlint requires using `this` inside class methods.
  // eslint-disable-next-line class-methods-use-this
  getData(id) {
    const userApiUrl = `${baseApiUrl}/user/${id}`;

    return fetch(userApiUrl)
      .then(subscriptionData => subscriptionData.json())
      .then(parsedSubscriptionData => parsedSubscriptionData);
  }

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
