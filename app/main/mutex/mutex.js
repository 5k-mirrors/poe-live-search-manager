import { Mutex } from "async-mutex";

class SingletonMutex {
  constructor() {
    if (!SingletonMutex.instance) {
      SingletonMutex.instance = new Mutex();
    }

    return SingletonMutex.instance;
  }
}

export default new SingletonMutex();
