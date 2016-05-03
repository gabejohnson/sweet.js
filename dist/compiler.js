"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _immutable = require("immutable");

var _termExpander = require("./term-expander.js");

var _termExpander2 = _interopRequireDefault(_termExpander);

var _tokenExpander = require("./token-expander");

var _tokenExpander2 = _interopRequireDefault(_tokenExpander);

var _scope = require("./scope");

var _ramda = require("ramda");

var _ = _interopRequireWildcard(_ramda);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Compiler = function () {
  function Compiler(phase_29, env_30, store_31, context_32) {
    _classCallCheck(this, Compiler);

    this.phase = phase_29;
    this.env = env_30;
    this.store = store_31;
    this.context = context_32;
  }

  _createClass(Compiler, [{
    key: "compile",
    value: function compile(stxl_33) {
      var tokenExpander_34 = new _tokenExpander2.default(_.merge(this.context, { phase: this.phase, env: this.env, store: this.store }));
      var termExpander_35 = new _termExpander2.default(_.merge(this.context, { phase: this.phase, env: this.env, store: this.store }));
      return _.pipe(_.bind(tokenExpander_34.expand, tokenExpander_34), _.map(function (t_36) {
        return termExpander_35.expand(t_36);
      }))(stxl_33);
    }
  }]);

  return Compiler;
}();

exports.default = Compiler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3N3ZWV0L2NvbXBpbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztJQUFhLEM7Ozs7Ozs7O0lBQ1EsUTtBQUNuQixvQkFBWSxRQUFaLEVBQXNCLE1BQXRCLEVBQThCLFFBQTlCLEVBQXdDLFVBQXhDLEVBQW9EO0FBQUE7O0FBQ2xELFNBQUssS0FBTCxHQUFhLFFBQWI7QUFDQSxTQUFLLEdBQUwsR0FBVyxNQUFYO0FBQ0EsU0FBSyxLQUFMLEdBQWEsUUFBYjtBQUNBLFNBQUssT0FBTCxHQUFlLFVBQWY7QUFDRDs7Ozs0QkFDTyxPLEVBQVM7QUFDZixVQUFJLG1CQUFtQiw0QkFBa0IsRUFBRSxLQUFGLENBQVEsS0FBSyxPQUFiLEVBQXNCLEVBQUMsT0FBTyxLQUFLLEtBQWIsRUFBb0IsS0FBSyxLQUFLLEdBQTlCLEVBQW1DLE9BQU8sS0FBSyxLQUEvQyxFQUF0QixDQUFsQixDQUF2QjtBQUNBLFVBQUksa0JBQWtCLDJCQUFpQixFQUFFLEtBQUYsQ0FBUSxLQUFLLE9BQWIsRUFBc0IsRUFBQyxPQUFPLEtBQUssS0FBYixFQUFvQixLQUFLLEtBQUssR0FBOUIsRUFBbUMsT0FBTyxLQUFLLEtBQS9DLEVBQXRCLENBQWpCLENBQXRCO0FBQ0EsYUFBTyxFQUFFLElBQUYsQ0FBTyxFQUFFLElBQUYsQ0FBTyxpQkFBaUIsTUFBeEIsRUFBZ0MsZ0JBQWhDLENBQVAsRUFBMEQsRUFBRSxHQUFGLENBQU07QUFBQSxlQUFRLGdCQUFnQixNQUFoQixDQUF1QixJQUF2QixDQUFSO0FBQUEsT0FBTixDQUExRCxFQUF1RyxPQUF2RyxDQUFQO0FBQ0Q7Ozs7OztrQkFYa0IsUSIsImZpbGUiOiJjb21waWxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TGlzdH0gZnJvbSBcImltbXV0YWJsZVwiO1xuaW1wb3J0IFRlcm1FeHBhbmRlciBmcm9tIFwiLi90ZXJtLWV4cGFuZGVyLmpzXCI7XG5pbXBvcnQgVG9rZW5FeHBhbmRlciBmcm9tIFwiLi90b2tlbi1leHBhbmRlclwiO1xuaW1wb3J0IHtTY29wZSwgZnJlc2hTY29wZX0gZnJvbSBcIi4vc2NvcGVcIjtcbmltcG9ydCAgKiBhcyBfIGZyb20gXCJyYW1kYVwiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcGlsZXIge1xuICBjb25zdHJ1Y3RvcihwaGFzZV8yOSwgZW52XzMwLCBzdG9yZV8zMSwgY29udGV4dF8zMikge1xuICAgIHRoaXMucGhhc2UgPSBwaGFzZV8yOTtcbiAgICB0aGlzLmVudiA9IGVudl8zMDtcbiAgICB0aGlzLnN0b3JlID0gc3RvcmVfMzE7XG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dF8zMjtcbiAgfVxuICBjb21waWxlKHN0eGxfMzMpIHtcbiAgICBsZXQgdG9rZW5FeHBhbmRlcl8zNCA9IG5ldyBUb2tlbkV4cGFuZGVyKF8ubWVyZ2UodGhpcy5jb250ZXh0LCB7cGhhc2U6IHRoaXMucGhhc2UsIGVudjogdGhpcy5lbnYsIHN0b3JlOiB0aGlzLnN0b3JlfSkpO1xuICAgIGxldCB0ZXJtRXhwYW5kZXJfMzUgPSBuZXcgVGVybUV4cGFuZGVyKF8ubWVyZ2UodGhpcy5jb250ZXh0LCB7cGhhc2U6IHRoaXMucGhhc2UsIGVudjogdGhpcy5lbnYsIHN0b3JlOiB0aGlzLnN0b3JlfSkpO1xuICAgIHJldHVybiBfLnBpcGUoXy5iaW5kKHRva2VuRXhwYW5kZXJfMzQuZXhwYW5kLCB0b2tlbkV4cGFuZGVyXzM0KSwgXy5tYXAodF8zNiA9PiB0ZXJtRXhwYW5kZXJfMzUuZXhwYW5kKHRfMzYpKSkoc3R4bF8zMyk7XG4gIH1cbn1cbiJdfQ==