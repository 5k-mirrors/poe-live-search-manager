import Bottleneck from "bottleneck";

// Even though Bottleneck is capable of shutting down a limiter and dropping scheduled jobs, it can't be restarted to receive jobs once it's been stopped.
// Group is used instead. This way the limiters are isolated, can be created and dropped one-by-one if the user decides to turn off notifications.
class NotificationLimiter {
  constructor() {
    // The limit is set to 7500ms to align with Windows notifications(5 seconds by default, but the notification's effect lasts for ~2500 ms).
    // https://www.pcworld.com/article/3054228/how-to-make-windows-10-notifications-last-a-little-or-a-lot-longer.html
    this.instance = new Bottleneck.Group({
      maxConcurrent: 1,
      minTime: 7500,
    });
  }

  get() {
    // https://github.com/SGrondin/bottleneck#key
    return this.instance.key();
  }

  drop() {
    return this.instance
      .key()
      .stop()
      .then(() => this.instance.deleteKey());
  }
}

class SingletonNotificationLimiter {
  constructor() {
    if (!SingletonNotificationLimiter.instance) {
      SingletonNotificationLimiter.instance = new NotificationLimiter();
    }

    return SingletonNotificationLimiter.instance;
  }
}

export default new SingletonNotificationLimiter();
