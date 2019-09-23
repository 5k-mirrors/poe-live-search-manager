import Bottleneck from "bottleneck";

class LimiterGroup {
  constructor() {
    // The limit is set to 7500ms to align with Windows notifications(5 seconds by default, but the notification's effect lasts for ~2500 ms).
    // https://www.pcworld.com/article/3054228/how-to-make-windows-10-notifications-last-a-little-or-a-lot-longer.html
    this.instance = new Bottleneck.Group({
      maxConcurrent: 1,
      minTime: 7500,
    });
  }

  get() {
    // If key is not specified explicitly, it defaults to an empty string.
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

class SingletonLimiterGroup {
  constructor() {
    if (!SingletonLimiterGroup.instance) {
      SingletonLimiterGroup.instance = new LimiterGroup();
    }

    return SingletonLimiterGroup.instance;
  }
}

export default new SingletonLimiterGroup();
