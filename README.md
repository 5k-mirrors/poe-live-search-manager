# poe-sniper-electron

## Development

- Include the Firebase API key in the `.env` file as described in the [example](./.env.example).
- Set up notifications (if on Windows): https://electronjs.org/docs/tutorial/notifications#windows

```bash
yarn install
yarn dev
```

## Portable version - Windows notifications issue

See #42. Additionally, an issue has been submitted to the _electron-builder_ repository:

- https://github.com/electron-userland/electron-builder/issues/4054
