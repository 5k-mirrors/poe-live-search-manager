# poe-sniper-electron

## Development

Include the Firebase API key in the `.env` file as described in the [example](./.env.example).

```bash
yarn install
yarn dev
```

## Features

- conditional socket connections
- single/all socket reconnections
- data persistence(between both app restarts & logouts, except the session id)
- route restrictions
- notifications(item name + b/o)
- notifications interval(customizable)
- test notifications
- query subscription details
- copy whisper messages to clipboard(customizable)
