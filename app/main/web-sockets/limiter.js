import Bottleneck from "bottleneck";

class WebSocketLimiter {
  constructor() {
    this.instance = new Bottleneck({
      maxConcurrent: 1,
      minTime: 1000,
    });
  }

  getInstance() {
    return this.instance;
  }
}

class SingletonWebSocketLimiter {
  constructor() {
    if (!SingletonWebSocketLimiter.instance) {
      SingletonWebSocketLimiter.instance = new WebSocketLimiter();
    }

    return SingletonWebSocketLimiter.instance;
  }
}

export default new SingletonWebSocketLimiter();
