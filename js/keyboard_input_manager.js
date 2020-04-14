var optionNumber;
var key;

function KeyboardInputManager() { // manages keyboard input
  this.events = {}; // has a list of events

  if (window.navigator.msPointerEnabled) {
    //Internet Explorer 10 style
    this.eventTouchstart = "MSPointerDown";
    this.eventTouchmove = "MSPointerMove";
    this.eventTouchend = "MSPointerUp";
  } else {
    this.eventTouchstart = "touchstart"; // has different variables and assigning names to them
    this.eventTouchmove = "touchmove";
    this.eventTouchend = "touchend";
  }

  this.listen(); // this WHOLE object is a listener.
}

KeyboardInputManager.prototype.on = function (event, callback) {  // attaches event handlers to the object. takes in an event + callback function
  if (!this.events[event]) { // if this given event is not in the current set of events
    this.events[event] = []; // add it i guess
  }
  this.events[event].push(callback); // do the callback function
};

KeyboardInputManager.prototype.emit = function (event, data) {  // should accept an event and some data
  var callbacks = this.events[event]; // set of functions
  if (callbacks) { // if there are callbacks for this event
    callbacks.forEach(function (callback) { // go through each of them
      callback(data); // take in the data (says which one to do)
    });
  }
};

KeyboardInputManager.prototype.listen = function () { // adds event listeners
  var self = this;


  var map = {
    38: 0, // Up
    39: 1, // Right
    40: 2, // Down
    37: 3, // Left
    75: 0, // Vim up
    76: 1, // Vim right
    74: 2, // Vim down
    72: 3, // Vim left
    87: 0, // W
    68: 1, // D
    83: 2, // S
    65: 3, // A
    32: 32, // space bar
    13: 13 // enter



  };

  // Respond to direction keys
  document.addEventListener("keydown", function (event) { // listening for keydown events --> 
    var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
      event.shiftKey;
    var mapped = map[event.which]; // returns the key that was pressed like 38, etc, and each key maps to a number
  
    var usingKeys = false;
  
    if (mapped == 32) {
      event.preventDefault();
      usingKeys = true;
      var copyMove;
      optionNumber++;
      var direction;

      if (optionNumber == 1) {
        direction = "right";
      }

      if (optionNumber == 2) {
        direction = "down"
      }

      if (optionNumber == 3) {
        direction = "left"
      }

      if (optionNumber == 4) {
        optionNumber = 0;
      }
      if (optionNumber == 0) {
        direction = "up";
      }
      mapped = optionNumber;
      document.getElementById("option").innerHTML = "Move " + direction;
        
    } 
  
    if (mapped == 13) {
      usingKeys = true;
      event.preventDefault();
      
      self.emit("move", optionNumber);
    } else {

    if (!modifiers) { // if it is not one of the special keys
      if (!usingKeys && mapped !== undefined) {  
        event.preventDefault();
        self.emit("move", mapped); 
        
      }
    }
    // R key restarts the game
    if (!modifiers && event.which === 82) {
      self.restart.call(self, event);
    }
  }
  });

  document.getElementById("s").addEventListener("click", function (event) { // listening for keydown events --> 
    var mapped = optionNumber;
    
    console.log(mapped);
    event.preventDefault();
    self.emit("move", mapped);

  });





  // Respond to button presses
  this.bindButtonPress(".retry-button", this.restart);
  this.bindButtonPress(".restart-button", this.restart);
  this.bindButtonPress(".keep-playing-button", this.keepPlaying);

  // Respond to swipe events
  var touchStartClientX, touchStartClientY;
  var gameContainer = document.getElementsByClassName("game-container")[0];

  gameContainer.addEventListener(this.eventTouchstart, function (event) {
    if ((!window.navigator.msPointerEnabled && event.touches.length > 1) ||
      event.targetTouches.length > 1) {
      return; // Ignore if touching with more than 1 finger
    }

    if (window.navigator.msPointerEnabled) {
      touchStartClientX = event.pageX;
      touchStartClientY = event.pageY;
    } else {
      touchStartClientX = event.touches[0].clientX;
      touchStartClientY = event.touches[0].clientY;
    }

    event.preventDefault();
  });

  gameContainer.addEventListener(this.eventTouchmove, function (event) {
    event.preventDefault();
  });

  gameContainer.addEventListener(this.eventTouchend, function (event) {
    if ((!window.navigator.msPointerEnabled && event.touches.length > 0) ||
      event.targetTouches.length > 0) {
      return; // Ignore if still touching with one or more fingers
    }

    var touchEndClientX, touchEndClientY;

    if (window.navigator.msPointerEnabled) {
      touchEndClientX = event.pageX;
      touchEndClientY = event.pageY;
    } else {
      touchEndClientX = event.changedTouches[0].clientX;
      touchEndClientY = event.changedTouches[0].clientY;
    }

    var dx = touchEndClientX - touchStartClientX;
    var absDx = Math.abs(dx);


    var dy = touchEndClientY - touchStartClientY;
    var absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 10) {
      // (right : left) : (down : up)
      self.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));


    }
  });
};

KeyboardInputManager.prototype.restart = function (event) {
  event.preventDefault();
  this.emit("restart");
};

KeyboardInputManager.prototype.keepPlaying = function (event) {
  event.preventDefault();
  this.emit("keepPlaying");
};

KeyboardInputManager.prototype.bindButtonPress = function (selector, fn) {
  var button = document.querySelector(selector);
  button.addEventListener("click", fn.bind(this));
  button.addEventListener(this.eventTouchend, fn.bind(this));
};



KeyboardInputManager.prototype.toggle = function (event) {
  optionNumber++;
  var direction;
  var map = {
    38: 0, // Up
    39: 1, // Right
    40: 2, // Down
    37: 3, // Left
  };

  if (optionNumber == 1) {
    direction = "right";
    key = 39;
  }

  if (optionNumber == 2) {
    direction = "down"
    key = 40;
  }

  if (optionNumber == 3) {
    direction = "left"
    key = 37;
  }

  if (optionNumber == 4) {
    optionNumber = 0;

  }
  if (optionNumber == 0) {
    direction = "up";
    key = 38;
  }

  document.getElementById("option").innerHTML = "Move " + direction;


}

// KeyboardInputManager.prototype.selectOption = function (event) {
//  // event.preventDefault();



// }
setListeners = function () {   // only sets at the beginning
  optionNumber = 0;

  document.getElementById("t").addEventListener("click", function (event) { KeyboardInputManager.prototype.toggle(event) })

};

setListeners();