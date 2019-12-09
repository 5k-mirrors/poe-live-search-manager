// => `fetch` is not defined in the main process.
import fetch from "node-fetch";

class Subscription {
  constructor() {
    this.data = {
      paying: false,
      type: "",
    };
  }

  query = id => {
    const userApiUrl = `${process.env.FIREBASE_API_URL}/user/${id}`;

    return fetch(userApiUrl).then(subscriptionData => subscriptionData.json());
  };

  update = updatedData => {
    this.data = {
      ...this.data,
      paying: updatedData.paying,
      type: updatedData.subscription_type,
    };
  };

  active = () => {
    return this.data.paying;
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
