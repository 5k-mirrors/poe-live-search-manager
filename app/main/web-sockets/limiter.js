import Bottleneck from "bottleneck";
import { randomInt } from "../../utils/JavaScriptUtils/JavaScriptUtils";

class WebSocketLimiter {
  constructor() {
    this.instance = new Bottleneck({
      maxConcurrent: 1,
      minTime: randomInt(1200, 1500),
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
