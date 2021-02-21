## Control Ultimarc I-PAC device from Node.js

Currently, only the [**I-PAC Ultimate I/O**](https://www.ultimarc.com/control-interfaces/i-pacs/i-pac-ultimate-i-o/) is supported, since I do not have access to any other devices to test them.

Adding support for new devices should be simply a matter of passing a different **`deviceTemplate`** option (specifying `vendorId`, `productId`, `interface` and `usagePage` of the USB device) to the initialization function. Open an issue / PR if you want to contribute code for other devices.

### Sample Program

```js
const iPac = require("node-ipac");

let device = iPac({
  // you can configure names for LEDs to use instead of numeric IDs
  ledNames: {
    right: 85,
    down: 88,
    left: 91,
    up: 94,
    rgb: 49
  }
});

device.setLED("up", 255);             // LED 94 full ON

device.blinkLED("down", 4, 100);      // LED 88 blink 4 times, duration of each on/off phase 100ms

device.setRgbLED("rgb", 20, 15, 40);  // RGB LED (LEDs 49-51) dark purple
```





