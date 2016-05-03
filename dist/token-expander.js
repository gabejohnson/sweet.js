"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _immutable = require("immutable");

var _enforester = require("./enforester");

var _termExpander = require("./term-expander.js");

var _termExpander2 = _interopRequireDefault(_termExpander);

var _bindingMap = require("./binding-map.js");

var _bindingMap2 = _interopRequireDefault(_bindingMap);

var _env = require("./env");

var _env2 = _interopRequireDefault(_env);

var _shiftReader = require("./shift-reader");

var _shiftReader2 = _interopRequireDefault(_shiftReader);

var _ramda = require("ramda");

var _ = _interopRequireWildcard(_ramda);

var _terms = require("./terms");

var _terms2 = _interopRequireDefault(_terms);

var _ramdaFantasy = require("ramda-fantasy");

var _symbol = require("./symbol");

var _transforms = require("./transforms");

var _errors = require("./errors");

var _loadSyntax = require("./load-syntax");

var _scope = require("./scope");

var _syntax = require("./syntax");

var _syntax2 = _interopRequireDefault(_syntax);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Just_931 = _ramdaFantasy.Maybe.Just;
var Nothing_932 = _ramdaFantasy.Maybe.Nothing;
var registerSyntax_933 = function registerSyntax_933(stx_939, context_940) {
  var newBinding_941 = (0, _symbol.gensym)(stx_939.val());
  context_940.env.set(newBinding_941.toString(), new _transforms.VarBindingTransform(stx_939));
  context_940.bindings.add(stx_939, { binding: newBinding_941, phase: context_940.phase, skipDup: true });
};
var registerBindings_934 = _.cond([[_terms.isBindingIdentifier, function (_ref, context_942) {
  var name = _ref.name;

  registerSyntax_933(name, context_942);
}], [_terms.isBindingPropertyIdentifier, function (_ref2, context_943) {
  var binding = _ref2.binding;

  registerBindings_934(binding, context_943);
}], [_terms.isBindingPropertyProperty, function (_ref3, context_944) {
  var binding = _ref3.binding;

  registerBindings_934(binding, context_944);
}], [_terms.isArrayBinding, function (_ref4, context_945) {
  var elements = _ref4.elements;
  var restElement = _ref4.restElement;

  if (restElement != null) {
    registerBindings_934(restElement, context_945);
  }
  elements.forEach(function (el_946) {
    if (el_946 != null) {
      registerBindings_934(el_946, context_945);
    }
  });
}], [_terms.isObjectBinding, function (_ref5, context_947) {
  var properties = _ref5.properties;
}], [_.T, function (binding_948) {
  return (0, _errors.assert)(false, "not implemented yet for: " + binding_948.type);
}]]);
var removeScope_935 = _.cond([[_terms.isBindingIdentifier, function (_ref6, scope_949, phase_950) {
  var name = _ref6.name;
  return new _terms2.default("BindingIdentifier", { name: name.removeScope(scope_949, phase_950) });
}], [_terms.isArrayBinding, function (_ref7, scope_951, phase_952) {
  var elements = _ref7.elements;
  var restElement = _ref7.restElement;

  return new _terms2.default("ArrayBinding", { elements: elements.map(function (el_953) {
      return el_953 == null ? null : removeScope_935(el_953, scope_951, phase_952);
    }), restElement: restElement == null ? null : removeScope_935(restElement, scope_951, phase_952) });
}], [_terms.isBindingPropertyIdentifier, function (_ref8, scope_954, phase_955) {
  var binding = _ref8.binding;
  var init = _ref8.init;
  return new _terms2.default("BindingPropertyIdentifier", { binding: removeScope_935(binding, scope_954, phase_955), init: init });
}], [_terms.isBindingPropertyProperty, function (_ref9, scope_956, phase_957) {
  var binding = _ref9.binding;
  var name = _ref9.name;
  return new _terms2.default("BindingPropertyProperty", { binding: removeScope_935(binding, scope_956, phase_957), name: name });
}], [_terms.isObjectBinding, function (_ref10, scope_958, phase_959) {
  var properties = _ref10.properties;
  return new _terms2.default("ObjectBinding", { properties: properties.map(function (prop_960) {
      return removeScope_935(prop_960, scope_958, phase_959);
    }) });
}], [_.T, function (binding_961) {
  return (0, _errors.assert)(false, "not implemented yet for: " + binding_961.type);
}]]);
function findNameInExports_936(name_962, exp_963) {
  var foundNames_964 = exp_963.reduce(function (acc_965, e_966) {
    if (e_966.declaration) {
      return acc_965.concat(e_966.declaration.declarators.reduce(function (acc_967, decl_968) {
        if (decl_968.binding.name.val() === name_962.val()) {
          return acc_967.concat(decl_968.binding.name);
        }
        return acc_967;
      }, (0, _immutable.List)()));
    }
    return acc_965;
  }, (0, _immutable.List)());
  (0, _errors.assert)(foundNames_964.size <= 1, "expecting no more than 1 matching name in exports");
  return foundNames_964.get(0);
}
function removeNames_937(impTerm_969, names_970) {
  return new _terms2.default(impTerm_969.type, { moduleSpecifier: impTerm_969.moduleSpecifier, defaultBinding: impTerm_969.defaultBinding, forSyntax: impTerm_969.forSyntax, namedImports: impTerm_969.namedImports.filter(function (specifier_971) {
      return !names_970.contains(specifier_971.binding.name);
    }) });
}
function bindImports_938(impTerm_972, exModule_973, context_974) {
  var names_975 = [];
  impTerm_972.namedImports.forEach(function (specifier_976) {
    var name_977 = specifier_976.binding.name;
    var exportName_978 = findNameInExports_936(name_977, exModule_973.exportEntries);
    if (exportName_978 != null) {
      var newBinding = (0, _symbol.gensym)(name_977.val());
      var storeName = exModule_973.moduleSpecifier + ":" + exportName_978.val() + ":" + context_974.phase;
      if (context_974.store.has(storeName)) {
        var storeStx = _syntax2.default.fromIdentifier(storeName);
        context_974.bindings.addForward(name_977, storeStx, newBinding, context_974.phase);
        names_975.push(name_977);
      }
    }
  });
  return (0, _immutable.List)(names_975);
}

var TokenExpander = function () {
  function TokenExpander(context_979) {
    _classCallCheck(this, TokenExpander);

    this.context = context_979;
  }

  _createClass(TokenExpander, [{
    key: "expand",
    value: function expand(stxl_980) {
      var result_981 = (0, _immutable.List)();
      if (stxl_980.size === 0) {
        return result_981;
      }
      var prev_982 = (0, _immutable.List)();
      var enf_983 = new _enforester.Enforester(stxl_980, prev_982, this.context);
      var self_984 = this;
      var phase_985 = self_984.context.phase;
      var env_986 = self_984.context.env;
      var store_987 = self_984.context.store;
      while (!enf_983.done) {
        var term = _.pipe(_.bind(enf_983.enforest, enf_983), _.cond([[_terms.isVariableDeclarationStatement, function (term_988) {
          term_988.declaration.declarators = term_988.declaration.declarators.map(function (decl_989) {
            return new _terms2.default("VariableDeclarator", { binding: removeScope_935(decl_989.binding, self_984.context.useScope, self_984.context.phase), init: decl_989.init });
          });
          if ((0, _terms.isSyntaxDeclaration)(term_988.declaration)) {
            (function () {
              var scope = (0, _scope.freshScope)("nonrec");
              term_988.declaration.declarators.forEach(function (decl_990) {
                var name_991 = decl_990.binding.name;
                var nameAdded_992 = name_991.addScope(scope, self_984.context.bindings, _syntax.ALL_PHASES);
                var nameRemoved_993 = name_991.removeScope(self_984.context.currentScope[self_984.context.currentScope.length - 1], self_984.context.phase);
                var newBinding_994 = (0, _symbol.gensym)(name_991.val());
                self_984.context.bindings.addForward(nameAdded_992, nameRemoved_993, newBinding_994, self_984.context.phase);
                decl_990.init = decl_990.init.addScope(scope, self_984.context.bindings, _syntax.ALL_PHASES);
              });
            })();
          }
          if ((0, _terms.isSyntaxDeclaration)(term_988.declaration) || (0, _terms.isSyntaxrecDeclaration)(term_988.declaration)) {
            term_988.declaration.declarators.forEach(function (decl_995) {
              var syntaxExpander_996 = new _termExpander2.default(_.merge(self_984.context, { phase: self_984.context.phase + 1, env: new _env2.default(), store: self_984.context.store }));
              registerBindings_934(decl_995.binding, self_984.context);
              var init_997 = syntaxExpander_996.expand(decl_995.init);
              var val_998 = (0, _loadSyntax.evalCompiletimeValue)(init_997.gen(), _.merge(self_984.context, { phase: self_984.context.phase + 1 }));
              self_984.context.env.set(decl_995.binding.name.resolve(self_984.context.phase), new _transforms.CompiletimeTransform(val_998));
            });
          } else {
            term_988.declaration.declarators.forEach(function (decl_999) {
              return registerBindings_934(decl_999.binding, self_984.context);
            });
          }
          return term_988;
        }], [_terms.isFunctionWithName, function (term_1000) {
          term_1000.name = removeScope_935(term_1000.name, self_984.context.useScope, self_984.context.phase);
          registerBindings_934(term_1000.name, self_984.context);
          return term_1000;
        }], [_terms.isImport, function (term_1001) {
          var path_1002 = term_1001.moduleSpecifier.val();
          var mod_1003 = self_984.context.modules.loadAndCompile(path_1002);
          store_987 = self_984.context.modules.visit(mod_1003, phase_985, store_987);
          if (term_1001.forSyntax) {
            store_987 = self_984.context.modules.invoke(mod_1003, phase_985 + 1, store_987);
          }
          var boundNames_1004 = bindImports_938(term_1001, mod_1003, self_984.context);
          return removeNames_937(term_1001, boundNames_1004);
        }], [_.T, function (term_1005) {
          return term_1005;
        }]]))();
        result_981 = result_981.concat(term);
      }
      return result_981;
    }
  }]);

  return TokenExpander;
}();

exports.default = TokenExpander;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3N3ZWV0L3Rva2VuLWV4cGFuZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7SUFBYSxDOztBQUNiOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFDQSxJQUFNLFdBQVcsb0JBQU0sSUFBdkI7QUFDQSxJQUFNLGNBQWMsb0JBQU0sT0FBMUI7QUFDQSxJQUFNLHFCQUFxQixTQUFyQixrQkFBcUIsQ0FBQyxPQUFELEVBQVUsV0FBVixFQUEwQjtBQUNuRCxNQUFJLGlCQUFpQixvQkFBTyxRQUFRLEdBQVIsRUFBUCxDQUFyQjtBQUNBLGNBQVksR0FBWixDQUFnQixHQUFoQixDQUFvQixlQUFlLFFBQWYsRUFBcEIsRUFBK0Msb0NBQXdCLE9BQXhCLENBQS9DO0FBQ0EsY0FBWSxRQUFaLENBQXFCLEdBQXJCLENBQXlCLE9BQXpCLEVBQWtDLEVBQUMsU0FBUyxjQUFWLEVBQTBCLE9BQU8sWUFBWSxLQUE3QyxFQUFvRCxTQUFTLElBQTdELEVBQWxDO0FBQ0QsQ0FKRDtBQUtBLElBQUksdUJBQXVCLEVBQUUsSUFBRixDQUFPLENBQUMsNkJBQXNCLGdCQUFTLFdBQVQsRUFBeUI7QUFBQSxNQUF2QixJQUF1QixRQUF2QixJQUF1Qjs7QUFDaEYscUJBQW1CLElBQW5CLEVBQXlCLFdBQXpCO0FBQ0QsQ0FGa0MsQ0FBRCxFQUU5QixxQ0FBOEIsaUJBQVksV0FBWixFQUE0QjtBQUFBLE1BQTFCLE9BQTBCLFNBQTFCLE9BQTBCOztBQUM1RCx1QkFBcUIsT0FBckIsRUFBOEIsV0FBOUI7QUFDRCxDQUZHLENBRjhCLEVBSTlCLG1DQUE0QixpQkFBWSxXQUFaLEVBQTRCO0FBQUEsTUFBMUIsT0FBMEIsU0FBMUIsT0FBMEI7O0FBQzFELHVCQUFxQixPQUFyQixFQUE4QixXQUE5QjtBQUNELENBRkcsQ0FKOEIsRUFN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b250ZW50IjpbImltcG9ydCB7TGlzdH0gZnJvbSBcImltbXV0YWJsZVwiO1xuaW1wb3J0IHtlbmZvcmVzdEV4cHIsIEVuZm9yZXN0ZXJ9IGZyb20gXCIuL2VuZm9yZXN0ZXJcIjtcbmltcG9ydCBUZXJtRXhwYW5kZXIgZnJvbSBcIi4vdGVybS1leHBhbmRlci5qc1wiO1xuaW1wb3J0IEJpbmRpbmdNYXAgZnJvbSBcIi4vYmluZGluZy1tYXAuanNcIjtcbmltcG9ydCBFbnYgZnJvbSBcIi4vZW52XCI7XG5pbXBvcnQgUmVhZGVyIGZyb20gXCIuL3NoaWZ0LXJlYWRlclwiO1xuaW1wb3J0ICAqIGFzIF8gZnJvbSBcInJhbWRhXCI7XG5pbXBvcnQgVGVybSwge2lzRU9GLCBpc0JpbmRpbmdJZGVudGlmaWVyLCBpc0JpbmRpbmdQcm9wZXJ0eVByb3BlcnR5LCBpc0JpbmRpbmdQcm9wZXJ0eUlkZW50aWZpZXIsIGlzT2JqZWN0QmluZGluZywgaXNBcnJheUJpbmRpbmcsIGlzRnVuY3Rpb25EZWNsYXJhdGlvbiwgaXNGdW5jdGlvbkV4cHJlc3Npb24sIGlzRnVuY3Rpb25UZXJtLCBpc0Z1bmN0aW9uV2l0aE5hbWUsIGlzU3ludGF4RGVjbGFyYXRpb24sIGlzU3ludGF4cmVjRGVjbGFyYXRpb24sIGlzVmFyaWFibGVEZWNsYXJhdGlvbiwgaXNWYXJpYWJsZURlY2xhcmF0aW9uU3RhdGVtZW50LCBpc0ltcG9ydCwgaXNFeHBvcnR9IGZyb20gXCIuL3Rlcm1zXCI7XG5pbXBvcnQge01heWJlfSBmcm9tIFwicmFtZGEtZmFudGFzeVwiO1xuaW1wb3J0IHtnZW5zeW19IGZyb20gXCIuL3N5bWJvbFwiO1xuaW1wb3J0IHtWYXJCaW5kaW5nVHJhbnNmb3JtLCBDb21waWxldGltZVRyYW5zZm9ybX0gZnJvbSBcIi4vdHJhbnNmb3Jtc1wiO1xuaW1wb3J0IHtleHBlY3QsIGFzc2VydH0gZnJvbSBcIi4vZXJyb3JzXCI7XG5pbXBvcnQge2V2YWxDb21waWxldGltZVZhbHVlfSBmcm9tIFwiLi9sb2FkLXN5bnRheFwiO1xuaW1wb3J0IHtTY29wZSwgZnJlc2hTY29wZX0gZnJvbSBcIi4vc2NvcGVcIjtcbmltcG9ydCBTeW50YXgsIHtBTExfUEhBU0VTfSBmcm9tIFwiLi9zeW50YXhcIjtcbmNvbnN0IEp1c3RfOTMxID0gTWF5YmUuSnVzdDtcbmNvbnN0IE5vdGhpbmdfOTMyID0gTWF5YmUuTm90aGluZztcbmNvbnN0IHJlZ2lzdGVyU3ludGF4XzkzMyA9IChzdHhfOTM5LCBjb250ZXh0Xzk0MCkgPT4ge1xuICBsZXQgbmV3QmluZGluZ185NDEgPSBnZW5zeW0oc3R4XzkzOS52YWwoKSk7XG4gIGNvbnRleHRfOTQwLmVudi5zZXQobmV3QmluZGluZ185NDEudG9TdHJpbmcoKSwgbmV3IFZhckJpbmRpbmdUcmFuc2Zvcm0oc3R4XzkzOSkpO1xuICBjb250ZXh0Xzk0MC5iaW5kaW5ncy5hZGQoc3R4XzkzOSwge2JpbmRpbmc6IG5ld0JpbmRpbmdfOTQxLCBwaGFzZTogY29udGV4dF85NDAucGhhc2UsIHNraXBEdXA6IHRydWV9KTtcbn07XG5sZXQgcmVnaXN0ZXJCaW5kaW5nc185MzQgPSBfLmNvbmQoW1tpc0JpbmRpbmdJZGVudGlmaWVyLCAoe25hbWV9LCBjb250ZXh0Xzk0MikgPT4ge1xuICByZWdpc3RlclN5bnRheF85MzMobmFtZSwgY29udGV4dF85NDIpO1xufV0sIFtpc0JpbmRpbmdQcm9wZXJ0eUlkZW50aWZpZXIsICh7YmluZGluZ30sIGNvbnRleHRfOTQzKSA9PiB7XG4gIHJlZ2lzdGVyQmluZGluZ3NfOTM0KGJpbmRpbmcsIGNvbnRleHRfOTQzKTtcbn1dLCBbaXNCaW5kaW5nUHJvcGVydHlQcm9wZXJ0eSwgKHtiaW5kaW5nfSwgY29udGV4dF85NDQpID0+IHtcbiAgcmVnaXN0ZXJCaW5kaW5nc185MzQoYmluZGluZywgY29udGV4dF85NDQpO1xufV0sIFtpc0FycmF5QmluZGluZywgKHtlbGVtZW50cywgcmVzdEVsZW1lbnR9LCBjb250ZXh0Xzk0NSkgPT4ge1xuICBpZiAocmVzdEVsZW1lbnQgIT0gbnVsbCkge1xuICAgIHJlZ2lzdGVyQmluZGluZ3NfOTM0KHJlc3RFbGVtZW50LCBjb250ZXh0Xzk0NSk7XG4gIH1cbiAgZWxlbWVudHMuZm9yRWFjaChlbF85NDYgPT4ge1xuICAgIGlmIChlbF85NDYgIT0gbnVsbCkge1xuICAgICAgcmVnaXN0ZXJCaW5kaW5nc185MzQoZWxfOTQ2LCBjb250ZXh0Xzk0NSk7XG4gICAgfVxuICB9KTtcbn1dLCBbaXNPYmplY3RCaW5kaW5nLCAoe3Byb3BlcnRpZXN9LCBjb250ZXh0Xzk0NykgPT4ge31dLCBbXy5ULCBiaW5kaW5nXzk0OCA9PiBhc3NlcnQoZmFsc2UsIFwibm90IGltcGxlbWVudGVkIHlldCBmb3I6IFwiICsgYmluZGluZ185NDgudHlwZSldXSk7XG5sZXQgcmVtb3ZlU2NvcGVfOTM1ID0gXy5jb25kKFtbaXNCaW5kaW5nSWRlbnRpZmllciwgKHtuYW1lfSwgc2NvcGVfOTQ5LCBwaGFzZV85NTApID0+IG5ldyBUZXJtKFwiQmluZGluZ0lkZW50aWZpZXJcIiwge25hbWU6IG5hbWUucmVtb3ZlU2NvcGUoc2NvcGVfOTQ5LCBwaGFzZV85NTApfSldLCBbaXNBcnJheUJpbmRpbmcsICh7ZWxlbWVudHMsIHJlc3RFbGVtZW50fSwgc2NvcGVfOTUxLCBwaGFzZV85NTIpID0+IHtcbiAgcmV0dXJuIG5ldyBUZXJtKFwiQXJyYXlCaW5kaW5nXCIsIHtlbGVtZW50czogZWxlbWVudHMubWFwKGVsXzk1MyA9PiBlbF85NTMgPT0gbnVsbCA/IG51bGwgOiByZW1vdmVTY29wZV85MzUoZWxfOTUzLCBzY29wZV85NTEsIHBoYXNlXzk1MikpLCByZXN0RWxlbWVudDogcmVzdEVsZW1lbnQgPT0gbnVsbCA/IG51bGwgOiByZW1vdmVTY29wZV85MzUocmVzdEVsZW1lbnQsIHNjb3BlXzk1MSwgcGhhc2VfOTUyKX0pO1xufV0sIFtpc0JpbmRpbmdQcm9wZXJ0eUlkZW50aWZpZXIsICh7YmluZGluZywgaW5pdH0sIHNjb3BlXzk1NCwgcGhhc2VfOTU1KSA9PiBuZXcgVGVybShcIkJpbmRpbmdQcm9wZXJ0eUlkZW50aWZpZXJcIiwge2JpbmRpbmc6IHJlbW92ZVNjb3BlXzkzNShiaW5kaW5nLCBzY29wZV85NTQsIHBoYXNlXzk1NSksIGluaXQ6IGluaXR9KV0sIFtpc0JpbmRpbmdQcm9wZXJ0eVByb3BlcnR5LCAoe2JpbmRpbmcsIG5hbWV9LCBzY29wZV85NTYsIHBoYXNlXzk1NykgPT4gbmV3IFRlcm0oXCJCaW5kaW5nUHJvcGVydHlQcm9wZXJ0eVwiLCB7YmluZGluZzogcmVtb3ZlU2NvcGVfOTM1KGJpbmRpbmcsIHNjb3BlXzk1NiwgcGhhc2VfOTU3KSwgbmFtZTogbmFtZX0pXSwgW2lzT2JqZWN0QmluZGluZywgKHtwcm9wZXJ0aWVzfSwgc2NvcGVfOTU4LCBwaGFzZV85NTkpID0+IG5ldyBUZXJtKFwiT2JqZWN0QmluZGluZ1wiLCB7cHJvcGVydGllczogcHJvcGVydGllcy5tYXAocHJvcF85NjAgPT4gcmVtb3ZlU2NvcGVfOTM1KHByb3BfOTYwLCBzY29wZV85NTgsIHBoYXNlXzk1OSkpfSldLCBbXy5ULCBiaW5kaW5nXzk2MSA9PiBhc3NlcnQoZmFsc2UsIFwibm90IGltcGxlbWVudGVkIHlldCBmb3I6IFwiICsgYmluZGluZ185NjEudHlwZSldXSk7XG5mdW5jdGlvbiBmaW5kTmFtZUluRXhwb3J0c185MzYobmFtZV85NjIsIGV4cF85NjMpIHtcbiAgbGV0IGZvdW5kTmFtZXNfOTY0ID0gZXhwXzk2My5yZWR1Y2UoKGFjY185NjUsIGVfOTY2KSA9PiB7XG4gICAgaWYgKGVfOTY2LmRlY2xhcmF0aW9uKSB7XG4gICAgICByZXR1cm4gYWNjXzk2NS5jb25jYXQoZV85NjYuZGVjbGFyYXRpb24uZGVjbGFyYXRvcnMucmVkdWNlKChhY2NfOTY3LCBkZWNsXzk2OCkgPT4ge1xuICAgICAgICBpZiAoZGVjbF85NjguYmluZGluZy5uYW1lLnZhbCgpID09PSBuYW1lXzk2Mi52YWwoKSkge1xuICAgICAgICAgIHJldHVybiBhY2NfOTY3LmNvbmNhdChkZWNsXzk2OC5iaW5kaW5nLm5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhY2NfOTY3O1xuICAgICAgfSwgTGlzdCgpKSk7XG4gICAgfVxuICAgIHJldHVybiBhY2NfOTY1O1xuICB9LCBMaXN0KCkpO1xuICBhc3NlcnQoZm91bmROYW1lc185NjQuc2l6ZSA8PSAxLCBcImV4cGVjdGluZyBubyBtb3JlIHRoYW4gMSBtYXRjaGluZyBuYW1lIGluIGV4cG9ydHNcIik7XG4gIHJldHVybiBmb3VuZE5hbWVzXzk2NC5nZXQoMCk7XG59XG5mdW5jdGlvbiByZW1vdmVOYW1lc185MzcoaW1wVGVybV85NjksIG5hbWVzXzk3MCkge1xuICByZXR1cm4gbmV3IFRlcm0oaW1wVGVybV85NjkudHlwZSwge21vZHVsZVNwZWNpZmllcjogaW1wVGVybV85NjkubW9kdWxlU3BlY2lmaWVyLCBkZWZhdWx0QmluZGluZzogaW1wVGVybV85NjkuZGVmYXVsdEJpbmRpbmcsIGZvclN5bnRheDogaW1wVGVybV85NjkuZm9yU3ludGF4LCBuYW1lZEltcG9ydHM6IGltcFRlcm1fOTY5Lm5hbWVkSW1wb3J0cy5maWx0ZXIoc3BlY2lmaWVyXzk3MSA9PiAhbmFtZXNfOTcwLmNvbnRhaW5zKHNwZWNpZmllcl85NzEuYmluZGluZy5uYW1lKSl9KTtcbn1cbmZ1bmN0aW9uIGJpbmRJbXBvcnRzXzkzOChpbXBUZXJtXzk3MiwgZXhNb2R1bGVfOTczLCBjb250ZXh0Xzk3NCkge1xuICBsZXQgbmFtZXNfOTc1ID0gW107XG4gIGltcFRlcm1fOTcyLm5hbWVkSW1wb3J0cy5mb3JFYWNoKHNwZWNpZmllcl85NzYgPT4ge1xuICAgIGxldCBuYW1lXzk3NyA9IHNwZWNpZmllcl85NzYuYmluZGluZy5uYW1lO1xuICAgIGxldCBleHBvcnROYW1lXzk3OCA9IGZpbmROYW1lSW5FeHBvcnRzXzkzNihuYW1lXzk3NywgZXhNb2R1bGVfOTczLmV4cG9ydEVudHJpZXMpO1xuICAgIGlmIChleHBvcnROYW1lXzk3OCAhPSBudWxsKSB7XG4gICAgICBsZXQgbmV3QmluZGluZyA9IGdlbnN5bShuYW1lXzk3Ny52YWwoKSk7XG4gICAgICBsZXQgc3RvcmVOYW1lID0gZXhNb2R1bGVfOTczLm1vZHVsZVNwZWNpZmllciArIFwiOlwiICsgZXhwb3J0TmFtZV85NzgudmFsKCkgKyBcIjpcIiArIGNvbnRleHRfOTc0LnBoYXNlO1xuICAgICAgaWYgKGNvbnRleHRfOTc0LnN0b3JlLmhhcyhzdG9yZU5hbWUpKSB7XG4gICAgICAgIGxldCBzdG9yZVN0eCA9IFN5bnRheC5mcm9tSWRlbnRpZmllcihzdG9yZU5hbWUpO1xuICAgICAgICBjb250ZXh0Xzk3NC5iaW5kaW5ncy5hZGRGb3J3YXJkKG5hbWVfOTc3LCBzdG9yZVN0eCwgbmV3QmluZGluZywgY29udGV4dF85NzQucGhhc2UpO1xuICAgICAgICBuYW1lc185NzUucHVzaChuYW1lXzk3Nyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIExpc3QobmFtZXNfOTc1KTtcbn1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRva2VuRXhwYW5kZXIge1xuICBjb25zdHJ1Y3Rvcihjb250ZXh0Xzk3OSkge1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHRfOTc5O1xuICB9XG4gIGV4cGFuZChzdHhsXzk4MCkge1xuICAgIGxldCByZXN1bHRfOTgxID0gTGlzdCgpO1xuICAgIGlmIChzdHhsXzk4MC5zaXplID09PSAwKSB7XG4gICAgICByZXR1cm4gcmVzdWx0Xzk4MTtcbiAgICB9XG4gICAgbGV0IHByZXZfOTgyID0gTGlzdCgpO1xuICAgIGxldCBlbmZfOTgzID0gbmV3IEVuZm9yZXN0ZXIoc3R4bF85ODAsIHByZXZfOTgyLCB0aGlzLmNvbnRleHQpO1xuICAgIGxldCBzZWxmXzk4NCA9IHRoaXM7XG4gICAgbGV0IHBoYXNlXzk4NSA9IHNlbGZfOTg0LmNvbnRleHQucGhhc2U7XG4gICAgbGV0IGVudl85ODYgPSBzZWxmXzk4NC5jb250ZXh0LmVudjtcbiAgICBsZXQgc3RvcmVfOTg3ID0gc2VsZl85ODQuY29udGV4dC5zdG9yZTtcbiAgICB3aGlsZSAoIWVuZl85ODMuZG9uZSkge1xuICAgICAgbGV0IHRlcm0gPSBfLnBpcGUoXy5iaW5kKGVuZl85ODMuZW5mb3Jlc3QsIGVuZl85ODMpLCBfLmNvbmQoW1tpc1ZhcmlhYmxlRGVjbGFyYXRpb25TdGF0ZW1lbnQsIHRlcm1fOTg4ID0+IHtcbiAgICAgICAgdGVybV85ODguZGVjbGFyYXRpb24uZGVjbGFyYXRvcnMgPSB0ZXJtXzk4OC5kZWNsYXJhdGlvbi5kZWNsYXJhdG9ycy5tYXAoZGVjbF85ODkgPT4ge1xuICAgICAgICAgIHJldHVybiBuZXcgVGVybShcIlZhcmlhYmxlRGVjbGFyYXRvclwiLCB7YmluZGluZzogcmVtb3ZlU2NvcGVfOTM1KGRlY2xfOTg5LmJpbmRpbmcsIHNlbGZfOTg0LmNvbnRleHQudXNlU2NvcGUsIHNlbGZfOTg0LmNvbnRleHQucGhhc2UpLCBpbml0OiBkZWNsXzk4OS5pbml0fSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoaXNTeW50YXhEZWNsYXJhdGlvbih0ZXJtXzk4OC5kZWNsYXJhdGlvbikpIHtcbiAgICAgICAgICBsZXQgc2NvcGUgPSBmcmVzaFNjb3BlKFwibm9ucmVjXCIpO1xuICAgICAgICAgIHRlcm1fOTg4LmRlY2xhcmF0aW9uLmRlY2xhcmF0b3JzLmZvckVhY2goZGVjbF85OTAgPT4ge1xuICAgICAgICAgICAgbGV0IG5hbWVfOTkxID0gZGVjbF85OTAuYmluZGluZy5uYW1lO1xuICAgICAgICAgICAgbGV0IG5hbWVBZGRlZF85OTIgPSBuYW1lXzk5MS5hZGRTY29wZShzY29wZSwgc2VsZl85ODQuY29udGV4dC5iaW5kaW5ncywgQUxMX1BIQVNFUyk7XG4gICAgICAgICAgICBsZXQgbmFtZVJlbW92ZWRfOTkzID0gbmFtZV85OTEucmVtb3ZlU2NvcGUoc2VsZl85ODQuY29udGV4dC5jdXJyZW50U2NvcGVbc2VsZl85ODQuY29udGV4dC5jdXJyZW50U2NvcGUubGVuZ3RoIC0gMV0sIHNlbGZfOTg0LmNvbnRleHQucGhhc2UpO1xuICAgICAgICAgICAgbGV0IG5ld0JpbmRpbmdfOTk0ID0gZ2Vuc3ltKG5hbWVfOTkxLnZhbCgpKTtcbiAgICAgICAgICAgIHNlbGZfOTg0LmNvbnRleHQuYmluZGluZ3MuYWRkRm9yd2FyZChuYW1lQWRkZWRfOTkyLCBuYW1lUmVtb3ZlZF85OTMsIG5ld0JpbmRpbmdfOTk0LCBzZWxmXzk4NC5jb250ZXh0LnBoYXNlKTtcbiAgICAgICAgICAgIGRlY2xfOTkwLmluaXQgPSBkZWNsXzk5MC5pbml0LmFkZFNjb3BlKHNjb3BlLCBzZWxmXzk4NC5jb250ZXh0LmJpbmRpbmdzLCBBTExfUEhBU0VTKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNTeW50YXhEZWNsYXJhdGlvbih0ZXJtXzk4OC5kZWNsYXJhdGlvbikgfHwgaXNTeW50YXhyZWNEZWNsYXJhdGlvbih0ZXJtXzk4OC5kZWNsYXJhdGlvbikpIHtcbiAgICAgICAgICB0ZXJtXzk4OC5kZWNsYXJhdGlvbi5kZWNsYXJhdG9ycy5mb3JFYWNoKGRlY2xfOTk1ID0+IHtcbiAgICAgICAgICAgIGxldCBzeW50YXhFeHBhbmRlcl85OTYgPSBuZXcgVGVybUV4cGFuZGVyKF8ubWVyZ2Uoc2VsZl85ODQuY29udGV4dCwge3BoYXNlOiBzZWxmXzk4NC5jb250ZXh0LnBoYXNlICsgMSwgZW52OiBuZXcgRW52LCBzdG9yZTogc2VsZl85ODQuY29udGV4dC5zdG9yZX0pKTtcbiAgICAgICAgICAgIHJlZ2lzdGVyQmluZGluZ3NfOTM0KGRlY2xfOTk1LmJpbmRpbmcsIHNlbGZfOTg0LmNvbnRleHQpO1xuICAgICAgICAgICAgbGV0IGluaXRfOTk3ID0gc3ludGF4RXhwYW5kZXJfOTk2LmV4cGFuZChkZWNsXzk5NS5pbml0KTtcbiAgICAgICAgICAgIGxldCB2YWxfOTk4ID0gZXZhbENvbXBpbGV0aW1lVmFsdWUoaW5pdF85OTcuZ2VuKCksIF8ubWVyZ2Uoc2VsZl85ODQuY29udGV4dCwge3BoYXNlOiBzZWxmXzk4NC5jb250ZXh0LnBoYXNlICsgMX0pKTtcbiAgICAgICAgICAgIHNlbGZfOTg0LmNvbnRleHQuZW52LnNldChkZWNsXzk5NS5iaW5kaW5nLm5hbWUucmVzb2x2ZShzZWxmXzk4NC5jb250ZXh0LnBoYXNlKSwgbmV3IENvbXBpbGV0aW1lVHJhbnNmb3JtKHZhbF85OTgpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0ZXJtXzk4OC5kZWNsYXJhdGlvbi5kZWNsYXJhdG9ycy5mb3JFYWNoKGRlY2xfOTk5ID0+IHJlZ2lzdGVyQmluZGluZ3NfOTM0KGRlY2xfOTk5LmJpbmRpbmcsIHNlbGZfOTg0LmNvbnRleHQpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGVybV85ODg7XG4gICAgICB9XSwgW2lzRnVuY3Rpb25XaXRoTmFtZSwgdGVybV8xMDAwID0+IHtcbiAgICAgICAgdGVybV8xMDAwLm5hbWUgPSByZW1vdmVTY29wZV85MzUodGVybV8xMDAwLm5hbWUsIHNlbGZfOTg0LmNvbnRleHQudXNlU2NvcGUsIHNlbGZfOTg0LmNvbnRleHQucGhhc2UpO1xuICAgICAgICByZWdpc3RlckJpbmRpbmdzXzkzNCh0ZXJtXzEwMDAubmFtZSwgc2VsZl85ODQuY29udGV4dCk7XG4gICAgICAgIHJldHVybiB0ZXJtXzEwMDA7XG4gICAgICB9XSwgW2lzSW1wb3J0LCB0ZXJtXzEwMDEgPT4ge1xuICAgICAgICBsZXQgcGF0aF8xMDAyID0gdGVybV8xMDAxLm1vZHVsZVNwZWNpZmllci52YWwoKTtcbiAgICAgICAgbGV0IG1vZF8xMDAzID0gc2VsZl85ODQuY29udGV4dC5tb2R1bGVzLmxvYWRBbmRDb21waWxlKHBhdGhfMTAwMik7XG4gICAgICAgIHN0b3JlXzk4NyA9IHNlbGZfOTg0LmNvbnRleHQubW9kdWxlcy52aXNpdChtb2RfMTAwMywgcGhhc2VfOTg1LCBzdG9yZV85ODcpO1xuICAgICAgICBpZiAodGVybV8xMDAxLmZvclN5bnRheCkge1xuICAgICAgICAgIHN0b3JlXzk4NyA9IHNlbGZfOTg0LmNvbnRleHQubW9kdWxlcy5pbnZva2UobW9kXzEwMDMsIHBoYXNlXzk4NSArIDEsIHN0b3JlXzk4Nyk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGJvdW5kTmFtZXNfMTAwNCA9IGJpbmRJbXBvcnRzXzkzOCh0ZXJtXzEwMDEsIG1vZF8xMDAzLCBzZWxmXzk4NC5jb250ZXh0KTtcbiAgICAgICAgcmV0dXJuIHJlbW92ZU5hbWVzXzkzNyh0ZXJtXzEwMDEsIGJvdW5kTmFtZXNfMTAwNCk7XG4gICAgICB9XSwgW18uVCwgdGVybV8xMDA1ID0+IHRlcm1fMTAwNV1dKSkoKTtcbiAgICAgIHJlc3VsdF85ODEgPSByZXN1bHRfOTgxLmNvbmNhdCh0ZXJtKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdF85ODE7XG4gIH1cbn1cbiJdfQ==