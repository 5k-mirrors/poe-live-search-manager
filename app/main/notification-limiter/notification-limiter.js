import Bottleneck from "bottleneck";

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
