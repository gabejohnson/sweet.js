"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ALL_PHASES = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _immutable = require("immutable");

var _errors = require("./errors");

var _bindingMap = require("./binding-map");

var _bindingMap2 = _interopRequireDefault(_bindingMap);

var _ramdaFantasy = require("ramda-fantasy");

var _ramda = require("ramda");

var _ = _interopRequireWildcard(_ramda);

var _tokenizer = require("shift-parser/dist/tokenizer");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Just_682 = _ramdaFantasy.Maybe.Just;
var Nothing_683 = _ramdaFantasy.Maybe.Nothing;

function sizeDecending_684(a_685, b_686) {
  if (a_685.scopes.size > b_686.scopes.size) {
    return -1;
  } else if (b_686.scopes.size > a_685.scopes.size) {
    return 1;
  } else {
    return 0;
  }
}
var ALL_PHASES = exports.ALL_PHASES = {};
;

var Syntax = function () {
  function Syntax(token_687) {
    var oldstx_688 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Syntax);

    this.token = token_687;
    this.bindings = oldstx_688.bindings != null ? oldstx_688.bindings : new _bindingMap2.default();
    this.scopesets = oldstx_688.scopesets != null ? oldstx_688.scopesets : { all: (0, _immutable.List)(), phase: (0, _immutable.Map)() };
    Object.freeze(this);
  }

  _createClass(Syntax, [{
    key: "resolve",
    value: function resolve(phase_716) {
      (0, _errors.assert)(phase_716 != null, "must provide a phase to resolve");
      var allScopes_717 = this.scopesets.all;
      var stxScopes_718 = this.scopesets.phase.has(phase_716) ? this.scopesets.phase.get(phase_716) : (0, _immutable.List)();
      stxScopes_718 = allScopes_717.concat(stxScopes_718);
      if (stxScopes_718.size === 0 || !(this.isIdentifier() || this.isKeyword())) {
        return this.token.value;
      }
      var scope_719 = stxScopes_718.last();
      var bindings_720 = this.bindings;
      if (scope_719) {
        var scopesetBindingList = bindings_720.get(this);
        if (scopesetBindingList) {
          var biggestBindingPair = scopesetBindingList.filter(function (_ref) {
            var scopes = _ref.scopes;
            var binding = _ref.binding;

            return scopes.isSubset(stxScopes_718);
          }).sort(sizeDecending_684);
          if (biggestBindingPair.size >= 2 && biggestBindingPair.get(0).scopes.size === biggestBindingPair.get(1).scopes.size) {
            var debugBase = "{" + stxScopes_718.map(function (s_721) {
              return s_721.toString();
            }).join(", ") + "}";
            var debugAmbigousScopesets = biggestBindingPair.map(function (_ref2) {
              var scopes = _ref2.scopes;

              return "{" + scopes.map(function (s_722) {
                return s_722.toString();
              }).join(", ") + "}";
            }).join(", ");
            throw new Error("Scopeset " + debugBase + " has ambiguous subsets " + debugAmbigousScopesets);
          } else if (biggestBindingPair.size !== 0) {
            var bindingStr = biggestBindingPair.get(0).binding.toString();
            if (_ramdaFantasy.Maybe.isJust(biggestBindingPair.get(0).alias)) {
              return biggestBindingPair.get(0).alias.getOrElse(null).resolve(phase_716);
            }
            return bindingStr;
          }
        }
      }
      return this.token.value;
    }
  }, {
    key: "val",
    value: function val() {
      (0, _errors.assert)(!this.isDelimiter(), "cannot get the val of a delimiter");
      if (this.isStringLiteral()) {
        return this.token.str;
      }
      if (this.isTemplate()) {
        return this.token.items.map(function (el_723) {
          if (el_723 instanceof Syntax && el_723.isDelimiter()) {
            return "${...}";
          }
          return el_723.slice.text;
        }).join("");
      }
      return this.token.value;
    }
  }, {
    key: "lineNumber",
    value: function lineNumber() {
      if (!this.isDelimiter()) {
        return this.token.slice.startLocation.line;
      } else {
        return this.token.get(0).lineNumber();
      }
    }
  }, {
    key: "inner",
    value: function inner() {
      (0, _errors.assert)(this.isDelimiter(), "can only get the inner of a delimiter");
      return this.token.slice(1, this.token.size - 1);
    }
  }, {
    key: "addScope",
    value: function addScope(scope_724, bindings_725, phase_726) {
      var options_727 = arguments.length <= 3 || arguments[3] === undefined ? { flip: false } : arguments[3];

      var token_728 = this.isDelimiter() ? this.token.map(function (s_732) {
        return s_732.addScope(scope_724, bindings_725, phase_726, options_727);
      }) : this.token;
      if (this.isTemplate()) {
        token_728 = { type: this.token.type, items: token_728.items.map(function (it_733) {
            if (it_733 instanceof Syntax && it_733.isDelimiter()) {
              return it_733.addScope(scope_724, bindings_725, phase_726, options_727);
            }
            return it_733;
          }) };
      }
      var oldScopeset_729 = void 0;
      if (phase_726 === ALL_PHASES) {
        oldScopeset_729 = this.scopesets.all;
      } else {
        oldScopeset_729 = this.scopesets.phase.has(phase_726) ? this.scopesets.phase.get(phase_726) : (0, _immutable.List)();
      }
      var newScopeset_730 = void 0;
      if (options_727.flip) {
        var index = oldScopeset_729.indexOf(scope_724);
        if (index !== -1) {
          newScopeset_730 = oldScopeset_729.remove(index);
        } else {
          newScopeset_730 = oldScopeset_729.push(scope_724);
        }
      } else {
        newScopeset_730 = oldScopeset_729.push(scope_724);
      }
      var newstx_731 = { bindings: bindings_725, scopesets: { all: this.scopesets.all, phase: this.scopesets.phase } };
      if (phase_726 === ALL_PHASES) {
        newstx_731.scopesets.all = newScopeset_730;
      } else {
        newstx_731.scopesets.phase = newstx_731.scopesets.phase.set(phase_726, newScopeset_730);
      }
      return new Syntax(token_728, newstx_731);
    }
  }, {
    key: "removeScope",
    value: function removeScope(scope_734, phase_735) {
      var token_736 = this.isDelimiter() ? this.token.map(function (s_742) {
        return s_742.removeScope(scope_734, phase_735);
      }) : this.token;
      var phaseScopeset_737 = this.scopesets.phase.has(phase_735) ? this.scopesets.phase.get(phase_735) : (0, _immutable.List)();
      var allScopeset_738 = this.scopesets.all;
      var newstx_739 = { bindings: this.bindings, scopesets: { all: this.scopesets.all, phase: this.scopesets.phase } };
      var phaseIndex_740 = phaseScopeset_737.indexOf(scope_734);
      var allIndex_741 = allScopeset_738.indexOf(scope_734);
      if (phaseIndex_740 !== -1) {
        newstx_739.scopesets.phase = this.scopesets.phase.set(phase_735, phaseScopeset_737.remove(phaseIndex_740));
      } else if (allIndex_741 !== -1) {
        newstx_739.scopesets.all = allScopeset_738.remove(allIndex_741);
      }
      return new Syntax(token_736, newstx_739);
    }
  }, {
    key: "isIdentifier",
    value: function isIdentifier() {
      return !this.isDelimiter() && this.token.type.klass === _tokenizer.TokenClass.Ident;
    }
  }, {
    key: "isAssign",
    value: function isAssign() {
      return !this.isDelimiter() && this.token.type === _tokenizer.TokenType.ASSIGN;
    }
  }, {
    key: "isBooleanLiteral",
    value: function isBooleanLiteral() {
      return !this.isDelimiter() && this.token.type === _tokenizer.TokenType.TRUE || this.token.type === _tokenizer.TokenType.FALSE;
    }
  }, {
    key: "isKeyword",
    value: function isKeyword() {
      return !this.isDelimiter() && this.token.type.klass === _tokenizer.TokenClass.Keyword;
    }
  }, {
    key: "isNullLiteral",
    value: function isNullLiteral() {
      return !this.isDelimiter() && this.token.type === _tokenizer.TokenType.NULL;
    }
  }, {
    key: "isNumericLiteral",
    value: function isNumericLiteral() {
      return !this.isDelimiter() && this.token.type.klass === _tokenizer.TokenClass.NumericLiteral;
    }
  }, {
    key: "isPunctuator",
    value: function isPunctuator() {
      return !this.isDelimiter() && this.token.type.klass === _tokenizer.TokenClass.Punctuator;
    }
  }, {
    key: "isStringLiteral",
    value: function isStringLiteral() {
      return !this.isDelimiter() && this.token.type.klass === _tokenizer.TokenClass.StringLiteral;
    }
  }, {
    key: "isRegularExpression",
    value: function isRegularExpression() {
      return !this.isDelimiter() && this.token.type.klass === _tokenizer.TokenClass.RegularExpression;
    }
  }, {
    key: "isTemplate",
    value: function isTemplate() {
      return !this.isDelimiter() && this.token.type === _tokenizer.TokenType.TEMPLATE;
    }
  }, {
    key: "isDelimiter",
    value: function isDelimiter() {
      return _immutable.List.isList(this.token);
    }
  }, {
    key: "isParens",
    value: function isParens() {
      return this.isDelimiter() && this.token.get(0).token.type === _tokenizer.TokenType.LPAREN;
    }
  }, {
    key: "isBraces",
    value: function isBraces() {
      return this.isDelimiter() && this.token.get(0).token.type === _tokenizer.TokenType.LBRACE;
    }
  }, {
    key: "isBrackets",
    value: function isBrackets() {
      return this.isDelimiter() && this.token.get(0).token.type === _tokenizer.TokenType.LBRACK;
    }
  }, {
    key: "isSyntaxTemplate",
    value: function isSyntaxTemplate() {
      return this.isDelimiter() && this.token.get(0).val() === "#`";
    }
  }, {
    key: "isEOF",
    value: function isEOF() {
      return !this.isDelimiter() && this.token.type === _tokenizer.TokenType.EOS;
    }
  }, {
    key: "toString",
    value: function toString() {
      if (this.isDelimiter()) {
        return this.token.map(function (s_743) {
          return s_743.toString();
        }).join(" ");
      }
      if (this.isStringLiteral()) {
        return "'" + this.token.str;
      }
      if (this.isTemplate()) {
        return this.val();
      }
      return this.token.value;
    }
  }], [{
    key: "of",
    value: function of(token_689) {
      var stx_690 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new Syntax(token_689, stx_690);
    }
  }, {
    key: "fromNull",
    value: function fromNull() {
      var stx_691 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return new Syntax({ type: _tokenizer.TokenType.NULL, value: null }, stx_691);
    }
  }, {
    key: "fromNumber",
    value: function fromNumber(value_692) {
      var stx_693 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new Syntax({ type: _tokenizer.TokenType.NUMBER, value: value_692 }, stx_693);
    }
  }, {
    key: "fromString",
    value: function fromString(value_694) {
      var stx_695 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new Syntax({ type: _tokenizer.TokenType.STRING, str: value_694 }, stx_695);
    }
  }, {
    key: "fromPunctuator",
    value: function fromPunctuator(value_696) {
      var stx_697 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new Syntax({ type: { klass: _tokenizer.TokenClass.Punctuator, name: value_696 }, value: value_696 }, stx_697);
    }
  }, {
    key: "fromKeyword",
    value: function fromKeyword(value_698) {
      var stx_699 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new Syntax({ type: { klass: _tokenizer.TokenClass.Keyword, name: value_698 }, value: value_698 }, stx_699);
    }
  }, {
    key: "fromIdentifier",
    value: function fromIdentifier(value_700) {
      var stx_701 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new Syntax({ type: _tokenizer.TokenType.IDENTIFIER, value: value_700 }, stx_701);
    }
  }, {
    key: "fromRegularExpression",
    value: function fromRegularExpression(value_702) {
      var stx_703 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new Syntax({ type: _tokenizer.TokenType.REGEXP, value: value_702 }, stx_703);
    }
  }, {
    key: "fromBraces",
    value: function fromBraces(inner_704) {
      var stx_705 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var left_706 = new Syntax({ type: _tokenizer.TokenType.LBRACE, value: "{" });
      var right_707 = new Syntax({ type: _tokenizer.TokenType.RBRACE, value: "}" });
      return new Syntax(_immutable.List.of(left_706).concat(inner_704).push(right_707), stx_705);
    }
  }, {
    key: "fromBrackets",
    value: function fromBrackets(inner_708) {
      var stx_709 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var left_710 = new Syntax({ type: _tokenizer.TokenType.LBRACK, value: "[" });
      var right_711 = new Syntax({ type: _tokenizer.TokenType.RBRACK, value: "]" });
      return new Syntax(_immutable.List.of(left_710).concat(inner_708).push(right_711), stx_709);
    }
  }, {
    key: "fromParens",
    value: function fromParens(inner_712) {
      var stx_713 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var left_714 = new Syntax({ type: _tokenizer.TokenType.LPAREN, value: "(" });
      var right_715 = new Syntax({ type: _tokenizer.TokenType.RPAREN, value: ")" });
      return new Syntax(_immutable.List.of(left_714).concat(inner_712).push(right_715), stx_713);
    }
  }]);

  return Syntax;
}();

exports.default = Syntax;
//# sourceMappingURL=data:application/json;base64,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T0FBaEUsQ0FBUDtBQUNEOzs7K0JBQ2lCLFMsRUFBeUI7QUFBQSxVQUFkLE9BQWMseURBQUosRUFBSTs7QUFDekMsVUFBSSxXQUFXLElBQUksTUFBSixDQUFXLEVBQUMsTUFBTSxxQkFBVSxNQUFqQixFQUF5QixPQUFPLEdBQWhDLEVBQVgsQ0FBZjtBQUNBLFVBQUksWUFBWSxJQUFJLE1BQUosQ0FBVyxFQUFDLE1BQU0scUJBQVUsTUFBakIsRUFBeUIsT0FBTyxHQUFoQyxFQUFYLENBQWhCO0FBQ0EsYUFBTyxJQUFJLE1BQUosQ0FBVyxnQkFBSyxFQUFMLENBQVEsUUFBUixFQUFrQixNQUFsQixDQUF5QixTQUF6QixFQUFvQyxJQUFwQyxDQUF5QyxTQUF6QyxDQUFYLEVBQWdFLE9BQWhFLENBQVA7QUFDRDs7Ozs7O2tCQTdDa0IsTSIsImZpbGUiOiJzeW50YXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0xpc3QsIE1hcH0gZnJvbSBcImltbXV0YWJsZVwiO1xuaW1wb3J0IHthc3NlcnR9IGZyb20gXCIuL2Vycm9yc1wiO1xuaW1wb3J0IEJpbmRpbmdNYXAgZnJvbSBcIi4vYmluZGluZy1tYXBcIjtcbmltcG9ydCB7TWF5YmV9IGZyb20gXCJyYW1kYS1mYW50YXN5XCI7XG5pbXBvcnQgICogYXMgXyBmcm9tIFwicmFtZGFcIjtcbmNvbnN0IEp1c3RfNjgyID0gTWF5YmUuSnVzdDtcbmNvbnN0IE5vdGhpbmdfNjgzID0gTWF5YmUuTm90aGluZztcbmltcG9ydCB7VG9rZW5UeXBlLCBUb2tlbkNsYXNzfSBmcm9tIFwic2hpZnQtcGFyc2VyL2Rpc3QvdG9rZW5pemVyXCI7XG5mdW5jdGlvbiBzaXplRGVjZW5kaW5nXzY4NChhXzY4NSwgYl82ODYpIHtcbiAgaWYgKGFfNjg1LnNjb3Blcy5zaXplID4gYl82ODYuc2NvcGVzLnNpemUpIHtcbiAgICByZXR1cm4gLTE7XG4gIH0gZWxzZSBpZiAoYl82ODYuc2NvcGVzLnNpemUgPiBhXzY4NS5zY29wZXMuc2l6ZSkge1xuICAgIHJldHVybiAxO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAwO1xuICB9XG59XG5leHBvcnQgY29uc3QgQUxMX1BIQVNFUyA9IHt9O1xuO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3ludGF4IHtcbiAgY29uc3RydWN0b3IodG9rZW5fNjg3LCBvbGRzdHhfNjg4ID0ge30pIHtcbiAgICB0aGlzLnRva2VuID0gdG9rZW5fNjg3O1xuICAgIHRoaXMuYmluZGluZ3MgPSBvbGRzdHhfNjg4LmJpbmRpbmdzICE9IG51bGwgPyBvbGRzdHhfNjg4LmJpbmRpbmdzIDogbmV3IEJpbmRpbmdNYXA7XG4gICAgdGhpcy5zY29wZXNldHMgPSBvbGRzdHhfNjg4LnNjb3Blc2V0cyAhPSBudWxsID8gb2xkc3R4XzY4OC5zY29wZXNldHMgOiB7YWxsOiBMaXN0KCksIHBoYXNlOiBNYXAoKX07XG4gICAgT2JqZWN0LmZyZWV6ZSh0aGlzKTtcbiAgfVxuICBzdGF0aWMgb2YodG9rZW5fNjg5LCBzdHhfNjkwID0ge30pIHtcbiAgICByZXR1cm4gbmV3IFN5bnRheCh0b2tlbl82ODksIHN0eF82OTApO1xuICB9XG4gIHN0YXRpYyBmcm9tTnVsbChzdHhfNjkxID0ge30pIHtcbiAgICByZXR1cm4gbmV3IFN5bnRheCh7dHlwZTogVG9rZW5UeXBlLk5VTEwsIHZhbHVlOiBudWxsfSwgc3R4XzY5MSk7XG4gIH1cbiAgc3RhdGljIGZyb21OdW1iZXIodmFsdWVfNjkyLCBzdHhfNjkzID0ge30pIHtcbiAgICByZXR1cm4gbmV3IFN5bnRheCh7dHlwZTogVG9rZW5UeXBlLk5VTUJFUiwgdmFsdWU6IHZhbHVlXzY5Mn0sIHN0eF82OTMpO1xuICB9XG4gIHN0YXRpYyBmcm9tU3RyaW5nKHZhbHVlXzY5NCwgc3R4XzY5NSA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBTeW50YXgoe3R5cGU6IFRva2VuVHlwZS5TVFJJTkcsIHN0cjogdmFsdWVfNjk0fSwgc3R4XzY5NSk7XG4gIH1cbiAgc3RhdGljIGZyb21QdW5jdHVhdG9yKHZhbHVlXzY5Niwgc3R4XzY5NyA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBTeW50YXgoe3R5cGU6IHtrbGFzczogVG9rZW5DbGFzcy5QdW5jdHVhdG9yLCBuYW1lOiB2YWx1ZV82OTZ9LCB2YWx1ZTogdmFsdWVfNjk2fSwgc3R4XzY5Nyk7XG4gIH1cbiAgc3RhdGljIGZyb21LZXl3b3JkKHZhbHVlXzY5OCwgc3R4XzY5OSA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBTeW50YXgoe3R5cGU6IHtrbGFzczogVG9rZW5DbGFzcy5LZXl3b3JkLCBuYW1lOiB2YWx1ZV82OTh9LCB2YWx1ZTogdmFsdWVfNjk4fSwgc3R4XzY5OSk7XG4gIH1cbiAgc3RhdGljIGZyb21JZGVudGlmaWVyKHZhbHVlXzcwMCwgc3R4XzcwMSA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBTeW50YXgoe3R5cGU6IFRva2VuVHlwZS5JREVOVElGSUVSLCB2YWx1ZTogdmFsdWVfNzAwfSwgc3R4XzcwMSk7XG4gIH1cbiAgc3RhdGljIGZyb21SZWd1bGFyRXhwcmVzc2lvbih2YWx1ZV83MDIsIHN0eF83MDMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgU3ludGF4KHt0eXBlOiBUb2tlblR5cGUuUkVHRVhQLCB2YWx1ZTogdmFsdWVfNzAyfSwgc3R4XzcwMyk7XG4gIH1cbiAgc3RhdGljIGZyb21CcmFjZXMoaW5uZXJfNzA0LCBzdHhfNzA1ID0ge30pIHtcbiAgICBsZXQgbGVmdF83MDYgPSBuZXcgU3ludGF4KHt0eXBlOiBUb2tlblR5cGUuTEJSQUNFLCB2YWx1ZTogXCJ7XCJ9KTtcbiAgICBsZXQgcmlnaHRfNzA3ID0gbmV3IFN5bnRheCh7dHlwZTogVG9rZW5UeXBlLlJCUkFDRSwgdmFsdWU6IFwifVwifSk7XG4gICAgcmV0dXJuIG5ldyBTeW50YXgoTGlzdC5vZihsZWZ0XzcwNikuY29uY2F0KGlubmVyXzcwNCkucHVzaChyaWdodF83MDcpLCBzdHhfNzA1KTtcbiAgfVxuICBzdGF0aWMgZnJvbUJyYWNrZXRzKGlubmVyXzcwOCwgc3R4XzcwOSA9IHt9KSB7XG4gICAgbGV0IGxlZnRfNzEwID0gbmV3IFN5bnRheCh7dHlwZTogVG9rZW5UeXBlLkxCUkFDSywgdmFsdWU6IFwiW1wifSk7XG4gICAgbGV0IHJpZ2h0XzcxMSA9IG5ldyBTeW50YXgoe3R5cGU6IFRva2VuVHlwZS5SQlJBQ0ssIHZhbHVlOiBcIl1cIn0pO1xuICAgIHJldHVybiBuZXcgU3ludGF4KExpc3Qub2YobGVmdF83MTApLmNvbmNhdChpbm5lcl83MDgpLnB1c2gocmlnaHRfNzExKSwgc3R4XzcwOSk7XG4gIH1cbiAgc3RhdGljIGZyb21QYXJlbnMoaW5uZXJfNzEyLCBzdHhfNzEzID0ge30pIHtcbiAgICBsZXQgbGVmdF83MTQgPSBuZXcgU3ludGF4KHt0eXBlOiBUb2tlblR5cGUuTFBBUkVOLCB2YWx1ZTogXCIoXCJ9KTtcbiAgICBsZXQgcmlnaHRfNzE1ID0gbmV3IFN5bnRheCh7dHlwZTogVG9rZW5UeXBlLlJQQVJFTiwgdmFsdWU6IFwiKVwifSk7XG4gICAgcmV0dXJuIG5ldyBTeW50YXgoTGlzdC5vZihsZWZ0XzcxNCkuY29uY2F0KGlubmVyXzcxMikucHVzaChyaWdodF83MTUpLCBzdHhfNzEzKTtcbiAgfVxuICByZXNvbHZlKHBoYXNlXzcxNikge1xuICAgIGFzc2VydChwaGFzZV83MTYgIT0gbnVsbCwgXCJtdXN0IHByb3ZpZGUgYSBwaGFzZSB0byByZXNvbHZlXCIpO1xuICAgIGxldCBhbGxTY29wZXNfNzE3ID0gdGhpcy5zY29wZXNldHMuYWxsO1xuICAgIGxldCBzdHhTY29wZXNfNzE4ID0gdGhpcy5zY29wZXNldHMucGhhc2UuaGFzKHBoYXNlXzcxNikgPyB0aGlzLnNjb3Blc2V0cy5waGFzZS5nZXQocGhhc2VfNzE2KSA6IExpc3QoKTtcbiAgICBzdHhTY29wZXNfNzE4ID0gYWxsU2NvcGVzXzcxNy5jb25jYXQoc3R4U2NvcGVzXzcxOCk7XG4gICAgaWYgKHN0eFNjb3Blc183MTguc2l6ZSA9PT0gMCB8fCAhKHRoaXMuaXNJZGVudGlmaWVyKCkgfHwgdGhpcy5pc0tleXdvcmQoKSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRva2VuLnZhbHVlO1xuICAgIH1cbiAgICBsZXQgc2NvcGVfNzE5ID0gc3R4U2NvcGVzXzcxOC5sYXN0KCk7XG4gICAgbGV0IGJpbmRpbmdzXzcyMCA9IHRoaXMuYmluZGluZ3M7XG4gICAgaWYgKHNjb3BlXzcxOSkge1xuICAgICAgbGV0IHNjb3Blc2V0QmluZGluZ0xpc3QgPSBiaW5kaW5nc183MjAuZ2V0KHRoaXMpO1xuICAgICAgaWYgKHNjb3Blc2V0QmluZGluZ0xpc3QpIHtcbiAgICAgICAgbGV0IGJpZ2dlc3RCaW5kaW5nUGFpciA9IHNjb3Blc2V0QmluZGluZ0xpc3QuZmlsdGVyKCh7c2NvcGVzLCBiaW5kaW5nfSkgPT4ge1xuICAgICAgICAgIHJldHVybiBzY29wZXMuaXNTdWJzZXQoc3R4U2NvcGVzXzcxOCk7XG4gICAgICAgIH0pLnNvcnQoc2l6ZURlY2VuZGluZ182ODQpO1xuICAgICAgICBpZiAoYmlnZ2VzdEJpbmRpbmdQYWlyLnNpemUgPj0gMiAmJiBiaWdnZXN0QmluZGluZ1BhaXIuZ2V0KDApLnNjb3Blcy5zaXplID09PSBiaWdnZXN0QmluZGluZ1BhaXIuZ2V0KDEpLnNjb3Blcy5zaXplKSB7XG4gICAgICAgICAgbGV0IGRlYnVnQmFzZSA9IFwie1wiICsgc3R4U2NvcGVzXzcxOC5tYXAoc183MjEgPT4gc183MjEudG9TdHJpbmcoKSkuam9pbihcIiwgXCIpICsgXCJ9XCI7XG4gICAgICAgICAgbGV0IGRlYnVnQW1iaWdvdXNTY29wZXNldHMgPSBiaWdnZXN0QmluZGluZ1BhaXIubWFwKCh7c2NvcGVzfSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIFwie1wiICsgc2NvcGVzLm1hcChzXzcyMiA9PiBzXzcyMi50b1N0cmluZygpKS5qb2luKFwiLCBcIikgKyBcIn1cIjtcbiAgICAgICAgICB9KS5qb2luKFwiLCBcIik7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2NvcGVzZXQgXCIgKyBkZWJ1Z0Jhc2UgKyBcIiBoYXMgYW1iaWd1b3VzIHN1YnNldHMgXCIgKyBkZWJ1Z0FtYmlnb3VzU2NvcGVzZXRzKTtcbiAgICAgICAgfSBlbHNlIGlmIChiaWdnZXN0QmluZGluZ1BhaXIuc2l6ZSAhPT0gMCkge1xuICAgICAgICAgIGxldCBiaW5kaW5nU3RyID0gYmlnZ2VzdEJpbmRpbmdQYWlyLmdldCgwKS5iaW5kaW5nLnRvU3RyaW5nKCk7XG4gICAgICAgICAgaWYgKE1heWJlLmlzSnVzdChiaWdnZXN0QmluZGluZ1BhaXIuZ2V0KDApLmFsaWFzKSkge1xuICAgICAgICAgICAgcmV0dXJuIGJpZ2dlc3RCaW5kaW5nUGFpci5nZXQoMCkuYWxpYXMuZ2V0T3JFbHNlKG51bGwpLnJlc29sdmUocGhhc2VfNzE2KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGJpbmRpbmdTdHI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudG9rZW4udmFsdWU7XG4gIH1cbiAgdmFsKCkge1xuICAgIGFzc2VydCghdGhpcy5pc0RlbGltaXRlcigpLCBcImNhbm5vdCBnZXQgdGhlIHZhbCBvZiBhIGRlbGltaXRlclwiKTtcbiAgICBpZiAodGhpcy5pc1N0cmluZ0xpdGVyYWwoKSkge1xuICAgICAgcmV0dXJuIHRoaXMudG9rZW4uc3RyO1xuICAgIH1cbiAgICBpZiAodGhpcy5pc1RlbXBsYXRlKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRva2VuLml0ZW1zLm1hcChlbF83MjMgPT4ge1xuICAgICAgICBpZiAoZWxfNzIzIGluc3RhbmNlb2YgU3ludGF4ICYmIGVsXzcyMy5pc0RlbGltaXRlcigpKSB7XG4gICAgICAgICAgcmV0dXJuIFwiJHsuLi59XCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsXzcyMy5zbGljZS50ZXh0O1xuICAgICAgfSkuam9pbihcIlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudG9rZW4udmFsdWU7XG4gIH1cbiAgbGluZU51bWJlcigpIHtcbiAgICBpZiAoIXRoaXMuaXNEZWxpbWl0ZXIoKSkge1xuICAgICAgcmV0dXJuIHRoaXMudG9rZW4uc2xpY2Uuc3RhcnRMb2NhdGlvbi5saW5lO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy50b2tlbi5nZXQoMCkubGluZU51bWJlcigpO1xuICAgIH1cbiAgfVxuICBpbm5lcigpIHtcbiAgICBhc3NlcnQodGhpcy5pc0RlbGltaXRlcigpLCBcImNhbiBvbmx5IGdldCB0aGUgaW5uZXIgb2YgYSBkZWxpbWl0ZXJcIik7XG4gICAgcmV0dXJuIHRoaXMudG9rZW4uc2xpY2UoMSwgdGhpcy50b2tlbi5zaXplIC0gMSk7XG4gIH1cbiAgYWRkU2NvcGUoc2NvcGVfNzI0LCBiaW5kaW5nc183MjUsIHBoYXNlXzcyNiwgb3B0aW9uc183MjcgPSB7ZmxpcDogZmFsc2V9KSB7XG4gICAgbGV0IHRva2VuXzcyOCA9IHRoaXMuaXNEZWxpbWl0ZXIoKSA/IHRoaXMudG9rZW4ubWFwKHNfNzMyID0+IHNfNzMyLmFkZFNjb3BlKHNjb3BlXzcyNCwgYmluZGluZ3NfNzI1LCBwaGFzZV83MjYsIG9wdGlvbnNfNzI3KSkgOiB0aGlzLnRva2VuO1xuICAgIGlmICh0aGlzLmlzVGVtcGxhdGUoKSkge1xuICAgICAgdG9rZW5fNzI4ID0ge3R5cGU6IHRoaXMudG9rZW4udHlwZSwgaXRlbXM6IHRva2VuXzcyOC5pdGVtcy5tYXAoaXRfNzMzID0+IHtcbiAgICAgICAgaWYgKGl0XzczMyBpbnN0YW5jZW9mIFN5bnRheCAmJiBpdF83MzMuaXNEZWxpbWl0ZXIoKSkge1xuICAgICAgICAgIHJldHVybiBpdF83MzMuYWRkU2NvcGUoc2NvcGVfNzI0LCBiaW5kaW5nc183MjUsIHBoYXNlXzcyNiwgb3B0aW9uc183MjcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpdF83MzM7XG4gICAgICB9KX07XG4gICAgfVxuICAgIGxldCBvbGRTY29wZXNldF83Mjk7XG4gICAgaWYgKHBoYXNlXzcyNiA9PT0gQUxMX1BIQVNFUykge1xuICAgICAgb2xkU2NvcGVzZXRfNzI5ID0gdGhpcy5zY29wZXNldHMuYWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBvbGRTY29wZXNldF83MjkgPSB0aGlzLnNjb3Blc2V0cy5waGFzZS5oYXMocGhhc2VfNzI2KSA/IHRoaXMuc2NvcGVzZXRzLnBoYXNlLmdldChwaGFzZV83MjYpIDogTGlzdCgpO1xuICAgIH1cbiAgICBsZXQgbmV3U2NvcGVzZXRfNzMwO1xuICAgIGlmIChvcHRpb25zXzcyNy5mbGlwKSB7XG4gICAgICBsZXQgaW5kZXggPSBvbGRTY29wZXNldF83MjkuaW5kZXhPZihzY29wZV83MjQpO1xuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICBuZXdTY29wZXNldF83MzAgPSBvbGRTY29wZXNldF83MjkucmVtb3ZlKGluZGV4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld1Njb3Blc2V0XzczMCA9IG9sZFNjb3Blc2V0XzcyOS5wdXNoKHNjb3BlXzcyNCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld1Njb3Blc2V0XzczMCA9IG9sZFNjb3Blc2V0XzcyOS5wdXNoKHNjb3BlXzcyNCk7XG4gICAgfVxuICAgIGxldCBuZXdzdHhfNzMxID0ge2JpbmRpbmdzOiBiaW5kaW5nc183MjUsIHNjb3Blc2V0czoge2FsbDogdGhpcy5zY29wZXNldHMuYWxsLCBwaGFzZTogdGhpcy5zY29wZXNldHMucGhhc2V9fTtcbiAgICBpZiAocGhhc2VfNzI2ID09PSBBTExfUEhBU0VTKSB7XG4gICAgICBuZXdzdHhfNzMxLnNjb3Blc2V0cy5hbGwgPSBuZXdTY29wZXNldF83MzA7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld3N0eF83MzEuc2NvcGVzZXRzLnBoYXNlID0gbmV3c3R4XzczMS5zY29wZXNldHMucGhhc2Uuc2V0KHBoYXNlXzcyNiwgbmV3U2NvcGVzZXRfNzMwKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBTeW50YXgodG9rZW5fNzI4LCBuZXdzdHhfNzMxKTtcbiAgfVxuICByZW1vdmVTY29wZShzY29wZV83MzQsIHBoYXNlXzczNSkge1xuICAgIGxldCB0b2tlbl83MzYgPSB0aGlzLmlzRGVsaW1pdGVyKCkgPyB0aGlzLnRva2VuLm1hcChzXzc0MiA9PiBzXzc0Mi5yZW1vdmVTY29wZShzY29wZV83MzQsIHBoYXNlXzczNSkpIDogdGhpcy50b2tlbjtcbiAgICBsZXQgcGhhc2VTY29wZXNldF83MzcgPSB0aGlzLnNjb3Blc2V0cy5waGFzZS5oYXMocGhhc2VfNzM1KSA/IHRoaXMuc2NvcGVzZXRzLnBoYXNlLmdldChwaGFzZV83MzUpIDogTGlzdCgpO1xuICAgIGxldCBhbGxTY29wZXNldF83MzggPSB0aGlzLnNjb3Blc2V0cy5hbGw7XG4gICAgbGV0IG5ld3N0eF83MzkgPSB7YmluZGluZ3M6IHRoaXMuYmluZGluZ3MsIHNjb3Blc2V0czoge2FsbDogdGhpcy5zY29wZXNldHMuYWxsLCBwaGFzZTogdGhpcy5zY29wZXNldHMucGhhc2V9fTtcbiAgICBsZXQgcGhhc2VJbmRleF83NDAgPSBwaGFzZVNjb3Blc2V0XzczNy5pbmRleE9mKHNjb3BlXzczNCk7XG4gICAgbGV0IGFsbEluZGV4Xzc0MSA9IGFsbFNjb3Blc2V0XzczOC5pbmRleE9mKHNjb3BlXzczNCk7XG4gICAgaWYgKHBoYXNlSW5kZXhfNzQwICE9PSAtMSkge1xuICAgICAgbmV3c3R4XzczOS5zY29wZXNldHMucGhhc2UgPSB0aGlzLnNjb3Blc2V0cy5waGFzZS5zZXQocGhhc2VfNzM1LCBwaGFzZVNjb3Blc2V0XzczNy5yZW1vdmUocGhhc2VJbmRleF83NDApKTtcbiAgICB9IGVsc2UgaWYgKGFsbEluZGV4Xzc0MSAhPT0gLTEpIHtcbiAgICAgIG5ld3N0eF83Mzkuc2NvcGVzZXRzLmFsbCA9IGFsbFNjb3Blc2V0XzczOC5yZW1vdmUoYWxsSW5kZXhfNzQxKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBTeW50YXgodG9rZW5fNzM2LCBuZXdzdHhfNzM5KTtcbiAgfVxuICBpc0lkZW50aWZpZXIoKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzRGVsaW1pdGVyKCkgJiYgdGhpcy50b2tlbi50eXBlLmtsYXNzID09PSBUb2tlbkNsYXNzLklkZW50O1xuICB9XG4gIGlzQXNzaWduKCkge1xuICAgIHJldHVybiAhdGhpcy5pc0RlbGltaXRlcigpICYmIHRoaXMudG9rZW4udHlwZSA9PT0gVG9rZW5UeXBlLkFTU0lHTjtcbiAgfVxuICBpc0Jvb2xlYW5MaXRlcmFsKCkge1xuICAgIHJldHVybiAhdGhpcy5pc0RlbGltaXRlcigpICYmIHRoaXMudG9rZW4udHlwZSA9PT0gVG9rZW5UeXBlLlRSVUUgfHwgdGhpcy50b2tlbi50eXBlID09PSBUb2tlblR5cGUuRkFMU0U7XG4gIH1cbiAgaXNLZXl3b3JkKCkge1xuICAgIHJldHVybiAhdGhpcy5pc0RlbGltaXRlcigpICYmIHRoaXMudG9rZW4udHlwZS5rbGFzcyA9PT0gVG9rZW5DbGFzcy5LZXl3b3JkO1xuICB9XG4gIGlzTnVsbExpdGVyYWwoKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzRGVsaW1pdGVyKCkgJiYgdGhpcy50b2tlbi50eXBlID09PSBUb2tlblR5cGUuTlVMTDtcbiAgfVxuICBpc051bWVyaWNMaXRlcmFsKCkge1xuICAgIHJldHVybiAhdGhpcy5pc0RlbGltaXRlcigpICYmIHRoaXMudG9rZW4udHlwZS5rbGFzcyA9PT0gVG9rZW5DbGFzcy5OdW1lcmljTGl0ZXJhbDtcbiAgfVxuICBpc1B1bmN0dWF0b3IoKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzRGVsaW1pdGVyKCkgJiYgdGhpcy50b2tlbi50eXBlLmtsYXNzID09PSBUb2tlbkNsYXNzLlB1bmN0dWF0b3I7XG4gIH1cbiAgaXNTdHJpbmdMaXRlcmFsKCkge1xuICAgIHJldHVybiAhdGhpcy5pc0RlbGltaXRlcigpICYmIHRoaXMudG9rZW4udHlwZS5rbGFzcyA9PT0gVG9rZW5DbGFzcy5TdHJpbmdMaXRlcmFsO1xuICB9XG4gIGlzUmVndWxhckV4cHJlc3Npb24oKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzRGVsaW1pdGVyKCkgJiYgdGhpcy50b2tlbi50eXBlLmtsYXNzID09PSBUb2tlbkNsYXNzLlJlZ3VsYXJFeHByZXNzaW9uO1xuICB9XG4gIGlzVGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzRGVsaW1pdGVyKCkgJiYgdGhpcy50b2tlbi50eXBlID09PSBUb2tlblR5cGUuVEVNUExBVEU7XG4gIH1cbiAgaXNEZWxpbWl0ZXIoKSB7XG4gICAgcmV0dXJuIExpc3QuaXNMaXN0KHRoaXMudG9rZW4pO1xuICB9XG4gIGlzUGFyZW5zKCkge1xuICAgIHJldHVybiB0aGlzLmlzRGVsaW1pdGVyKCkgJiYgdGhpcy50b2tlbi5nZXQoMCkudG9rZW4udHlwZSA9PT0gVG9rZW5UeXBlLkxQQVJFTjtcbiAgfVxuICBpc0JyYWNlcygpIHtcbiAgICByZXR1cm4gdGhpcy5pc0RlbGltaXRlcigpICYmIHRoaXMudG9rZW4uZ2V0KDApLnRva2VuLnR5cGUgPT09IFRva2VuVHlwZS5MQlJBQ0U7XG4gIH1cbiAgaXNCcmFja2V0cygpIHtcbiAgICByZXR1cm4gdGhpcy5pc0RlbGltaXRlcigpICYmIHRoaXMudG9rZW4uZ2V0KDApLnRva2VuLnR5cGUgPT09IFRva2VuVHlwZS5MQlJBQ0s7XG4gIH1cbiAgaXNTeW50YXhUZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5pc0RlbGltaXRlcigpICYmIHRoaXMudG9rZW4uZ2V0KDApLnZhbCgpID09PSBcIiNgXCI7XG4gIH1cbiAgaXNFT0YoKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzRGVsaW1pdGVyKCkgJiYgdGhpcy50b2tlbi50eXBlID09PSBUb2tlblR5cGUuRU9TO1xuICB9XG4gIHRvU3RyaW5nKCkge1xuICAgIGlmICh0aGlzLmlzRGVsaW1pdGVyKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRva2VuLm1hcChzXzc0MyA9PiBzXzc0My50b1N0cmluZygpKS5qb2luKFwiIFwiKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNTdHJpbmdMaXRlcmFsKCkpIHtcbiAgICAgIHJldHVybiBcIidcIiArIHRoaXMudG9rZW4uc3RyO1xuICAgIH1cbiAgICBpZiAodGhpcy5pc1RlbXBsYXRlKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbCgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy50b2tlbi52YWx1ZTtcbiAgfVxufVxuIl19