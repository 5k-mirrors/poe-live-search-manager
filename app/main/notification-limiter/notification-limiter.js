import Bottleneck from "bottleneck";

// Bottleneck's group feature is used because it's not capable of restarting a particular limiter after it's stopped.
export default class NotificationsLimiter {
  static bottleneck = new Bottleneck.Group({
    maxConcurrent: 1,
    minTime: 7500,
  });

  static get() {
    // https://github.com/SGrondin/bottleneck#key
    return this.bottleneck.key();
  }

  static drop() {
    return this.bottleneck
      .key()
      .stop()
      .then(() => this.bottleneck.deleteKey());
  }
}
