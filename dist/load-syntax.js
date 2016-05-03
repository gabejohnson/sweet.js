"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sanitizeReplacementValues = sanitizeReplacementValues;
exports.evalRuntimeValues = evalRuntimeValues;
exports.evalCompiletimeValue = evalCompiletimeValue;

var _ramda = require("ramda");

var _ = _interopRequireWildcard(_ramda);

var _termExpander = require("./term-expander");

var _termExpander2 = _interopRequireDefault(_termExpander);

var _immutable = require("immutable");

var _parseReducer = require("./parse-reducer.js");

var _parseReducer2 = _interopRequireDefault(_parseReducer);

var _shiftReducer = require("shift-reducer");

var _shiftReducer2 = _interopRequireDefault(_shiftReducer);

var _serializer = require("./serializer");

var _syntax = require("./syntax");

var _syntax2 = _interopRequireDefault(_syntax);

var _shiftCodegen = require("shift-codegen");

var _shiftCodegen2 = _interopRequireDefault(_shiftCodegen);

var _shiftSpidermonkeyConverter = require("shift-spidermonkey-converter");

var _transforms = require("./transforms");

var _terms = require("./terms");

var _terms2 = _interopRequireDefault(_terms);

var _shiftReader = require("./shift-reader");

var _shiftReader2 = _interopRequireDefault(_shiftReader);

var _macroContext = require("./macro-context");

var _templateProcessor = require("./template-processor");

var _vm = require("vm");

var _vm2 = _interopRequireDefault(_vm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var geval_316 = eval;
function sanitizeReplacementValues(values_317) {
  if (Array.isArray(values_317)) {
    return sanitizeReplacementValues((0, _immutable.List)(values_317));
  } else if (_immutable.List.isList(values_317)) {
    return values_317.map(sanitizeReplacementValues);
  } else if (values_317 == null) {
    throw new Error("replacement values for syntax template must not be null or undefined");
  } else if (typeof values_317.next === "function") {
    return sanitizeReplacementValues((0, _immutable.List)(values_317));
  }
  return (0, _macroContext.unwrap)(values_317);
}
function evalRuntimeValues(terms_318, context_319) {
  var parsed_320 = (0, _shiftReducer2.default)(new _parseReducer2.default(context_319), new _terms2.default("Module", { directives: (0, _immutable.List)(), items: terms_318 }));
  parsed_320 = (0, _shiftSpidermonkeyConverter.toSpiderMonkey)(parsed_320);
  var result_321 = context_319.transform(parsed_320, { babelrc: true, filename: context_319.filename });
  var exportsObj_322 = {};
  context_319.store.set("exports", exportsObj_322);
  var val_323 = _vm2.default.runInContext(result_321.code, context_319.store.getNodeContext());
  return exportsObj_322;
}
function evalCompiletimeValue(expr_324, context_325) {
  var deserializer_326 = (0, _serializer.makeDeserializer)(context_325.bindings);
  var sandbox_327 = { syntaxQuote: function syntaxQuote(strings_334) {
      for (var _len = arguments.length, values_333 = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        values_333[_key - 1] = arguments[_key];
      }

      var ctx_335 = deserializer_326.read(_.last(values_333));
      var reader_336 = new _shiftReader2.default(strings_334, ctx_335, _.take(values_333.length - 1, values_333));
      return reader_336.read();
    }, syntaxTemplate: function syntaxTemplate(str_338) {
      for (var _len2 = arguments.length, values_337 = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        values_337[_key2 - 1] = arguments[_key2];
      }

      return (0, _templateProcessor.replaceTemplate)(deserializer_326.read(str_338), sanitizeReplacementValues(values_337));
    } };
  var sandboxKeys_328 = (0, _immutable.List)(Object.keys(sandbox_327));
  var sandboxVals_329 = sandboxKeys_328.map(function (k_339) {
    return sandbox_327[k_339];
  }).toArray();
  var parsed_330 = (0, _shiftReducer2.default)(new _parseReducer2.default(context_325), new _terms2.default("Module", { directives: (0, _immutable.List)(), items: _immutable.List.of(new _terms2.default("ExpressionStatement", { expression: new _terms2.default("FunctionExpression", { isGenerator: false, name: null, params: new _terms2.default("FormalParameters", { items: sandboxKeys_328.map(function (param_340) {
            return new _terms2.default("BindingIdentifier", { name: _syntax2.default.fromIdentifier(param_340) });
          }), rest: null }), body: new _terms2.default("FunctionBody", { directives: _immutable.List.of(new _terms2.default("Directive", { rawValue: "use strict" })), statements: _immutable.List.of(new _terms2.default("ReturnStatement", { expression: expr_324 })) }) }) })) }));
  parsed_330 = (0, _shiftSpidermonkeyConverter.toSpiderMonkey)(parsed_330);
  var result_331 = context_325.transform(parsed_330, { babelrc: true, filename: context_325.filename });
  var val_332 = _vm2.default.runInContext(result_331.code, context_325.store.getNodeContext());
  return val_332.apply(undefined, sandboxVals_329);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3N3ZWV0L2xvYWQtc3ludGF4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBZ0JnQix5QixHQUFBLHlCO1FBWUEsaUIsR0FBQSxpQjtRQVNBLG9CLEdBQUEsb0I7O0FBckNoQjs7SUFBYSxDOztBQUNiOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBQ0EsSUFBSSxZQUFZLElBQWhCO0FBQ08sU0FBUyx5QkFBVCxDQUFtQyxVQUFuQyxFQUErQztBQUNwRCxNQUFJLE1BQU0sT0FBTixDQUFjLFVBQWQsQ0FBSixFQUErQjtBQUM3QixXQUFPLDBCQUEwQixxQkFBSyxVQUFMLENBQTFCLENBQVA7QUFDRCxHQUZELE1BRU8sSUFBSSxnQkFBSyxNQUFMLENBQVksVUFBWixDQUFKLEVBQTZCO0FBQ2xDLFdBQU8sV0FBVyxHQUFYLENBQWUseUJBQWYsQ0FBUDtBQUNELEdBRk0sTUFFQSxJQUFJLGNBQWMsSUFBbEIsRUFBd0I7QUFDN0IsVUFBTSxJQUFJLEtBQUosQ0FBVSxzRUFBVixDQUFOO0FBQ0QsR0FGTSxNQUVBLElBQUksT0FBTyxXQUFXLElBQWxCLEtBQTJCLFVBQS9CLEVBQTJDO0FBQ2hELFdBQU8sMEJBQTBCLHFCQUFLLFVBQUwsQ0FBMUIsQ0FBUDtBQUNEO0FBQ0QsU0FBTywwQkFBTyxVQUFQLENBQVA7QUFDRDtBQUNNLFNBQVMsaUJBQVQsQ0FBMkIsU0FBM0IsRUFBc0MsV0FBdEMsRUFBbUQ7QUFDeEQsTUFBSSxhQUFhLDRCQUFRLDJCQUFpQixXQUFqQixDQUFSLEVBQXVDLG9CQUFTLFFBQVQsRUFBbUIsRUFBQyxZQUFZLHNCQUFiLEVBQXFCLE9BQU8sU0FBNUIsRUFBbkIsQ0FBdkMsQ0FBakI7QUFDQSxlQUFhLGdEQUFRLFVBQVIsQ0FBYjtBQUNBLE1BQUksYUFBYSxZQUFZLFNBQVosQ0FBc0IsVUFB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dGVudCI6WyJpbXBvcnQgICogYXMgXyBmcm9tIFwicmFtZGFcIjtcbmltcG9ydCBUZXJtRXhwYW5kZXIgZnJvbSBcIi4vdGVybS1leHBhbmRlclwiO1xuaW1wb3J0IHtMaXN0fSBmcm9tIFwiaW1tdXRhYmxlXCI7XG5pbXBvcnQgUGFyc2VSZWR1Y2VyIGZyb20gXCIuL3BhcnNlLXJlZHVjZXIuanNcIjtcbmltcG9ydCByZWR1Y2VyLCB7TW9ub2lkYWxSZWR1Y2VyfSBmcm9tIFwic2hpZnQtcmVkdWNlclwiO1xuaW1wb3J0IHttYWtlRGVzZXJpYWxpemVyfSBmcm9tIFwiLi9zZXJpYWxpemVyXCI7XG5pbXBvcnQgU3ludGF4IGZyb20gXCIuL3N5bnRheFwiO1xuaW1wb3J0IGNvZGVnZW4sIHtGb3JtYXR0ZWRDb2RlR2VufSBmcm9tIFwic2hpZnQtY29kZWdlblwiO1xuaW1wb3J0IHt0b1NwaWRlck1vbmtleSBhcyB0b0JhYmVsfSBmcm9tIFwic2hpZnQtc3BpZGVybW9ua2V5LWNvbnZlcnRlclwiO1xuaW1wb3J0IHtWYXJCaW5kaW5nVHJhbnNmb3JtLCBDb21waWxldGltZVRyYW5zZm9ybX0gZnJvbSBcIi4vdHJhbnNmb3Jtc1wiO1xuaW1wb3J0IFRlcm0sIHtpc0VPRiwgaXNCaW5kaW5nSWRlbnRpZmllciwgaXNGdW5jdGlvbkRlY2xhcmF0aW9uLCBpc0Z1bmN0aW9uRXhwcmVzc2lvbiwgaXNGdW5jdGlvblRlcm0sIGlzRnVuY3Rpb25XaXRoTmFtZSwgaXNTeW50YXhEZWNsYXJhdGlvbiwgaXNWYXJpYWJsZURlY2xhcmF0aW9uLCBpc1ZhcmlhYmxlRGVjbGFyYXRpb25TdGF0ZW1lbnQsIGlzSW1wb3J0LCBpc0V4cG9ydH0gZnJvbSBcIi4vdGVybXNcIjtcbmltcG9ydCBSZWFkZXIgZnJvbSBcIi4vc2hpZnQtcmVhZGVyXCI7XG5pbXBvcnQge3Vud3JhcH0gZnJvbSBcIi4vbWFjcm8tY29udGV4dFwiO1xuaW1wb3J0IHtyZXBsYWNlVGVtcGxhdGV9IGZyb20gXCIuL3RlbXBsYXRlLXByb2Nlc3NvclwiO1xuaW1wb3J0IHZtIGZyb20gXCJ2bVwiO1xubGV0IGdldmFsXzMxNiA9IGV2YWw7XG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVSZXBsYWNlbWVudFZhbHVlcyh2YWx1ZXNfMzE3KSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlc18zMTcpKSB7XG4gICAgcmV0dXJuIHNhbml0aXplUmVwbGFjZW1lbnRWYWx1ZXMoTGlzdCh2YWx1ZXNfMzE3KSk7XG4gIH0gZWxzZSBpZiAoTGlzdC5pc0xpc3QodmFsdWVzXzMxNykpIHtcbiAgICByZXR1cm4gdmFsdWVzXzMxNy5tYXAoc2FuaXRpemVSZXBsYWNlbWVudFZhbHVlcyk7XG4gIH0gZWxzZSBpZiAodmFsdWVzXzMxNyA9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwicmVwbGFjZW1lbnQgdmFsdWVzIGZvciBzeW50YXggdGVtcGxhdGUgbXVzdCBub3QgYmUgbnVsbCBvciB1bmRlZmluZWRcIik7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlc18zMTcubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgcmV0dXJuIHNhbml0aXplUmVwbGFjZW1lbnRWYWx1ZXMoTGlzdCh2YWx1ZXNfMzE3KSk7XG4gIH1cbiAgcmV0dXJuIHVud3JhcCh2YWx1ZXNfMzE3KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBldmFsUnVudGltZVZhbHVlcyh0ZXJtc18zMTgsIGNvbnRleHRfMzE5KSB7XG4gIGxldCBwYXJzZWRfMzIwID0gcmVkdWNlcihuZXcgUGFyc2VSZWR1Y2VyKGNvbnRleHRfMzE5KSwgbmV3IFRlcm0oXCJNb2R1bGVcIiwge2RpcmVjdGl2ZXM6IExpc3QoKSwgaXRlbXM6IHRlcm1zXzMxOH0pKTtcbiAgcGFyc2VkXzMyMCA9IHRvQmFiZWwocGFyc2VkXzMyMCk7XG4gIGxldCByZXN1bHRfMzIxID0gY29udGV4dF8zMTkudHJhbnNmb3JtKHBhcnNlZF8zMjAsIHtiYWJlbHJjOiB0cnVlLCBmaWxlbmFtZTogY29udGV4dF8zMTkuZmlsZW5hbWV9KTtcbiAgbGV0IGV4cG9ydHNPYmpfMzIyID0ge307XG4gIGNvbnRleHRfMzE5LnN0b3JlLnNldChcImV4cG9ydHNcIiwgZXhwb3J0c09ial8zMjIpO1xuICBsZXQgdmFsXzMyMyA9IHZtLnJ1bkluQ29udGV4dChyZXN1bHRfMzIxLmNvZGUsIGNvbnRleHRfMzE5LnN0b3JlLmdldE5vZGVDb250ZXh0KCkpO1xuICByZXR1cm4gZXhwb3J0c09ial8zMjI7XG59XG5leHBvcnQgZnVuY3Rpb24gZXZhbENvbXBpbGV0aW1lVmFsdWUoZXhwcl8zMjQsIGNvbnRleHRfMzI1KSB7XG4gIGxldCBkZXNlcmlhbGl6ZXJfMzI2ID0gbWFrZURlc2VyaWFsaXplcihjb250ZXh0XzMyNS5iaW5kaW5ncyk7XG4gIGxldCBzYW5kYm94XzMyNyA9IHtzeW50YXhRdW90ZTogZnVuY3Rpb24gKHN0cmluZ3NfMzM0LCAuLi52YWx1ZXNfMzMzKSB7XG4gICAgbGV0IGN0eF8zMzUgPSBkZXNlcmlhbGl6ZXJfMzI2LnJlYWQoXy5sYXN0KHZhbHVlc18zMzMpKTtcbiAgICBsZXQgcmVhZGVyXzMzNiA9IG5ldyBSZWFkZXIoc3RyaW5nc18zMzQsIGN0eF8zMzUsIF8udGFrZSh2YWx1ZXNfMzMzLmxlbmd0aCAtIDEsIHZhbHVlc18zMzMpKTtcbiAgICByZXR1cm4gcmVhZGVyXzMzNi5yZWFkKCk7XG4gIH0sIHN5bnRheFRlbXBsYXRlOiBmdW5jdGlvbiAoc3RyXzMzOCwgLi4udmFsdWVzXzMzNykge1xuICAgIHJldHVybiByZXBsYWNlVGVtcGxhdGUoZGVzZXJpYWxpemVyXzMyNi5yZWFkKHN0cl8zMzgpLCBzYW5pdGl6ZVJlcGxhY2VtZW50VmFsdWVzKHZhbHVlc18zMzcpKTtcbiAgfX07XG4gIGxldCBzYW5kYm94S2V5c18zMjggPSBMaXN0KE9iamVjdC5rZXlzKHNhbmRib3hfMzI3KSk7XG4gIGxldCBzYW5kYm94VmFsc18zMjkgPSBzYW5kYm94S2V5c18zMjgubWFwKGtfMzM5ID0+IHNhbmRib3hfMzI3W2tfMzM5XSkudG9BcnJheSgpO1xuICBsZXQgcGFyc2VkXzMzMCA9IHJlZHVjZXIobmV3IFBhcnNlUmVkdWNlcihjb250ZXh0XzMyNSksIG5ldyBUZXJtKFwiTW9kdWxlXCIsIHtkaXJlY3RpdmVzOiBMaXN0KCksIGl0ZW1zOiBMaXN0Lm9mKG5ldyBUZXJtKFwiRXhwcmVzc2lvblN0YXRlbWVudFwiLCB7ZXhwcmVzc2lvbjogbmV3IFRlcm0oXCJGdW5jdGlvbkV4cHJlc3Npb25cIiwge2lzR2VuZXJhdG9yOiBmYWxzZSwgbmFtZTogbnVsbCwgcGFyYW1zOiBuZXcgVGVybShcIkZvcm1hbFBhcmFtZXRlcnNcIiwge2l0ZW1zOiBzYW5kYm94S2V5c18zMjgubWFwKHBhcmFtXzM0MCA9PiB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQmluZGluZ0lkZW50aWZpZXJcIiwge25hbWU6IFN5bnRheC5mcm9tSWRlbnRpZmllcihwYXJhbV8zNDApfSk7XG4gIH0pLCByZXN0OiBudWxsfSksIGJvZHk6IG5ldyBUZXJtKFwiRnVuY3Rpb25Cb2R5XCIsIHtkaXJlY3RpdmVzOiBMaXN0Lm9mKG5ldyBUZXJtKFwiRGlyZWN0aXZlXCIsIHtyYXdWYWx1ZTogXCJ1c2Ugc3RyaWN0XCJ9KSksIHN0YXRlbWVudHM6IExpc3Qub2YobmV3IFRlcm0oXCJSZXR1cm5TdGF0ZW1lbnRcIiwge2V4cHJlc3Npb246IGV4cHJfMzI0fSkpfSl9KX0pKX0pKTtcbiAgcGFyc2VkXzMzMCA9IHRvQmFiZWwocGFyc2VkXzMzMCk7XG4gIGxldCByZXN1bHRfMzMxID0gY29udGV4dF8zMjUudHJhbnNmb3JtKHBhcnNlZF8zMzAsIHtiYWJlbHJjOiB0cnVlLCBmaWxlbmFtZTogY29udGV4dF8zMjUuZmlsZW5hbWV9KTtcbiAgbGV0IHZhbF8zMzIgPSB2bS5ydW5JbkNvbnRleHQocmVzdWx0XzMzMS5jb2RlLCBjb250ZXh0XzMyNS5zdG9yZS5nZXROb2RlQ29udGV4dCgpKTtcbiAgcmV0dXJuIHZhbF8zMzIuYXBwbHkodW5kZWZpbmVkLCBzYW5kYm94VmFsc18zMjkpO1xufVxuIl19