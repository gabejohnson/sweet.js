"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _tokenizer = require("shift-parser/dist/tokenizer");

var _tokenizer2 = _interopRequireDefault(_tokenizer);

var _immutable = require("immutable");

var _syntax = require("./syntax");

var _syntax2 = _interopRequireDefault(_syntax);

var _ramda = require("ramda");

var R = _interopRequireWildcard(_ramda);

var _ramdaFantasy = require("ramda-fantasy");

var _errors = require("./errors");

var _terms = require("./terms");

var _terms2 = _interopRequireDefault(_terms);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Just_526 = _ramdaFantasy.Maybe.Just;
var Nothing_527 = _ramdaFantasy.Maybe.Nothing;

var LSYNTAX_528 = { name: "left-syntax" };
var RSYNTAX_529 = { name: "right-syntax" };
var AT_530 = { klass: _tokenizer.TokenClass.Punctuator, name: "@" };
var literalKeywords_531 = ["this", "null", "true", "false"];
var isLeftBracket_532 = R.whereEq({ type: _tokenizer.TokenType.LBRACK });
var isLeftBrace_533 = R.whereEq({ type: _tokenizer.TokenType.LBRACE });
var isLeftParen_534 = R.whereEq({ type: _tokenizer.TokenType.LPAREN });
var isRightBracket_535 = R.whereEq({ type: _tokenizer.TokenType.RBRACK });
var isRightBrace_536 = R.whereEq({ type: _tokenizer.TokenType.RBRACE });
var isRightParen_537 = R.whereEq({ type: _tokenizer.TokenType.RPAREN });
var isEOS_538 = R.whereEq({ type: _tokenizer.TokenType.EOS });
var isHash_539 = R.whereEq({ type: _tokenizer.TokenType.IDENTIFIER, value: "#" });
var isLeftSyntax_540 = R.whereEq({ type: LSYNTAX_528 });
var isRightSyntax_541 = R.whereEq({ type: RSYNTAX_529 });
var isLeftDelimiter_542 = R.anyPass([isLeftBracket_532, isLeftBrace_533, isLeftParen_534, isLeftSyntax_540]);
var isRightDelimiter_543 = R.anyPass([isRightBracket_535, isRightBrace_536, isRightParen_537, isRightSyntax_541]);
var isMatchingDelimiters_544 = R.cond([[isLeftBracket_532, function (__585, b_586) {
  return isRightBracket_535(b_586);
}], [isLeftBrace_533, function (__587, b_588) {
  return isRightBrace_536(b_588);
}], [isLeftParen_534, function (__589, b_590) {
  return isRightParen_537(b_590);
}], [isLeftSyntax_540, function (__591, b_592) {
  return isRightSyntax_541(b_592);
}], [R.T, R.F]]);
var assignOps_545 = ["=", "+=", "-=", "*=", "/=", "%=", "<<=", ">>=", ">>>=", "&=", "|=", "^=", ","];
var binaryOps_546 = ["+", "-", "*", "/", "%", "<<", ">>", ">>>", "&", "|", "^", "&&", "||", "?", ":", "===", "==", ">=", "<=", "<", ">", "!=", "!==", "instanceof"];
var unaryOps_547 = ["++", "--", "~", "!", "delete", "void", "typeof", "yield", "throw", "new"];
var isEmpty_548 = R.whereEq({ size: 0 });
var isPunctuator_549 = function isPunctuator_549(s_593) {
  return s_593.isPunctuator();
};
var isKeyword_550 = function isKeyword_550(s_594) {
  return s_594.isKeyword();
};
var isDelimiter_551 = function isDelimiter_551(s_595) {
  return s_595.isDelimiter();
};
var isParens_552 = function isParens_552(s_596) {
  return s_596.isParens();
};
var isBraces_553 = function isBraces_553(s_597) {
  return s_597.isBraces();
};
var isBrackets_554 = function isBrackets_554(s_598) {
  return s_598.isBrackets();
};
var isIdentifier_555 = function isIdentifier_555(s_599) {
  return s_599.isIdentifier();
};
var val_556 = function val_556(s_600) {
  return s_600.val();
};
var isVal_557 = R.curry(function (v_601, s_602) {
  return s_602.val() === v_601;
});
var isDot_558 = R.allPass([isPunctuator_549, isVal_557(".")]);
var isColon_559 = R.allPass([isPunctuator_549, isVal_557(":")]);
var isFunctionKeyword_560 = R.allPass([isKeyword_550, isVal_557("function")]);
var isOperator_561 = function isOperator_561(s_603) {
  return (s_603.isPunctuator() || s_603.isKeyword()) && R.any(R.equals(s_603.val()), assignOps_545.concat(binaryOps_546).concat(unaryOps_547));
};
var isNonLiteralKeyword_562 = R.allPass([isKeyword_550, function (s_604) {
  return R.none(R.equals(s_604.val()), literalKeywords_531);
}]);
var isKeywordExprPrefix_563 = R.allPass([isKeyword_550, function (s_605) {
  return R.any(R.equals(s_605.val()), ["instanceof", "typeof", "delete", "void", "yield", "throw", "new", "case"]);
}]);
var last_564 = function last_564(p_606) {
  return p_606.last();
};
var safeLast_565 = R.pipe(R.cond([[isEmpty_548, R.always(Nothing_527())], [R.T, R.compose(_ramdaFantasy.Maybe.of, last_564)]]));
var stuffTrue_566 = R.curry(function (p_607, b_608) {
  return b_608 ? Just_526(p_607) : Nothing_527();
});
var stuffFalse_567 = R.curry(function (p_609, b_610) {
  return !b_610 ? Just_526(p_609) : Nothing_527();
});
var isTopColon_568 = R.pipe(safeLast_565, R.map(isColon_559), _ramdaFantasy.Maybe.maybe(false, R.identity));
var isTopPunctuator_569 = R.pipe(safeLast_565, R.map(isPunctuator_549), _ramdaFantasy.Maybe.maybe(false, R.identity));
var isExprReturn_570 = R.curry(function (l_611, p_612) {
  var retKwd_613 = safeLast_565(p_612);
  var maybeDot_614 = pop_581(p_612).chain(safeLast_565);
  if (maybeDot_614.map(isDot_558).getOrElse(false)) {
    return true;
  }
  return retKwd_613.map(function (s_615) {
    return s_615.isKeyword() && s_615.val() === "return" && s_615.lineNumber() === l_611;
  }).getOrElse(false);
});
var isTopOperator_571 = R.pipe(safeLast_565, R.map(isOperator_561), _ramdaFantasy.Maybe.maybe(false, R.identity));
var isTopKeywordExprPrefix_572 = R.pipe(safeLast_565, R.map(isKeywordExprPrefix_563), _ramdaFantasy.Maybe.maybe(false, R.identity));
var isExprPrefix_573 = R.curry(function (l_616, b_617) {
  return R.cond([[isEmpty_548, R.always(b_617)], [isTopColon_568, R.always(b_617)], [isTopKeywordExprPrefix_572, R.T], [isTopOperator_571, R.T], [isTopPunctuator_569, R.always(b_617)], [isExprReturn_570(l_616), R.T], [R.T, R.F]]);
});
var curly_574 = function curly_574(p_618) {
  return safeLast_565(p_618).map(isBraces_553).chain(stuffTrue_566(p_618));
};
var paren_575 = function paren_575(p_619) {
  return safeLast_565(p_619).map(isParens_552).chain(stuffTrue_566(p_619));
};
var func_576 = function func_576(p_620) {
  return safeLast_565(p_620).map(isFunctionKeyword_560).chain(stuffTrue_566(p_620));
};
var ident_577 = function ident_577(p_621) {
  return safeLast_565(p_621).map(isIdentifier_555).chain(stuffTrue_566(p_621));
};
var nonLiteralKeyword_578 = function nonLiteralKeyword_578(p_622) {
  return safeLast_565(p_622).map(isNonLiteralKeyword_562).chain(stuffTrue_566(p_622));
};
var opt_579 = R.curry(function (a_623, b_624, p_625) {
  var result_626 = R.pipeK(a_623, b_624)(_ramdaFantasy.Maybe.of(p_625));
  return _ramdaFantasy.Maybe.isJust(result_626) ? result_626 : _ramdaFantasy.Maybe.of(p_625);
});
var notDot_580 = R.ifElse(R.whereEq({ size: 0 }), Just_526, function (p_627) {
  return safeLast_565(p_627).map(function (s_628) {
    return !(s_628.isPunctuator() && s_628.val() === ".");
  }).chain(stuffTrue_566(p_627));
});
var pop_581 = R.compose(Just_526, function (p_629) {
  return p_629.pop();
});
var functionPrefix_582 = R.pipeK(curly_574, pop_581, paren_575, pop_581, opt_579(ident_577, pop_581), func_576);
var isRegexPrefix_583 = function isRegexPrefix_583(b_630) {
  return R.anyPass([isEmpty_548, isTopPunctuator_569, R.pipe(_ramdaFantasy.Maybe.of, R.pipeK(nonLiteralKeyword_578, pop_581, notDot_580), _ramdaFantasy.Maybe.isJust), R.pipe(_ramdaFantasy.Maybe.of, R.pipeK(paren_575, pop_581, nonLiteralKeyword_578, pop_581, notDot_580), _ramdaFantasy.Maybe.isJust), R.pipe(_ramdaFantasy.Maybe.of, functionPrefix_582, R.chain(function (p_631) {
    return safeLast_565(p_631).map(function (s_632) {
      return s_632.lineNumber();
    }).chain(function (fnLine_633) {
      return pop_581(p_631).map(isExprPrefix_573(fnLine_633, b_630));
    }).chain(stuffFalse_567(p_631));
  }), _ramdaFantasy.Maybe.isJust), function (p_634) {
    var isCurly_635 = _ramdaFantasy.Maybe.isJust(safeLast_565(p_634).map(isBraces_553));
    var alreadyCheckedFunction_636 = R.pipe(_ramdaFantasy.Maybe.of, functionPrefix_582, _ramdaFantasy.Maybe.isJust)(p_634);
    if (alreadyCheckedFunction_636) {
      return false;
    }
    return R.pipe(_ramdaFantasy.Maybe.of, R.chain(curly_574), R.chain(function (p_637) {
      return safeLast_565(p_637).map(function (s_638) {
        return s_638.lineNumber();
      }).chain(function (curlyLine_639) {
        return pop_581(p_637).map(isExprPrefix_573(curlyLine_639, b_630));
      }).chain(stuffFalse_567(p_637));
    }), _ramdaFantasy.Maybe.isJust)(p_634);
  }]);
};
function lastEl_584(l_640) {
  return l_640[l_640.length - 1];
}

var Reader = function (_Tokenizer) {
  _inherits(Reader, _Tokenizer);

  function Reader(strings_641, context_642, replacements_643) {
    _classCallCheck(this, Reader);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Reader).call(this, Array.isArray(strings_641) ? strings_641.join("") : strings_641));

    _this.delimStack = new Map();
    _this.insideSyntaxTemplate = [false];
    _this.context = context_642;
    if (Array.isArray(strings_641)) {
      (function () {
        var totalIndex = 0;
        _this.replacementIndex = R.reduce(function (acc_644, strRep_645) {
          acc_644.push({ index: totalIndex + strRep_645[0].length, replacement: strRep_645[1] });
          totalIndex += strRep_645[0].length;
          return acc_644;
        }, [], R.zip(strings_641, replacements_643));
      })();
    }
    return _this;
  }

  _createClass(Reader, [{
    key: "read",
    value: function read() {
      var stack_646 = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
      var b_647 = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      var singleDelimiter_648 = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      var prefix_649 = (0, _immutable.List)();
      while (true) {
        var tok = this.advance(prefix_649, b_647);
        if (tok instanceof _syntax2.default || tok instanceof _terms2.default) {
          stack_646.push(tok);
          continue;
        }
        if (Array.isArray(tok)) {
          Array.prototype.push.apply(stack_646, tok);
          continue;
        }
        if (_immutable.List.isList(tok)) {
          Array.prototype.push.apply(stack_646, tok.toArray());
          continue;
        }
        if (isEOS_538(tok)) {
          if (stack_646[0] && isLeftDelimiter_542(stack_646[0].token)) {
            throw this.createUnexpected(tok);
          }
          break;
        }
        if (isLeftDelimiter_542(tok)) {
          if (isLeftSyntax_540(tok)) {
            this.insideSyntaxTemplate.push(true);
          }
          var line = tok.slice.startLocation.line;
          var innerB = isLeftBrace_533(tok) ? isExprPrefix_573(line, b_647)(prefix_649) : true;
          var inner = this.read([new _syntax2.default(tok, this.context)], innerB, false);
          var stx = new _syntax2.default(inner, this.context);
          prefix_649 = prefix_649.concat(stx);
          stack_646.push(stx);
          if (singleDelimiter_648) {
            break;
          }
        } else if (isRightDelimiter_543(tok)) {
          if (stack_646[0] && !isMatchingDelimiters_544(stack_646[0].token, tok)) {
            throw this.createUnexpected(tok);
          }
          var _stx = new _syntax2.default(tok, this.context);
          stack_646.push(_stx);
          if (lastEl_584(this.insideSyntaxTemplate) && isRightSyntax_541(tok)) {
            this.insideSyntaxTemplate.pop();
          }
          break;
        } else {
          var _stx2 = new _syntax2.default(tok, this.context);
          prefix_649 = prefix_649.concat(_stx2);
          stack_646.push(_stx2);
        }
      }
      return (0, _immutable.List)(stack_646);
    }
  }, {
    key: "advance",
    value: function advance(prefix_650, b_651) {
      var startLocation_652 = this.getLocation();
      this.lastIndex = this.index;
      this.lastLine = this.line;
      this.lastLineStart = this.lineStart;
      this.skipComment();
      this.startIndex = this.index;
      this.startLine = this.line;
      this.startLineStart = this.lineStart;
      if (this.replacementIndex && this.replacementIndex[0] && this.index >= this.replacementIndex[0].index) {
        var rep = this.replacementIndex[0].replacement;
        this.replacementIndex.shift();
        return rep;
      }
      var charCode_653 = this.source.charCodeAt(this.index);
      if (charCode_653 === 96) {
        var element = void 0,
            items = [];
        var _startLocation_ = this.getLocation();
        var start = this.index;
        this.index++;
        if (lastEl_584(this.insideSyntaxTemplate)) {
          var slice = this.getSlice(start, _startLocation_);
          return { type: RSYNTAX_529, value: "`", slice: slice };
        }
        do {
          element = this.scanTemplateElement();
          items.push(element);
          if (element.interp) {
            element = this.read([], false, true);
            (0, _errors.assert)(element.size === 1, "should only have read a single delimiter inside a template");
            items.push(element.get(0));
          }
        } while (!element.tail);
        return { type: _tokenizer.TokenType.TEMPLATE, items: (0, _immutable.List)(items) };
      } else if (charCode_653 === 35) {
        var _startLocation_2 = this.getLocation();
        var _start = this.index;
        var _slice = this.getSlice(_start, _startLocation_2);
        this.index++;
        if (this.source.charCodeAt(this.index) === 96) {
          this.index++;
          return { type: LSYNTAX_528, value: "#`", slice: _slice };
        }
        return { type: _tokenizer.TokenType.IDENTIFIER, value: "#", slice: _slice };
      } else if (charCode_653 === 64) {
        var _startLocation_3 = this.getLocation();
        var _start2 = this.index;
        var _slice2 = this.getSlice(_start2, _startLocation_3);
        this.index++;
        return { type: AT_530, value: "@", slice: _slice2 };
      }
      var lookahead_654 = _get(Object.getPrototypeOf(Reader.prototype), "advance", this).call(this);
      if (lookahead_654.type === _tokenizer.TokenType.DIV && isRegexPrefix_583(b_651)(prefix_650)) {
        return _get(Object.getPrototypeOf(Reader.prototype), "scanRegExp", this).call(this, "/");
      }
      return lookahead_654;
    }
  }, {
    key: "scanTemplateElement",
    value: function scanTemplateElement() {
      var startLocation_655 = this.getLocation();
      var start_656 = this.index;
      while (this.index < this.source.length) {
        var ch = this.source.charCodeAt(this.index);
        switch (ch) {
          case 96:
            var slice = this.getSlice(start_656, startLocation_655);
            this.index++;
            return { type: _tokenizer.TokenType.TEMPLATE, tail: true, interp: false, slice: slice };
          case 36:
            if (this.source.charCodeAt(this.index + 1) === 123) {
              var _slice3 = this.getSlice(start_656, startLocation_655);
              this.index += 1;
              return { type: _tokenizer.TokenType.TEMPLATE, tail: false, interp: true, slice: _slice3 };
            }
            this.index++;
            break;
          case 92:
            {
              var octal = this.scanStringEscape("", null)[1];
              if (octal != null) {
                throw this.createILLEGAL();
              }
              break;
            }
          default:
            this.index++;
        }
      }
      throw this.createILLEGAL();
    }
  }]);

  return Reader;
}(_tokenizer2.default);

exports.default = Reader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3N3ZWV0L3NoaWZ0LXJlYWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFFQTs7QUFDQTs7OztBQUNBOztJQUFhLEM7O0FBQ2I7O0FBQ0E7O0FBR0E7Ozs7Ozs7Ozs7Ozs7O0FBRkEsSUFBTSxXQUFXLG9CQUFNLElBQXZCO0FBQ0EsSUFBTSxjQUFjLG9CQUFNLE9BQTFCOztBQUVBLElBQU0sY0FBYyxFQUFDLE1BQU0sYUFBUCxFQUFwQjtBQUNBLElBQU0sY0FBYyxFQUFDLE1BQU0sY0FBUCxFQUFwQjtBQUNBLElBQU0sU0FBUyxFQUFDLE9BQU8sc0JBQVcsVUFBbkIsRUFBK0IsTUFBTSxHQUFyQyxFQUFmO0FBQ0EsSUFBTSxzQkFBc0IsQ0FBQyxNQUFELEVBQVMsTUFBVCxFQUFpQixNQUFqQixFQUF5QixPQUF6QixDQUE1QjtBQUNBLElBQU0sb0JBQW9CLEVBQUUsT0FBRixDQUFVLEVBQUMsTUFBTSxxQkFBVSxNQUFqQixFQUFWLENBQTFCO0FBQ0EsSUFBTSxrQkFBa0IsRUFBRSxPQUFGLENBQVUsRUFBQyxNQUFNLHFCQUFVLE1BQWpCLEVBQVYsQ0FBeEI7QUFDQSxJQUFNLGtCQUFrQixFQUFFLE9BQUYsQ0FBVSxFQUFDLE1BQU0scUJBQVUsTUFBakIsRUFBVixDQUF4QjtBQUNBLElBQU0scUJBQXFCLEVBQUUsT0FBRixDQUFVLEVBQUMsTUFBTSxxQkFBVSxNQUFqQixFQUFWLENBQTNCO0FBQ0EsSUFBTSxtQkFBbUIsRUFBRSxPQUFGLENBQVUsRUFBQyxNQUFNLHFCQUFVLE1BQWpCLEVBQVYsQ0FBekI7QUFDQSxJQUFNLG1CQUFtQixFQUFFLE9BQUYsQ0FBVSxFQUFDLE1BQU0scUJBQVUsTUFBakIsRUFBVixDQUF6QjtBQUNBLElBQU0sWUFBWSxFQUFFLE9BQUYsQ0FBVSxFQUFDLE1BQU0scUJBQVUsR0FBakIsRUFBVixDQUFsQjtBQUNBLElBQU0sYUFBYSxFQUFFLE9BQUYsQ0FBVSxFQUFDLE1BQU0scUJB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S0FBSyxNQUFMLENBQVksVUFBWixDQUF1QixLQUFLLEtBQTVCLENBQVQ7QUFDQSxnQkFBUSxFQUFSO0FBQ0UsZUFBSyxFQUFMO0FBQ0UsZ0JBQUksUUFBUSxLQUFLLFFBQUwsQ0FBYyxTQUFkLEVBQXlCLGlCQUF6QixDQUFaO0FBQ0EsaUJBQUssS0FBTDtBQUNBLG1CQUFPLEVBQUMsTUFBTSxxQkFBVSxRQUFqQixFQUEyQixNQUFNLElBQWpDLEVBQXVDLFFBQVEsS0FBL0MsRUFBc0QsT0FBTyxLQUE3RCxFQUFQO0FBQ0YsZUFBSyxFQUFMO0FBQ0UsZ0JBQUksS0FBSyxNQUFMLENBQVksVUFBWixDQUF1QixLQUFLLEtBQUwsR0FBYSxDQUFwQyxNQUEyQyxHQUEvQyxFQUFvRDtBQUNsRCxrQkFBSSxVQUFRLEtBQUssUUFBTCxDQUFjLFNBQWQsRUFBeUIsaUJBQXpCLENBQVo7QUFDQSxtQkFBSyxLQUFMLElBQWMsQ0FBZDtBQUNBLHFCQUFPLEVBQUMsTUFBTSxxQkFBVSxRQUFqQixFQUEyQixNQUFNLEtBQWpDLEVBQXdDLFFBQVEsSUFBaEQsRUFBc0QsT0FBTyxPQUE3RCxFQUFQO0FBQ0Q7QUFDRCxpQkFBSyxLQUFMO0FBQ0E7QUFDRixlQUFLLEVBQUw7QUFDRTtBQUNFLGtCQUFJLFFBQVEsS0FBSyxnQkFBTCxDQUFzQixFQUF0QixFQUEwQixJQUExQixFQUFnQyxDQUFoQyxDQUFaO0FBQ0Esa0JBQUksU0FBUyxJQUFiLEVBQW1CO0FBQ2pCLHNCQUFNLEtBQUssYUFBTCxFQUFOO0FBQ0Q7QUFDRDtBQUNEO0FBQ0g7QUFDRSxpQkFBSyxLQUFMO0FBdEJKO0FBd0JEO0FBQ0QsWUFBTSxLQUFLLGFBQUwsRUFBTjtBQUNEOzs7Ozs7a0JBNUprQixNIiwiZmlsZSI6InNoaWZ0LXJlYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUb2tlbml6ZXIgZnJvbSBcInNoaWZ0LXBhcnNlci9kaXN0L3Rva2VuaXplclwiO1xuaW1wb3J0IHtUb2tlbkNsYXNzLCBUb2tlblR5cGV9IGZyb20gXCJzaGlmdC1wYXJzZXIvZGlzdC90b2tlbml6ZXJcIjtcbmltcG9ydCB7TGlzdH0gZnJvbSBcImltbXV0YWJsZVwiO1xuaW1wb3J0IFN5bnRheCBmcm9tIFwiLi9zeW50YXhcIjtcbmltcG9ydCAgKiBhcyBSIGZyb20gXCJyYW1kYVwiO1xuaW1wb3J0IHtNYXliZX0gZnJvbSBcInJhbWRhLWZhbnRhc3lcIjtcbmltcG9ydCB7YXNzZXJ0fSBmcm9tIFwiLi9lcnJvcnNcIjtcbmNvbnN0IEp1c3RfNTI2ID0gTWF5YmUuSnVzdDtcbmNvbnN0IE5vdGhpbmdfNTI3ID0gTWF5YmUuTm90aGluZztcbmltcG9ydCBUZXJtIGZyb20gXCIuL3Rlcm1zXCI7XG5jb25zdCBMU1lOVEFYXzUyOCA9IHtuYW1lOiBcImxlZnQtc3ludGF4XCJ9O1xuY29uc3QgUlNZTlRBWF81MjkgPSB7bmFtZTogXCJyaWdodC1zeW50YXhcIn07XG5jb25zdCBBVF81MzAgPSB7a2xhc3M6IFRva2VuQ2xhc3MuUHVuY3R1YXRvciwgbmFtZTogXCJAXCJ9O1xuY29uc3QgbGl0ZXJhbEtleXdvcmRzXzUzMSA9IFtcInRoaXNcIiwgXCJudWxsXCIsIFwidHJ1ZVwiLCBcImZhbHNlXCJdO1xuY29uc3QgaXNMZWZ0QnJhY2tldF81MzIgPSBSLndoZXJlRXEoe3R5cGU6IFRva2VuVHlwZS5MQlJBQ0t9KTtcbmNvbnN0IGlzTGVmdEJyYWNlXzUzMyA9IFIud2hlcmVFcSh7dHlwZTogVG9rZW5UeXBlLkxCUkFDRX0pO1xuY29uc3QgaXNMZWZ0UGFyZW5fNTM0ID0gUi53aGVyZUVxKHt0eXBlOiBUb2tlblR5cGUuTFBBUkVOfSk7XG5jb25zdCBpc1JpZ2h0QnJhY2tldF81MzUgPSBSLndoZXJlRXEoe3R5cGU6IFRva2VuVHlwZS5SQlJBQ0t9KTtcbmNvbnN0IGlzUmlnaHRCcmFjZV81MzYgPSBSLndoZXJlRXEoe3R5cGU6IFRva2VuVHlwZS5SQlJBQ0V9KTtcbmNvbnN0IGlzUmlnaHRQYXJlbl81MzcgPSBSLndoZXJlRXEoe3R5cGU6IFRva2VuVHlwZS5SUEFSRU59KTtcbmNvbnN0IGlzRU9TXzUzOCA9IFIud2hlcmVFcSh7dHlwZTogVG9rZW5UeXBlLkVPU30pO1xuY29uc3QgaXNIYXNoXzUzOSA9IFIud2hlcmVFcSh7dHlwZTogVG9rZW5UeXBlLklERU5USUZJRVIsIHZhbHVlOiBcIiNcIn0pO1xuY29uc3QgaXNMZWZ0U3ludGF4XzU0MCA9IFIud2hlcmVFcSh7dHlwZTogTFNZTlRBWF81Mjh9KTtcbmNvbnN0IGlzUmlnaHRTeW50YXhfNTQxID0gUi53aGVyZUVxKHt0eXBlOiBSU1lOVEFYXzUyOX0pO1xuY29uc3QgaXNMZWZ0RGVsaW1pdGVyXzU0MiA9IFIuYW55UGFzcyhbaXNMZWZ0QnJhY2tldF81MzIsIGlzTGVmdEJyYWNlXzUzMywgaXNMZWZ0UGFyZW5fNTM0LCBpc0xlZnRTeW50YXhfNTQwXSk7XG5jb25zdCBpc1JpZ2h0RGVsaW1pdGVyXzU0MyA9IFIuYW55UGFzcyhbaXNSaWdodEJyYWNrZXRfNTM1LCBpc1JpZ2h0QnJhY2VfNTM2LCBpc1JpZ2h0UGFyZW5fNTM3LCBpc1JpZ2h0U3ludGF4XzU0MV0pO1xuY29uc3QgaXNNYXRjaGluZ0RlbGltaXRlcnNfNTQ0ID0gUi5jb25kKFtbaXNMZWZ0QnJhY2tldF81MzIsIChfXzU4NSwgYl81ODYpID0+IGlzUmlnaHRCcmFja2V0XzUzNShiXzU4NildLCBbaXNMZWZ0QnJhY2VfNTMzLCAoX181ODcsIGJfNTg4KSA9PiBpc1JpZ2h0QnJhY2VfNTM2KGJfNTg4KV0sIFtpc0xlZnRQYXJlbl81MzQsIChfXzU4OSwgYl81OTApID0+IGlzUmlnaHRQYXJlbl81MzcoYl81OTApXSwgW2lzTGVmdFN5bnRheF81NDAsIChfXzU5MSwgYl81OTIpID0+IGlzUmlnaHRTeW50YXhfNTQxKGJfNTkyKV0sIFtSLlQsIFIuRl1dKTtcbmNvbnN0IGFzc2lnbk9wc181NDUgPSBbXCI9XCIsIFwiKz1cIiwgXCItPVwiLCBcIio9XCIsIFwiLz1cIiwgXCIlPVwiLCBcIjw8PVwiLCBcIj4+PVwiLCBcIj4+Pj1cIiwgXCImPVwiLCBcInw9XCIsIFwiXj1cIiwgXCIsXCJdO1xuY29uc3QgYmluYXJ5T3BzXzU0NiA9IFtcIitcIiwgXCItXCIsIFwiKlwiLCBcIi9cIiwgXCIlXCIsIFwiPDxcIiwgXCI+PlwiLCBcIj4+PlwiLCBcIiZcIiwgXCJ8XCIsIFwiXlwiLCBcIiYmXCIsIFwifHxcIiwgXCI/XCIsIFwiOlwiLCBcIj09PVwiLCBcIj09XCIsIFwiPj1cIiwgXCI8PVwiLCBcIjxcIiwgXCI+XCIsIFwiIT1cIiwgXCIhPT1cIiwgXCJpbnN0YW5jZW9mXCJdO1xuY29uc3QgdW5hcnlPcHNfNTQ3ID0gW1wiKytcIiwgXCItLVwiLCBcIn5cIiwgXCIhXCIsIFwiZGVsZXRlXCIsIFwidm9pZFwiLCBcInR5cGVvZlwiLCBcInlpZWxkXCIsIFwidGhyb3dcIiwgXCJuZXdcIl07XG5jb25zdCBpc0VtcHR5XzU0OCA9IFIud2hlcmVFcSh7c2l6ZTogMH0pO1xuY29uc3QgaXNQdW5jdHVhdG9yXzU0OSA9IHNfNTkzID0+IHNfNTkzLmlzUHVuY3R1YXRvcigpO1xuY29uc3QgaXNLZXl3b3JkXzU1MCA9IHNfNTk0ID0+IHNfNTk0LmlzS2V5d29yZCgpO1xuY29uc3QgaXNEZWxpbWl0ZXJfNTUxID0gc181OTUgPT4gc181OTUuaXNEZWxpbWl0ZXIoKTtcbmNvbnN0IGlzUGFyZW5zXzU1MiA9IHNfNTk2ID0+IHNfNTk2LmlzUGFyZW5zKCk7XG5jb25zdCBpc0JyYWNlc181NTMgPSBzXzU5NyA9PiBzXzU5Ny5pc0JyYWNlcygpO1xuY29uc3QgaXNCcmFja2V0c181NTQgPSBzXzU5OCA9PiBzXzU5OC5pc0JyYWNrZXRzKCk7XG5jb25zdCBpc0lkZW50aWZpZXJfNTU1ID0gc181OTkgPT4gc181OTkuaXNJZGVudGlmaWVyKCk7XG5jb25zdCB2YWxfNTU2ID0gc182MDAgPT4gc182MDAudmFsKCk7XG5jb25zdCBpc1ZhbF81NTcgPSBSLmN1cnJ5KCh2XzYwMSwgc182MDIpID0+IHNfNjAyLnZhbCgpID09PSB2XzYwMSk7XG5jb25zdCBpc0RvdF81NTggPSBSLmFsbFBhc3MoW2lzUHVuY3R1YXRvcl81NDksIGlzVmFsXzU1NyhcIi5cIildKTtcbmNvbnN0IGlzQ29sb25fNTU5ID0gUi5hbGxQYXNzKFtpc1B1bmN0dWF0b3JfNTQ5LCBpc1ZhbF81NTcoXCI6XCIpXSk7XG5jb25zdCBpc0Z1bmN0aW9uS2V5d29yZF81NjAgPSBSLmFsbFBhc3MoW2lzS2V5d29yZF81NTAsIGlzVmFsXzU1NyhcImZ1bmN0aW9uXCIpXSk7XG5jb25zdCBpc09wZXJhdG9yXzU2MSA9IHNfNjAzID0+IChzXzYwMy5pc1B1bmN0dWF0b3IoKSB8fCBzXzYwMy5pc0tleXdvcmQoKSkgJiYgUi5hbnkoUi5lcXVhbHMoc182MDMudmFsKCkpLCBhc3NpZ25PcHNfNTQ1LmNvbmNhdChiaW5hcnlPcHNfNTQ2KS5jb25jYXQodW5hcnlPcHNfNTQ3KSk7XG5jb25zdCBpc05vbkxpdGVyYWxLZXl3b3JkXzU2MiA9IFIuYWxsUGFzcyhbaXNLZXl3b3JkXzU1MCwgc182MDQgPT4gUi5ub25lKFIuZXF1YWxzKHNfNjA0LnZhbCgpKSwgbGl0ZXJhbEtleXdvcmRzXzUzMSldKTtcbmNvbnN0IGlzS2V5d29yZEV4cHJQcmVmaXhfNTYzID0gUi5hbGxQYXNzKFtpc0tleXdvcmRfNTUwLCBzXzYwNSA9PiBSLmFueShSLmVxdWFscyhzXzYwNS52YWwoKSksIFtcImluc3RhbmNlb2ZcIiwgXCJ0eXBlb2ZcIiwgXCJkZWxldGVcIiwgXCJ2b2lkXCIsIFwieWllbGRcIiwgXCJ0aHJvd1wiLCBcIm5ld1wiLCBcImNhc2VcIl0pXSk7XG5sZXQgbGFzdF81NjQgPSBwXzYwNiA9PiBwXzYwNi5sYXN0KCk7XG5sZXQgc2FmZUxhc3RfNTY1ID0gUi5waXBlKFIuY29uZChbW2lzRW1wdHlfNTQ4LCBSLmFsd2F5cyhOb3RoaW5nXzUyNygpKV0sIFtSLlQsIFIuY29tcG9zZShNYXliZS5vZiwgbGFzdF81NjQpXV0pKTtcbmxldCBzdHVmZlRydWVfNTY2ID0gUi5jdXJyeSgocF82MDcsIGJfNjA4KSA9PiBiXzYwOCA/IEp1c3RfNTI2KHBfNjA3KSA6IE5vdGhpbmdfNTI3KCkpO1xubGV0IHN0dWZmRmFsc2VfNTY3ID0gUi5jdXJyeSgocF82MDksIGJfNjEwKSA9PiAhYl82MTAgPyBKdXN0XzUyNihwXzYwOSkgOiBOb3RoaW5nXzUyNygpKTtcbmxldCBpc1RvcENvbG9uXzU2OCA9IFIucGlwZShzYWZlTGFzdF81NjUsIFIubWFwKGlzQ29sb25fNTU5KSwgTWF5YmUubWF5YmUoZmFsc2UsIFIuaWRlbnRpdHkpKTtcbmxldCBpc1RvcFB1bmN0dWF0b3JfNTY5ID0gUi5waXBlKHNhZmVMYXN0XzU2NSwgUi5tYXAoaXNQdW5jdHVhdG9yXzU0OSksIE1heWJlLm1heWJlKGZhbHNlLCBSLmlkZW50aXR5KSk7XG5sZXQgaXNFeHByUmV0dXJuXzU3MCA9IFIuY3VycnkoKGxfNjExLCBwXzYxMikgPT4ge1xuICBsZXQgcmV0S3dkXzYxMyA9IHNhZmVMYXN0XzU2NShwXzYxMik7XG4gIGxldCBtYXliZURvdF82MTQgPSBwb3BfNTgxKHBfNjEyKS5jaGFpbihzYWZlTGFzdF81NjUpO1xuICBpZiAobWF5YmVEb3RfNjE0Lm1hcChpc0RvdF81NTgpLmdldE9yRWxzZShmYWxzZSkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gcmV0S3dkXzYxMy5tYXAoc182MTUgPT4ge1xuICAgIHJldHVybiBzXzYxNS5pc0tleXdvcmQoKSAmJiBzXzYxNS52YWwoKSA9PT0gXCJyZXR1cm5cIiAmJiBzXzYxNS5saW5lTnVtYmVyKCkgPT09IGxfNjExO1xuICB9KS5nZXRPckVsc2UoZmFsc2UpO1xufSk7XG5jb25zdCBpc1RvcE9wZXJhdG9yXzU3MSA9IFIucGlwZShzYWZlTGFzdF81NjUsIFIubWFwKGlzT3BlcmF0b3JfNTYxKSwgTWF5YmUubWF5YmUoZmFsc2UsIFIuaWRlbnRpdHkpKTtcbmNvbnN0IGlzVG9wS2V5d29yZEV4cHJQcmVmaXhfNTcyID0gUi5waXBlKHNhZmVMYXN0XzU2NSwgUi5tYXAoaXNLZXl3b3JkRXhwclByZWZpeF81NjMpLCBNYXliZS5tYXliZShmYWxzZSwgUi5pZGVudGl0eSkpO1xubGV0IGlzRXhwclByZWZpeF81NzMgPSBSLmN1cnJ5KChsXzYxNiwgYl82MTcpID0+IFIuY29uZChbW2lzRW1wdHlfNTQ4LCBSLmFsd2F5cyhiXzYxNyldLCBbaXNUb3BDb2xvbl81NjgsIFIuYWx3YXlzKGJfNjE3KV0sIFtpc1RvcEtleXdvcmRFeHByUHJlZml4XzU3MiwgUi5UXSwgW2lzVG9wT3BlcmF0b3JfNTcxLCBSLlRdLCBbaXNUb3BQdW5jdHVhdG9yXzU2OSwgUi5hbHdheXMoYl82MTcpXSwgW2lzRXhwclJldHVybl81NzAobF82MTYpLCBSLlRdLCBbUi5ULCBSLkZdXSkpO1xubGV0IGN1cmx5XzU3NCA9IHBfNjE4ID0+IHNhZmVMYXN0XzU2NShwXzYxOCkubWFwKGlzQnJhY2VzXzU1MykuY2hhaW4oc3R1ZmZUcnVlXzU2NihwXzYxOCkpO1xubGV0IHBhcmVuXzU3NSA9IHBfNjE5ID0+IHNhZmVMYXN0XzU2NShwXzYxOSkubWFwKGlzUGFyZW5zXzU1MikuY2hhaW4oc3R1ZmZUcnVlXzU2NihwXzYxOSkpO1xubGV0IGZ1bmNfNTc2ID0gcF82MjAgPT4gc2FmZUxhc3RfNTY1KHBfNjIwKS5tYXAoaXNGdW5jdGlvbktleXdvcmRfNTYwKS5jaGFpbihzdHVmZlRydWVfNTY2KHBfNjIwKSk7XG5sZXQgaWRlbnRfNTc3ID0gcF82MjEgPT4gc2FmZUxhc3RfNTY1KHBfNjIxKS5tYXAoaXNJZGVudGlmaWVyXzU1NSkuY2hhaW4oc3R1ZmZUcnVlXzU2NihwXzYyMSkpO1xubGV0IG5vbkxpdGVyYWxLZXl3b3JkXzU3OCA9IHBfNjIyID0+IHNhZmVMYXN0XzU2NShwXzYyMikubWFwKGlzTm9uTGl0ZXJhbEtleXdvcmRfNTYyKS5jaGFpbihzdHVmZlRydWVfNTY2KHBfNjIyKSk7XG5sZXQgb3B0XzU3OSA9IFIuY3VycnkoKGFfNjIzLCBiXzYyNCwgcF82MjUpID0+IHtcbiAgbGV0IHJlc3VsdF82MjYgPSBSLnBpcGVLKGFfNjIzLCBiXzYyNCkoTWF5YmUub2YocF82MjUpKTtcbiAgcmV0dXJuIE1heWJlLmlzSnVzdChyZXN1bHRfNjI2KSA/IHJlc3VsdF82MjYgOiBNYXliZS5vZihwXzYyNSk7XG59KTtcbmxldCBub3REb3RfNTgwID0gUi5pZkVsc2UoUi53aGVyZUVxKHtzaXplOiAwfSksIEp1c3RfNTI2LCBwXzYyNyA9PiBzYWZlTGFzdF81NjUocF82MjcpLm1hcChzXzYyOCA9PiAhKHNfNjI4LmlzUHVuY3R1YXRvcigpICYmIHNfNjI4LnZhbCgpID09PSBcIi5cIikpLmNoYWluKHN0dWZmVHJ1ZV81NjYocF82MjcpKSk7XG5sZXQgcG9wXzU4MSA9IFIuY29tcG9zZShKdXN0XzUyNiwgcF82MjkgPT4gcF82MjkucG9wKCkpO1xuY29uc3QgZnVuY3Rpb25QcmVmaXhfNTgyID0gUi5waXBlSyhjdXJseV81NzQsIHBvcF81ODEsIHBhcmVuXzU3NSwgcG9wXzU4MSwgb3B0XzU3OShpZGVudF81NzcsIHBvcF81ODEpLCBmdW5jXzU3Nik7XG5jb25zdCBpc1JlZ2V4UHJlZml4XzU4MyA9IGJfNjMwID0+IFIuYW55UGFzcyhbaXNFbXB0eV81NDgsIGlzVG9wUHVuY3R1YXRvcl81NjksIFIucGlwZShNYXliZS5vZiwgUi5waXBlSyhub25MaXRlcmFsS2V5d29yZF81NzgsIHBvcF81ODEsIG5vdERvdF81ODApLCBNYXliZS5pc0p1c3QpLCBSLnBpcGUoTWF5YmUub2YsIFIucGlwZUsocGFyZW5fNTc1LCBwb3BfNTgxLCBub25MaXRlcmFsS2V5d29yZF81NzgsIHBvcF81ODEsIG5vdERvdF81ODApLCBNYXliZS5pc0p1c3QpLCBSLnBpcGUoTWF5YmUub2YsIGZ1bmN0aW9uUHJlZml4XzU4MiwgUi5jaGFpbihwXzYzMSA9PiB7XG4gIHJldHVybiBzYWZlTGFzdF81NjUocF82MzEpLm1hcChzXzYzMiA9PiBzXzYzMi5saW5lTnVtYmVyKCkpLmNoYWluKGZuTGluZV82MzMgPT4ge1xuICAgIHJldHVybiBwb3BfNTgxKHBfNjMxKS5tYXAoaXNFeHByUHJlZml4XzU3MyhmbkxpbmVfNjMzLCBiXzYzMCkpO1xuICB9KS5jaGFpbihzdHVmZkZhbHNlXzU2NyhwXzYzMSkpO1xufSksIE1heWJlLmlzSnVzdCksIHBfNjM0ID0+IHtcbiAgbGV0IGlzQ3VybHlfNjM1ID0gTWF5YmUuaXNKdXN0KHNhZmVMYXN0XzU2NShwXzYzNCkubWFwKGlzQnJhY2VzXzU1MykpO1xuICBsZXQgYWxyZWFkeUNoZWNrZWRGdW5jdGlvbl82MzYgPSBSLnBpcGUoTWF5YmUub2YsIGZ1bmN0aW9uUHJlZml4XzU4MiwgTWF5YmUuaXNKdXN0KShwXzYzNCk7XG4gIGlmIChhbHJlYWR5Q2hlY2tlZEZ1bmN0aW9uXzYzNikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gUi5waXBlKE1heWJlLm9mLCBSLmNoYWluKGN1cmx5XzU3NCksIFIuY2hhaW4ocF82MzcgPT4ge1xuICAgIHJldHVybiBzYWZlTGFzdF81NjUocF82MzcpLm1hcChzXzYzOCA9PiBzXzYzOC5saW5lTnVtYmVyKCkpLmNoYWluKGN1cmx5TGluZV82MzkgPT4ge1xuICAgICAgcmV0dXJuIHBvcF81ODEocF82MzcpLm1hcChpc0V4cHJQcmVmaXhfNTczKGN1cmx5TGluZV82MzksIGJfNjMwKSk7XG4gICAgfSkuY2hhaW4oc3R1ZmZGYWxzZV81NjcocF82MzcpKTtcbiAgfSksIE1heWJlLmlzSnVzdCkocF82MzQpO1xufV0pO1xuZnVuY3Rpb24gbGFzdEVsXzU4NChsXzY0MCkge1xuICByZXR1cm4gbF82NDBbbF82NDAubGVuZ3RoIC0gMV07XG59XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWFkZXIgZXh0ZW5kcyBUb2tlbml6ZXIge1xuICBjb25zdHJ1Y3RvcihzdHJpbmdzXzY0MSwgY29udGV4dF82NDIsIHJlcGxhY2VtZW50c182NDMpIHtcbiAgICBzdXBlcihBcnJheS5pc0FycmF5KHN0cmluZ3NfNjQxKSA/IHN0cmluZ3NfNjQxLmpvaW4oXCJcIikgOiBzdHJpbmdzXzY0MSk7XG4gICAgdGhpcy5kZWxpbVN0YWNrID0gbmV3IE1hcDtcbiAgICB0aGlzLmluc2lkZVN5bnRheFRlbXBsYXRlID0gW2ZhbHNlXTtcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0XzY0MjtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzdHJpbmdzXzY0MSkpIHtcbiAgICAgIGxldCB0b3RhbEluZGV4ID0gMDtcbiAgICAgIHRoaXMucmVwbGFjZW1lbnRJbmRleCA9IFIucmVkdWNlKChhY2NfNjQ0LCBzdHJSZXBfNjQ1KSA9PiB7XG4gICAgICAgIGFjY182NDQucHVzaCh7aW5kZXg6IHRvdGFsSW5kZXggKyBzdHJSZXBfNjQ1WzBdLmxlbmd0aCwgcmVwbGFjZW1lbnQ6IHN0clJlcF82NDVbMV19KTtcbiAgICAgICAgdG90YWxJbmRleCArPSBzdHJSZXBfNjQ1WzBdLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIGFjY182NDQ7XG4gICAgICB9LCBbXSwgUi56aXAoc3RyaW5nc182NDEsIHJlcGxhY2VtZW50c182NDMpKTtcbiAgICB9XG4gIH1cbiAgcmVhZChzdGFja182NDYgPSBbXSwgYl82NDcgPSBmYWxzZSwgc2luZ2xlRGVsaW1pdGVyXzY0OCA9IGZhbHNlKSB7XG4gICAgbGV0IHByZWZpeF82NDkgPSBMaXN0KCk7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGxldCB0b2sgPSB0aGlzLmFkdmFuY2UocHJlZml4XzY0OSwgYl82NDcpO1xuICAgICAgaWYgKHRvayBpbnN0YW5jZW9mIFN5bnRheCB8fCB0b2sgaW5zdGFuY2VvZiBUZXJtKSB7XG4gICAgICAgIHN0YWNrXzY0Ni5wdXNoKHRvayk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodG9rKSkge1xuICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShzdGFja182NDYsIHRvayk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKExpc3QuaXNMaXN0KHRvaykpIHtcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoc3RhY2tfNjQ2LCB0b2sudG9BcnJheSgpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAoaXNFT1NfNTM4KHRvaykpIHtcbiAgICAgICAgaWYgKHN0YWNrXzY0NlswXSAmJiBpc0xlZnREZWxpbWl0ZXJfNTQyKHN0YWNrXzY0NlswXS50b2tlbikpIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmNyZWF0ZVVuZXhwZWN0ZWQodG9rKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChpc0xlZnREZWxpbWl0ZXJfNTQyKHRvaykpIHtcbiAgICAgICAgaWYgKGlzTGVmdFN5bnRheF81NDAodG9rKSkge1xuICAgICAgICAgIHRoaXMuaW5zaWRlU3ludGF4VGVtcGxhdGUucHVzaCh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbGluZSA9IHRvay5zbGljZS5zdGFydExvY2F0aW9uLmxpbmU7XG4gICAgICAgIGxldCBpbm5lckIgPSBpc0xlZnRCcmFjZV81MzModG9rKSA/IGlzRXhwclByZWZpeF81NzMobGluZSwgYl82NDcpKHByZWZpeF82NDkpIDogdHJ1ZTtcbiAgICAgICAgbGV0IGlubmVyID0gdGhpcy5yZWFkKFtuZXcgU3ludGF4KHRvaywgdGhpcy5jb250ZXh0KV0sIGlubmVyQiwgZmFsc2UpO1xuICAgICAgICBsZXQgc3R4ID0gbmV3IFN5bnRheChpbm5lciwgdGhpcy5jb250ZXh0KTtcbiAgICAgICAgcHJlZml4XzY0OSA9IHByZWZpeF82NDkuY29uY2F0KHN0eCk7XG4gICAgICAgIHN0YWNrXzY0Ni5wdXNoKHN0eCk7XG4gICAgICAgIGlmIChzaW5nbGVEZWxpbWl0ZXJfNjQ4KSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXNSaWdodERlbGltaXRlcl81NDModG9rKSkge1xuICAgICAgICBpZiAoc3RhY2tfNjQ2WzBdICYmICFpc01hdGNoaW5nRGVsaW1pdGVyc181NDQoc3RhY2tfNjQ2WzBdLnRva2VuLCB0b2spKSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5jcmVhdGVVbmV4cGVjdGVkKHRvayk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN0eCA9IG5ldyBTeW50YXgodG9rLCB0aGlzLmNvbnRleHQpO1xuICAgICAgICBzdGFja182NDYucHVzaChzdHgpO1xuICAgICAgICBpZiAobGFzdEVsXzU4NCh0aGlzLmluc2lkZVN5bnRheFRlbXBsYXRlKSAmJiBpc1JpZ2h0U3ludGF4XzU0MSh0b2spKSB7XG4gICAgICAgICAgdGhpcy5pbnNpZGVTeW50YXhUZW1wbGF0ZS5wb3AoKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBzdHggPSBuZXcgU3ludGF4KHRvaywgdGhpcy5jb250ZXh0KTtcbiAgICAgICAgcHJlZml4XzY0OSA9IHByZWZpeF82NDkuY29uY2F0KHN0eCk7XG4gICAgICAgIHN0YWNrXzY0Ni5wdXNoKHN0eCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBMaXN0KHN0YWNrXzY0Nik7XG4gIH1cbiAgYWR2YW5jZShwcmVmaXhfNjUwLCBiXzY1MSkge1xuICAgIGxldCBzdGFydExvY2F0aW9uXzY1MiA9IHRoaXMuZ2V0TG9jYXRpb24oKTtcbiAgICB0aGlzLmxhc3RJbmRleCA9IHRoaXMuaW5kZXg7XG4gICAgdGhpcy5sYXN0TGluZSA9IHRoaXMubGluZTtcbiAgICB0aGlzLmxhc3RMaW5lU3RhcnQgPSB0aGlzLmxpbmVTdGFydDtcbiAgICB0aGlzLnNraXBDb21tZW50KCk7XG4gICAgdGhpcy5zdGFydEluZGV4ID0gdGhpcy5pbmRleDtcbiAgICB0aGlzLnN0YXJ0TGluZSA9IHRoaXMubGluZTtcbiAgICB0aGlzLnN0YXJ0TGluZVN0YXJ0ID0gdGhpcy5saW5lU3RhcnQ7XG4gICAgaWYgKHRoaXMucmVwbGFjZW1lbnRJbmRleCAmJiB0aGlzLnJlcGxhY2VtZW50SW5kZXhbMF0gJiYgdGhpcy5pbmRleCA+PSB0aGlzLnJlcGxhY2VtZW50SW5kZXhbMF0uaW5kZXgpIHtcbiAgICAgIGxldCByZXAgPSB0aGlzLnJlcGxhY2VtZW50SW5kZXhbMF0ucmVwbGFjZW1lbnQ7XG4gICAgICB0aGlzLnJlcGxhY2VtZW50SW5kZXguc2hpZnQoKTtcbiAgICAgIHJldHVybiByZXA7XG4gICAgfVxuICAgIGxldCBjaGFyQ29kZV82NTMgPSB0aGlzLnNvdXJjZS5jaGFyQ29kZUF0KHRoaXMuaW5kZXgpO1xuICAgIGlmIChjaGFyQ29kZV82NTMgPT09IDk2KSB7XG4gICAgICBsZXQgZWxlbWVudCwgaXRlbXMgPSBbXTtcbiAgICAgIGxldCBzdGFydExvY2F0aW9uXzY1MiA9IHRoaXMuZ2V0TG9jYXRpb24oKTtcbiAgICAgIGxldCBzdGFydCA9IHRoaXMuaW5kZXg7XG4gICAgICB0aGlzLmluZGV4Kys7XG4gICAgICBpZiAobGFzdEVsXzU4NCh0aGlzLmluc2lkZVN5bnRheFRlbXBsYXRlKSkge1xuICAgICAgICBsZXQgc2xpY2UgPSB0aGlzLmdldFNsaWNlKHN0YXJ0LCBzdGFydExvY2F0aW9uXzY1Mik7XG4gICAgICAgIHJldHVybiB7dHlwZTogUlNZTlRBWF81MjksIHZhbHVlOiBcImBcIiwgc2xpY2U6IHNsaWNlfTtcbiAgICAgIH1cbiAgICAgIGRvIHtcbiAgICAgICAgZWxlbWVudCA9IHRoaXMuc2NhblRlbXBsYXRlRWxlbWVudCgpO1xuICAgICAgICBpdGVtcy5wdXNoKGVsZW1lbnQpO1xuICAgICAgICBpZiAoZWxlbWVudC5pbnRlcnApIHtcbiAgICAgICAgICBlbGVtZW50ID0gdGhpcy5yZWFkKFtdLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgYXNzZXJ0KGVsZW1lbnQuc2l6ZSA9PT0gMSwgXCJzaG91bGQgb25seSBoYXZlIHJlYWQgYSBzaW5nbGUgZGVsaW1pdGVyIGluc2lkZSBhIHRlbXBsYXRlXCIpO1xuICAgICAgICAgIGl0ZW1zLnB1c2goZWxlbWVudC5nZXQoMCkpO1xuICAgICAgICB9XG4gICAgICB9IHdoaWxlICghZWxlbWVudC50YWlsKTtcbiAgICAgIHJldHVybiB7dHlwZTogVG9rZW5UeXBlLlRFTVBMQVRFLCBpdGVtczogTGlzdChpdGVtcyl9O1xuICAgIH0gZWxzZSBpZiAoY2hhckNvZGVfNjUzID09PSAzNSkge1xuICAgICAgbGV0IHN0YXJ0TG9jYXRpb25fNjUyID0gdGhpcy5nZXRMb2NhdGlvbigpO1xuICAgICAgbGV0IHN0YXJ0ID0gdGhpcy5pbmRleDtcbiAgICAgIGxldCBzbGljZSA9IHRoaXMuZ2V0U2xpY2Uoc3RhcnQsIHN0YXJ0TG9jYXRpb25fNjUyKTtcbiAgICAgIHRoaXMuaW5kZXgrKztcbiAgICAgIGlmICh0aGlzLnNvdXJjZS5jaGFyQ29kZUF0KHRoaXMuaW5kZXgpID09PSA5Nikge1xuICAgICAgICB0aGlzLmluZGV4Kys7XG4gICAgICAgIHJldHVybiB7dHlwZTogTFNZTlRBWF81MjgsIHZhbHVlOiBcIiNgXCIsIHNsaWNlOiBzbGljZX07XG4gICAgICB9XG4gICAgICByZXR1cm4ge3R5cGU6IFRva2VuVHlwZS5JREVOVElGSUVSLCB2YWx1ZTogXCIjXCIsIHNsaWNlOiBzbGljZX07XG4gICAgfSBlbHNlIGlmIChjaGFyQ29kZV82NTMgPT09IDY0KSB7XG4gICAgICBsZXQgc3RhcnRMb2NhdGlvbl82NTIgPSB0aGlzLmdldExvY2F0aW9uKCk7XG4gICAgICBsZXQgc3RhcnQgPSB0aGlzLmluZGV4O1xuICAgICAgbGV0IHNsaWNlID0gdGhpcy5nZXRTbGljZShzdGFydCwgc3RhcnRMb2NhdGlvbl82NTIpO1xuICAgICAgdGhpcy5pbmRleCsrO1xuICAgICAgcmV0dXJuIHt0eXBlOiBBVF81MzAsIHZhbHVlOiBcIkBcIiwgc2xpY2U6IHNsaWNlfTtcbiAgICB9XG4gICAgbGV0IGxvb2thaGVhZF82NTQgPSBzdXBlci5hZHZhbmNlKCk7XG4gICAgaWYgKGxvb2thaGVhZF82NTQudHlwZSA9PT0gVG9rZW5UeXBlLkRJViAmJiBpc1JlZ2V4UHJlZml4XzU4MyhiXzY1MSkocHJlZml4XzY1MCkpIHtcbiAgICAgIHJldHVybiBzdXBlci5zY2FuUmVnRXhwKFwiL1wiKTtcbiAgICB9XG4gICAgcmV0dXJuIGxvb2thaGVhZF82NTQ7XG4gIH1cbiAgc2NhblRlbXBsYXRlRWxlbWVudCgpIHtcbiAgICBsZXQgc3RhcnRMb2NhdGlvbl82NTUgPSB0aGlzLmdldExvY2F0aW9uKCk7XG4gICAgbGV0IHN0YXJ0XzY1NiA9IHRoaXMuaW5kZXg7XG4gICAgd2hpbGUgKHRoaXMuaW5kZXggPCB0aGlzLnNvdXJjZS5sZW5ndGgpIHtcbiAgICAgIGxldCBjaCA9IHRoaXMuc291cmNlLmNoYXJDb2RlQXQodGhpcy5pbmRleCk7XG4gICAgICBzd2l0Y2ggKGNoKSB7XG4gICAgICAgIGNhc2UgOTY6XG4gICAgICAgICAgbGV0IHNsaWNlID0gdGhpcy5nZXRTbGljZShzdGFydF82NTYsIHN0YXJ0TG9jYXRpb25fNjU1KTtcbiAgICAgICAgICB0aGlzLmluZGV4Kys7XG4gICAgICAgICAgcmV0dXJuIHt0eXBlOiBUb2tlblR5cGUuVEVNUExBVEUsIHRhaWw6IHRydWUsIGludGVycDogZmFsc2UsIHNsaWNlOiBzbGljZX07XG4gICAgICAgIGNhc2UgMzY6XG4gICAgICAgICAgaWYgKHRoaXMuc291cmNlLmNoYXJDb2RlQXQodGhpcy5pbmRleCArIDEpID09PSAxMjMpIHtcbiAgICAgICAgICAgIGxldCBzbGljZSA9IHRoaXMuZ2V0U2xpY2Uoc3RhcnRfNjU2LCBzdGFydExvY2F0aW9uXzY1NSk7XG4gICAgICAgICAgICB0aGlzLmluZGV4ICs9IDE7XG4gICAgICAgICAgICByZXR1cm4ge3R5cGU6IFRva2VuVHlwZS5URU1QTEFURSwgdGFpbDogZmFsc2UsIGludGVycDogdHJ1ZSwgc2xpY2U6IHNsaWNlfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5pbmRleCsrO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDkyOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxldCBvY3RhbCA9IHRoaXMuc2NhblN0cmluZ0VzY2FwZShcIlwiLCBudWxsKVsxXTtcbiAgICAgICAgICAgIGlmIChvY3RhbCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHRocm93IHRoaXMuY3JlYXRlSUxMRUdBTCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRoaXMuaW5kZXgrKztcbiAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgdGhpcy5jcmVhdGVJTExFR0FMKCk7XG4gIH1cbn1cbiJdfQ==