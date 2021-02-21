
const iPac = require("./index.js");

console.log(iPac.devices());

let device = iPac({
  ledNames: {
    right: 85,
    down: 88,
    left: 91,
    up: 94,
    rgb: 49
  }
});

setTimeout(() => device.blinkLED("right", 100, 100, 300), 0);
setTimeout(() => device.blinkLED("down", 100, 100, 300), 100);
setTimeout(() => device.blinkLED("left", 100, 100, 300), 200);
setTimeout(() => device.blinkLED("up", 100, 100, 300), 300);

device.setRgbLED("rgb", 20, 15, 40);

setTimeout(() => device.setRgbLED("rgb", 0, 0, 0), 10000);