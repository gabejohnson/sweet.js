"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mixin = mixin;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function mixin(target_1007, source_1008) {
  var F_1009 = function (_target_) {
    _inherits(F_1009, _target_);

    function F_1009() {
      _classCallCheck(this, F_1009);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(F_1009).apply(this, arguments));
    }

    return F_1009;
  }(target_1007);

  Object.getOwnPropertyNames(source_1008.prototype).forEach(function (name_1010) {
    if (name_1010 !== "constructor") {
      var newProp = Object.getOwnPropertyDescriptor(source_1008.prototype, name_1010);
      Object.defineProperty(F_1009.prototype, name_1010, newProp);
    }
  });
  return F_1009;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3N3ZWV0L3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBQWdCLEssR0FBQSxLOzs7Ozs7OztBQUFULFNBQVMsS0FBVCxDQUFlLFdBQWYsRUFBNEIsV0FBNUIsRUFBeUM7QUFBQSxNQUN4QyxNQUR3QztBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBLElBQ3pCLFdBRHlCOztBQUU5QyxTQUFPLG1CQUFQLENBQTJCLFlBQVksU0FBdkMsRUFBa0QsT0FBbEQsQ0FBMEQscUJBQWE7QUFDckUsUUFBSSxjQUFjLGFBQWxCLEVBQWlDO0FBQy9CLFVBQUksVUFBVSxPQUFPLHdCQUFQLENBQWdDLFlBQVksU0FBNUMsRUFBdUQsU0FBdkQsQ0FBZDtBQUNBLGFBQU8sY0FBUCxDQUFzQixPQUFPLFNBQTdCLEVBQXdDLFNBQXhDLEVBQW1ELE9BQW5EO0FBQ0Q7QUFDRixHQUxEO0FBTUEsU0FBTyxNQUFQO0FBQ0QiLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gbWl4aW4odGFyZ2V0XzEwMDcsIHNvdXJjZV8xMDA4KSB7XG4gIGNsYXNzIEZfMTAwOSBleHRlbmRzIHRhcmdldF8xMDA3IHt9XG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZV8xMDA4LnByb3RvdHlwZSkuZm9yRWFjaChuYW1lXzEwMTAgPT4ge1xuICAgIGlmIChuYW1lXzEwMTAgIT09IFwiY29uc3RydWN0b3JcIikge1xuICAgICAgbGV0IG5ld1Byb3AgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZV8xMDA4LnByb3RvdHlwZSwgbmFtZV8xMDEwKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGXzEwMDkucHJvdG90eXBlLCBuYW1lXzEwMTAsIG5ld1Byb3ApO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBGXzEwMDk7XG59XG4iXX0=