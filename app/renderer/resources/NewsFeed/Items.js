import types from "./Types";

export default [
  {
    type: types.RELEASE_NOTE,
    title: "v1.5.0",
    link: "https://github.com/5k-mirrors/poe-sniper/releases/tag/v1.5.0",
    description:
      "New features:\n- Include result timestamp\n- Pop up a confirmation window upon deleting ALL searches and results to avoid accidental removals",
  },
  {
    type: types.RELEASE_NOTE,
    title: "v1.4.0",
    link: "https://github.com/5k-mirrors/poe-sniper/releases/tag/v1.4.0",
    description:
      "New features:\n- Prices in non-English whisper messages are now also recognized\n\nFixes:\n- Eliminate another instance of duplicate socket connections",
  },
  {
    type: types.RELEASE_NOTE,
    title: "v1.3.0",
    link: "https://github.com/5k-mirrors/poe-sniper/releases/tag/v1.3.0",
    description:
      "Improve searches screen(vertical scrolling & remove pagination).",
  },
  {
    type: types.RELEASE_NOTE,
    title: "v1.2.1",
    link: "https://github.com/5k-mirrors/poe-sniper/releases/tag/v1.2.1",
    description: "Support encoded characters in search URLs",
  },
  {
    type: types.RELEASE_NOTE,
    title: "v1.2.0",
    link: "https://github.com/5k-mirrors/poe-sniper/releases/tag/v1.2.0",
    description:
      "New features:\n- Option to enable and disable system notifications upon new items\n- Open search URLs right from the app\n\nImprovements:\n- Remove application menu bar",
  },
];
