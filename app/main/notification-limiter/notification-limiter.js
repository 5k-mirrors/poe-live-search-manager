import Bottleneck from "bottleneck";

// Notifications are limited to adapt to Windows's default settings. Users can enable and disable notifications which means the limiter needs to be stopped and restarted several times.
// Even though Bottleneck is capable of shutting down and dropping scheduled jobs altogether, it can't restart a particular limiter to receive jobs once it's stopped.
// The group feature is used instead even though there's always a single limiter attached to the group. This single limiter can be removed and re-added in response to user interactions.
export default class NotificationsLimiter {
  // The limit is set to 7500ms to align with Windows notifications(5 seconds by default, but the notification's effect lasts for ~2500 ms).
  // https://www.pcworld.com/article/3054228/how-to-make-windows-10-notifications-last-a-little-or-a-lot-longer.html
  static bottleneck = new Bottleneck.Group({
    maxConcurrent: 1,
    minTime: 7500,
  });

  static get() {
    // https://github.com/SGrondin/bottleneck#key
    return this.bottleneck.key();
  }

  // It stops the limiter attached to the group which means all queued jobs are dropped regardless of their state. Once it resolves, the limiter under the specified key is removed.
  // https://github.com/SGrondin/bottleneck#stop
  static drop() {
    return this.get()
      .stop()
      .then(() => this.bottleneck.deleteKey());
  }
}
