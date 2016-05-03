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

var ParseReducer = function (_CloneReducer) {
  _inherits(ParseReducer, _CloneReducer);

  function ParseReducer(context_439) {
    _classCallCheck(this, ParseReducer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ParseReducer).call(this));

    _this.context = context_439;
    return _this;
  }

  _createClass(ParseReducer, [{
    key: "reduceModule",
    value: function reduceModule(node_440, state_441) {
      return new _terms2.default("Module", { directives: state_441.directives.toArray(), items: state_441.items.toArray() });
    }
  }, {
    key: "reduceImport",
    value: function reduceImport(node_442, state_443) {
      var moduleSpecifier_444 = state_443.moduleSpecifier ? state_443.moduleSpecifier.val() : null;
      return new _terms2.default("Import", { defaultBinding: state_443.defaultBinding, namedImports: state_443.namedImports.toArray(), moduleSpecifier: moduleSpecifier_444, forSyntax: node_442.forSyntax });
    }
  }, {
    key: "reduceImportNamespace",
    value: function reduceImportNamespace(node_445, state_446) {
      var moduleSpecifier_447 = state_446.moduleSpecifier ? state_446.moduleSpecifier.val() : null;
      return new _terms2.default("ImportNamespace", { defaultBinding: state_446.defaultBinding, namespaceBinding: state_446.namespaceBinding, moduleSpecifier: moduleSpecifier_447, forSyntax: node_445.forSyntax });
    }
  }, {
    key: "reduceExport",
    value: function reduceExport(node_448, state_449) {
      return new _terms2.default("Export", { declaration: state_449.declaration });
    }
  }, {
    key: "reduceExportAllFrom",
    value: function reduceExportAllFrom(node_450, state_451) {
      var moduleSpecifier_452 = state_451.moduleSpecifier ? state_451.moduleSpecifier.val() : null;
      return new _terms2.default("ExportAllFrom", { moduleSpecifier: moduleSpecifier_452 });
    }
  }, {
    key: "reduceExportFrom",
    value: function reduceExportFrom(node_453, state_454) {
      var moduleSpecifier_455 = state_454.moduleSpecifier ? state_454.moduleSpecifier.val() : null;
      return new _terms2.default("ExportFrom", { moduleSpecifier: moduleSpecifier_455, namedExports: state_454.namedExports.toArray() });
    }
  }, {
    key: "reduceExportSpecifier",
    value: function reduceExportSpecifier(node_456, state_457) {
      var name_458 = state_457.name,
          exportedName_459 = state_457.exportedName;
      if (name_458 == null) {
        name_458 = exportedName_459.resolve(this.context.phase);
        exportedName_459 = exportedName_459.val();
      } else {
        name_458 = name_458.resolve(this.context.phase);
        exportedName_459 = exportedName_459.val();
      }
      return new _terms2.default("ExportSpecifier", { name: name_458, exportedName: exportedName_459 });
    }
  }, {
    key: "reduceImportSpecifier",
    value: function reduceImportSpecifier(node_460, state_461) {
      var name_462 = state_461.name ? state_461.name.resolve(this.context.phase) : null;
      return new _terms2.default("ImportSpecifier", { name: name_462, binding: state_461.binding });
    }
  }, {
    key: "reduceIdentifierExpression",
    value: function reduceIdentifierExpression(node_463, state_464) {
      return new _terms2.default("IdentifierExpression", { name: node_463.name.resolve(this.context.phase) });
    }
  }, {
    key: "reduceLiteralNumericExpression",
    value: function reduceLiteralNumericExpression(node_465, state_466) {
      return new _terms2.default("LiteralNumericExpression", { value: node_465.value.val() });
    }
  }, {
    key: "reduceLiteralBooleanExpression",
    value: function reduceLiteralBooleanExpression(node_467, state_468) {
      return new _terms2.default("LiteralBooleanExpression", { value: node_467.value.val() === "true" });
    }
  }, {
    key: "reduceLiteralStringExpression",
    value: function reduceLiteralStringExpression(node_469, state_470) {
      return new _terms2.default("LiteralStringExpression", { value: node_469.value.token.str });
    }
  }, {
    key: "reduceCallExpression",
    value: function reduceCallExpression(node_471, state_472) {
      return new _terms2.default("CallExpression", { callee: state_472.callee, arguments: state_472.arguments.toArray() });
    }
  }, {
    key: "reduceFunctionBody",
    value: function reduceFunctionBody(node_473, state_474) {
      return new _terms2.default("FunctionBody", { directives: state_474.directives.toArray(), statements: state_474.statements.toArray() });
    }
  }, {
    key: "reduceFormalParameters",
    value: function reduceFormalParameters(node_475, state_476) {
      return new _terms2.default("FormalParameters", { items: state_476.items.toArray(), rest: state_476.rest });
    }
  }, {
    key: "reduceBindingIdentifier",
    value: function reduceBindingIdentifier(node_477, state_478) {
      return new _terms2.default("BindingIdentifier", { name: node_477.name.resolve(this.context.phase) });
    }
  }, {
    key: "reduceBinaryExpression",
    value: function reduceBinaryExpression(node_479, state_480) {
      return new _terms2.default("BinaryExpression", { left: state_480.left, operator: node_479.operator.val(), right: state_480.right });
    }
  }, {
    key: "reduceObjectExpression",
    value: function reduceObjectExpression(node_481, state_482) {
      return new _terms2.default("ObjectExpression", { properties: state_482.properties.toArray() });
    }
  }, {
    key: "reduceVariableDeclaration",
    value: function reduceVariableDeclaration(node_483, state_484) {
      return new _terms2.default("VariableDeclaration", { kind: state_484.kind, declarators: state_484.declarators.toArray() });
    }
  }, {
    key: "reduceStaticPropertyName",
    value: function reduceStaticPropertyName(node_485, state_486) {
      return new _terms2.default("StaticPropertyName", { value: node_485.value.val().toString() });
    }
  }, {
    key: "reduceArrayExpression",
    value: function reduceArrayExpression(node_487, state_488) {
      return new _terms2.default("ArrayExpression", { elements: state_488.elements.toArray() });
    }
  }, {
    key: "reduceStaticMemberExpression",
    value: function reduceStaticMemberExpression(node_489, state_490) {
      return new _terms2.default("StaticMemberExpression", { object: state_490.object, property: state_490.property.val() });
    }
  }]);

  return ParseReducer;
}(_shiftReducer.CloneReducer);

exports.default = ParseReducer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3N3ZWV0L3BhcnNlLXJlZHVjZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7O0lBQ3FCLFk7OztBQUNuQix3QkFBWSxXQUFaLEVBQXlCO0FBQUE7O0FBQUE7O0FBRXZCLFVBQUssT0FBTCxHQUFlLFdBQWY7QUFGdUI7QUFHeEI7Ozs7aUNBQ1ksUSxFQUFVLFMsRUFBVztBQUNoQyxhQUFPLG9CQUFTLFFBQVQsRUFBbUIsRUFBQyxZQUFZLFVBQVUsVUFBVixDQUFxQixPQUFyQixFQUFiLEVBQTZDLE9BQU8sVUFBVSxLQUFWLENBQWdCLE9BQWhCLEVBQXBELEVBQW5CLENBQVA7QUFDRDs7O2lDQUNZLFEsRUFBVSxTLEVBQVc7QUFDaEMsVUFBSSxzQkFBc0IsVUFBVSxlQUFWLEdBQTRCLFVBQVUsZUFBVixDQUEwQixHQUExQixFQUE1QixHQUE4RCxJQUF4RjtBQUNBLGFBQU8sb0JBQVMsUUFBVCxFQUFtQixFQUFDLGdCQUFnQixVQUFVLGNBQTNCLEVBQTJDLGNBQWMsVUFBVSxZQUFWLENBQXVCLE9BQXZCLEVBQXpELEVBQTJGLGlCQUFpQixtQkFBNUcsRUFBaUksV0FBVyxTQUFTLFNBQXJKLEVBQW5CLENBQVA7QUFDRDs7OzBDQUNxQixRLEVBQVUsUyxFQUFXO0FBQ3pDLFVBQUksc0JBQXNCLFVBQVUsZUFBVixHQUE0QixVQUFVLGVBQVYsQ0FBMEIsR0FBMUIsRUFBNUIsR0FBOEQsSUFBeEY7QUFDQSxhQUFPLG9CQUFTLGlCQUFULEVBQTRCLEVBQUMsZ0JBQWdCLFVBQVUsY0FBM0IsRUFBMkMsa0JBQWtCLFVBQVUsZ0JBQXZFLEVBQXlGLGlCQUFpQixtQkFBMUcsRUFBK0gsV0FBVyxTQUFTLFNBQW5KLEVBQTVCLENBQVA7QUFDRDs7O2lDQUNZLFEsRUFBVSxTLEVBQVc7QUFDaEMsYUFBTyxvQkFBUyxRQUFULEVBQW1CLEVBQUMsYUFBYSxVQUFVLFdBQXhCLEVBQW5CLENBQVA7QUFDRDs7O3dDQUNtQixRLEVBQVUsUyxFQUFXO0FBQ3ZDLFVBQUksc0JBQXNCLFVBQVUsZUFBVixHQUE0QixVQUFVLGVBQVYsQ0FBMEIsR0FBMUIsRUFBNUIsR0FBOEQsSUFBeEY7QUFDQSxhQUFPLG9CQUFTLGVBQVQsRUFBMEIsRUFBQyxpQkFBaUIsbUJBQWxCLEVBQTFCLENBQVA7QUFDRDs7O3FDQUNnQixRLEVBQVUsUyxFQUFXO0FBQ3BDLFVBQUksc0JBQXNCLFVBQVUsZUFBVixHQUE0QixVQUFVLGVBQVYsQ0FBMEIsR0FBMUIsRUFBNUIsR0FBOEQsSUFBeEY7QUFDQSxhQUFPLG9CQUFTLFlBQVQsRUFBdUIsRUFBQyxpQkFBaUIsbUJBQWxCLEVBQXVDLGNBQWMsVUFBVSxZQUFWLENBQXVCLE9BQXZCLEVBQXJELEVBQXZCLENBQVA7QUFDRDs7OzBDQUNxQixRLEVBQVUsUyxFQUFXO0FBQ3pDLFVBQUksV0FBVyxVQUFVLElBQXpCO1VBQStCLG1CQUFtQixVQUFVLFlBQTVEO0FBQ0EsVUFBSSxZQUFZLElBQWhCLEVBQXNCO0FBQ3BCLG1CQUFXLGlCQUFpQixPQUFqQixDQUF5QixLQUFLLE9BQUwsQ0FBYSxLQUF0QyxDQUFYO0FBQ0EsMkJBQW1CLGlCQUFpQixHQUFqQixFQUFuQjtBQUNELE9BSEQsTUFHTztBQUNMLG1CQUFXLFNBQVMsT0FBVCxDQUFpQixLQUFLLE9BQUwsQ0FBYSxLQUE5QixDQUFYO0FBQ0EsMkJBQW1CLGlCQUFpQixHQUFqQixFQUFuQjtBQUNEO0FBQ0QsYUFBTyxvQkFBUyxpQkFBVCxFQUE0QixFQUFDLE1BQU0sUUFBUCxFQUFpQixjQUFjLGdCQUEvQixFQUE1QixDQUFQO0FBQ0Q7OzswQ0FDcUIsUSxFQUFVLFMsRUFBVztBQUN6QyxVQUFJLFdBQVcsVUFBVSxJQUFWLEdBQWlCLFVBQVUsSUFBVixDQUFlLE9BQWYsQ0FBdUIsS0FBSyxPQUFMLENBQWEsS0FBcEMsQ0FBakIsR0FBOEQsSUFBN0U7QUFDQSxhQUFPLG9CQUFTLGlCQUFULEVBQTRCLEVBQUMsTUFBTSxRQUFQLEVBQWlCLFNBQVMsVUFBVSxPQUFwQyxFQUE1QixDQUFQO0FBQ0Q7OzsrQ0FDMEIsUSxFQUFVLFMsRUFBVztBQUM5QyxhQUFPLG9CQUFTLHNCQUFULEVBQWlDLEVBQUMsTUFBTSxTQUFTLElBQVQsQ0FBYyxPQUFkLENBQXNCLEtBQUssT0FBTCxDQUFhLEtBQW5DLENBQVAsRUFBakMsQ0FBUDtBQUNEOzs7bURBQzhCLFEsRUFBVSxTLEVBQVc7QUFDbEQsYUFBTyxvQkFBUywwQkFBVCxFQUFxQyxFQUFDLE9BQU8sU0FBUyxLQUFULENBQWUsR0FBZixFQUFSLEVBQXJDLENBQVA7QUFDRDs7O21EQUM4QixRLEVBQVUsUyxFQUFXO0FBQ2xELGFBQU8sb0JBQVMsMEJBQVQsRUFBcUMsRUFBQyxPQUFPLFNBQVMsS0FBVCxDQUFlLEdBQWYsT0FBeUIsTUFBakMsRUFBckMsQ0FBUDtBQUNEOzs7a0RBQzZCLFEsRUFBVSxTLEVBQVc7QUFDakQsYUFBTyxvQkFBUyx5QkFBVCxFQUFvQyxFQUFDLE9BQU8sU0FBUyxLQUFULENBQWUsS0FBZixDQUFxQixHQUE3QixFQUFwQyxDQUFQO0FBQ0Q7Ozt5Q0FDb0IsUSxFQUFVLFMsRUFBVztBQUN4QyxhQUFPLG9CQUFTLGdCQUFULEVBQTJCLEVBQUMsUUFBUSxVQUFVLE1BQW5CLEVBQTJCLFdBQVcsVUFBVSxTQUFWLENBQW9CLE9BQXBCLEVBQXRDLEVBQTNCLENBQVA7QUFDRDs7O3VDQUNrQixRLEVBQVUsUyxFQUFXO0FBQ3RDLGFBQU8sb0JBQVMsY0FBVCxFQUF5QixFQUFDLFlBQVksVUFBVSxVQUFWLENBQXFCLE9BQXJCLEVBQWIsRUFBNkMsWUFBWSxVQUFVLFVBQVYsQ0FBcUIsT0FBckIsRUFBekQsRUFBekIsQ0FBUDtBQUNEOzs7MkNBQ3NCLFEsRUFBVSxTLEVBQVc7QUFDMUMsYUFBTyxvQkFBUyxrQkFBVCxFQUE2QixFQUFDLE9BQU8sVUFBVSxLQUFWLENBQWdCLE9BQWhCLEVBQVIsRUFBbUMsTUFBTSxVQUFVLElBQW5ELEVBQTdCLENBQVA7QUFDRDs7OzRDQUN1QixRLEVBQVUsUyxFQUFXO0FBQzNDLGFBQU8sb0JBQVMsbUJBQVQsRUFBOEIsRUFBQyxNQUFNLFNBQVMsSUFBVCxDQUFjLE9BQWQsQ0FBc0IsS0FBSyxPQUFMLENBQWEsS0FBbkMsQ0FBUCxFQUE5QixDQUFQO0FBQ0Q7OzsyQ0FDc0IsUSxFQUFVLFMsRUFBVztBQUMxQyxhQUFPLG9CQUFTLGtCQUFULEVBQTZCLEVBQUMsTUFBTSxVQUFVLElBQWpCLEVBQXVCLFVBQVUsU0FBUyxRQUFULENBQWtCLEdBQWxCLEVBQWpDLEVBQTBELE9BQU8sVUFBVSxLQUEzRSxFQUE3QixDQUFQO0FBQ0Q7OzsyQ0FDc0IsUSxFQUFVLFMsRUFBVztBQUMxQyxhQUFPLG9CQUFTLGtCQUFULEVBQTZCLEVBQUMsWUFBWSxVQUFVLFVBQVYsQ0FBcUIsT0FBckIsRUFBYixFQUE3QixDQUFQO0FBQ0Q7Ozs4Q0FDeUIsUSxFQUFVLFMsRUFBVztBQUM3QyxhQUFPLG9CQUFTLHFCQUFULEVBQWdDLEVBQUMsTUFBTSxVQUFVLElBQWpCLEVBQXVCLGFBQWEsVUFBVSxXQUFWLENBQXNCLE9BQXRCLEVBQXBDLEVBQWhDLENBQVA7QUFDRDs7OzZDQUN3QixRLEVBQVUsUyxFQUFXO0FBQzVDLGFBQU8sb0JBQVMsb0JBQVQsRUFBK0IsRUFBQyxPQUFPLFNBQVMsS0FBVCxDQUFlLEdBQWYsR0FBcUIsUUFBckIsRUFBUixFQUEvQixDQUFQO0FBQ0Q7OzswQ0FDcUIsUSxFQUFVLFMsRUFBVztBQUN6QyxhQUFPLG9CQUFTLGlCQUFULEVBQTRCLEVBQUMsVUFBVSxVQUFVLFFBQVYsQ0FBbUIsT0FBbkIsRUFBWCxFQUE1QixDQUFQO0FBQ0Q7OztpREFDNEIsUSxFQUFVLFMsRUFBVztBQUNoRCxhQUFPLG9CQUFTLHdCQUFULEVBQW1DLEVBQUMsUUFBUSxVQUFVLE1BQW5CLEVBQTJCLFVBQVUsVUFBVSxRQUFWLENBQW1CLEdBQW5CLEVBQXJDLEVBQW5DLENBQVA7QUFDRDs7Ozs7O2tCQW5Ga0IsWSIsImZpbGUiOiJwYXJzZS1yZWR1Y2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRlcm0gZnJvbSBcIi4vdGVybXNcIjtcbmltcG9ydCB7Q2xvbmVSZWR1Y2VyfSBmcm9tIFwic2hpZnQtcmVkdWNlclwiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFyc2VSZWR1Y2VyIGV4dGVuZHMgQ2xvbmVSZWR1Y2VyIHtcbiAgY29uc3RydWN0b3IoY29udGV4dF80MzkpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHRfNDM5O1xuICB9XG4gIHJlZHVjZU1vZHVsZShub2RlXzQ0MCwgc3RhdGVfNDQxKSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiTW9kdWxlXCIsIHtkaXJlY3RpdmVzOiBzdGF0ZV80NDEuZGlyZWN0aXZlcy50b0FycmF5KCksIGl0ZW1zOiBzdGF0ZV80NDEuaXRlbXMudG9BcnJheSgpfSk7XG4gIH1cbiAgcmVkdWNlSW1wb3J0KG5vZGVfNDQyLCBzdGF0ZV80NDMpIHtcbiAgICBsZXQgbW9kdWxlU3BlY2lmaWVyXzQ0NCA9IHN0YXRlXzQ0My5tb2R1bGVTcGVjaWZpZXIgPyBzdGF0ZV80NDMubW9kdWxlU3BlY2lmaWVyLnZhbCgpIDogbnVsbDtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJJbXBvcnRcIiwge2RlZmF1bHRCaW5kaW5nOiBzdGF0ZV80NDMuZGVmYXVsdEJpbmRpbmcsIG5hbWVkSW1wb3J0czogc3RhdGVfNDQzLm5hbWVkSW1wb3J0cy50b0FycmF5KCksIG1vZHVsZVNwZWNpZmllcjogbW9kdWxlU3BlY2lmaWVyXzQ0NCwgZm9yU3ludGF4OiBub2RlXzQ0Mi5mb3JTeW50YXh9KTtcbiAgfVxuICByZWR1Y2VJbXBvcnROYW1lc3BhY2Uobm9kZV80NDUsIHN0YXRlXzQ0Nikge1xuICAgIGxldCBtb2R1bGVTcGVjaWZpZXJfNDQ3ID0gc3RhdGVfNDQ2Lm1vZHVsZVNwZWNpZmllciA/IHN0YXRlXzQ0Ni5tb2R1bGVTcGVjaWZpZXIudmFsKCkgOiBudWxsO1xuICAgIHJldHVybiBuZXcgVGVybShcIkltcG9ydE5hbWVzcGFjZVwiLCB7ZGVmYXVsdEJpbmRpbmc6IHN0YXRlXzQ0Ni5kZWZhdWx0QmluZGluZywgbmFtZXNwYWNlQmluZGluZzogc3RhdGVfNDQ2Lm5hbWVzcGFjZUJpbmRpbmcsIG1vZHVsZVNwZWNpZmllcjogbW9kdWxlU3BlY2lmaWVyXzQ0NywgZm9yU3ludGF4OiBub2RlXzQ0NS5mb3JTeW50YXh9KTtcbiAgfVxuICByZWR1Y2VFeHBvcnQobm9kZV80NDgsIHN0YXRlXzQ0OSkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkV4cG9ydFwiLCB7ZGVjbGFyYXRpb246IHN0YXRlXzQ0OS5kZWNsYXJhdGlvbn0pO1xuICB9XG4gIHJlZHVjZUV4cG9ydEFsbEZyb20obm9kZV80NTAsIHN0YXRlXzQ1MSkge1xuICAgIGxldCBtb2R1bGVTcGVjaWZpZXJfNDUyID0gc3RhdGVfNDUxLm1vZHVsZVNwZWNpZmllciA/IHN0YXRlXzQ1MS5tb2R1bGVTcGVjaWZpZXIudmFsKCkgOiBudWxsO1xuICAgIHJldHVybiBuZXcgVGVybShcIkV4cG9ydEFsbEZyb21cIiwge21vZHVsZVNwZWNpZmllcjogbW9kdWxlU3BlY2lmaWVyXzQ1Mn0pO1xuICB9XG4gIHJlZHVjZUV4cG9ydEZyb20obm9kZV80NTMsIHN0YXRlXzQ1NCkge1xuICAgIGxldCBtb2R1bGVTcGVjaWZpZXJfNDU1ID0gc3RhdGVfNDU0Lm1vZHVsZVNwZWNpZmllciA/IHN0YXRlXzQ1NC5tb2R1bGVTcGVjaWZpZXIudmFsKCkgOiBudWxsO1xuICAgIHJldHVybiBuZXcgVGVybShcIkV4cG9ydEZyb21cIiwge21vZHVsZVNwZWNpZmllcjogbW9kdWxlU3BlY2lmaWVyXzQ1NSwgbmFtZWRFeHBvcnRzOiBzdGF0ZV80NTQubmFtZWRFeHBvcnRzLnRvQXJyYXkoKX0pO1xuICB9XG4gIHJlZHVjZUV4cG9ydFNwZWNpZmllcihub2RlXzQ1Niwgc3RhdGVfNDU3KSB7XG4gICAgbGV0IG5hbWVfNDU4ID0gc3RhdGVfNDU3Lm5hbWUsIGV4cG9ydGVkTmFtZV80NTkgPSBzdGF0ZV80NTcuZXhwb3J0ZWROYW1lO1xuICAgIGlmIChuYW1lXzQ1OCA9PSBudWxsKSB7XG4gICAgICBuYW1lXzQ1OCA9IGV4cG9ydGVkTmFtZV80NTkucmVzb2x2ZSh0aGlzLmNvbnRleHQucGhhc2UpO1xuICAgICAgZXhwb3J0ZWROYW1lXzQ1OSA9IGV4cG9ydGVkTmFtZV80NTkudmFsKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWVfNDU4ID0gbmFtZV80NTgucmVzb2x2ZSh0aGlzLmNvbnRleHQucGhhc2UpO1xuICAgICAgZXhwb3J0ZWROYW1lXzQ1OSA9IGV4cG9ydGVkTmFtZV80NTkudmFsKCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgVGVybShcIkV4cG9ydFNwZWNpZmllclwiLCB7bmFtZTogbmFtZV80NTgsIGV4cG9ydGVkTmFtZTogZXhwb3J0ZWROYW1lXzQ1OX0pO1xuICB9XG4gIHJlZHVjZUltcG9ydFNwZWNpZmllcihub2RlXzQ2MCwgc3RhdGVfNDYxKSB7XG4gICAgbGV0IG5hbWVfNDYyID0gc3RhdGVfNDYxLm5hbWUgPyBzdGF0ZV80NjEubmFtZS5yZXNvbHZlKHRoaXMuY29udGV4dC5waGFzZSkgOiBudWxsO1xuICAgIHJldHVybiBuZXcgVGVybShcIkltcG9ydFNwZWNpZmllclwiLCB7bmFtZTogbmFtZV80NjIsIGJpbmRpbmc6IHN0YXRlXzQ2MS5iaW5kaW5nfSk7XG4gIH1cbiAgcmVkdWNlSWRlbnRpZmllckV4cHJlc3Npb24obm9kZV80NjMsIHN0YXRlXzQ2NCkge1xuICAgIHJldHVybiBuZXcgVGVybShcIklkZW50aWZpZXJFeHByZXNzaW9uXCIsIHtuYW1lOiBub2RlXzQ2My5uYW1lLnJlc29sdmUodGhpcy5jb250ZXh0LnBoYXNlKX0pO1xuICB9XG4gIHJlZHVjZUxpdGVyYWxOdW1lcmljRXhwcmVzc2lvbihub2RlXzQ2NSwgc3RhdGVfNDY2KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiTGl0ZXJhbE51bWVyaWNFeHByZXNzaW9uXCIsIHt2YWx1ZTogbm9kZV80NjUudmFsdWUudmFsKCl9KTtcbiAgfVxuICByZWR1Y2VMaXRlcmFsQm9vbGVhbkV4cHJlc3Npb24obm9kZV80NjcsIHN0YXRlXzQ2OCkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkxpdGVyYWxCb29sZWFuRXhwcmVzc2lvblwiLCB7dmFsdWU6IG5vZGVfNDY3LnZhbHVlLnZhbCgpID09PSBcInRydWVcIn0pO1xuICB9XG4gIHJlZHVjZUxpdGVyYWxTdHJpbmdFeHByZXNzaW9uKG5vZGVfNDY5LCBzdGF0ZV80NzApIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJMaXRlcmFsU3RyaW5nRXhwcmVzc2lvblwiLCB7dmFsdWU6IG5vZGVfNDY5LnZhbHVlLnRva2VuLnN0cn0pO1xuICB9XG4gIHJlZHVjZUNhbGxFeHByZXNzaW9uKG5vZGVfNDcxLCBzdGF0ZV80NzIpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJDYWxsRXhwcmVzc2lvblwiLCB7Y2FsbGVlOiBzdGF0ZV80NzIuY2FsbGVlLCBhcmd1bWVudHM6IHN0YXRlXzQ3Mi5hcmd1bWVudHMudG9BcnJheSgpfSk7XG4gIH1cbiAgcmVkdWNlRnVuY3Rpb25Cb2R5KG5vZGVfNDczLCBzdGF0ZV80NzQpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJGdW5jdGlvbkJvZHlcIiwge2RpcmVjdGl2ZXM6IHN0YXRlXzQ3NC5kaXJlY3RpdmVzLnRvQXJyYXkoKSwgc3RhdGVtZW50czogc3RhdGVfNDc0LnN0YXRlbWVudHMudG9BcnJheSgpfSk7XG4gIH1cbiAgcmVkdWNlRm9ybWFsUGFyYW1ldGVycyhub2RlXzQ3NSwgc3RhdGVfNDc2KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiRm9ybWFsUGFyYW1ldGVyc1wiLCB7aXRlbXM6IHN0YXRlXzQ3Ni5pdGVtcy50b0FycmF5KCksIHJlc3Q6IHN0YXRlXzQ3Ni5yZXN0fSk7XG4gIH1cbiAgcmVkdWNlQmluZGluZ0lkZW50aWZpZXIobm9kZV80NzcsIHN0YXRlXzQ3OCkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkJpbmRpbmdJZGVudGlmaWVyXCIsIHtuYW1lOiBub2RlXzQ3Ny5uYW1lLnJlc29sdmUodGhpcy5jb250ZXh0LnBoYXNlKX0pO1xuICB9XG4gIHJlZHVjZUJpbmFyeUV4cHJlc3Npb24obm9kZV80NzksIHN0YXRlXzQ4MCkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkJpbmFyeUV4cHJlc3Npb25cIiwge2xlZnQ6IHN0YXRlXzQ4MC5sZWZ0LCBvcGVyYXRvcjogbm9kZV80Nzkub3BlcmF0b3IudmFsKCksIHJpZ2h0OiBzdGF0ZV80ODAucmlnaHR9KTtcbiAgfVxuICByZWR1Y2VPYmplY3RFeHByZXNzaW9uKG5vZGVfNDgxLCBzdGF0ZV80ODIpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJPYmplY3RFeHByZXNzaW9uXCIsIHtwcm9wZXJ0aWVzOiBzdGF0ZV80ODIucHJvcGVydGllcy50b0FycmF5KCl9KTtcbiAgfVxuICByZWR1Y2VWYXJpYWJsZURlY2xhcmF0aW9uKG5vZGVfNDgzLCBzdGF0ZV80ODQpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJWYXJpYWJsZURlY2xhcmF0aW9uXCIsIHtraW5kOiBzdGF0ZV80ODQua2luZCwgZGVjbGFyYXRvcnM6IHN0YXRlXzQ4NC5kZWNsYXJhdG9ycy50b0FycmF5KCl9KTtcbiAgfVxuICByZWR1Y2VTdGF0aWNQcm9wZXJ0eU5hbWUobm9kZV80ODUsIHN0YXRlXzQ4Nikge1xuICAgIHJldHVybiBuZXcgVGVybShcIlN0YXRpY1Byb3BlcnR5TmFtZVwiLCB7dmFsdWU6IG5vZGVfNDg1LnZhbHVlLnZhbCgpLnRvU3RyaW5nKCl9KTtcbiAgfVxuICByZWR1Y2VBcnJheUV4cHJlc3Npb24obm9kZV80ODcsIHN0YXRlXzQ4OCkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkFycmF5RXhwcmVzc2lvblwiLCB7ZWxlbWVudHM6IHN0YXRlXzQ4OC5lbGVtZW50cy50b0FycmF5KCl9KTtcbiAgfVxuICByZWR1Y2VTdGF0aWNNZW1iZXJFeHByZXNzaW9uKG5vZGVfNDg5LCBzdGF0ZV80OTApIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJTdGF0aWNNZW1iZXJFeHByZXNzaW9uXCIsIHtvYmplY3Q6IHN0YXRlXzQ5MC5vYmplY3QsIHByb3BlcnR5OiBzdGF0ZV80OTAucHJvcGVydHkudmFsKCl9KTtcbiAgfVxufVxuIl19