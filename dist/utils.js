"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mixin = mixin;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function mixin(target_1008, source_1009) {
  var F_1010 = function (_target_) {
    _inherits(F_1010, _target_);

    function F_1010() {
      _classCallCheck(this, F_1010);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(F_1010).apply(this, arguments));
    }

    return F_1010;
  }(target_1008);

  Object.getOwnPropertyNames(source_1009.prototype).forEach(function (name_1011) {
    if (name_1011 !== "constructor") {
      var newProp = Object.getOwnPropertyDescriptor(source_1009.prototype, name_1011);
      Object.defineProperty(F_1010.prototype, name_1011, newProp);
    }
  });
  return F_1010;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3N3ZWV0L3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBQWdCLEssR0FBQSxLOzs7Ozs7OztBQUFULFNBQVMsS0FBVCxDQUFlLFdBQWYsRUFBNEIsV0FBNUIsRUFBeUM7QUFBQSxNQUN4QyxNQUR3QztBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBLElBQ3pCLFdBRHlCOztBQUU5QyxTQUFPLG1CQUFQLENBQTJCLFlBQVksU0FBdkMsRUFBa0QsT0FBbEQsQ0FBMEQscUJBQWE7QUFDckUsUUFBSSxjQUFjLGFBQWxCLEVBQWlDO0FBQy9CLFVBQUksVUFBVSxPQUFPLHdCQUFQLENBQWdDLFlBQVksU0FBNUMsRUFBdUQsU0FBdkQsQ0FBZDtBQUNBLGFBQU8sY0FBUCxDQUFzQixPQUFPLFNBQTdCLEVBQXdDLFNBQXhDLEVBQW1ELE9BQW5EO0FBQ0Q7QUFDRixHQUxEO0FBTUEsU0FBTyxNQUFQO0FBQ0QiLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gbWl4aW4odGFyZ2V0XzEwMDgsIHNvdXJjZV8xMDA5KSB7XG4gIGNsYXNzIEZfMTAxMCBleHRlbmRzIHRhcmdldF8xMDA4IHt9XG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZV8xMDA5LnByb3RvdHlwZSkuZm9yRWFjaChuYW1lXzEwMTEgPT4ge1xuICAgIGlmIChuYW1lXzEwMTEgIT09IFwiY29uc3RydWN0b3JcIikge1xuICAgICAgbGV0IG5ld1Byb3AgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZV8xMDA5LnByb3RvdHlwZSwgbmFtZV8xMDExKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGXzEwMTAucHJvdG90eXBlLCBuYW1lXzEwMTEsIG5ld1Byb3ApO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBGXzEwMTA7XG59XG4iXX0=