# Testing

## Search IDs

```js

let ids = [
// all unique armour as of 3.8
"Standard/NK6Ec5",
"Standard/24PVIk",
"Standard/QMgpcw",
"Standard/E6zLC5",
"Standard/On3YlHE",
"Standard/zb6as4",
"Standard/WaRRSm",
"Standard/PPXrJMUL",
"Standard/Ag0aIQ",
"Standard/A3DZc5",
"Standard/GnyZL9Ub",
"Standard/3XO0F5",
"Standard/gLyOiQ",
"Standard/l5a2tV",
"Standard/vlQZSE",
"Standard/ypRBiR",
"Standard/yYnWnOCR",
"Standard/9DnOtK",
"Standard/V5bbpaCp",
"Standard/AL0BTn",
"Standard/A4GQs9",
"Standard/19lOHK",
"Standard/z9gRF4",
"Standard/nw4zc0",
"Standard/ve2XFE",
"Standard/1qykFg",
"Standard/NK6Ec5",
"Standard/AevgUL",
"Standard/8KW8cV",
"Standard/RJ2rs7",
"Standard/vyyWFE",
"Standard/x7BRH5",
"Standard/9ajYiK",
"Standard/pwWeC0",
"Standard/grZKsQ",
"Standard/WGDLpRfm",
"Standard/xWXmfm",
"Standard/AMXPsJ",
"Standard/7K527T5",
"Standard/z8vR3Rc4",
"Standard/pJ7YDeS0",
"Standard/GKKDFb",
"Standard/mjarELH6",
"Standard/yEqqsR",
"Standard/9dOmCK",
"Standard/mkVZf6",
"Standard/ZWe9TQ",
"Standard/G6OWUb",
"Standard/JZP9cl",
"Standard/BgnQ3at8",
"Standard/RJkqI7",
// unique boots as of 3.8
"Standard/jJ8RluX",
"Standard/oVEgsl",
"Standard/9zJaEeQSK",
"Standard/2n7GIk",
"Standard/EBWbM4S5",
"Standard/mk7LU6",
"Standard/nrnMBvT0",
"Standard/RW5XPRi7",
"Standard/8roMsV",
"Standard/B6w4u8",
"Standard/WvoZCm",
"Standard/1z6LF4",
"Standard/XLYeIP",
"Standard/2nloIk",
"Standard/4mqEh9",
"Standard/yllGIR",
"Standard/3dagU5",
"Standard/Dl6wS5",
"Standard/dgEvcJ",
"Standard/Gvn3Fb",
"Standard/7Xoav7H5",
"Standard/OgBzBOUE",
"Standard/EBoYS5",
"Standard/YgeDiY",
"Standard/q9MkCg",
"Standard/vZPWHE",
"Standard/OEmQUE",
"Standard/kynMO6S5",
"Standard/j9DWTX",
"Standard/ALzjfn",
"Standard/k3MOgWU5",
"Standard/NBajh8",
"Standard/MWRyHJ",
];

console.log(ids.length);
```

To test the rate limit on connecting websockets execute in a browser console on a logged-in pathofexile.com page:

```js
const connectToAll = (ids = []) => {
  ids.forEach((id, index) => {
    console.log(`Connecting to ${index} ${id}`);

    const ws = new WebSocket(`wss://www.pathofexile.com/api/trade/live/${id}`);

    ws.onopen = function onOpen() {
      console.log(`Socket open - ${index} ${id} ${new Date().toLocaleTimeString()}`);
    };

    ws.onclose = function onClose() {
      console.log(`Socket close - ${index} ${id} ${new Date().toLocaleTimeString()}`);
    };
  });
};

connectToAll(ids);
```

Limitations:
- connection `open`: 1/second
- connection limit: 80
- connection `close`: 1/second, 1/minute after some events
