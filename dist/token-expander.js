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

var Just_930 = _ramdaFantasy.Maybe.Just;
var Nothing_931 = _ramdaFantasy.Maybe.Nothing;
var registerSyntax_932 = function registerSyntax_932(stx_938, context_939) {
  var newBinding_940 = (0, _symbol.gensym)(stx_938.val());
  context_939.env.set(newBinding_940.toString(), new _transforms.VarBindingTransform(stx_938));
  context_939.bindings.add(stx_938, { binding: newBinding_940, phase: context_939.phase, skipDup: true });
};
var registerBindings_933 = _.cond([[_terms.isBindingIdentifier, function (_ref, context_941) {
  var name = _ref.name;

  registerSyntax_932(name, context_941);
}], [_terms.isBindingPropertyIdentifier, function (_ref2, context_942) {
  var binding = _ref2.binding;

  registerBindings_933(binding, context_942);
}], [_terms.isBindingPropertyProperty, function (_ref3, context_943) {
  var binding = _ref3.binding;

  registerBindings_933(binding, context_943);
}], [_terms.isArrayBinding, function (_ref4, context_944) {
  var elements = _ref4.elements;
  var restElement = _ref4.restElement;

  if (restElement != null) {
    registerBindings_933(restElement, context_944);
  }
  elements.forEach(function (el_945) {
    if (el_945 != null) {
      registerBindings_933(el_945, context_944);
    }
  });
}], [_terms.isObjectBinding, function (_ref5, context_946) {
  var properties = _ref5.properties;
}], [_.T, function (binding_947) {
  return (0, _errors.assert)(false, "not implemented yet for: " + binding_947.type);
}]]);
var removeScope_934 = _.cond([[_terms.isBindingIdentifier, function (_ref6, scope_948, phase_949) {
  var name = _ref6.name;
  return new _terms2.default("BindingIdentifier", { name: name.removeScope(scope_948, phase_949) });
}], [_terms.isArrayBinding, function (_ref7, scope_950, phase_951) {
  var elements = _ref7.elements;
  var restElement = _ref7.restElement;

  return new _terms2.default("ArrayBinding", { elements: elements.map(function (el_952) {
      return el_952 == null ? null : removeScope_934(el_952, scope_950, phase_951);
    }), restElement: restElement == null ? null : removeScope_934(restElement, scope_950, phase_951) });
}], [_terms.isBindingPropertyIdentifier, function (_ref8, scope_953, phase_954) {
  var binding = _ref8.binding;
  var init = _ref8.init;
  return new _terms2.default("BindingPropertyIdentifier", { binding: removeScope_934(binding, scope_953, phase_954), init: init });
}], [_terms.isBindingPropertyProperty, function (_ref9, scope_955, phase_956) {
  var binding = _ref9.binding;
  var name = _ref9.name;
  return new _terms2.default("BindingPropertyProperty", { binding: removeScope_934(binding, scope_955, phase_956), name: name });
}], [_terms.isObjectBinding, function (_ref10, scope_957, phase_958) {
  var properties = _ref10.properties;
  return new _terms2.default("ObjectBinding", { properties: properties.map(function (prop_959) {
      return removeScope_934(prop_959, scope_957, phase_958);
    }) });
}], [_.T, function (binding_960) {
  return (0, _errors.assert)(false, "not implemented yet for: " + binding_960.type);
}]]);
function findNameInExports_935(name_961, exp_962) {
  var foundNames_963 = exp_962.reduce(function (acc_964, e_965) {
    if (e_965.declaration) {
      return acc_964.concat(e_965.declaration.declarators.reduce(function (acc_966, decl_967) {
        if (decl_967.binding.name.val() === name_961.val()) {
          return acc_966.concat(decl_967.binding.name);
        }
        return acc_966;
      }, (0, _immutable.List)()));
    }
    return acc_964;
  }, (0, _immutable.List)());
  (0, _errors.assert)(foundNames_963.size <= 1, "expecting no more than 1 matching name in exports");
  return foundNames_963.get(0);
}
function removeNames_936(impTerm_968, names_969) {
  return new _terms2.default(impTerm_968.type, { moduleSpecifier: impTerm_968.moduleSpecifier, defaultBinding: impTerm_968.defaultBinding, forSyntax: impTerm_968.forSyntax, namedImports: impTerm_968.namedImports.filter(function (specifier_970) {
      return !names_969.contains(specifier_970.binding.name);
    }) });
}
function bindImports_937(impTerm_971, exModule_972, context_973) {
  var names_974 = [];
  impTerm_971.namedImports.forEach(function (specifier_975) {
    var name_976 = specifier_975.binding.name;
    var exportName_977 = findNameInExports_935(name_976, exModule_972.exportEntries);
    if (exportName_977 != null) {
      var newBinding = (0, _symbol.gensym)(name_976.val());
      var storeName = exModule_972.moduleSpecifier + ":" + exportName_977.val() + ":" + context_973.phase;
      if (context_973.store.has(storeName)) {
        var storeStx = _syntax2.default.fromIdentifier(storeName);
        context_973.bindings.addForward(name_976, storeStx, newBinding, context_973.phase);
        names_974.push(name_976);
      }
    }
  });
  return (0, _immutable.List)(names_974);
}

var TokenExpander = function () {
  function TokenExpander(context_978) {
    _classCallCheck(this, TokenExpander);

    this.context = context_978;
  }

  _createClass(TokenExpander, [{
    key: "expand",
    value: function expand(stxl_979) {
      var result_980 = (0, _immutable.List)();
      if (stxl_979.size === 0) {
        return result_980;
      }
      var prev_981 = (0, _immutable.List)();
      var enf_982 = new _enforester.Enforester(stxl_979, prev_981, this.context);
      var self_983 = this;
      var phase_984 = self_983.context.phase;
      var env_985 = self_983.context.env;
      var store_986 = self_983.context.store;
      while (!enf_982.done) {
        var term = _.pipe(_.bind(enf_982.enforest, enf_982), _.cond([[_terms.isVariableDeclarationStatement, function (term_987) {
          term_987.declaration.declarators = term_987.declaration.declarators.map(function (decl_988) {
            return new _terms2.default("VariableDeclarator", { binding: removeScope_934(decl_988.binding, self_983.context.useScope, self_983.context.phase), init: decl_988.init });
          });
          if ((0, _terms.isSyntaxDeclaration)(term_987.declaration)) {
            (function () {
              var scope = (0, _scope.freshScope)("nonrec");
              term_987.declaration.declarators.forEach(function (decl_989) {
                var name_990 = decl_989.binding.name;
                var nameAdded_991 = name_990.addScope(scope, self_983.context.bindings, _syntax.ALL_PHASES);
                var nameRemoved_992 = name_990.removeScope(self_983.context.currentScope[self_983.context.currentScope.length - 1], self_983.context.phase);
                var newBinding_993 = (0, _symbol.gensym)(name_990.val());
                self_983.context.bindings.addForward(nameAdded_991, nameRemoved_992, newBinding_993, self_983.context.phase);
                decl_989.init = decl_989.init.addScope(scope, self_983.context.bindings, _syntax.ALL_PHASES);
              });
            })();
          }
          if ((0, _terms.isSyntaxDeclaration)(term_987.declaration) || (0, _terms.isSyntaxrecDeclaration)(term_987.declaration)) {
            term_987.declaration.declarators.forEach(function (decl_994) {
              var syntaxExpander_995 = new _termExpander2.default(_.merge(self_983.context, { phase: self_983.context.phase + 1, env: new _env2.default(), store: self_983.context.store }));
              registerBindings_933(decl_994.binding, self_983.context);
              var init_996 = syntaxExpander_995.expand(decl_994.init);
              var val_997 = (0, _loadSyntax.evalCompiletimeValue)(init_996.gen(), _.merge(self_983.context, { phase: self_983.context.phase + 1 }));
              self_983.context.env.set(decl_994.binding.name.resolve(self_983.context.phase), new _transforms.CompiletimeTransform(val_997));
            });
          } else {
            term_987.declaration.declarators.forEach(function (decl_998) {
              return registerBindings_933(decl_998.binding, self_983.context);
            });
          }
          return term_987;
        }], [_terms.isFunctionWithName, function (term_999) {
          term_999.name = removeScope_934(term_999.name, self_983.context.useScope, self_983.context.phase);
          registerBindings_933(term_999.name, self_983.context);
          return term_999;
        }], [_terms.isImport, function (term_1000) {
          var path_1001 = term_1000.moduleSpecifier.val();
          var mod_1002 = self_983.context.modules.loadAndCompile(path_1001);
          store_986 = self_983.context.modules.visit(mod_1002, phase_984, store_986);
          if (term_1000.forSyntax) {
            store_986 = self_983.context.modules.invoke(mod_1002, phase_984 + 1, store_986);
          }
          var boundNames_1003 = bindImports_937(term_1000, mod_1002, self_983.context);
          return removeNames_936(term_1000, boundNames_1003);
        }], [_.T, function (term_1004) {
          return term_1004;
        }]]))();
        result_980 = result_980.concat(term);
      }
      return result_980;
    }
  }]);

  return TokenExpander;
}();

exports.default = TokenExpander;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3N3ZWV0L3Rva2VuLWV4cGFuZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7SUFBYSxDOztBQUNiOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFDQSxJQUFNLFdBQVcsb0JBQU0sSUFBdkI7QUFDQSxJQUFNLGNBQWMsb0JBQU0sT0FBMUI7QUFDQSxJQUFNLHFCQUFxQixTQUFyQixrQkFBcUIsQ0FBQyxPQUFELEVBQVUsV0FBVixFQUEwQjtBQUNuRCxNQUFJLGlCQUFpQixvQkFBTyxRQUFRLEdBQVIsRUFBUCxDQUFyQjtBQUNBLGNBQVksR0FBWixDQUFnQixHQUFoQixDQUFvQixlQUFlLFFBQWYsRUFBcEIsRUFBK0Msb0NBQXdCLE9BQXhCLENBQS9DO0FBQ0EsY0FBWSxRQUFaLENBQXFCLEdBQXJCLENBQXlCLE9BQXpCLEVBQWtDLEVBQUMsU0FBUyxjQUFWLEVBQTBCLE9BQU8sWUFBWSxLQUE3QyxFQUFvRCxTQUFTLElBQTdELEVBQWxDO0FBQ0QsQ0FKRDtBQUtBLElBQUksdUJBQXVCLEVBQUUsSUFBRixDQUFPLENBQUMsNkJBQXNCLGdCQUFTLFdBQVQsRUFBeUI7QUFBQSxNQUF2QixJQUF1QixRQUF2QixJQUF1Qjs7QUFDaEYscUJBQW1CLElBQW5CLEVBQXlCLFdBQXpCO0FBQ0QsQ0FGa0MsQ0FBRCxFQUU5QixxQ0FBOEIsaUJBQVksV0FBWixFQUE0QjtBQUFBLE1BQTFCLE9BQTBCLFNBQTFCLE9BQTBCOztBQUM1RCx1QkFBcUIsT0FBckIsRUFBOEIsV0FBOUI7QUFDRCxDQUZHLENBRjhCLEVBSTlCLG1DQUE0QixpQkFBWSxXQUFaLEVBQTRCO0FBQUEsTUFBMUIsT0FBMEIsU0FBMUIsT0FBMEI7O0FBQzFELHVCQUFxQixPQUFyQixFQUE4QixXQUE5QjtBQUNELENBRkcsQ0FKOEIsRUFN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b250ZW50IjpbImltcG9ydCB7TGlzdH0gZnJvbSBcImltbXV0YWJsZVwiO1xuaW1wb3J0IHtlbmZvcmVzdEV4cHIsIEVuZm9yZXN0ZXJ9IGZyb20gXCIuL2VuZm9yZXN0ZXJcIjtcbmltcG9ydCBUZXJtRXhwYW5kZXIgZnJvbSBcIi4vdGVybS1leHBhbmRlci5qc1wiO1xuaW1wb3J0IEJpbmRpbmdNYXAgZnJvbSBcIi4vYmluZGluZy1tYXAuanNcIjtcbmltcG9ydCBFbnYgZnJvbSBcIi4vZW52XCI7XG5pbXBvcnQgUmVhZGVyIGZyb20gXCIuL3NoaWZ0LXJlYWRlclwiO1xuaW1wb3J0ICAqIGFzIF8gZnJvbSBcInJhbWRhXCI7XG5pbXBvcnQgVGVybSwge2lzRU9GLCBpc0JpbmRpbmdJZGVudGlmaWVyLCBpc0JpbmRpbmdQcm9wZXJ0eVByb3BlcnR5LCBpc0JpbmRpbmdQcm9wZXJ0eUlkZW50aWZpZXIsIGlzT2JqZWN0QmluZGluZywgaXNBcnJheUJpbmRpbmcsIGlzRnVuY3Rpb25EZWNsYXJhdGlvbiwgaXNGdW5jdGlvbkV4cHJlc3Npb24sIGlzRnVuY3Rpb25UZXJtLCBpc0Z1bmN0aW9uV2l0aE5hbWUsIGlzU3ludGF4RGVjbGFyYXRpb24sIGlzU3ludGF4cmVjRGVjbGFyYXRpb24sIGlzVmFyaWFibGVEZWNsYXJhdGlvbiwgaXNWYXJpYWJsZURlY2xhcmF0aW9uU3RhdGVtZW50LCBpc0ltcG9ydCwgaXNFeHBvcnR9IGZyb20gXCIuL3Rlcm1zXCI7XG5pbXBvcnQge01heWJlfSBmcm9tIFwicmFtZGEtZmFudGFzeVwiO1xuaW1wb3J0IHtnZW5zeW19IGZyb20gXCIuL3N5bWJvbFwiO1xuaW1wb3J0IHtWYXJCaW5kaW5nVHJhbnNmb3JtLCBDb21waWxldGltZVRyYW5zZm9ybX0gZnJvbSBcIi4vdHJhbnNmb3Jtc1wiO1xuaW1wb3J0IHtleHBlY3QsIGFzc2VydH0gZnJvbSBcIi4vZXJyb3JzXCI7XG5pbXBvcnQge2V2YWxDb21waWxldGltZVZhbHVlfSBmcm9tIFwiLi9sb2FkLXN5bnRheFwiO1xuaW1wb3J0IHtTY29wZSwgZnJlc2hTY29wZX0gZnJvbSBcIi4vc2NvcGVcIjtcbmltcG9ydCBTeW50YXgsIHtBTExfUEhBU0VTfSBmcm9tIFwiLi9zeW50YXhcIjtcbmNvbnN0IEp1c3RfOTMwID0gTWF5YmUuSnVzdDtcbmNvbnN0IE5vdGhpbmdfOTMxID0gTWF5YmUuTm90aGluZztcbmNvbnN0IHJlZ2lzdGVyU3ludGF4XzkzMiA9IChzdHhfOTM4LCBjb250ZXh0XzkzOSkgPT4ge1xuICBsZXQgbmV3QmluZGluZ185NDAgPSBnZW5zeW0oc3R4XzkzOC52YWwoKSk7XG4gIGNvbnRleHRfOTM5LmVudi5zZXQobmV3QmluZGluZ185NDAudG9TdHJpbmcoKSwgbmV3IFZhckJpbmRpbmdUcmFuc2Zvcm0oc3R4XzkzOCkpO1xuICBjb250ZXh0XzkzOS5iaW5kaW5ncy5hZGQoc3R4XzkzOCwge2JpbmRpbmc6IG5ld0JpbmRpbmdfOTQwLCBwaGFzZTogY29udGV4dF85MzkucGhhc2UsIHNraXBEdXA6IHRydWV9KTtcbn07XG5sZXQgcmVnaXN0ZXJCaW5kaW5nc185MzMgPSBfLmNvbmQoW1tpc0JpbmRpbmdJZGVudGlmaWVyLCAoe25hbWV9LCBjb250ZXh0Xzk0MSkgPT4ge1xuICByZWdpc3RlclN5bnRheF85MzIobmFtZSwgY29udGV4dF85NDEpO1xufV0sIFtpc0JpbmRpbmdQcm9wZXJ0eUlkZW50aWZpZXIsICh7YmluZGluZ30sIGNvbnRleHRfOTQyKSA9PiB7XG4gIHJlZ2lzdGVyQmluZGluZ3NfOTMzKGJpbmRpbmcsIGNvbnRleHRfOTQyKTtcbn1dLCBbaXNCaW5kaW5nUHJvcGVydHlQcm9wZXJ0eSwgKHtiaW5kaW5nfSwgY29udGV4dF85NDMpID0+IHtcbiAgcmVnaXN0ZXJCaW5kaW5nc185MzMoYmluZGluZywgY29udGV4dF85NDMpO1xufV0sIFtpc0FycmF5QmluZGluZywgKHtlbGVtZW50cywgcmVzdEVsZW1lbnR9LCBjb250ZXh0Xzk0NCkgPT4ge1xuICBpZiAocmVzdEVsZW1lbnQgIT0gbnVsbCkge1xuICAgIHJlZ2lzdGVyQmluZGluZ3NfOTMzKHJlc3RFbGVtZW50LCBjb250ZXh0Xzk0NCk7XG4gIH1cbiAgZWxlbWVudHMuZm9yRWFjaChlbF85NDUgPT4ge1xuICAgIGlmIChlbF85NDUgIT0gbnVsbCkge1xuICAgICAgcmVnaXN0ZXJCaW5kaW5nc185MzMoZWxfOTQ1LCBjb250ZXh0Xzk0NCk7XG4gICAgfVxuICB9KTtcbn1dLCBbaXNPYmplY3RCaW5kaW5nLCAoe3Byb3BlcnRpZXN9LCBjb250ZXh0Xzk0NikgPT4ge31dLCBbXy5ULCBiaW5kaW5nXzk0NyA9PiBhc3NlcnQoZmFsc2UsIFwibm90IGltcGxlbWVudGVkIHlldCBmb3I6IFwiICsgYmluZGluZ185NDcudHlwZSldXSk7XG5sZXQgcmVtb3ZlU2NvcGVfOTM0ID0gXy5jb25kKFtbaXNCaW5kaW5nSWRlbnRpZmllciwgKHtuYW1lfSwgc2NvcGVfOTQ4LCBwaGFzZV85NDkpID0+IG5ldyBUZXJtKFwiQmluZGluZ0lkZW50aWZpZXJcIiwge25hbWU6IG5hbWUucmVtb3ZlU2NvcGUoc2NvcGVfOTQ4LCBwaGFzZV85NDkpfSldLCBbaXNBcnJheUJpbmRpbmcsICh7ZWxlbWVudHMsIHJlc3RFbGVtZW50fSwgc2NvcGVfOTUwLCBwaGFzZV85NTEpID0+IHtcbiAgcmV0dXJuIG5ldyBUZXJtKFwiQXJyYXlCaW5kaW5nXCIsIHtlbGVtZW50czogZWxlbWVudHMubWFwKGVsXzk1MiA9PiBlbF85NTIgPT0gbnVsbCA/IG51bGwgOiByZW1vdmVTY29wZV85MzQoZWxfOTUyLCBzY29wZV85NTAsIHBoYXNlXzk1MSkpLCByZXN0RWxlbWVudDogcmVzdEVsZW1lbnQgPT0gbnVsbCA/IG51bGwgOiByZW1vdmVTY29wZV85MzQocmVzdEVsZW1lbnQsIHNjb3BlXzk1MCwgcGhhc2VfOTUxKX0pO1xufV0sIFtpc0JpbmRpbmdQcm9wZXJ0eUlkZW50aWZpZXIsICh7YmluZGluZywgaW5pdH0sIHNjb3BlXzk1MywgcGhhc2VfOTU0KSA9PiBuZXcgVGVybShcIkJpbmRpbmdQcm9wZXJ0eUlkZW50aWZpZXJcIiwge2JpbmRpbmc6IHJlbW92ZVNjb3BlXzkzNChiaW5kaW5nLCBzY29wZV85NTMsIHBoYXNlXzk1NCksIGluaXQ6IGluaXR9KV0sIFtpc0JpbmRpbmdQcm9wZXJ0eVByb3BlcnR5LCAoe2JpbmRpbmcsIG5hbWV9LCBzY29wZV85NTUsIHBoYXNlXzk1NikgPT4gbmV3IFRlcm0oXCJCaW5kaW5nUHJvcGVydHlQcm9wZXJ0eVwiLCB7YmluZGluZzogcmVtb3ZlU2NvcGVfOTM0KGJpbmRpbmcsIHNjb3BlXzk1NSwgcGhhc2VfOTU2KSwgbmFtZTogbmFtZX0pXSwgW2lzT2JqZWN0QmluZGluZywgKHtwcm9wZXJ0aWVzfSwgc2NvcGVfOTU3LCBwaGFzZV85NTgpID0+IG5ldyBUZXJtKFwiT2JqZWN0QmluZGluZ1wiLCB7cHJvcGVydGllczogcHJvcGVydGllcy5tYXAocHJvcF85NTkgPT4gcmVtb3ZlU2NvcGVfOTM0KHByb3BfOTU5LCBzY29wZV85NTcsIHBoYXNlXzk1OCkpfSldLCBbXy5ULCBiaW5kaW5nXzk2MCA9PiBhc3NlcnQoZmFsc2UsIFwibm90IGltcGxlbWVudGVkIHlldCBmb3I6IFwiICsgYmluZGluZ185NjAudHlwZSldXSk7XG5mdW5jdGlvbiBmaW5kTmFtZUluRXhwb3J0c185MzUobmFtZV85NjEsIGV4cF85NjIpIHtcbiAgbGV0IGZvdW5kTmFtZXNfOTYzID0gZXhwXzk2Mi5yZWR1Y2UoKGFjY185NjQsIGVfOTY1KSA9PiB7XG4gICAgaWYgKGVfOTY1LmRlY2xhcmF0aW9uKSB7XG4gICAgICByZXR1cm4gYWNjXzk2NC5jb25jYXQoZV85NjUuZGVjbGFyYXRpb24uZGVjbGFyYXRvcnMucmVkdWNlKChhY2NfOTY2LCBkZWNsXzk2NykgPT4ge1xuICAgICAgICBpZiAoZGVjbF85NjcuYmluZGluZy5uYW1lLnZhbCgpID09PSBuYW1lXzk2MS52YWwoKSkge1xuICAgICAgICAgIHJldHVybiBhY2NfOTY2LmNvbmNhdChkZWNsXzk2Ny5iaW5kaW5nLm5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhY2NfOTY2O1xuICAgICAgfSwgTGlzdCgpKSk7XG4gICAgfVxuICAgIHJldHVybiBhY2NfOTY0O1xuICB9LCBMaXN0KCkpO1xuICBhc3NlcnQoZm91bmROYW1lc185NjMuc2l6ZSA8PSAxLCBcImV4cGVjdGluZyBubyBtb3JlIHRoYW4gMSBtYXRjaGluZyBuYW1lIGluIGV4cG9ydHNcIik7XG4gIHJldHVybiBmb3VuZE5hbWVzXzk2My5nZXQoMCk7XG59XG5mdW5jdGlvbiByZW1vdmVOYW1lc185MzYoaW1wVGVybV85NjgsIG5hbWVzXzk2OSkge1xuICByZXR1cm4gbmV3IFRlcm0oaW1wVGVybV85NjgudHlwZSwge21vZHVsZVNwZWNpZmllcjogaW1wVGVybV85NjgubW9kdWxlU3BlY2lmaWVyLCBkZWZhdWx0QmluZGluZzogaW1wVGVybV85NjguZGVmYXVsdEJpbmRpbmcsIGZvclN5bnRheDogaW1wVGVybV85NjguZm9yU3ludGF4LCBuYW1lZEltcG9ydHM6IGltcFRlcm1fOTY4Lm5hbWVkSW1wb3J0cy5maWx0ZXIoc3BlY2lmaWVyXzk3MCA9PiAhbmFtZXNfOTY5LmNvbnRhaW5zKHNwZWNpZmllcl85NzAuYmluZGluZy5uYW1lKSl9KTtcbn1cbmZ1bmN0aW9uIGJpbmRJbXBvcnRzXzkzNyhpbXBUZXJtXzk3MSwgZXhNb2R1bGVfOTcyLCBjb250ZXh0Xzk3Mykge1xuICBsZXQgbmFtZXNfOTc0ID0gW107XG4gIGltcFRlcm1fOTcxLm5hbWVkSW1wb3J0cy5mb3JFYWNoKHNwZWNpZmllcl85NzUgPT4ge1xuICAgIGxldCBuYW1lXzk3NiA9IHNwZWNpZmllcl85NzUuYmluZGluZy5uYW1lO1xuICAgIGxldCBleHBvcnROYW1lXzk3NyA9IGZpbmROYW1lSW5FeHBvcnRzXzkzNShuYW1lXzk3NiwgZXhNb2R1bGVfOTcyLmV4cG9ydEVudHJpZXMpO1xuICAgIGlmIChleHBvcnROYW1lXzk3NyAhPSBudWxsKSB7XG4gICAgICBsZXQgbmV3QmluZGluZyA9IGdlbnN5bShuYW1lXzk3Ni52YWwoKSk7XG4gICAgICBsZXQgc3RvcmVOYW1lID0gZXhNb2R1bGVfOTcyLm1vZHVsZVNwZWNpZmllciArIFwiOlwiICsgZXhwb3J0TmFtZV85NzcudmFsKCkgKyBcIjpcIiArIGNvbnRleHRfOTczLnBoYXNlO1xuICAgICAgaWYgKGNvbnRleHRfOTczLnN0b3JlLmhhcyhzdG9yZU5hbWUpKSB7XG4gICAgICAgIGxldCBzdG9yZVN0eCA9IFN5bnRheC5mcm9tSWRlbnRpZmllcihzdG9yZU5hbWUpO1xuICAgICAgICBjb250ZXh0Xzk3My5iaW5kaW5ncy5hZGRGb3J3YXJkKG5hbWVfOTc2LCBzdG9yZVN0eCwgbmV3QmluZGluZywgY29udGV4dF85NzMucGhhc2UpO1xuICAgICAgICBuYW1lc185NzQucHVzaChuYW1lXzk3Nik7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIExpc3QobmFtZXNfOTc0KTtcbn1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRva2VuRXhwYW5kZXIge1xuICBjb25zdHJ1Y3Rvcihjb250ZXh0Xzk3OCkge1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHRfOTc4O1xuICB9XG4gIGV4cGFuZChzdHhsXzk3OSkge1xuICAgIGxldCByZXN1bHRfOTgwID0gTGlzdCgpO1xuICAgIGlmIChzdHhsXzk3OS5zaXplID09PSAwKSB7XG4gICAgICByZXR1cm4gcmVzdWx0Xzk4MDtcbiAgICB9XG4gICAgbGV0IHByZXZfOTgxID0gTGlzdCgpO1xuICAgIGxldCBlbmZfOTgyID0gbmV3IEVuZm9yZXN0ZXIoc3R4bF85NzksIHByZXZfOTgxLCB0aGlzLmNvbnRleHQpO1xuICAgIGxldCBzZWxmXzk4MyA9IHRoaXM7XG4gICAgbGV0IHBoYXNlXzk4NCA9IHNlbGZfOTgzLmNvbnRleHQucGhhc2U7XG4gICAgbGV0IGVudl85ODUgPSBzZWxmXzk4My5jb250ZXh0LmVudjtcbiAgICBsZXQgc3RvcmVfOTg2ID0gc2VsZl85ODMuY29udGV4dC5zdG9yZTtcbiAgICB3aGlsZSAoIWVuZl85ODIuZG9uZSkge1xuICAgICAgbGV0IHRlcm0gPSBfLnBpcGUoXy5iaW5kKGVuZl85ODIuZW5mb3Jlc3QsIGVuZl85ODIpLCBfLmNvbmQoW1tpc1ZhcmlhYmxlRGVjbGFyYXRpb25TdGF0ZW1lbnQsIHRlcm1fOTg3ID0+IHtcbiAgICAgICAgdGVybV85ODcuZGVjbGFyYXRpb24uZGVjbGFyYXRvcnMgPSB0ZXJtXzk4Ny5kZWNsYXJhdGlvbi5kZWNsYXJhdG9ycy5tYXAoZGVjbF85ODggPT4ge1xuICAgICAgICAgIHJldHVybiBuZXcgVGVybShcIlZhcmlhYmxlRGVjbGFyYXRvclwiLCB7YmluZGluZzogcmVtb3ZlU2NvcGVfOTM0KGRlY2xfOTg4LmJpbmRpbmcsIHNlbGZfOTgzLmNvbnRleHQudXNlU2NvcGUsIHNlbGZfOTgzLmNvbnRleHQucGhhc2UpLCBpbml0OiBkZWNsXzk4OC5pbml0fSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoaXNTeW50YXhEZWNsYXJhdGlvbih0ZXJtXzk4Ny5kZWNsYXJhdGlvbikpIHtcbiAgICAgICAgICBsZXQgc2NvcGUgPSBmcmVzaFNjb3BlKFwibm9ucmVjXCIpO1xuICAgICAgICAgIHRlcm1fOTg3LmRlY2xhcmF0aW9uLmRlY2xhcmF0b3JzLmZvckVhY2goZGVjbF85ODkgPT4ge1xuICAgICAgICAgICAgbGV0IG5hbWVfOTkwID0gZGVjbF85ODkuYmluZGluZy5uYW1lO1xuICAgICAgICAgICAgbGV0IG5hbWVBZGRlZF85OTEgPSBuYW1lXzk5MC5hZGRTY29wZShzY29wZSwgc2VsZl85ODMuY29udGV4dC5iaW5kaW5ncywgQUxMX1BIQVNFUyk7XG4gICAgICAgICAgICBsZXQgbmFtZVJlbW92ZWRfOTkyID0gbmFtZV85OTAucmVtb3ZlU2NvcGUoc2VsZl85ODMuY29udGV4dC5jdXJyZW50U2NvcGVbc2VsZl85ODMuY29udGV4dC5jdXJyZW50U2NvcGUubGVuZ3RoIC0gMV0sIHNlbGZfOTgzLmNvbnRleHQucGhhc2UpO1xuICAgICAgICAgICAgbGV0IG5ld0JpbmRpbmdfOTkzID0gZ2Vuc3ltKG5hbWVfOTkwLnZhbCgpKTtcbiAgICAgICAgICAgIHNlbGZfOTgzLmNvbnRleHQuYmluZGluZ3MuYWRkRm9yd2FyZChuYW1lQWRkZWRfOTkxLCBuYW1lUmVtb3ZlZF85OTIsIG5ld0JpbmRpbmdfOTkzLCBzZWxmXzk4My5jb250ZXh0LnBoYXNlKTtcbiAgICAgICAgICAgIGRlY2xfOTg5LmluaXQgPSBkZWNsXzk4OS5pbml0LmFkZFNjb3BlKHNjb3BlLCBzZWxmXzk4My5jb250ZXh0LmJpbmRpbmdzLCBBTExfUEhBU0VTKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNTeW50YXhEZWNsYXJhdGlvbih0ZXJtXzk4Ny5kZWNsYXJhdGlvbikgfHwgaXNTeW50YXhyZWNEZWNsYXJhdGlvbih0ZXJtXzk4Ny5kZWNsYXJhdGlvbikpIHtcbiAgICAgICAgICB0ZXJtXzk4Ny5kZWNsYXJhdGlvbi5kZWNsYXJhdG9ycy5mb3JFYWNoKGRlY2xfOTk0ID0+IHtcbiAgICAgICAgICAgIGxldCBzeW50YXhFeHBhbmRlcl85OTUgPSBuZXcgVGVybUV4cGFuZGVyKF8ubWVyZ2Uoc2VsZl85ODMuY29udGV4dCwge3BoYXNlOiBzZWxmXzk4My5jb250ZXh0LnBoYXNlICsgMSwgZW52OiBuZXcgRW52LCBzdG9yZTogc2VsZl85ODMuY29udGV4dC5zdG9yZX0pKTtcbiAgICAgICAgICAgIHJlZ2lzdGVyQmluZGluZ3NfOTMzKGRlY2xfOTk0LmJpbmRpbmcsIHNlbGZfOTgzLmNvbnRleHQpO1xuICAgICAgICAgICAgbGV0IGluaXRfOTk2ID0gc3ludGF4RXhwYW5kZXJfOTk1LmV4cGFuZChkZWNsXzk5NC5pbml0KTtcbiAgICAgICAgICAgIGxldCB2YWxfOTk3ID0gZXZhbENvbXBpbGV0aW1lVmFsdWUoaW5pdF85OTYuZ2VuKCksIF8ubWVyZ2Uoc2VsZl85ODMuY29udGV4dCwge3BoYXNlOiBzZWxmXzk4My5jb250ZXh0LnBoYXNlICsgMX0pKTtcbiAgICAgICAgICAgIHNlbGZfOTgzLmNvbnRleHQuZW52LnNldChkZWNsXzk5NC5iaW5kaW5nLm5hbWUucmVzb2x2ZShzZWxmXzk4My5jb250ZXh0LnBoYXNlKSwgbmV3IENvbXBpbGV0aW1lVHJhbnNmb3JtKHZhbF85OTcpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0ZXJtXzk4Ny5kZWNsYXJhdGlvbi5kZWNsYXJhdG9ycy5mb3JFYWNoKGRlY2xfOTk4ID0+IHJlZ2lzdGVyQmluZGluZ3NfOTMzKGRlY2xfOTk4LmJpbmRpbmcsIHNlbGZfOTgzLmNvbnRleHQpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGVybV85ODc7XG4gICAgICB9XSwgW2lzRnVuY3Rpb25XaXRoTmFtZSwgdGVybV85OTkgPT4ge1xuICAgICAgICB0ZXJtXzk5OS5uYW1lID0gcmVtb3ZlU2NvcGVfOTM0KHRlcm1fOTk5Lm5hbWUsIHNlbGZfOTgzLmNvbnRleHQudXNlU2NvcGUsIHNlbGZfOTgzLmNvbnRleHQucGhhc2UpO1xuICAgICAgICByZWdpc3RlckJpbmRpbmdzXzkzMyh0ZXJtXzk5OS5uYW1lLCBzZWxmXzk4My5jb250ZXh0KTtcbiAgICAgICAgcmV0dXJuIHRlcm1fOTk5O1xuICAgICAgfV0sIFtpc0ltcG9ydCwgdGVybV8xMDAwID0+IHtcbiAgICAgICAgbGV0IHBhdGhfMTAwMSA9IHRlcm1fMTAwMC5tb2R1bGVTcGVjaWZpZXIudmFsKCk7XG4gICAgICAgIGxldCBtb2RfMTAwMiA9IHNlbGZfOTgzLmNvbnRleHQubW9kdWxlcy5sb2FkQW5kQ29tcGlsZShwYXRoXzEwMDEpO1xuICAgICAgICBzdG9yZV85ODYgPSBzZWxmXzk4My5jb250ZXh0Lm1vZHVsZXMudmlzaXQobW9kXzEwMDIsIHBoYXNlXzk4NCwgc3RvcmVfOTg2KTtcbiAgICAgICAgaWYgKHRlcm1fMTAwMC5mb3JTeW50YXgpIHtcbiAgICAgICAgICBzdG9yZV85ODYgPSBzZWxmXzk4My5jb250ZXh0Lm1vZHVsZXMuaW52b2tlKG1vZF8xMDAyLCBwaGFzZV85ODQgKyAxLCBzdG9yZV85ODYpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBib3VuZE5hbWVzXzEwMDMgPSBiaW5kSW1wb3J0c185MzcodGVybV8xMDAwLCBtb2RfMTAwMiwgc2VsZl85ODMuY29udGV4dCk7XG4gICAgICAgIHJldHVybiByZW1vdmVOYW1lc185MzYodGVybV8xMDAwLCBib3VuZE5hbWVzXzEwMDMpO1xuICAgICAgfV0sIFtfLlQsIHRlcm1fMTAwNCA9PiB0ZXJtXzEwMDRdXSkpKCk7XG4gICAgICByZXN1bHRfOTgwID0gcmVzdWx0Xzk4MC5jb25jYXQodGVybSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRfOTgwO1xuICB9XG59XG4iXX0=