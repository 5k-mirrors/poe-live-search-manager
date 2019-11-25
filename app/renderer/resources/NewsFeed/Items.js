import types from "./Types";

export default [
  {
    type: types.RELEASE_NOTE,
    title: "v1.8.0",
    link: "https://github.com/5k-mirrors/poe-sniper/releases/tag/v1.8.0",
    description: `Requests are now rate-limitied to adapt to Path of Exile's tracking policies.

New features:
- Reflect rate-limit state on the left side of the navigation bar.
    `,
    date: "2019-11-25T10:00:00Z",
  },
  {
    type: types.RELEASE_NOTE,
    title: "v1.7.0",
    link: "https://github.com/5k-mirrors/poe-sniper/releases/tag/v1.7.0",
    description:
      'Shipping an all-new "News" tab to keep up with the latest updates.',
    date: "2019-11-15T14:03:00Z",
  },
  {
    type: types.RELEASE_NOTE,
    title: "v1.6.0",
    link: "https://github.com/5k-mirrors/poe-sniper/releases/tag/v1.6.0",
    description: `New features:
- Display number of Searches on the bottom of the Searches screen

Fixes:
- Disable "delete all" action in case of no entries
- Remove tooltip displaying true upon hovering version number
- Adjust the layout of the Searches screen`,
    date: "2019-11-15T13:37:00Z",
  },
  {
    type: types.RELEASE_NOTE,
    title: "v1.5.0",
    link: "https://github.com/5k-mirrors/poe-sniper/releases/tag/v1.5.0",
    description: `New features:
- Include result timestamp([#57](https://github.com/5k-mirrors/poe-sniper/issues/57))
- Pop up a confirmation window upon deleting ALL searches and results to avoid accidental removals`,
    date: "2019-11-13T14:51:00Z",
  },
  {
    type: types.RELEASE_NOTE,
    title: "v1.4.0",
    link: "https://github.com/5k-mirrors/poe-sniper/releases/tag/v1.4.0",
    description: `New features:
- Prices in non-English whisper messages are now also recognized - thanks to [@verasztol](https://github.com/verasztol) for the contribution

Fixes:
- Eliminate another instance of duplicate socket connections`,
    date: "2019-11-04T17:25:00Z",
  },
  {
    type: types.RELEASE_NOTE,
    title: "v1.3.0",
    link: "https://github.com/5k-mirrors/poe-sniper/releases/tag/v1.3.0",
    description:
      "Improve searches screen(vertical scrolling & remove pagination).",
    date: "2019-10-02T11:36:00Z",
  },
  {
    type: types.RELEASE_NOTE,
    title: "v1.2.1",
    link: "https://github.com/5k-mirrors/poe-sniper/releases/tag/v1.2.1",
    description:
      "Support encoded characters in search URLs([#51](https://github.com/5k-mirrors/poe-sniper/issues/51)).",
    date: "2019-09-28T11:47:00Z",
  },
  {
    type: types.RELEASE_NOTE,
    title: "v1.2.0",
    link: "https://github.com/5k-mirrors/poe-sniper/releases/tag/v1.2.0",
    description: `New features:
- Option to enable and disable system notifications upon new items([#50](https://github.com/5k-mirrors/poe-sniper/issues/50)).
- Open search URLs right from the app.

Improvements:
- Remove application menu bar.`,
    date: "2019-09-26T08:17:00Z",
  },
  {
    type: types.RELEASE_NOTE,
    title: "v1.1.0",
    link: "https://github.com/5k-mirrors/poe-sniper/releases/tag/v1.1.0",
    description: `New feature:
- Added results screen ([#43](https://github.com/5k-mirrors/poe-sniper/issues/43), [#45](https://github.com/5k-mirrors/poe-sniper/issues/45))

Fixes:
- Fixed another instance of duplicate notifications ([#48](https://github.com/5k-mirrors/poe-sniper/issues/48))
  - In case of encountering this issue again, report it here and restart the app the temporarily fix it`,
    date: "2019-09-17T21:07:00Z",
  },
  {
    type: types.RELEASE_NOTE,
    title: "v1.0.3",
    link: "https://github.com/5k-mirrors/poe-sniper/releases/tag/v1.0.3",
    description: "Add delete all button",
    date: "2019-09-14T13:30:00Z",
  },
  {
    type: types.RELEASE_NOTE,
    title: "v1.0.2",
    link: "https://github.com/5k-mirrors/poe-sniper/releases/tag/v1.0.2",
    description:
      "Fixes [#48](https://github.com/5k-mirrors/poe-sniper/issues/48) - Notifications come in multiple times for the same result",
    date: "2019-09-12T11:09:00Z",
  },
  {
    type: types.RELEASE_NOTE,
    title: "v1.0.1",
    link: "https://github.com/5k-mirrors/poe-sniper/releases/tag/v1.0.1",
    description:
      "Users can no longer navigate away from the account tab until the setup is completed.",
    date: "2019-09-12T08:07:00Z",
  },
  {
    type: types.RELEASE_NOTE,
    title: "v1.0.0",
    link: "https://github.com/5k-mirrors/poe-sniper/releases/tag/v1.0.0",
    description: `\`v1.0.0\` ships a completely new app with [pathofexile.com/trade](https://www.pathofexile.com/trade) support and a graphical interface.

Going forward we're working new features, such as showing the items in the app and the ability to ignore users. As always, we're welcoming feedback, ideas and bug reports at https://github.com/5k-mirrors/poe-sniper/issues.`,
    date: "2019-09-12T14:20:00Z",
  },
];
