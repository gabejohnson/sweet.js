"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _terms = require("./terms");

var _terms2 = _interopRequireDefault(_terms);

var _shiftReducer = require("shift-reducer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MapSyntaxReducer = function (_CloneReducer) {
  _inherits(MapSyntaxReducer, _CloneReducer);

  function MapSyntaxReducer(fn_386) {
    _classCallCheck(this, MapSyntaxReducer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MapSyntaxReducer).call(this));

    _this.fn = fn_386;
    return _this;
  }

  _createClass(MapSyntaxReducer, [{
    key: "reduceBindingIdentifier",
    value: function reduceBindingIdentifier(node_387, state_388) {
      var name_389 = this.fn(node_387.name);
      return new _terms2.default("BindingIdentifier", { name: name_389 });
    }
  }, {
    key: "reduceIdentifierExpression",
    value: function reduceIdentifierExpression(node_390, state_391) {
      var name_392 = this.fn(node_390.name);
      return new _terms2.default("IdentifierExpression", { name: name_392 });
    }
  }]);

  return MapSyntaxReducer;
}(_shiftReducer.CloneReducer);

exports.default = MapSyntaxReducer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3N3ZWV0L21hcC1zeW50YXgtcmVkdWNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7Ozs7Ozs7SUFDcUIsZ0I7OztBQUNuQiw0QkFBWSxNQUFaLEVBQW9CO0FBQUE7O0FBQUE7O0FBRWxCLFVBQUssRUFBTCxHQUFVLE1BQVY7QUFGa0I7QUFHbkI7Ozs7NENBQ3VCLFEsRUFBVSxTLEVBQVc7QUFDM0MsVUFBSSxXQUFXLEtBQUssRUFBTCxDQUFRLFNBQVMsSUFBakIsQ0FBZjtBQUNBLGFBQU8sb0JBQVMsbUJBQVQsRUFBOEIsRUFBQyxNQUFNLFFBQVAsRUFBOUIsQ0FBUDtBQUNEOzs7K0NBQzBCLFEsRUFBVSxTLEVBQVc7QUFDOUMsVUFBSSxXQUFXLEtBQUssRUFBTCxDQUFRLFNBQVMsSUFBakIsQ0FBZjtBQUNBLGFBQU8sb0JBQVMsc0JBQVQsRUFBaUMsRUFBQyxNQUFNLFFBQVAsRUFBakMsQ0FBUDtBQUNEOzs7Ozs7a0JBWmtCLGdCIiwiZmlsZSI6Im1hcC1zeW50YXgtcmVkdWNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZXJtIGZyb20gXCIuL3Rlcm1zXCI7XG5pbXBvcnQge0Nsb25lUmVkdWNlcn0gZnJvbSBcInNoaWZ0LXJlZHVjZXJcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcFN5bnRheFJlZHVjZXIgZXh0ZW5kcyBDbG9uZVJlZHVjZXIge1xuICBjb25zdHJ1Y3Rvcihmbl8zODYpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZm4gPSBmbl8zODY7XG4gIH1cbiAgcmVkdWNlQmluZGluZ0lkZW50aWZpZXIobm9kZV8zODcsIHN0YXRlXzM4OCkge1xuICAgIGxldCBuYW1lXzM4OSA9IHRoaXMuZm4obm9kZV8zODcubmFtZSk7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQmluZGluZ0lkZW50aWZpZXJcIiwge25hbWU6IG5hbWVfMzg5fSk7XG4gIH1cbiAgcmVkdWNlSWRlbnRpZmllckV4cHJlc3Npb24obm9kZV8zOTAsIHN0YXRlXzM5MSkge1xuICAgIGxldCBuYW1lXzM5MiA9IHRoaXMuZm4obm9kZV8zOTAubmFtZSk7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiSWRlbnRpZmllckV4cHJlc3Npb25cIiwge25hbWU6IG5hbWVfMzkyfSk7XG4gIH1cbn1cbiJdfQ==