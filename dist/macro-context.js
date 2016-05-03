"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SyntaxOrTermWrapper = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.unwrap = unwrap;

var _mapSyntaxReducer = require("./map-syntax-reducer");

var _mapSyntaxReducer2 = _interopRequireDefault(_mapSyntaxReducer);

var _shiftReducer = require("shift-reducer");

var _shiftReducer2 = _interopRequireDefault(_shiftReducer);

var _immutable = require("immutable");

var _enforester = require("./enforester");

var _syntax = require("./syntax");

var _syntax2 = _interopRequireDefault(_syntax);

var _ramda = require("ramda");

var _ = _interopRequireWildcard(_ramda);

var _ramdaFantasy = require("ramda-fantasy");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Just_341 = _ramdaFantasy.Maybe.Just;
var Nothing_342 = _ramdaFantasy.Maybe.Nothing;
var symWrap_343 = Symbol("wrapper");
var isKind_344 = _.curry(function (kind_358, t_359, v_360) {
  if (t_359 instanceof _syntax2.default) {
    return t_359[kind_358]() && (v_360 == null || t_359.val() == v_360);
  }
});
var isKeyword_345 = isKind_344("isKeyword");
var isIdentifier_346 = isKind_344("isIdentifier");
var isNumericLiteral_347 = isKind_344("isNumericLiteral");
var isStringLiteral_348 = isKind_344("isStringLiteral");
var isNullLiteral_349 = isKind_344("isNullLiteral");
var isPunctuator_350 = isKind_344("isPunctuator");
var isRegularExpression_351 = isKind_344("isRegularExpression");
var isBraces_352 = isKind_344("isBraces");
var isBrackets_353 = isKind_344("isBrackets");
var isParens_354 = isKind_344("isParens");
var isDelimiter_355 = isKind_344("isDelimiter");
var getLineNumber_356 = function getLineNumber_356(t_361) {
  if (t_361 instanceof _syntax2.default) {
    return t_361.lineNumber();
  }
  throw new Error("Line numbers on terms not implemented yet");
};
var getVal_357 = function getVal_357(t_362) {
  if (isDelimiter_355(t_362, null)) {
    return null;
  }
  if (t_362 instanceof _syntax2.default) {
    return t_362.val();
  }
  return null;
};

var SyntaxOrTermWrapper = exports.SyntaxOrTermWrapper = function () {
  function SyntaxOrTermWrapper(s_363) {
    var context_364 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, SyntaxOrTermWrapper);

    this[symWrap_343] = s_363;
    this.context = context_364;
  }

  _createClass(SyntaxOrTermWrapper, [{
    key: "isKeyword",
    value: function isKeyword(value_365) {
      return isKeyword_345(this[symWrap_343], value_365);
    }
  }, {
    key: "isIdentifier",
    value: function isIdentifier(value_366) {
      return isIdentifier_346(this[symWrap_343], value_366);
    }
  }, {
    key: "isNumericLiteral",
    value: function isNumericLiteral(value_367) {
      return isNumericLiteral_347(this[symWrap_343], value_367);
    }
  }, {
    key: "isStringLiteral",
    value: function isStringLiteral(value_368) {
      return isStringLiteral_348(this[symWrap_343], value_368);
    }
  }, {
    key: "isNullLiteral",
    value: function isNullLiteral(value_369) {
      return isNullLiteral_349(this[symWrap_343], value_369);
    }
  }, {
    key: "isPunctuator",
    value: function isPunctuator(value_370) {
      return isPunctuator_350(this[symWrap_343], value_370);
    }
  }, {
    key: "isRegularExpression",
    value: function isRegularExpression(value_371) {
      return isRegularExpression_351(this[symWrap_343], value_371);
    }
  }, {
    key: "isBraces",
    value: function isBraces(value_372) {
      return isBraces_352(this[symWrap_343], value_372);
    }
  }, {
    key: "isBrackets",
    value: function isBrackets(value_373) {
      return isBrackets_353(this[symWrap_343], value_373);
    }
  }, {
    key: "isParens",
    value: function isParens(value_374) {
      return isParens_354(this[symWrap_343], value_374);
    }
  }, {
    key: "isDelimiter",
    value: function isDelimiter(value_375) {
      return isDelimiter_355(this[symWrap_343], value_375);
    }
  }, {
    key: "lineNumber",
    value: function lineNumber() {
      return getLineNumber_356(this[symWrap_343]);
    }
  }, {
    key: "val",
    value: function val() {
      return getVal_357(this[symWrap_343]);
    }
  }, {
    key: "inner",
    value: function inner() {
      var stx_376 = this[symWrap_343];
      if (!isDelimiter_355(stx_376, null)) {
        throw new Error("Can only get inner syntax on a delimiter");
      }
      var enf_377 = new _enforester.Enforester(stx_376.inner(), (0, _immutable.List)(), this.context);
      return new MacroContext(enf_377, "inner", this.context);
    }
  }]);

  return SyntaxOrTermWrapper;
}();

function unwrap(x_378) {
  if (x_378 instanceof SyntaxOrTermWrapper) {
    return x_378[symWrap_343];
  }
  return x_378;
}

var MacroContext = function () {
  function MacroContext(enf_379, name_380, context_381, useScope_382, introducedScope_383) {
    var _this = this;

    _classCallCheck(this, MacroContext);

    this._enf = enf_379;
    this.name = name_380;
    this.context = context_381;
    if (useScope_382 && introducedScope_383) {
      this.noScopes = false;
      this.useScope = useScope_382;
      this.introducedScope = introducedScope_383;
    } else {
      this.noScopes = true;
    }
    this[Symbol.iterator] = function () {
      return _this;
    };
  }

  _createClass(MacroContext, [{
    key: "next",
    value: function next() {
      var type_384 = arguments.length <= 0 || arguments[0] === undefined ? "Syntax" : arguments[0];

      if (this._enf.rest.size === 0) {
        return { done: true, value: null };
      }
      var value_385 = void 0;
      switch (type_384) {
        case "AssignmentExpression":
        case "expr":
          value_385 = this._enf.enforestExpressionLoop();
          break;
        case "Expression":
          value_385 = this._enf.enforestExpression();
          break;
        case "Syntax":
          value_385 = this._enf.advance();
          if (!this.noScopes) {
            value_385 = value_385.addScope(this.useScope, this.context.bindings, _syntax.ALL_PHASES).addScope(this.introducedScope, this.context.bindings, _syntax.ALL_PHASES, { flip: true });
          }
          break;
        default:
          throw new Error("Unknown term type: " + type_384);
      }
      return { done: false, value: new SyntaxOrTermWrapper(value_385, this.context) };
    }
  }]);

  return MacroContext;
}();

exports.default = MacroContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3N3ZWV0L21hY3JvLWNvbnRleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O1FBOEZnQixNLEdBQUEsTTs7QUE5RmhCOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOztJQUFhLEM7O0FBQ2I7Ozs7Ozs7O0FBQ0EsSUFBTSxXQUFXLG9CQUFNLElBQXZCO0FBQ0EsSUFBTSxjQUFjLG9CQUFNLE9BQTFCO0FBQ0EsSUFBTSxjQUFjLE9BQU8sU0FBUCxDQUFwQjtBQUNBLElBQU0sYUFBYSxFQUFFLEtBQUYsQ0FBUSxVQUFDLFFBQUQsRUFBVyxLQUFYLEVBQWtCLEtBQWxCLEVBQTRCO0FBQ3JELE1BQUksaUNBQUosRUFBNkI7QUFDM0IsV0FBTyxNQUFNLFFBQU4sUUFBc0IsU0FBUyxJQUFULElBQWlCLE1BQU0sR0FBTixNQUFlLEtBQXRELENBQVA7QUFDRDtBQUNGLENBSmtCLENBQW5CO0FBS0EsSUFBTSxnQkFBZ0IsV0FBVyxXQUFYLENBQXRCO0FBQ0EsSUFBTSxtQkFBbUIsV0FBVyxjQUFYLENBQXpCO0FBQ0EsSUFBTSx1QkFBdUIsV0FBVyxrQkFBWCxDQUE3QjtBQUNBLElBQU0sc0JBQXNCLFdBQVcsaUJBQVgsQ0FBNUI7QUFDQSxJQUFNLG9CQUFvQixXQUFXLGVBQVgsQ0FBMUI7QUFDQSxJQUFNLG1CQUFtQixXQUFXLGNBQVgsQ0FBekI7QUFDQSxJQUFNLDBCQUEwQixXQUFXLHFCQUFYLENBQWhDO0FBQ0EsSUFBTSxlQUFlLFdBQVcsVUFBWCxDQUFyQjtBQUNBLElBQU0saUJBQWlCLFdBQVcsWUFBWCxDQUF2QjtBQUNBLElBQU0sZUFBZSxXQUFXLFVBQVgsQ0FBckI7QUFDQSxJQUFNLGtCQUFrQixXQUFXLGFBQVgsQ0FBeEI7QUFDQSxJQUFNLG9CQUFvQixTQUFwQixpQkFBb0IsUUFBUztBQUNqQyxNQUFJLGlDQUFKLEVBQTZCO0FBQzNCLFdBQU8sTUFBTSxVQUFOLEVBQVA7QUFDRDtBQUNELFFBQU0sSUFBSSxL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ZmlsZSI6Im1hY3JvLWNvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTWFwU3ludGF4UmVkdWNlciBmcm9tIFwiLi9tYXAtc3ludGF4LXJlZHVjZXJcIjtcbmltcG9ydCByZWR1Y2VyIGZyb20gXCJzaGlmdC1yZWR1Y2VyXCI7XG5pbXBvcnQge0xpc3R9IGZyb20gXCJpbW11dGFibGVcIjtcbmltcG9ydCB7RW5mb3Jlc3Rlcn0gZnJvbSBcIi4vZW5mb3Jlc3RlclwiO1xuaW1wb3J0IFN5bnRheCwge0FMTF9QSEFTRVN9IGZyb20gXCIuL3N5bnRheFwiO1xuaW1wb3J0ICAqIGFzIF8gZnJvbSBcInJhbWRhXCI7XG5pbXBvcnQge01heWJlfSBmcm9tIFwicmFtZGEtZmFudGFzeVwiO1xuY29uc3QgSnVzdF8zNDEgPSBNYXliZS5KdXN0O1xuY29uc3QgTm90aGluZ18zNDIgPSBNYXliZS5Ob3RoaW5nO1xuY29uc3Qgc3ltV3JhcF8zNDMgPSBTeW1ib2woXCJ3cmFwcGVyXCIpO1xuY29uc3QgaXNLaW5kXzM0NCA9IF8uY3VycnkoKGtpbmRfMzU4LCB0XzM1OSwgdl8zNjApID0+IHtcbiAgaWYgKHRfMzU5IGluc3RhbmNlb2YgU3ludGF4KSB7XG4gICAgcmV0dXJuIHRfMzU5W2tpbmRfMzU4XSgpICYmICh2XzM2MCA9PSBudWxsIHx8IHRfMzU5LnZhbCgpID09IHZfMzYwKTtcbiAgfVxufSk7XG5jb25zdCBpc0tleXdvcmRfMzQ1ID0gaXNLaW5kXzM0NChcImlzS2V5d29yZFwiKTtcbmNvbnN0IGlzSWRlbnRpZmllcl8zNDYgPSBpc0tpbmRfMzQ0KFwiaXNJZGVudGlmaWVyXCIpO1xuY29uc3QgaXNOdW1lcmljTGl0ZXJhbF8zNDcgPSBpc0tpbmRfMzQ0KFwiaXNOdW1lcmljTGl0ZXJhbFwiKTtcbmNvbnN0IGlzU3RyaW5nTGl0ZXJhbF8zNDggPSBpc0tpbmRfMzQ0KFwiaXNTdHJpbmdMaXRlcmFsXCIpO1xuY29uc3QgaXNOdWxsTGl0ZXJhbF8zNDkgPSBpc0tpbmRfMzQ0KFwiaXNOdWxsTGl0ZXJhbFwiKTtcbmNvbnN0IGlzUHVuY3R1YXRvcl8zNTAgPSBpc0tpbmRfMzQ0KFwiaXNQdW5jdHVhdG9yXCIpO1xuY29uc3QgaXNSZWd1bGFyRXhwcmVzc2lvbl8zNTEgPSBpc0tpbmRfMzQ0KFwiaXNSZWd1bGFyRXhwcmVzc2lvblwiKTtcbmNvbnN0IGlzQnJhY2VzXzM1MiA9IGlzS2luZF8zNDQoXCJpc0JyYWNlc1wiKTtcbmNvbnN0IGlzQnJhY2tldHNfMzUzID0gaXNLaW5kXzM0NChcImlzQnJhY2tldHNcIik7XG5jb25zdCBpc1BhcmVuc18zNTQgPSBpc0tpbmRfMzQ0KFwiaXNQYXJlbnNcIik7XG5jb25zdCBpc0RlbGltaXRlcl8zNTUgPSBpc0tpbmRfMzQ0KFwiaXNEZWxpbWl0ZXJcIik7XG5jb25zdCBnZXRMaW5lTnVtYmVyXzM1NiA9IHRfMzYxID0+IHtcbiAgaWYgKHRfMzYxIGluc3RhbmNlb2YgU3ludGF4KSB7XG4gICAgcmV0dXJuIHRfMzYxLmxpbmVOdW1iZXIoKTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoXCJMaW5lIG51bWJlcnMgb24gdGVybXMgbm90IGltcGxlbWVudGVkIHlldFwiKTtcbn07XG5jb25zdCBnZXRWYWxfMzU3ID0gdF8zNjIgPT4ge1xuICBpZiAoaXNEZWxpbWl0ZXJfMzU1KHRfMzYyLCBudWxsKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGlmICh0XzM2MiBpbnN0YW5jZW9mIFN5bnRheCkge1xuICAgIHJldHVybiB0XzM2Mi52YWwoKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5leHBvcnQgY2xhc3MgU3ludGF4T3JUZXJtV3JhcHBlciB7XG4gIGNvbnN0cnVjdG9yKHNfMzYzLCBjb250ZXh0XzM2NCA9IHt9KSB7XG4gICAgdGhpc1tzeW1XcmFwXzM0M10gPSBzXzM2MztcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0XzM2NDtcbiAgfVxuICBpc0tleXdvcmQodmFsdWVfMzY1KSB7XG4gICAgcmV0dXJuIGlzS2V5d29yZF8zNDUodGhpc1tzeW1XcmFwXzM0M10sIHZhbHVlXzM2NSk7XG4gIH1cbiAgaXNJZGVudGlmaWVyKHZhbHVlXzM2Nikge1xuICAgIHJldHVybiBpc0lkZW50aWZpZXJfMzQ2KHRoaXNbc3ltV3JhcF8zNDNdLCB2YWx1ZV8zNjYpO1xuICB9XG4gIGlzTnVtZXJpY0xpdGVyYWwodmFsdWVfMzY3KSB7XG4gICAgcmV0dXJuIGlzTnVtZXJpY0xpdGVyYWxfMzQ3KHRoaXNbc3ltV3JhcF8zNDNdLCB2YWx1ZV8zNjcpO1xuICB9XG4gIGlzU3RyaW5nTGl0ZXJhbCh2YWx1ZV8zNjgpIHtcbiAgICByZXR1cm4gaXNTdHJpbmdMaXRlcmFsXzM0OCh0aGlzW3N5bVdyYXBfMzQzXSwgdmFsdWVfMzY4KTtcbiAgfVxuICBpc051bGxMaXRlcmFsKHZhbHVlXzM2OSkge1xuICAgIHJldHVybiBpc051bGxMaXRlcmFsXzM0OSh0aGlzW3N5bVdyYXBfMzQzXSwgdmFsdWVfMzY5KTtcbiAgfVxuICBpc1B1bmN0dWF0b3IodmFsdWVfMzcwKSB7XG4gICAgcmV0dXJuIGlzUHVuY3R1YXRvcl8zNTAodGhpc1tzeW1XcmFwXzM0M10sIHZhbHVlXzM3MCk7XG4gIH1cbiAgaXNSZWd1bGFyRXhwcmVzc2lvbih2YWx1ZV8zNzEpIHtcbiAgICByZXR1cm4gaXNSZWd1bGFyRXhwcmVzc2lvbl8zNTEodGhpc1tzeW1XcmFwXzM0M10sIHZhbHVlXzM3MSk7XG4gIH1cbiAgaXNCcmFjZXModmFsdWVfMzcyKSB7XG4gICAgcmV0dXJuIGlzQnJhY2VzXzM1Mih0aGlzW3N5bVdyYXBfMzQzXSwgdmFsdWVfMzcyKTtcbiAgfVxuICBpc0JyYWNrZXRzKHZhbHVlXzM3Mykge1xuICAgIHJldHVybiBpc0JyYWNrZXRzXzM1Myh0aGlzW3N5bVdyYXBfMzQzXSwgdmFsdWVfMzczKTtcbiAgfVxuICBpc1BhcmVucyh2YWx1ZV8zNzQpIHtcbiAgICByZXR1cm4gaXNQYXJlbnNfMzU0KHRoaXNbc3ltV3JhcF8zNDNdLCB2YWx1ZV8zNzQpO1xuICB9XG4gIGlzRGVsaW1pdGVyKHZhbHVlXzM3NSkge1xuICAgIHJldHVybiBpc0RlbGltaXRlcl8zNTUodGhpc1tzeW1XcmFwXzM0M10sIHZhbHVlXzM3NSk7XG4gIH1cbiAgbGluZU51bWJlcigpIHtcbiAgICByZXR1cm4gZ2V0TGluZU51bWJlcl8zNTYodGhpc1tzeW1XcmFwXzM0M10pO1xuICB9XG4gIHZhbCgpIHtcbiAgICByZXR1cm4gZ2V0VmFsXzM1Nyh0aGlzW3N5bVdyYXBfMzQzXSk7XG4gIH1cbiAgaW5uZXIoKSB7XG4gICAgbGV0IHN0eF8zNzYgPSB0aGlzW3N5bVdyYXBfMzQzXTtcbiAgICBpZiAoIWlzRGVsaW1pdGVyXzM1NShzdHhfMzc2LCBudWxsKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuIG9ubHkgZ2V0IGlubmVyIHN5bnRheCBvbiBhIGRlbGltaXRlclwiKTtcbiAgICB9XG4gICAgbGV0IGVuZl8zNzcgPSBuZXcgRW5mb3Jlc3RlcihzdHhfMzc2LmlubmVyKCksIExpc3QoKSwgdGhpcy5jb250ZXh0KTtcbiAgICByZXR1cm4gbmV3IE1hY3JvQ29udGV4dChlbmZfMzc3LCBcImlubmVyXCIsIHRoaXMuY29udGV4dCk7XG4gIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiB1bndyYXAoeF8zNzgpIHtcbiAgaWYgKHhfMzc4IGluc3RhbmNlb2YgU3ludGF4T3JUZXJtV3JhcHBlcikge1xuICAgIHJldHVybiB4XzM3OFtzeW1XcmFwXzM0M107XG4gIH1cbiAgcmV0dXJuIHhfMzc4O1xufVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFjcm9Db250ZXh0IHtcbiAgY29uc3RydWN0b3IoZW5mXzM3OSwgbmFtZV8zODAsIGNvbnRleHRfMzgxLCB1c2VTY29wZV8zODIsIGludHJvZHVjZWRTY29wZV8zODMpIHtcbiAgICB0aGlzLl9lbmYgPSBlbmZfMzc5O1xuICAgIHRoaXMubmFtZSA9IG5hbWVfMzgwO1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHRfMzgxO1xuICAgIGlmICh1c2VTY29wZV8zODIgJiYgaW50cm9kdWNlZFNjb3BlXzM4Mykge1xuICAgICAgdGhpcy5ub1Njb3BlcyA9IGZhbHNlO1xuICAgICAgdGhpcy51c2VTY29wZSA9IHVzZVNjb3BlXzM4MjtcbiAgICAgIHRoaXMuaW50cm9kdWNlZFNjb3BlID0gaW50cm9kdWNlZFNjb3BlXzM4MztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ub1Njb3BlcyA9IHRydWU7XG4gICAgfVxuICAgIHRoaXNbU3ltYm9sLml0ZXJhdG9yXSA9ICgpID0+IHRoaXM7XG4gIH1cbiAgbmV4dCh0eXBlXzM4NCA9IFwiU3ludGF4XCIpIHtcbiAgICBpZiAodGhpcy5fZW5mLnJlc3Quc2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHtkb25lOiB0cnVlLCB2YWx1ZTogbnVsbH07XG4gICAgfVxuICAgIGxldCB2YWx1ZV8zODU7XG4gICAgc3dpdGNoICh0eXBlXzM4NCkge1xuICAgICAgY2FzZSBcIkFzc2lnbm1lbnRFeHByZXNzaW9uXCI6XG4gICAgICBjYXNlIFwiZXhwclwiOlxuICAgICAgICB2YWx1ZV8zODUgPSB0aGlzLl9lbmYuZW5mb3Jlc3RFeHByZXNzaW9uTG9vcCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJFeHByZXNzaW9uXCI6XG4gICAgICAgIHZhbHVlXzM4NSA9IHRoaXMuX2VuZi5lbmZvcmVzdEV4cHJlc3Npb24oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiU3ludGF4XCI6XG4gICAgICAgIHZhbHVlXzM4NSA9IHRoaXMuX2VuZi5hZHZhbmNlKCk7XG4gICAgICAgIGlmICghdGhpcy5ub1Njb3Blcykge1xuICAgICAgICAgIHZhbHVlXzM4NSA9IHZhbHVlXzM4NS5hZGRTY29wZSh0aGlzLnVzZVNjb3BlLCB0aGlzLmNvbnRleHQuYmluZGluZ3MsIEFMTF9QSEFTRVMpLmFkZFNjb3BlKHRoaXMuaW50cm9kdWNlZFNjb3BlLCB0aGlzLmNvbnRleHQuYmluZGluZ3MsIEFMTF9QSEFTRVMsIHtmbGlwOiB0cnVlfSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIHRlcm0gdHlwZTogXCIgKyB0eXBlXzM4NCk7XG4gICAgfVxuICAgIHJldHVybiB7ZG9uZTogZmFsc2UsIHZhbHVlOiBuZXcgU3ludGF4T3JUZXJtV3JhcHBlcih2YWx1ZV8zODUsIHRoaXMuY29udGV4dCl9O1xuICB9XG59XG4iXX0=