import Bottleneck from "bottleneck";

// Even though Bottleneck is capable of shutting down a limiter and dropping scheduled jobs, it can't be restarted to receive jobs once it's been stopped.
// Group is used instead. This way the limiters are isolated, can be created and dropped one-by-one if the user decides to turn on/off notifications.
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
