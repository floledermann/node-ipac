const HID = require('node-hid');

function init(options) {
  
  options = Object.assign({
    deviceTemplate: {
      "vendorId": 53769,  // Ultimarc
      "productId": 1040,  // I-Pac Ultimate I/O
      "interface": 2,     // Interface for HID access
      "usagePage": 1
    },
    ledNames: {}
  }, options);
  
  let devices = HID.devices().filter(d => {
    return Object.entries(options.deviceTemplate).every(([key, value]) => d[key] == value);
  });
  
  if (devices.length == 0) {
    console.warn("No matching HID device found: " + 
      Object.entries(options.deviceTemplate).map(([key, value]) => key + ":" + value).join(", "));
    return null;
  }
  if (devices.length > 1) {
    console.warn("More than one device matching, using first match: " +
      Object.entries(options.deviceTemplate).map(([key, value]) => key + ":" + value).join(", "));
  }
  
  let deviceDescriptor = devices[0];
  let device = new HID.HID(deviceDescriptor.path);
  
  function getLedId(name) {
    if (typeof ledId == "number") return ledId;
    return options.ledNames[name] || undefined;
  }
  
  // public API
  return {
    
    setLED: function(ledId, intensity) {
      
      if (typeof ledId == "string") ledId = getLedId(ledId);
      
      if (ledId !== undefined) {
        // clamp id and intensity
        ledId = ledId & 0x7F;
        intensity = intensity & 0xff;
        
        device.write([3, ledId-1, intensity, 0, 0]);
      }
    },

    setRgbLED: function(ledId, red, green, blue) {
      
      if (typeof ledId == "string") ledId = getLedId(ledId);
      
      if (ledId !== undefined) {
        // clamp rgb values
        red = red & 0xff;
        green = green & 0xff;
        blue = blue & 0xff;
        
        this.setLED(ledId, blue);
        this.setLED(ledId+1, green);
        this.setLED(ledId+2, red);
      }
    },

    blinkLED: function(ledId, numPulses=4, durationOn=100, durationOff, highIntensity=255, lowIntensity=0) {
      
      if (!durationOff) durationOff = durationOn;

      // minimum cycle duration is ~100ms, because of lag introduced by USB comm
      durationOn = Math.max(durationOn, 100);
      durationOff = Math.max(durationOff, 100);      
      
      let isOn = false;
      let pulseCount = 0;
      
      let blink = () => {
        
        isOn = !isOn;
        
        if (isOn) {
          this.setLED(ledId, highIntensity);
          setTimeout(blink, durationOn);
        }
        else {
          this.setLED(ledId, lowIntensity);
          if (++pulseCount < numPulses) {
            setTimeout(blink, durationOff);
          }
        }
      }
      
      blink();
      
    },
    
    // takes an object holding name => ID pairs
    nameLEDs(namesToIds) {
      ledNames = namesToIds;
    },
    
    close: function() {
      device.close();
      device = null;
    },
    
    open: function() {
      if (device) close();
      let device = new HID.HID(deviceDescriptor.path);
    }
    
  }

}

init.devices = function() {
  return HID.devices();
}

module.exports = init;
