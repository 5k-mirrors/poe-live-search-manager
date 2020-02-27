import SingletonGlobalStore from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";

class User {
  constructor() {
    const globalStore = new SingletonGlobalStore();

    this.data = {
      id: null,
      jwt: null,
      policy: globalStore.get(storeKeys.ACCEPTED_PRIVACY_POLICY, null),
    };
  }

  update(nextData) {
    this.data = {
      ...this.data,
      ...nextData,
    };
  }

  clear() {
    this.data = {
      id: null,
      jwt: null,
      policy: null,
    };
  }
}

class SingletonUser {
  constructor() {
    if (!SingletonUser.instance) {
      SingletonUser.instance = new User();
    }

    return SingletonUser.instance;
  }
}

const singletonUser = new SingletonUser();

export default singletonUser;
