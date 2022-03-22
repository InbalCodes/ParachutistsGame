// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/InputState.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var InputState =
/** @class */
function () {
  function InputState(boatSpeed) {
    this.boatSpeed = boatSpeed;
    this.boatMovement = 0;
    this.leftDown = false;
    this.righDown = false;
    window.addEventListener('keydown', this.keydownListener.bind(this));
    window.addEventListener('keyup', this.keyupListener.bind(this));
  }

  InputState.prototype.keydownListener = function (event) {
    if (event.code == "ArrowLeft") {
      this.leftDown = true;
      this.boatMovement = 0 - this.boatSpeed;
    } else if (event.code == "ArrowRight") {
      this.rightDown = true;
      this.boatMovement = this.boatSpeed;
    }
  };

  InputState.prototype.keyupListener = function (event) {
    if (event.code == "ArrowLeft") {
      this.leftDown = false;
      this.boatMovement = this.rightDown ? this.boatSpeed : 0;
    } else if (event.code == "ArrowRight") {
      this.rightDown = false;
      this.boatMovement = this.leftDown ? 0 - this.boatSpeed : 0;
    }
  };

  return InputState;
}();

exports.default = InputState;
},{}],"src/GameStatus.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var GameStatus =
/** @class */
function () {
  function GameStatus(maxLives, pointsPerParachute) {
    this.pointsPerParachute = pointsPerParachute;
    this.remainingLives = maxLives;
    this.scoreTotal = 0;
  }

  GameStatus.prototype.hitBoat = function () {
    this.scoreTotal += this.pointsPerParachute;
  };

  GameStatus.prototype.hitSea = function () {
    this.remainingLives -= 1;
    return this.remainingLives <= 0;
  };

  GameStatus.prototype.draw = function (canvasEl, x, y) {
    var context = canvasEl.getContext('2d');
    context.font = "20px Arial";
    context.fillText("Lives: " + this.remainingLives, x, y);
    context.fillText("Score: " + this.scoreTotal, x, y + 50);
  };

  return GameStatus;
}();

exports.default = GameStatus;
},{}],"src/GameObject.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var GameObject =
/** @class */
function () {
  function GameObject(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  GameObject.prototype.drawImage = function (canvasEl, imageId) {
    var context = canvasEl.getContext('2d');
    var elementImageEl = document.getElementById(imageId);
    context.drawImage(elementImageEl, this.x, this.y, this.width, this.height);
  };

  GameObject.prototype.intersect = function (other) {
    return other.x + other.width > this.x && other.x < this.x + this.width && other.y + other.height > this.y && other.y < this.y + this.height;
  };

  return GameObject;
}();

exports.default = GameObject;
},{}],"src/Objects/Sky.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var GameObject_1 = __importDefault(require("/src/GameObject"));

var Sky =
/** @class */
function (_super) {
  __extends(Sky, _super);

  function Sky(x, y, width, height) {
    return _super.call(this, x, y, width, height) || this;
  }

  Sky.prototype.draw = function (canvasEl) {
    _super.prototype.drawImage.call(this, canvasEl, "sky-image");
  };

  return Sky;
}(GameObject_1.default);

exports.default = Sky;
},{"/src/GameObject":"src/GameObject.ts"}],"src/Objects/Sea.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var GameObject_1 = __importDefault(require("/src/GameObject"));

var Sea =
/** @class */
function (_super) {
  __extends(Sea, _super);

  function Sea(x, y, width, height) {
    return _super.call(this, x, y, width, height) || this;
  }

  Sea.prototype.draw = function (canvasEl) {
    _super.prototype.drawImage.call(this, canvasEl, "sea-image");
  };

  return Sea;
}(GameObject_1.default);

exports.default = Sea;
},{"/src/GameObject":"src/GameObject.ts"}],"src/Objects/Boat.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var GameObject_1 = __importDefault(require("/src/GameObject"));

var Sea =
/** @class */
function (_super) {
  __extends(Sea, _super);

  function Sea(x, y, width, height) {
    return _super.call(this, x, y, width, height) || this;
  }

  Sea.prototype.draw = function (canvasEl) {
    this.drawImage(canvasEl, "boat-image");
  };

  Sea.prototype.move = function (boatMovement, gameWidth) {
    if (boatMovement == 0) {
      return;
    }

    this.x = this.x + boatMovement;

    if (this.x > gameWidth - this.width) {
      this.x = gameWidth - this.width;
    }

    if (this.x < 0) {
      this.x = 0;
    }
  };

  return Sea;
}(GameObject_1.default);

exports.default = Sea;
},{"/src/GameObject":"src/GameObject.ts"}],"src/Objects/Parachute.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var GameObject_1 = __importDefault(require("/src/GameObject"));

var Parachute =
/** @class */
function (_super) {
  __extends(Parachute, _super);

  function Parachute(x, y, width, height) {
    return _super.call(this, x, y, width, height) || this;
  }

  Parachute.prototype.draw = function (canvasEl) {
    _super.prototype.drawImage.call(this, canvasEl, "parachute-image");
  };

  Parachute.prototype.move = function (parachuteSpeed) {
    this.y = this.y + parachuteSpeed;
  };

  return Parachute;
}(GameObject_1.default);

exports.default = Parachute;
},{"/src/GameObject":"src/GameObject.ts"}],"src/Objects/Plane.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var GameObject_1 = __importDefault(require("/src/GameObject"));

var Parachute_1 = __importDefault(require("/src/Objects/Parachute"));

var Plane =
/** @class */
function (_super) {
  __extends(Plane, _super);

  function Plane(x, y, width, height) {
    var _this = _super.call(this, x, y, width, height) || this;

    _this.initialPlaneX = x;
    return _this;
  }

  Plane.prototype.draw = function (canvasEl) {
    _super.prototype.drawImage.call(this, canvasEl, "plane-image");
  };

  Plane.prototype.move = function (planeSpeed, gameWidth) {
    this.x = this.x - planeSpeed;

    if (this.x < 0 - this.width) {
      this.x = this.initialPlaneX + this.width;
    }
  };

  Plane.prototype.isPlaneFullyInBoard = function (gameWidth) {
    return this.x > this.width / 2 && this.x < gameWidth - this.width / 2;
  };

  Plane.prototype.dropParachute = function (parachuteWidth, parachuteHeight) {
    return new Parachute_1.default(this.x + this.width / 2 - parachuteWidth / 2, this.y + this.height, parachuteWidth, parachuteHeight);
  };

  return Plane;
}(GameObject_1.default);

exports.default = Plane;
},{"/src/GameObject":"src/GameObject.ts","/src/Objects/Parachute":"src/Objects/Parachute.ts"}],"src/Game.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var InputState_1 = __importDefault(require("/src/InputState"));

var GameStatus_1 = __importDefault(require("/src/GameStatus"));

var Sky_1 = __importDefault(require("/src/Objects/Sky"));

var Sea_1 = __importDefault(require("/src/Objects/Sea"));

var Boat_1 = __importDefault(require("/src/Objects/Boat"));

var Plane_1 = __importDefault(require("/src/Objects/Plane"));

var Game =
/** @class */
function () {
  function Game(config, canvasEl) {
    this.config = config;
    this.canvasEl = canvasEl;
    this.input = new InputState_1.default(config.boatSpeed);
    this.canvasEl.width = config.gameWidth;
    this.canvasEl.height = config.gameHeight;
    this.status = new GameStatus_1.default(config.maxLives, config.pointsPerParachute);
    this.sky = new Sky_1.default(0, 0, config.gameWidth, config.gameHeight - config.seaHeight);
    this.sea = new Sea_1.default(0, config.gameHeight - config.seaHeight - config.wavesHeight, config.gameWidth, config.seaHeight + config.wavesHeight);
    this.boat = new Boat_1.default(config.gameWidth / 2 - config.boatWidth / 2, config.gameHeight - config.seaHeight - config.boatHeight, config.boatWidth, config.boatHeight);
    this.plane = new Plane_1.default(config.gameWidth - config.planeWidth, config.planeGap, config.planeWidth, config.planeHeight);
    this.parachutes = [];
    this.scheduleNextParachuteDrop();
  }

  Game.prototype.restart = function () {
    var newGame = new Game(this.config, this.canvasEl);
    newGame.start();
  };

  Game.prototype.start = function () {
    this.gameInterval = setInterval(this.refreshGame.bind(this), this.config.gameRefreshRate);
  };

  Game.prototype.refreshGame = function () {
    var owner = this;

    if (this.shouldDropParachute()) {
      this.dropParachute();
      this.scheduleNextParachuteDrop();
    }

    this.boat.move(this.input.boatMovement, this.config.gameWidth);
    this.plane.move(this.config.planeSpeed, this.config.gameWidth);
    this.parachutes.forEach(function (parachute) {
      parachute.move(owner.config.parachuteSpeed);
    });
    this.calculateParachutesHits();
    this.sky.draw(this.canvasEl);
    this.sea.draw(this.canvasEl);
    this.boat.draw(this.canvasEl);
    this.plane.draw(this.canvasEl);
    this.parachutes.forEach(function (parachute) {
      parachute.draw(owner.canvasEl);
    });
    this.status.draw(this.canvasEl, 50, 50);
  };

  Game.prototype.scheduleNextParachuteDrop = function () {
    var parachuteDropRangeMillis = this.config.parachuteDropMaxMillis - this.config.parachuteDropMinMillis;
    var relativeNextParachuteMillis = this.config.parachuteDropMinMillis + Math.floor(Math.random() * Math.floor(parachuteDropRangeMillis));
    var nowMillis = new Date().getTime();
    this.nextParachuteMillis = nowMillis + relativeNextParachuteMillis;
  };

  Game.prototype.shouldDropParachute = function () {
    if (!this.plane.isPlaneFullyInBoard(this.config.gameWidth)) {
      this.scheduleNextParachuteDrop();
      return false;
    }

    var nowMillis = new Date().getTime();
    return this.nextParachuteMillis <= nowMillis;
  };

  Game.prototype.dropParachute = function () {
    var parachute = this.plane.dropParachute(this.config.parachuteWidth, this.config.parachuteHeight);
    this.parachutes.push(parachute);
  };

  Game.prototype.calculateParachutesHits = function () {
    var index = 0;

    while (index < this.parachutes.length) {
      var parachute = this.parachutes[index];

      if (this.boat.intersect(parachute)) {
        this.status.hitBoat();
        this.parachutes.splice(index, 1);
        continue;
      }

      if (this.sea.intersect(parachute)) {
        if (this.status.hitSea()) {
          clearInterval(this.gameInterval);
          alert("Game Over!");
          this.restart();
        }

        this.parachutes.splice(index, 1);
        continue;
      }

      index++;
    }
  };

  return Game;
}();

exports.default = Game;
},{"/src/InputState":"src/InputState.ts","/src/GameStatus":"src/GameStatus.ts","/src/Objects/Sky":"src/Objects/Sky.ts","/src/Objects/Sea":"src/Objects/Sea.ts","/src/Objects/Boat":"src/Objects/Boat.ts","/src/Objects/Plane":"src/Objects/Plane.ts"}],"src/GameConfig.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var GameConfig =
/** @class */
function () {
  function GameConfig() {
    this.gameRefreshRate = 50;
    this.boatSpeed = 25;
    this.planeSpeed = 20;
    this.parachuteSpeed = 5;
    this.parachuteDropMinMillis = 500;
    this.parachuteDropMaxMillis = 1000;
    this.maxLives = 3;
    this.pointsPerParachute = 10;
    this.gameWidth = 800;
    this.gameHeight = 800;
    this.seaHeight = 30;
    this.wavesHeight = 20;
    this.boatWidth = 244;
    this.boatHeight = 153;
    this.planeHeight = 113;
    this.planeWidth = 145;
    this.planeGap = 15;
    this.parachuteWidth = 77;
    this.parachuteHeight = 113;
  }

  return GameConfig;
}();

exports.default = GameConfig;
},{}],"index.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Game_1 = __importDefault(require("/src/Game"));

var GameConfig_1 = __importDefault(require("/src/GameConfig"));

var canvasEl = document.getElementById("game");
var gameConfig = new GameConfig_1.default();
var game = new Game_1.default(gameConfig, canvasEl);
game.start();
},{"/src/Game":"src/Game.ts","/src/GameConfig":"src/GameConfig.ts"}],"../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54128" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/test.77de5100.js.map