"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vm = require("vm");

var _vm2 = _interopRequireDefault(_vm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = function () {
  function Store() {
    _classCallCheck(this, Store);

    this.map = new Map();
    this.nodeContext = _vm2.default.createContext();
  }

  _createClass(Store, [{
    key: "has",
    value: function has(key_657) {
      return this.map.has(key_657);
    }
  }, {
    key: "get",
    value: function get(key_658) {
      return this.map.get(key_658);
    }
  }, {
    key: "set",
    value: function set(key_659, val_660) {
      this.nodeContext[key_659] = val_660;
      return this.map.set(key_659, val_660);
    }
  }, {
    key: "getNodeContext",
    value: function getNodeContext() {
      return this.nodeContext;
    }
  }]);

  return Store;
}();

exports.default = Store;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3N3ZWV0L3N0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7O0lBQ3FCLEs7QUFDbkIsbUJBQWM7QUFBQTs7QUFDWixTQUFLLEdBQUwsR0FBVyxJQUFJLEdBQUosRUFBWDtBQUNBLFNBQUssV0FBTCxHQUFtQixhQUFHLGFBQUgsRUFBbkI7QUFDRDs7Ozt3QkFDRyxPLEVBQVM7QUFDWCxhQUFPLEtBQUssR0FBTCxDQUFTLEdBQVQsQ0FBYSxPQUFiLENBQVA7QUFDRDs7O3dCQUNHLE8sRUFBUztBQUNYLGFBQU8sS0FBSyxHQUFMLENBQVMsR0FBVCxDQUFhLE9BQWIsQ0FBUDtBQUNEOzs7d0JBQ0csTyxFQUFTLE8sRUFBUztBQUNwQixXQUFLLFdBQUwsQ0FBaUIsT0FBakIsSUFBNEIsT0FBNUI7QUFDQSxhQUFPLEtBQUssR0FBTCxDQUFTLEdBQVQsQ0FBYSxPQUFiLEVBQXNCLE9BQXRCLENBQVA7QUFDRDs7O3FDQUNnQjtBQUNmLGFBQU8sS0FBSyxXQUFaO0FBQ0Q7Ozs7OztrQkFqQmtCLEsiLCJmaWxlIjoic3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdm0gZnJvbSBcInZtXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdG9yZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubWFwID0gbmV3IE1hcDtcbiAgICB0aGlzLm5vZGVDb250ZXh0ID0gdm0uY3JlYXRlQ29udGV4dCgpO1xuICB9XG4gIGhhcyhrZXlfNjU3KSB7XG4gICAgcmV0dXJuIHRoaXMubWFwLmhhcyhrZXlfNjU3KTtcbiAgfVxuICBnZXQoa2V5XzY1OCkge1xuICAgIHJldHVybiB0aGlzLm1hcC5nZXQoa2V5XzY1OCk7XG4gIH1cbiAgc2V0KGtleV82NTksIHZhbF82NjApIHtcbiAgICB0aGlzLm5vZGVDb250ZXh0W2tleV82NTldID0gdmFsXzY2MDtcbiAgICByZXR1cm4gdGhpcy5tYXAuc2V0KGtleV82NTksIHZhbF82NjApO1xuICB9XG4gIGdldE5vZGVDb250ZXh0KCkge1xuICAgIHJldHVybiB0aGlzLm5vZGVDb250ZXh0O1xuICB9XG59XG4iXX0=