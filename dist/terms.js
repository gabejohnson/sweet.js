"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isCompiletimeStatement = exports.isCompiletimeDeclaration = exports.isSyntaxDeclarationStatement = exports.isExportSyntax = exports.isParenthesizedExpression = exports.isFunctionWithName = exports.isFunctionTerm = exports.isSyntaxrecDeclaration = exports.isSyntaxDeclaration = exports.isEOF = exports.isVariableDeclarator = exports.isVariableDeclaration = exports.isSyntaxTemplate = exports.isTemplateElement = exports.isSwitchDefault = exports.isSwitchCase = exports.isSuper = exports.isSpreadElement = exports.isScript = exports.isFunctionDeclaration = exports.isFunctionBody = exports.isFormalParameters = exports.isDirective = exports.isCatchClause = exports.isBlock = exports.isWithStatement = exports.isWhileStatement = exports.isVariableDeclarationStatement = exports.isTryFinallyStatement = exports.isTryCatchStatement = exports.isThrowStatement = exports.isSwitchStatementWithDefault = exports.isSwitchStatement = exports.isReturnStatement = exports.isLabeledStatement = exports.isIfStatement = exports.isForStatement = exports.isForOfStatement = exports.isForInStatement = exports.isExpressionStatement = exports.isEmptyStatement = exports.isDoWhileStatement = exports.isDebuggerStatement = exports.isCompoundAssignmentExpression = exports.isContinueStatement = exports.isBreakStatement = exports.isBlockStatement = exports.isYieldGeneratorExpression = exports.isYieldExpression = exports.isUpdateExpression = exports.isThisExpression = exports.isTemplateExpression = exports.isStaticMemberExpression = exports.isUnaryExpression = exports.isObjectExpression = exports.isNewTargetExpression = exports.isNewExpression = exports.isIdentifierExpression = exports.isFunctionExpression = exports.isConditionalExpression = exports.isComputedMemberExpression = exports.isComputedAssignmentExpression = exports.isCallExpression = exports.isBinaryExpression = exports.isAssignmentExpression = exports.isArrowExpression = exports.isArrayExpression = exports.isLiteralStringExpression = exports.isLiteralRegExpExpression = exports.isLiteralNumericExpression = exports.isLiteralNullExpression = exports.isLiteralInfinityExpression = exports.isLiteralBooleanExpression = exports.isStaticPropertyName = exports.isComputedPropertyName = exports.isShorthandProperty = exports.isDataProperty = exports.isSetter = exports.isGetter = exports.isMethod = exports.isExportSpecifier = exports.isExportDefault = exports.isExport = exports.isExportFrom = exports.isExportAllFrom = exports.isImportSpecifier = exports.isImportNamespace = exports.isImport = exports.isModule = exports.isClassElement = exports.isClassDeclaration = exports.isClassExpression = exports.isBindingPropertyProperty = exports.isBindingPropertyIdentifier = exports.isObjectBinding = exports.isArrayBinding = exports.isBindingIdentifier = exports.isBindingWithDefault = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _immutable = require("immutable");

var _errors = require("./errors");

var _utils = require("./utils");

var _syntax = require("./syntax");

var _syntax2 = _interopRequireDefault(_syntax);

var _ramda = require("ramda");

var R = _interopRequireWildcard(_ramda);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Term = function () {
  function Term(type_916, props_917) {
    _classCallCheck(this, Term);

    this.type = type_916;
    this.loc = null;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.keys(props_917)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var prop = _step.value;

        this[prop] = props_917[prop];
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  _createClass(Term, [{
    key: "gen",
    value: function gen() {
      var next_918 = {};
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = fieldsIn_915(this)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var field = _step2.value;

          if (this[field] == null) {
            next_918[field] = null;
          } else if (this[field] instanceof Term) {
            next_918[field] = this[field].gen();
          } else if (_immutable.List.isList(this[field])) {
            next_918[field] = this[field].filter(R.complement(isCompiletimeStatement)).map(function (term_919) {
              return term_919 instanceof Term ? term_919.gen() : term_919;
            });
          } else {
            next_918[field] = this[field];
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return new Term(this.type, next_918);
    }
  }, {
    key: "addScope",
    value: function addScope(scope_920, bindings_921, phase_922, options_923) {
      var next_924 = {};
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = fieldsIn_915(this)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var field = _step3.value;

          if (this[field] == null) {
            next_924[field] = null;
          } else if (typeof this[field].addScope === "function") {
            next_924[field] = this[field].addScope(scope_920, bindings_921, phase_922, options_923);
          } else if (_immutable.List.isList(this[field])) {
            next_924[field] = this[field].map(function (f_925) {
              return f_925.addScope(scope_920, bindings_921, phase_922, options_923);
            });
          } else {
            next_924[field] = this[field];
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return new Term(this.type, next_924);
    }
  }]);

  return Term;
}();

exports.default = Term;
var isBindingWithDefault = exports.isBindingWithDefault = R.whereEq({ type: "BindingWithDefault" });
;
var isBindingIdentifier = exports.isBindingIdentifier = R.whereEq({ type: "BindingIdentifier" });
;
var isArrayBinding = exports.isArrayBinding = R.whereEq({ type: "ArrayBinding" });
;
var isObjectBinding = exports.isObjectBinding = R.whereEq({ type: "ObjectBinding" });
;
var isBindingPropertyIdentifier = exports.isBindingPropertyIdentifier = R.whereEq({ type: "BindingPropertyIdentifier" });
;
var isBindingPropertyProperty = exports.isBindingPropertyProperty = R.whereEq({ type: "BindingPropertyIdentifier" });
;
var isClassExpression = exports.isClassExpression = R.whereEq({ type: "ClassExpression" });
;
var isClassDeclaration = exports.isClassDeclaration = R.whereEq({ type: "ClassDeclaration" });
;
var isClassElement = exports.isClassElement = R.whereEq({ type: "ClassElement" });
;
var isModule = exports.isModule = R.whereEq({ type: "Module" });
;
var isImport = exports.isImport = R.whereEq({ type: "Import" });
;
var isImportNamespace = exports.isImportNamespace = R.whereEq({ type: "ImportNamespace" });
;
var isImportSpecifier = exports.isImportSpecifier = R.whereEq({ type: "ImportSpecifier" });
;
var isExportAllFrom = exports.isExportAllFrom = R.whereEq({ type: "ExportAllFrom" });
;
var isExportFrom = exports.isExportFrom = R.whereEq({ type: "ExportFrom" });
;
var isExport = exports.isExport = R.whereEq({ type: "Export" });
;
var isExportDefault = exports.isExportDefault = R.whereEq({ type: "ExportDefault" });
;
var isExportSpecifier = exports.isExportSpecifier = R.whereEq({ type: "ExportSpecifier" });
;
var isMethod = exports.isMethod = R.whereEq({ type: "Method" });
;
var isGetter = exports.isGetter = R.whereEq({ type: "Getter" });
;
var isSetter = exports.isSetter = R.whereEq({ type: "Setter" });
;
var isDataProperty = exports.isDataProperty = R.whereEq({ type: "DataProperty" });
;
var isShorthandProperty = exports.isShorthandProperty = R.whereEq({ type: "ShorthandProperty" });
;
var isComputedPropertyName = exports.isComputedPropertyName = R.whereEq({ type: "ComputedPropertyName" });
;
var isStaticPropertyName = exports.isStaticPropertyName = R.whereEq({ type: "StaticPropertyName" });
;
var isLiteralBooleanExpression = exports.isLiteralBooleanExpression = R.whereEq({ type: "LiteralBooleanExpression" });
;
var isLiteralInfinityExpression = exports.isLiteralInfinityExpression = R.whereEq({ type: "LiteralInfinityExpression" });
;
var isLiteralNullExpression = exports.isLiteralNullExpression = R.whereEq({ type: "LiteralNullExpression" });
;
var isLiteralNumericExpression = exports.isLiteralNumericExpression = R.whereEq({ type: "LiteralNumericExpression" });
;
var isLiteralRegExpExpression = exports.isLiteralRegExpExpression = R.whereEq({ type: "LiteralRegExpExpression" });
;
var isLiteralStringExpression = exports.isLiteralStringExpression = R.whereEq({ type: "LiteralStringExpression" });
;
var isArrayExpression = exports.isArrayExpression = R.whereEq({ type: "ArrayExpression" });
;
var isArrowExpression = exports.isArrowExpression = R.whereEq({ type: "ArrowExpression" });
;
var isAssignmentExpression = exports.isAssignmentExpression = R.whereEq({ type: "AssignmentExpression" });
;
var isBinaryExpression = exports.isBinaryExpression = R.whereEq({ type: "BinaryExpression" });
;
var isCallExpression = exports.isCallExpression = R.whereEq({ type: "CallExpression" });
;
var isComputedAssignmentExpression = exports.isComputedAssignmentExpression = R.whereEq({ type: "ComputedAssignmentExpression" });
;
var isComputedMemberExpression = exports.isComputedMemberExpression = R.whereEq({ type: "ComputedMemberExpression" });
;
var isConditionalExpression = exports.isConditionalExpression = R.whereEq({ type: "ConditionalExpression" });
;
var isFunctionExpression = exports.isFunctionExpression = R.whereEq({ type: "FunctionExpression" });
;
var isIdentifierExpression = exports.isIdentifierExpression = R.whereEq({ type: "IdentifierExpression" });
;
var isNewExpression = exports.isNewExpression = R.whereEq({ type: "NewExpression" });
;
var isNewTargetExpression = exports.isNewTargetExpression = R.whereEq({ type: "NewTargetExpression" });
;
var isObjectExpression = exports.isObjectExpression = R.whereEq({ type: "ObjectExpression" });
;
var isUnaryExpression = exports.isUnaryExpression = R.whereEq({ type: "UnaryExpression" });
;
var isStaticMemberExpression = exports.isStaticMemberExpression = R.whereEq({ type: "StaticMemberExpression" });
;
var isTemplateExpression = exports.isTemplateExpression = R.whereEq({ type: "TemplateExpression" });
;
var isThisExpression = exports.isThisExpression = R.whereEq({ type: "ThisExpression" });
;
var isUpdateExpression = exports.isUpdateExpression = R.whereEq({ type: "UpdateExpression" });
;
var isYieldExpression = exports.isYieldExpression = R.whereEq({ type: "YieldExpression" });
;
var isYieldGeneratorExpression = exports.isYieldGeneratorExpression = R.whereEq({ type: "YieldGeneratorExpression" });
;
var isBlockStatement = exports.isBlockStatement = R.whereEq({ type: "BlockStatement" });
;
var isBreakStatement = exports.isBreakStatement = R.whereEq({ type: "BreakStatement" });
;
var isContinueStatement = exports.isContinueStatement = R.whereEq({ type: "ContinueStatement" });
;
var isCompoundAssignmentExpression = exports.isCompoundAssignmentExpression = R.whereEq({ type: "CompoundAssignmentExpression" });
;
var isDebuggerStatement = exports.isDebuggerStatement = R.whereEq({ type: "DebuggerStatement" });
;
var isDoWhileStatement = exports.isDoWhileStatement = R.whereEq({ type: "DoWhileStatement" });
;
var isEmptyStatement = exports.isEmptyStatement = R.whereEq({ type: "EmptyStatement" });
;
var isExpressionStatement = exports.isExpressionStatement = R.whereEq({ type: "ExpressionStatement" });
;
var isForInStatement = exports.isForInStatement = R.whereEq({ type: "ForInStatement" });
;
var isForOfStatement = exports.isForOfStatement = R.whereEq({ type: "ForOfStatement" });
;
var isForStatement = exports.isForStatement = R.whereEq({ type: "ForStatement" });
;
var isIfStatement = exports.isIfStatement = R.whereEq({ type: "IfStatement" });
;
var isLabeledStatement = exports.isLabeledStatement = R.whereEq({ type: "LabeledStatement" });
;
var isReturnStatement = exports.isReturnStatement = R.whereEq({ type: "ReturnStatement" });
;
var isSwitchStatement = exports.isSwitchStatement = R.whereEq({ type: "SwitchStatement" });
;
var isSwitchStatementWithDefault = exports.isSwitchStatementWithDefault = R.whereEq({ type: "SwitchStatementWithDefault" });
;
var isThrowStatement = exports.isThrowStatement = R.whereEq({ type: "ThrowStatement" });
;
var isTryCatchStatement = exports.isTryCatchStatement = R.whereEq({ type: "TryCatchStatement" });
;
var isTryFinallyStatement = exports.isTryFinallyStatement = R.whereEq({ type: "TryFinallyStatement" });
;
var isVariableDeclarationStatement = exports.isVariableDeclarationStatement = R.whereEq({ type: "VariableDeclarationStatement" });
;
var isWhileStatement = exports.isWhileStatement = R.whereEq({ type: "WhileStatement" });
;
var isWithStatement = exports.isWithStatement = R.whereEq({ type: "WithStatement" });
;
var isBlock = exports.isBlock = R.whereEq({ type: "Block" });
;
var isCatchClause = exports.isCatchClause = R.whereEq({ type: "CatchClause" });
;
var isDirective = exports.isDirective = R.whereEq({ type: "Directive" });
;
var isFormalParameters = exports.isFormalParameters = R.whereEq({ type: "FormalParameters" });
;
var isFunctionBody = exports.isFunctionBody = R.whereEq({ type: "FunctionBody" });
;
var isFunctionDeclaration = exports.isFunctionDeclaration = R.whereEq({ type: "FunctionDeclaration" });
;
var isScript = exports.isScript = R.whereEq({ type: "Script" });
;
var isSpreadElement = exports.isSpreadElement = R.whereEq({ type: "SpreadElement" });
;
var isSuper = exports.isSuper = R.whereEq({ type: "Super" });
;
var isSwitchCase = exports.isSwitchCase = R.whereEq({ type: "SwitchCase" });
;
var isSwitchDefault = exports.isSwitchDefault = R.whereEq({ type: "SwitchDefault" });
;
var isTemplateElement = exports.isTemplateElement = R.whereEq({ type: "TemplateElement" });
;
var isSyntaxTemplate = exports.isSyntaxTemplate = R.whereEq({ type: "SyntaxTemplate" });
;
var isVariableDeclaration = exports.isVariableDeclaration = R.whereEq({ type: "VariableDeclaration" });
;
var isVariableDeclarator = exports.isVariableDeclarator = R.whereEq({ type: "VariableDeclarator" });
;
var isEOF = exports.isEOF = R.whereEq({ type: "EOF" });
;
var isSyntaxDeclaration = exports.isSyntaxDeclaration = R.both(isVariableDeclaration, R.whereEq({ kind: "syntax" }));
;
var isSyntaxrecDeclaration = exports.isSyntaxrecDeclaration = R.both(isVariableDeclaration, R.whereEq({ kind: "syntaxrec" }));
;
var isFunctionTerm = exports.isFunctionTerm = R.either(isFunctionDeclaration, isFunctionExpression);
;
var isFunctionWithName = exports.isFunctionWithName = R.and(isFunctionTerm, R.complement(R.where({ name: R.isNil })));
;
var isParenthesizedExpression = exports.isParenthesizedExpression = R.whereEq({ type: "ParenthesizedExpression" });
;
var isExportSyntax = exports.isExportSyntax = R.both(isExport, function (exp_926) {
  return R.or(isSyntaxDeclaration(exp_926.declaration), isSyntaxrecDeclaration(exp_926.declaration));
});
;
var isSyntaxDeclarationStatement = exports.isSyntaxDeclarationStatement = R.both(isVariableDeclarationStatement, function (decl_927) {
  return isCompiletimeDeclaration(decl_927.declaration);
});
;
var isCompiletimeDeclaration = exports.isCompiletimeDeclaration = R.either(isSyntaxDeclaration, isSyntaxrecDeclaration);
;
var isCompiletimeStatement = exports.isCompiletimeStatement = function isCompiletimeStatement(term_928) {
  return term_928 instanceof Term && isVariableDeclarationStatement(term_928) && isCompiletimeDeclaration(term_928.declaration);
};
;
var fieldsIn_915 = R.cond([[isBindingWithDefault, R.always(_immutable.List.of("binding", "init"))], [isBindingIdentifier, R.always(_immutable.List.of("name"))], [isArrayBinding, R.always(_immutable.List.of("elements", "restElement"))], [isObjectBinding, R.always(_immutable.List.of("properties"))], [isBindingPropertyIdentifier, R.always(_immutable.List.of("binding", "init"))], [isBindingPropertyProperty, R.always(_immutable.List.of("name", "binding"))], [isClassExpression, R.always(_immutable.List.of("name", "super", "elements"))], [isClassDeclaration, R.always(_immutable.List.of("name", "super", "elements"))], [isClassElement, R.always(_immutable.List.of("isStatic", "method"))], [isModule, R.always(_immutable.List.of("directives", "items"))], [isImport, R.always(_immutable.List.of("moduleSpecifier", "defaultBinding", "namedImports", "forSyntax"))], [isImportNamespace, R.always(_immutable.List.of("moduleSpecifier", "defaultBinding", "namespaceBinding"))], [isImportSpecifier, R.always(_immutable.List.of("name", "binding"))], [isExportAllFrom, R.always(_immutable.List.of("moduleSpecifier"))], [isExportFrom, R.always(_immutable.List.of("namedExports", "moduleSpecifier"))], [isExport, R.always(_immutable.List.of("declaration"))], [isExportDefault, R.always(_immutable.List.of("body"))], [isExportSpecifier, R.always(_immutable.List.of("name", "exportedName"))], [isMethod, R.always(_immutable.List.of("name", "body", "isGenerator", "params"))], [isGetter, R.always(_immutable.List.of("name", "body"))], [isSetter, R.always(_immutable.List.of("name", "body", "param"))], [isDataProperty, R.always(_immutable.List.of("name", "expression"))], [isShorthandProperty, R.always(_immutable.List.of("expression"))], [isStaticPropertyName, R.always(_immutable.List.of("value"))], [isLiteralBooleanExpression, R.always(_immutable.List.of("value"))], [isLiteralInfinityExpression, R.always((0, _immutable.List)())], [isLiteralNullExpression, R.always((0, _immutable.List)())], [isLiteralNumericExpression, R.always(_immutable.List.of("value"))], [isLiteralRegExpExpression, R.always(_immutable.List.of("pattern", "flags"))], [isLiteralStringExpression, R.always(_immutable.List.of("value"))], [isArrayExpression, R.always(_immutable.List.of("elements"))], [isArrowExpression, R.always(_immutable.List.of("params", "body"))], [isAssignmentExpression, R.always(_immutable.List.of("binding", "expression"))], [isBinaryExpression, R.always(_immutable.List.of("operator", "left", "right"))], [isCallExpression, R.always(_immutable.List.of("callee", "arguments"))], [isComputedAssignmentExpression, R.always(_immutable.List.of("operator", "binding", "expression"))], [isComputedMemberExpression, R.always(_immutable.List.of("object", "expression"))], [isConditionalExpression, R.always(_immutable.List.of("test", "consequent", "alternate"))], [isFunctionExpression, R.always(_immutable.List.of("name", "isGenerator", "params", "body"))], [isIdentifierExpression, R.always(_immutable.List.of("name"))], [isNewExpression, R.always(_immutable.List.of("callee", "arguments"))], [isNewTargetExpression, R.always((0, _immutable.List)())], [isObjectExpression, R.always(_immutable.List.of("properties"))], [isUnaryExpression, R.always(_immutable.List.of("operator", "operand"))], [isStaticMemberExpression, R.always(_immutable.List.of("object", "property"))], [isTemplateExpression, R.always(_immutable.List.of("tag", "elements"))], [isThisExpression, R.always((0, _immutable.List)())], [isUpdateExpression, R.always(_immutable.List.of("isPrefix", "operator", "operand"))], [isYieldExpression, R.always(_immutable.List.of("expression"))], [isYieldGeneratorExpression, R.always(_immutable.List.of("expression"))], [isBlockStatement, R.always(_immutable.List.of("block"))], [isBreakStatement, R.always(_immutable.List.of("label"))], [isContinueStatement, R.always(_immutable.List.of("label"))], [isCompoundAssignmentExpression, R.always(_immutable.List.of("binding", "operator", "expression"))], [isDebuggerStatement, R.always((0, _immutable.List)())], [isDoWhileStatement, R.always(_immutable.List.of("test", "body"))], [isEmptyStatement, R.always((0, _immutable.List)())], [isExpressionStatement, R.always(_immutable.List.of("expression"))], [isForInStatement, R.always(_immutable.List.of("left", "right", "body"))], [isForOfStatement, R.always(_immutable.List.of("left", "right", "body"))], [isForStatement, R.always(_immutable.List.of("init", "test", "update", "body"))], [isIfStatement, R.always(_immutable.List.of("test", "consequent", "alternate"))], [isLabeledStatement, R.always(_immutable.List.of("label", "body"))], [isReturnStatement, R.always(_immutable.List.of("expression"))], [isSwitchStatement, R.always(_immutable.List.of("discriminant", "cases"))], [isSwitchStatementWithDefault, R.always(_immutable.List.of("discriminant", "preDefaultCases", "defaultCase", "postDefaultCases"))], [isThrowStatement, R.always(_immutable.List.of("expression"))], [isTryCatchStatement, R.always(_immutable.List.of("body", "catchClause"))], [isTryFinallyStatement, R.always(_immutable.List.of("body", "catchClause", "finalizer"))], [isVariableDeclarationStatement, R.always(_immutable.List.of("declaration"))], [isWithStatement, R.always(_immutable.List.of("object", "body"))], [isWhileStatement, R.always(_immutable.List.of("test", "body"))], [isBlock, R.always(_immutable.List.of("statements"))], [isCatchClause, R.always(_immutable.List.of("binding", "body"))], [isDirective, R.always(_immutable.List.of("rawValue"))], [isFormalParameters, R.always(_immutable.List.of("items", "rest"))], [isFunctionBody, R.always(_immutable.List.of("directives", "statements"))], [isFunctionDeclaration, R.always(_immutable.List.of("name", "isGenerator", "params", "body"))], [isScript, R.always(_immutable.List.of("directives", "statements"))], [isSpreadElement, R.always(_immutable.List.of("expression"))], [isSuper, R.always((0, _immutable.List)())], [isSwitchCase, R.always(_immutable.List.of("test", "consequent"))], [isSwitchDefault, R.always(_immutable.List.of("consequent"))], [isTemplateElement, R.always(_immutable.List.of("rawValue"))], [isSyntaxTemplate, R.always(_immutable.List.of("template"))], [isVariableDeclaration, R.always(_immutable.List.of("kind", "declarators"))], [isVariableDeclarator, R.always(_immutable.List.of("binding", "init"))], [isParenthesizedExpression, R.always(_immutable.List.of("inner"))], [R.T, function (type_929) {
  return (0, _errors.assert)(false, "Missing case in fields: " + type_929.type);
}]]);
//# sourceMappingURL=data:application/json;base64,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YmxlXCI7XG5pbXBvcnQge2Fzc2VydCwgZXhwZWN0fSBmcm9tIFwiLi9lcnJvcnNcIjtcbmltcG9ydCB7bWl4aW59IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgU3ludGF4IGZyb20gXCIuL3N5bnRheFwiO1xuaW1wb3J0ICAqIGFzIFIgZnJvbSBcInJhbWRhXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXJtIHtcbiAgY29uc3RydWN0b3IodHlwZV85MTYsIHByb3BzXzkxNykge1xuICAgIHRoaXMudHlwZSA9IHR5cGVfOTE2O1xuICAgIHRoaXMubG9jID0gbnVsbDtcbiAgICBmb3IgKGxldCBwcm9wIG9mIE9iamVjdC5rZXlzKHByb3BzXzkxNykpIHtcbiAgICAgIHRoaXNbcHJvcF0gPSBwcm9wc185MTdbcHJvcF07XG4gICAgfVxuICB9XG4gIGdlbigpIHtcbiAgICBsZXQgbmV4dF85MTggPSB7fTtcbiAgICBmb3IgKGxldCBmaWVsZCBvZiBmaWVsZHNJbl85MTUodGhpcykpIHtcbiAgICAgIGlmICh0aGlzW2ZpZWxkXSA9PSBudWxsKSB7XG4gICAgICAgIG5leHRfOTE4W2ZpZWxkXSA9IG51bGw7XG4gICAgICB9IGVsc2UgaWYgKHRoaXNbZmllbGRdIGluc3RhbmNlb2YgVGVybSkge1xuICAgICAgICBuZXh0XzkxOFtmaWVsZF0gPSB0aGlzW2ZpZWxkXS5nZW4oKTtcbiAgICAgIH0gZWxzZSBpZiAoTGlzdC5pc0xpc3QodGhpc1tmaWVsZF0pKSB7XG4gICAgICAgIG5leHRfOTE4W2ZpZWxkXSA9IHRoaXNbZmllbGRdLmZpbHRlcihSLmNvbXBsZW1lbnQoaXNDb21waWxldGltZVN0YXRlbWVudCkpLm1hcCh0ZXJtXzkxOSA9PiB0ZXJtXzkxOSBpbnN0YW5jZW9mIFRlcm0gPyB0ZXJtXzkxOS5nZW4oKSA6IHRlcm1fOTE5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5leHRfOTE4W2ZpZWxkXSA9IHRoaXNbZmllbGRdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IFRlcm0odGhpcy50eXBlLCBuZXh0XzkxOCk7XG4gIH1cbiAgYWRkU2NvcGUoc2NvcGVfOTIwLCBiaW5kaW5nc185MjEsIHBoYXNlXzkyMiwgb3B0aW9uc185MjMpIHtcbiAgICBsZXQgbmV4dF85MjQgPSB7fTtcbiAgICBmb3IgKGxldCBmaWVsZCBvZiBmaWVsZHNJbl85MTUodGhpcykpIHtcbiAgICAgIGlmICh0aGlzW2ZpZWxkXSA9PSBudWxsKSB7XG4gICAgICAgIG5leHRfOTI0W2ZpZWxkXSA9IG51bGw7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzW2ZpZWxkXS5hZGRTY29wZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIG5leHRfOTI0W2ZpZWxkXSA9IHRoaXNbZmllbGRdLmFkZFNjb3BlKHNjb3BlXzkyMCwgYmluZGluZ3NfOTIxLCBwaGFzZV85MjIsIG9wdGlvbnNfOTIzKTtcbiAgICAgIH0gZWxzZSBpZiAoTGlzdC5pc0xpc3QodGhpc1tmaWVsZF0pKSB7XG4gICAgICAgIG5leHRfOTI0W2ZpZWxkXSA9IHRoaXNbZmllbGRdLm1hcChmXzkyNSA9PiBmXzkyNS5hZGRTY29wZShzY29wZV85MjAsIGJpbmRpbmdzXzkyMSwgcGhhc2VfOTIyLCBvcHRpb25zXzkyMykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dF85MjRbZmllbGRdID0gdGhpc1tmaWVsZF07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgVGVybSh0aGlzLnR5cGUsIG5leHRfOTI0KTtcbiAgfVxufVxuZXhwb3J0IGNvbnN0IGlzQmluZGluZ1dpdGhEZWZhdWx0ID0gUi53aGVyZUVxKHt0eXBlOiBcIkJpbmRpbmdXaXRoRGVmYXVsdFwifSk7XG47XG5leHBvcnQgY29uc3QgaXNCaW5kaW5nSWRlbnRpZmllciA9IFIud2hlcmVFcSh7dHlwZTogXCJCaW5kaW5nSWRlbnRpZmllclwifSk7XG47XG5leHBvcnQgY29uc3QgaXNBcnJheUJpbmRpbmcgPSBSLndoZXJlRXEoe3R5cGU6IFwiQXJyYXlCaW5kaW5nXCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc09iamVjdEJpbmRpbmcgPSBSLndoZXJlRXEoe3R5cGU6IFwiT2JqZWN0QmluZGluZ1wifSk7XG47XG5leHBvcnQgY29uc3QgaXNCaW5kaW5nUHJvcGVydHlJZGVudGlmaWVyID0gUi53aGVyZUVxKHt0eXBlOiBcIkJpbmRpbmdQcm9wZXJ0eUlkZW50aWZpZXJcIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzQmluZGluZ1Byb3BlcnR5UHJvcGVydHkgPSBSLndoZXJlRXEoe3R5cGU6IFwiQmluZGluZ1Byb3BlcnR5SWRlbnRpZmllclwifSk7XG47XG5leHBvcnQgY29uc3QgaXNDbGFzc0V4cHJlc3Npb24gPSBSLndoZXJlRXEoe3R5cGU6IFwiQ2xhc3NFeHByZXNzaW9uXCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc0NsYXNzRGVjbGFyYXRpb24gPSBSLndoZXJlRXEoe3R5cGU6IFwiQ2xhc3NEZWNsYXJhdGlvblwifSk7XG47XG5leHBvcnQgY29uc3QgaXNDbGFzc0VsZW1lbnQgPSBSLndoZXJlRXEoe3R5cGU6IFwiQ2xhc3NFbGVtZW50XCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc01vZHVsZSA9IFIud2hlcmVFcSh7dHlwZTogXCJNb2R1bGVcIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzSW1wb3J0ID0gUi53aGVyZUVxKHt0eXBlOiBcIkltcG9ydFwifSk7XG47XG5leHBvcnQgY29uc3QgaXNJbXBvcnROYW1lc3BhY2UgPSBSLndoZXJlRXEoe3R5cGU6IFwiSW1wb3J0TmFtZXNwYWNlXCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc0ltcG9ydFNwZWNpZmllciA9IFIud2hlcmVFcSh7dHlwZTogXCJJbXBvcnRTcGVjaWZpZXJcIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzRXhwb3J0QWxsRnJvbSA9IFIud2hlcmVFcSh7dHlwZTogXCJFeHBvcnRBbGxGcm9tXCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc0V4cG9ydEZyb20gPSBSLndoZXJlRXEoe3R5cGU6IFwiRXhwb3J0RnJvbVwifSk7XG47XG5leHBvcnQgY29uc3QgaXNFeHBvcnQgPSBSLndoZXJlRXEoe3R5cGU6IFwiRXhwb3J0XCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc0V4cG9ydERlZmF1bHQgPSBSLndoZXJlRXEoe3R5cGU6IFwiRXhwb3J0RGVmYXVsdFwifSk7XG47XG5leHBvcnQgY29uc3QgaXNFeHBvcnRTcGVjaWZpZXIgPSBSLndoZXJlRXEoe3R5cGU6IFwiRXhwb3J0U3BlY2lmaWVyXCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc01ldGhvZCA9IFIud2hlcmVFcSh7dHlwZTogXCJNZXRob2RcIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzR2V0dGVyID0gUi53aGVyZUVxKHt0eXBlOiBcIkdldHRlclwifSk7XG47XG5leHBvcnQgY29uc3QgaXNTZXR0ZXIgPSBSLndoZXJlRXEoe3R5cGU6IFwiU2V0dGVyXCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc0RhdGFQcm9wZXJ0eSA9IFIud2hlcmVFcSh7dHlwZTogXCJEYXRhUHJvcGVydHlcIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzU2hvcnRoYW5kUHJvcGVydHkgPSBSLndoZXJlRXEoe3R5cGU6IFwiU2hvcnRoYW5kUHJvcGVydHlcIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzQ29tcHV0ZWRQcm9wZXJ0eU5hbWUgPSBSLndoZXJlRXEoe3R5cGU6IFwiQ29tcHV0ZWRQcm9wZXJ0eU5hbWVcIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzU3RhdGljUHJvcGVydHlOYW1lID0gUi53aGVyZUVxKHt0eXBlOiBcIlN0YXRpY1Byb3BlcnR5TmFtZVwifSk7XG47XG5leHBvcnQgY29uc3QgaXNMaXRlcmFsQm9vbGVhbkV4cHJlc3Npb24gPSBSLndoZXJlRXEoe3R5cGU6IFwiTGl0ZXJhbEJvb2xlYW5FeHByZXNzaW9uXCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc0xpdGVyYWxJbmZpbml0eUV4cHJlc3Npb24gPSBSLndoZXJlRXEoe3R5cGU6IFwiTGl0ZXJhbEluZmluaXR5RXhwcmVzc2lvblwifSk7XG47XG5leHBvcnQgY29uc3QgaXNMaXRlcmFsTnVsbEV4cHJlc3Npb24gPSBSLndoZXJlRXEoe3R5cGU6IFwiTGl0ZXJhbE51bGxFeHByZXNzaW9uXCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc0xpdGVyYWxOdW1lcmljRXhwcmVzc2lvbiA9IFIud2hlcmVFcSh7dHlwZTogXCJMaXRlcmFsTnVtZXJpY0V4cHJlc3Npb25cIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzTGl0ZXJhbFJlZ0V4cEV4cHJlc3Npb24gPSBSLndoZXJlRXEoe3R5cGU6IFwiTGl0ZXJhbFJlZ0V4cEV4cHJlc3Npb25cIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzTGl0ZXJhbFN0cmluZ0V4cHJlc3Npb24gPSBSLndoZXJlRXEoe3R5cGU6IFwiTGl0ZXJhbFN0cmluZ0V4cHJlc3Npb25cIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzQXJyYXlFeHByZXNzaW9uID0gUi53aGVyZUVxKHt0eXBlOiBcIkFycmF5RXhwcmVzc2lvblwifSk7XG47XG5leHBvcnQgY29uc3QgaXNBcnJvd0V4cHJlc3Npb24gPSBSLndoZXJlRXEoe3R5cGU6IFwiQXJyb3dFeHByZXNzaW9uXCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc0Fzc2lnbm1lbnRFeHByZXNzaW9uID0gUi53aGVyZUVxKHt0eXBlOiBcIkFzc2lnbm1lbnRFeHByZXNzaW9uXCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc0JpbmFyeUV4cHJlc3Npb24gPSBSLndoZXJlRXEoe3R5cGU6IFwiQmluYXJ5RXhwcmVzc2lvblwifSk7XG47XG5leHBvcnQgY29uc3QgaXNDYWxsRXhwcmVzc2lvbiA9IFIud2hlcmVFcSh7dHlwZTogXCJDYWxsRXhwcmVzc2lvblwifSk7XG47XG5leHBvcnQgY29uc3QgaXNDb21wdXRlZEFzc2lnbm1lbnRFeHByZXNzaW9uID0gUi53aGVyZUVxKHt0eXBlOiBcIkNvbXB1dGVkQXNzaWdubWVudEV4cHJlc3Npb25cIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzQ29tcHV0ZWRNZW1iZXJFeHByZXNzaW9uID0gUi53aGVyZUVxKHt0eXBlOiBcIkNvbXB1dGVkTWVtYmVyRXhwcmVzc2lvblwifSk7XG47XG5leHBvcnQgY29uc3QgaXNDb25kaXRpb25hbEV4cHJlc3Npb24gPSBSLndoZXJlRXEoe3R5cGU6IFwiQ29uZGl0aW9uYWxFeHByZXNzaW9uXCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc0Z1bmN0aW9uRXhwcmVzc2lvbiA9IFIud2hlcmVFcSh7dHlwZTogXCJGdW5jdGlvbkV4cHJlc3Npb25cIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzSWRlbnRpZmllckV4cHJlc3Npb24gPSBSLndoZXJlRXEoe3R5cGU6IFwiSWRlbnRpZmllckV4cHJlc3Npb25cIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzTmV3RXhwcmVzc2lvbiA9IFIud2hlcmVFcSh7dHlwZTogXCJOZXdFeHByZXNzaW9uXCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc05ld1RhcmdldEV4cHJlc3Npb24gPSBSLndoZXJlRXEoe3R5cGU6IFwiTmV3VGFyZ2V0RXhwcmVzc2lvblwifSk7XG47XG5leHBvcnQgY29uc3QgaXNPYmplY3RFeHByZXNzaW9uID0gUi53aGVyZUVxKHt0eXBlOiBcIk9iamVjdEV4cHJlc3Npb25cIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzVW5hcnlFeHByZXNzaW9uID0gUi53aGVyZUVxKHt0eXBlOiBcIlVuYXJ5RXhwcmVzc2lvblwifSk7XG47XG5leHBvcnQgY29uc3QgaXNTdGF0aWNNZW1iZXJFeHByZXNzaW9uID0gUi53aGVyZUVxKHt0eXBlOiBcIlN0YXRpY01lbWJlckV4cHJlc3Npb25cIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzVGVtcGxhdGVFeHByZXNzaW9uID0gUi53aGVyZUVxKHt0eXBlOiBcIlRlbXBsYXRlRXhwcmVzc2lvblwifSk7XG47XG5leHBvcnQgY29uc3QgaXNUaGlzRXhwcmVzc2lvbiA9IFIud2hlcmVFcSh7dHlwZTogXCJUaGlzRXhwcmVzc2lvblwifSk7XG47XG5leHBvcnQgY29uc3QgaXNVcGRhdGVFeHByZXNzaW9uID0gUi53aGVyZUVxKHt0eXBlOiBcIlVwZGF0ZUV4cHJlc3Npb25cIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzWWllbGRFeHByZXNzaW9uID0gUi53aGVyZUVxKHt0eXBlOiBcIllpZWxkRXhwcmVzc2lvblwifSk7XG47XG5leHBvcnQgY29uc3QgaXNZaWVsZEdlbmVyYXRvckV4cHJlc3Npb24gPSBSLndoZXJlRXEoe3R5cGU6IFwiWWllbGRHZW5lcmF0b3JFeHByZXNzaW9uXCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc0Jsb2NrU3RhdGVtZW50ID0gUi53aGVyZUVxKHt0eXBlOiBcIkJsb2NrU3RhdGVtZW50XCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc0JyZWFrU3RhdGVtZW50ID0gUi53aGVyZUVxKHt0eXBlOiBcIkJyZWFrU3RhdGVtZW50XCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc0NvbnRpbnVlU3RhdGVtZW50ID0gUi53aGVyZUVxKHt0eXBlOiBcIkNvbnRpbnVlU3RhdGVtZW50XCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc0NvbXBvdW5kQXNzaWdubWVudEV4cHJlc3Npb24gPSBSLndoZXJlRXEoe3R5cGU6IFwiQ29tcG91bmRBc3NpZ25tZW50RXhwcmVzc2lvblwifSk7XG47XG5leHBvcnQgY29uc3QgaXNEZWJ1Z2dlclN0YXRlbWVudCA9IFIud2hlcmVFcSh7dHlwZTogXCJEZWJ1Z2dlclN0YXRlbWVudFwifSk7XG47XG5leHBvcnQgY29uc3QgaXNEb1doaWxlU3RhdGVtZW50ID0gUi53aGVyZUVxKHt0eXBlOiBcIkRvV2hpbGVTdGF0ZW1lbnRcIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzRW1wdHlTdGF0ZW1lbnQgPSBSLndoZXJlRXEoe3R5cGU6IFwiRW1wdHlTdGF0ZW1lbnRcIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzRXhwcmVzc2lvblN0YXRlbWVudCA9IFIud2hlcmVFcSh7dHlwZTogXCJFeHByZXNzaW9uU3RhdGVtZW50XCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc0ZvckluU3RhdGVtZW50ID0gUi53aGVyZUVxKHt0eXBlOiBcIkZvckluU3RhdGVtZW50XCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc0Zvck9mU3RhdGVtZW50ID0gUi53aGVyZUVxKHt0eXBlOiBcIkZvck9mU3RhdGVtZW50XCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc0ZvclN0YXRlbWVudCA9IFIud2hlcmVFcSh7dHlwZTogXCJGb3JTdGF0ZW1lbnRcIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzSWZTdGF0ZW1lbnQgPSBSLndoZXJlRXEoe3R5cGU6IFwiSWZTdGF0ZW1lbnRcIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzTGFiZWxlZFN0YXRlbWVudCA9IFIud2hlcmVFcSh7dHlwZTogXCJMYWJlbGVkU3RhdGVtZW50XCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc1JldHVyblN0YXRlbWVudCA9IFIud2hlcmVFcSh7dHlwZTogXCJSZXR1cm5TdGF0ZW1lbnRcIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzU3dpdGNoU3RhdGVtZW50ID0gUi53aGVyZUVxKHt0eXBlOiBcIlN3aXRjaFN0YXRlbWVudFwifSk7XG47XG5leHBvcnQgY29uc3QgaXNTd2l0Y2hTdGF0ZW1lbnRXaXRoRGVmYXVsdCA9IFIud2hlcmVFcSh7dHlwZTogXCJTd2l0Y2hTdGF0ZW1lbnRXaXRoRGVmYXVsdFwifSk7XG47XG5leHBvcnQgY29uc3QgaXNUaHJvd1N0YXRlbWVudCA9IFIud2hlcmVFcSh7dHlwZTogXCJUaHJvd1N0YXRlbWVudFwifSk7XG47XG5leHBvcnQgY29uc3QgaXNUcnlDYXRjaFN0YXRlbWVudCA9IFIud2hlcmVFcSh7dHlwZTogXCJUcnlDYXRjaFN0YXRlbWVudFwifSk7XG47XG5leHBvcnQgY29uc3QgaXNUcnlGaW5hbGx5U3RhdGVtZW50ID0gUi53aGVyZUVxKHt0eXBlOiBcIlRyeUZpbmFsbHlTdGF0ZW1lbnRcIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzVmFyaWFibGVEZWNsYXJhdGlvblN0YXRlbWVudCA9IFIud2hlcmVFcSh7dHlwZTogXCJWYXJpYWJsZURlY2xhcmF0aW9uU3RhdGVtZW50XCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc1doaWxlU3RhdGVtZW50ID0gUi53aGVyZUVxKHt0eXBlOiBcIldoaWxlU3RhdGVtZW50XCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc1dpdGhTdGF0ZW1lbnQgPSBSLndoZXJlRXEoe3R5cGU6IFwiV2l0aFN0YXRlbWVudFwifSk7XG47XG5leHBvcnQgY29uc3QgaXNCbG9jayA9IFIud2hlcmVFcSh7dHlwZTogXCJCbG9ja1wifSk7XG47XG5leHBvcnQgY29uc3QgaXNDYXRjaENsYXVzZSA9IFIud2hlcmVFcSh7dHlwZTogXCJDYXRjaENsYXVzZVwifSk7XG47XG5leHBvcnQgY29uc3QgaXNEaXJlY3RpdmUgPSBSLndoZXJlRXEoe3R5cGU6IFwiRGlyZWN0aXZlXCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc0Zvcm1hbFBhcmFtZXRlcnMgPSBSLndoZXJlRXEoe3R5cGU6IFwiRm9ybWFsUGFyYW1ldGVyc1wifSk7XG47XG5leHBvcnQgY29uc3QgaXNGdW5jdGlvbkJvZHkgPSBSLndoZXJlRXEoe3R5cGU6IFwiRnVuY3Rpb25Cb2R5XCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc0Z1bmN0aW9uRGVjbGFyYXRpb24gPSBSLndoZXJlRXEoe3R5cGU6IFwiRnVuY3Rpb25EZWNsYXJhdGlvblwifSk7XG47XG5leHBvcnQgY29uc3QgaXNTY3JpcHQgPSBSLndoZXJlRXEoe3R5cGU6IFwiU2NyaXB0XCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc1NwcmVhZEVsZW1lbnQgPSBSLndoZXJlRXEoe3R5cGU6IFwiU3ByZWFkRWxlbWVudFwifSk7XG47XG5leHBvcnQgY29uc3QgaXNTdXBlciA9IFIud2hlcmVFcSh7dHlwZTogXCJTdXBlclwifSk7XG47XG5leHBvcnQgY29uc3QgaXNTd2l0Y2hDYXNlID0gUi53aGVyZUVxKHt0eXBlOiBcIlN3aXRjaENhc2VcIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzU3dpdGNoRGVmYXVsdCA9IFIud2hlcmVFcSh7dHlwZTogXCJTd2l0Y2hEZWZhdWx0XCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc1RlbXBsYXRlRWxlbWVudCA9IFIud2hlcmVFcSh7dHlwZTogXCJUZW1wbGF0ZUVsZW1lbnRcIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzU3ludGF4VGVtcGxhdGUgPSBSLndoZXJlRXEoe3R5cGU6IFwiU3ludGF4VGVtcGxhdGVcIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzVmFyaWFibGVEZWNsYXJhdGlvbiA9IFIud2hlcmVFcSh7dHlwZTogXCJWYXJpYWJsZURlY2xhcmF0aW9uXCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc1ZhcmlhYmxlRGVjbGFyYXRvciA9IFIud2hlcmVFcSh7dHlwZTogXCJWYXJpYWJsZURlY2xhcmF0b3JcIn0pO1xuO1xuZXhwb3J0IGNvbnN0IGlzRU9GID0gUi53aGVyZUVxKHt0eXBlOiBcIkVPRlwifSk7XG47XG5leHBvcnQgY29uc3QgaXNTeW50YXhEZWNsYXJhdGlvbiA9IFIuYm90aChpc1ZhcmlhYmxlRGVjbGFyYXRpb24sIFIud2hlcmVFcSh7a2luZDogXCJzeW50YXhcIn0pKTtcbjtcbmV4cG9ydCBjb25zdCBpc1N5bnRheHJlY0RlY2xhcmF0aW9uID0gUi5ib3RoKGlzVmFyaWFibGVEZWNsYXJhdGlvbiwgUi53aGVyZUVxKHtraW5kOiBcInN5bnRheHJlY1wifSkpO1xuO1xuZXhwb3J0IGNvbnN0IGlzRnVuY3Rpb25UZXJtID0gUi5laXRoZXIoaXNGdW5jdGlvbkRlY2xhcmF0aW9uLCBpc0Z1bmN0aW9uRXhwcmVzc2lvbik7XG47XG5leHBvcnQgY29uc3QgaXNGdW5jdGlvbldpdGhOYW1lID0gUi5hbmQoaXNGdW5jdGlvblRlcm0sIFIuY29tcGxlbWVudChSLndoZXJlKHtuYW1lOiBSLmlzTmlsfSkpKTtcbjtcbmV4cG9ydCBjb25zdCBpc1BhcmVudGhlc2l6ZWRFeHByZXNzaW9uID0gUi53aGVyZUVxKHt0eXBlOiBcIlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uXCJ9KTtcbjtcbmV4cG9ydCBjb25zdCBpc0V4cG9ydFN5bnRheCA9IFIuYm90aChpc0V4cG9ydCwgZXhwXzkyNiA9PiBSLm9yKGlzU3ludGF4RGVjbGFyYXRpb24oZXhwXzkyNi5kZWNsYXJhdGlvbiksIGlzU3ludGF4cmVjRGVjbGFyYXRpb24oZXhwXzkyNi5kZWNsYXJhdGlvbikpKTtcbjtcbmV4cG9ydCBjb25zdCBpc1N5bnRheERlY2xhcmF0aW9uU3RhdGVtZW50ID0gUi5ib3RoKGlzVmFyaWFibGVEZWNsYXJhdGlvblN0YXRlbWVudCwgZGVjbF85MjcgPT4gaXNDb21waWxldGltZURlY2xhcmF0aW9uKGRlY2xfOTI3LmRlY2xhcmF0aW9uKSk7XG47XG5leHBvcnQgY29uc3QgaXNDb21waWxldGltZURlY2xhcmF0aW9uID0gUi5laXRoZXIoaXNTeW50YXhEZWNsYXJhdGlvbiwgaXNTeW50YXhyZWNEZWNsYXJhdGlvbik7XG47XG5leHBvcnQgY29uc3QgaXNDb21waWxldGltZVN0YXRlbWVudCA9IHRlcm1fOTI4ID0+IHtcbiAgcmV0dXJuIHRlcm1fOTI4IGluc3RhbmNlb2YgVGVybSAmJiBpc1ZhcmlhYmxlRGVjbGFyYXRpb25TdGF0ZW1lbnQodGVybV85MjgpICYmIGlzQ29tcGlsZXRpbWVEZWNsYXJhdGlvbih0ZXJtXzkyOC5kZWNsYXJhdGlvbik7XG59O1xuO1xuY29uc3QgZmllbGRzSW5fOTE1ID0gUi5jb25kKFtbaXNCaW5kaW5nV2l0aERlZmF1bHQsIFIuYWx3YXlzKExpc3Qub2YoXCJiaW5kaW5nXCIsIFwiaW5pdFwiKSldLCBbaXNCaW5kaW5nSWRlbnRpZmllciwgUi5hbHdheXMoTGlzdC5vZihcIm5hbWVcIikpXSwgW2lzQXJyYXlCaW5kaW5nLCBSLmFsd2F5cyhMaXN0Lm9mKFwiZWxlbWVudHNcIiwgXCJyZXN0RWxlbWVudFwiKSldLCBbaXNPYmplY3RCaW5kaW5nLCBSLmFsd2F5cyhMaXN0Lm9mKFwicHJvcGVydGllc1wiKSldLCBbaXNCaW5kaW5nUHJvcGVydHlJZGVudGlmaWVyLCBSLmFsd2F5cyhMaXN0Lm9mKFwiYmluZGluZ1wiLCBcImluaXRcIikpXSwgW2lzQmluZGluZ1Byb3BlcnR5UHJvcGVydHksIFIuYWx3YXlzKExpc3Qub2YoXCJuYW1lXCIsIFwiYmluZGluZ1wiKSldLCBbaXNDbGFzc0V4cHJlc3Npb24sIFIuYWx3YXlzKExpc3Qub2YoXCJuYW1lXCIsIFwic3VwZXJcIiwgXCJlbGVtZW50c1wiKSldLCBbaXNDbGFzc0RlY2xhcmF0aW9uLCBSLmFsd2F5cyhMaXN0Lm9mKFwibmFtZVwiLCBcInN1cGVyXCIsIFwiZWxlbWVudHNcIikpXSwgW2lzQ2xhc3NFbGVtZW50LCBSLmFsd2F5cyhMaXN0Lm9mKFwiaXNTdGF0aWNcIiwgXCJtZXRob2RcIikpXSwgW2lzTW9kdWxlLCBSLmFsd2F5cyhMaXN0Lm9mKFwiZGlyZWN0aXZlc1wiLCBcIml0ZW1zXCIpKV0sIFtpc0ltcG9ydCwgUi5hbHdheXMoTGlzdC5vZihcIm1vZHVsZVNwZWNpZmllclwiLCBcImRlZmF1bHRCaW5kaW5nXCIsIFwibmFtZWRJbXBvcnRzXCIsIFwiZm9yU3ludGF4XCIpKV0sIFtpc0ltcG9ydE5hbWVzcGFjZSwgUi5hbHdheXMoTGlzdC5vZihcIm1vZHVsZVNwZWNpZmllclwiLCBcImRlZmF1bHRCaW5kaW5nXCIsIFwibmFtZXNwYWNlQmluZGluZ1wiKSldLCBbaXNJbXBvcnRTcGVjaWZpZXIsIFIuYWx3YXlzKExpc3Qub2YoXCJuYW1lXCIsIFwiYmluZGluZ1wiKSldLCBbaXNFeHBvcnRBbGxGcm9tLCBSLmFsd2F5cyhMaXN0Lm9mKFwibW9kdWxlU3BlY2lmaWVyXCIpKV0sIFtpc0V4cG9ydEZyb20sIFIuYWx3YXlzKExpc3Qub2YoXCJuYW1lZEV4cG9ydHNcIiwgXCJtb2R1bGVTcGVjaWZpZXJcIikpXSwgW2lzRXhwb3J0LCBSLmFsd2F5cyhMaXN0Lm9mKFwiZGVjbGFyYXRpb25cIikpXSwgW2lzRXhwb3J0RGVmYXVsdCwgUi5hbHdheXMoTGlzdC5vZihcImJvZHlcIikpXSwgW2lzRXhwb3J0U3BlY2lmaWVyLCBSLmFsd2F5cyhMaXN0Lm9mKFwibmFtZVwiLCBcImV4cG9ydGVkTmFtZVwiKSldLCBbaXNNZXRob2QsIFIuYWx3YXlzKExpc3Qub2YoXCJuYW1lXCIsIFwiYm9keVwiLCBcImlzR2VuZXJhdG9yXCIsIFwicGFyYW1zXCIpKV0sIFtpc0dldHRlciwgUi5hbHdheXMoTGlzdC5vZihcIm5hbWVcIiwgXCJib2R5XCIpKV0sIFtpc1NldHRlciwgUi5hbHdheXMoTGlzdC5vZihcIm5hbWVcIiwgXCJib2R5XCIsIFwicGFyYW1cIikpXSwgW2lzRGF0YVByb3BlcnR5LCBSLmFsd2F5cyhMaXN0Lm9mKFwibmFtZVwiLCBcImV4cHJlc3Npb25cIikpXSwgW2lzU2hvcnRoYW5kUHJvcGVydHksIFIuYWx3YXlzKExpc3Qub2YoXCJleHByZXNzaW9uXCIpKV0sIFtpc1N0YXRpY1Byb3BlcnR5TmFtZSwgUi5hbHdheXMoTGlzdC5vZihcInZhbHVlXCIpKV0sIFtpc0xpdGVyYWxCb29sZWFuRXhwcmVzc2lvbiwgUi5hbHdheXMoTGlzdC5vZihcInZhbHVlXCIpKV0sIFtpc0xpdGVyYWxJbmZpbml0eUV4cHJlc3Npb24sIFIuYWx3YXlzKExpc3QoKSldLCBbaXNMaXRlcmFsTnVsbEV4cHJlc3Npb24sIFIuYWx3YXlzKExpc3QoKSldLCBbaXNMaXRlcmFsTnVtZXJpY0V4cHJlc3Npb24sIFIuYWx3YXlzKExpc3Qub2YoXCJ2YWx1ZVwiKSldLCBbaXNMaXRlcmFsUmVnRXhwRXhwcmVzc2lvbiwgUi5hbHdheXMoTGlzdC5vZihcInBhdHRlcm5cIiwgXCJmbGFnc1wiKSldLCBbaXNMaXRlcmFsU3RyaW5nRXhwcmVzc2lvbiwgUi5hbHdheXMoTGlzdC5vZihcInZhbHVlXCIpKV0sIFtpc0FycmF5RXhwcmVzc2lvbiwgUi5hbHdheXMoTGlzdC5vZihcImVsZW1lbnRzXCIpKV0sIFtpc0Fycm93RXhwcmVzc2lvbiwgUi5hbHdheXMoTGlzdC5vZihcInBhcmFtc1wiLCBcImJvZHlcIikpXSwgW2lzQXNzaWdubWVudEV4cHJlc3Npb24sIFIuYWx3YXlzKExpc3Qub2YoXCJiaW5kaW5nXCIsIFwiZXhwcmVzc2lvblwiKSldLCBbaXNCaW5hcnlFeHByZXNzaW9uLCBSLmFsd2F5cyhMaXN0Lm9mKFwib3BlcmF0b3JcIiwgXCJsZWZ0XCIsIFwicmlnaHRcIikpXSwgW2lzQ2FsbEV4cHJlc3Npb24sIFIuYWx3YXlzKExpc3Qub2YoXCJjYWxsZWVcIiwgXCJhcmd1bWVudHNcIikpXSwgW2lzQ29tcHV0ZWRBc3NpZ25tZW50RXhwcmVzc2lvbiwgUi5hbHdheXMoTGlzdC5vZihcIm9wZXJhdG9yXCIsIFwiYmluZGluZ1wiLCBcImV4cHJlc3Npb25cIikpXSwgW2lzQ29tcHV0ZWRNZW1iZXJFeHByZXNzaW9uLCBSLmFsd2F5cyhMaXN0Lm9mKFwib2JqZWN0XCIsIFwiZXhwcmVzc2lvblwiKSldLCBbaXNDb25kaXRpb25hbEV4cHJlc3Npb24sIFIuYWx3YXlzKExpc3Qub2YoXCJ0ZXN0XCIsIFwiY29uc2VxdWVudFwiLCBcImFsdGVybmF0ZVwiKSldLCBbaXNGdW5jdGlvbkV4cHJlc3Npb24sIFIuYWx3YXlzKExpc3Qub2YoXCJuYW1lXCIsIFwiaXNHZW5lcmF0b3JcIiwgXCJwYXJhbXNcIiwgXCJib2R5XCIpKV0sIFtpc0lkZW50aWZpZXJFeHByZXNzaW9uLCBSLmFsd2F5cyhMaXN0Lm9mKFwibmFtZVwiKSldLCBbaXNOZXdFeHByZXNzaW9uLCBSLmFsd2F5cyhMaXN0Lm9mKFwiY2FsbGVlXCIsIFwiYXJndW1lbnRzXCIpKV0sIFtpc05ld1RhcmdldEV4cHJlc3Npb24sIFIuYWx3YXlzKExpc3QoKSldLCBbaXNPYmplY3RFeHByZXNzaW9uLCBSLmFsd2F5cyhMaXN0Lm9mKFwicHJvcGVydGllc1wiKSldLCBbaXNVbmFyeUV4cHJlc3Npb24sIFIuYWx3YXlzKExpc3Qub2YoXCJvcGVyYXRvclwiLCBcIm9wZXJhbmRcIikpXSwgW2lzU3RhdGljTWVtYmVyRXhwcmVzc2lvbiwgUi5hbHdheXMoTGlzdC5vZihcIm9iamVjdFwiLCBcInByb3BlcnR5XCIpKV0sIFtpc1RlbXBsYXRlRXhwcmVzc2lvbiwgUi5hbHdheXMoTGlzdC5vZihcInRhZ1wiLCBcImVsZW1lbnRzXCIpKV0sIFtpc1RoaXNFeHByZXNzaW9uLCBSLmFsd2F5cyhMaXN0KCkpXSwgW2lzVXBkYXRlRXhwcmVzc2lvbiwgUi5hbHdheXMoTGlzdC5vZihcImlzUHJlZml4XCIsIFwib3BlcmF0b3JcIiwgXCJvcGVyYW5kXCIpKV0sIFtpc1lpZWxkRXhwcmVzc2lvbiwgUi5hbHdheXMoTGlzdC5vZihcImV4cHJlc3Npb25cIikpXSwgW2lzWWllbGRHZW5lcmF0b3JFeHByZXNzaW9uLCBSLmFsd2F5cyhMaXN0Lm9mKFwiZXhwcmVzc2lvblwiKSldLCBbaXNCbG9ja1N0YXRlbWVudCwgUi5hbHdheXMoTGlzdC5vZihcImJsb2NrXCIpKV0sIFtpc0JyZWFrU3RhdGVtZW50LCBSLmFsd2F5cyhMaXN0Lm9mKFwibGFiZWxcIikpXSwgW2lzQ29udGludWVTdGF0ZW1lbnQsIFIuYWx3YXlzKExpc3Qub2YoXCJsYWJlbFwiKSldLCBbaXNDb21wb3VuZEFzc2lnbm1lbnRFeHByZXNzaW9uLCBSLmFsd2F5cyhMaXN0Lm9mKFwiYmluZGluZ1wiLCBcIm9wZXJhdG9yXCIsIFwiZXhwcmVzc2lvblwiKSldLCBbaXNEZWJ1Z2dlclN0YXRlbWVudCwgUi5hbHdheXMoTGlzdCgpKV0sIFtpc0RvV2hpbGVTdGF0ZW1lbnQsIFIuYWx3YXlzKExpc3Qub2YoXCJ0ZXN0XCIsIFwiYm9keVwiKSldLCBbaXNFbXB0eVN0YXRlbWVudCwgUi5hbHdheXMoTGlzdCgpKV0sIFtpc0V4cHJlc3Npb25TdGF0ZW1lbnQsIFIuYWx3YXlzKExpc3Qub2YoXCJleHByZXNzaW9uXCIpKV0sIFtpc0ZvckluU3RhdGVtZW50LCBSLmFsd2F5cyhMaXN0Lm9mKFwibGVmdFwiLCBcInJpZ2h0XCIsIFwiYm9keVwiKSldLCBbaXNGb3JPZlN0YXRlbWVudCwgUi5hbHdheXMoTGlzdC5vZihcImxlZnRcIiwgXCJyaWdodFwiLCBcImJvZHlcIikpXSwgW2lzRm9yU3RhdGVtZW50LCBSLmFsd2F5cyhMaXN0Lm9mKFwiaW5pdFwiLCBcInRlc3RcIiwgXCJ1cGRhdGVcIiwgXCJib2R5XCIpKV0sIFtpc0lmU3RhdGVtZW50LCBSLmFsd2F5cyhMaXN0Lm9mKFwidGVzdFwiLCBcImNvbnNlcXVlbnRcIiwgXCJhbHRlcm5hdGVcIikpXSwgW2lzTGFiZWxlZFN0YXRlbWVudCwgUi5hbHdheXMoTGlzdC5vZihcImxhYmVsXCIsIFwiYm9keVwiKSldLCBbaXNSZXR1cm5TdGF0ZW1lbnQsIFIuYWx3YXlzKExpc3Qub2YoXCJleHByZXNzaW9uXCIpKV0sIFtpc1N3aXRjaFN0YXRlbWVudCwgUi5hbHdheXMoTGlzdC5vZihcImRpc2NyaW1pbmFudFwiLCBcImNhc2VzXCIpKV0sIFtpc1N3aXRjaFN0YXRlbWVudFdpdGhEZWZhdWx0LCBSLmFsd2F5cyhMaXN0Lm9mKFwiZGlzY3JpbWluYW50XCIsIFwicHJlRGVmYXVsdENhc2VzXCIsIFwiZGVmYXVsdENhc2VcIiwgXCJwb3N0RGVmYXVsdENhc2VzXCIpKV0sIFtpc1Rocm93U3RhdGVtZW50LCBSLmFsd2F5cyhMaXN0Lm9mKFwiZXhwcmVzc2lvblwiKSldLCBbaXNUcnlDYXRjaFN0YXRlbWVudCwgUi5hbHdheXMoTGlzdC5vZihcImJvZHlcIiwgXCJjYXRjaENsYXVzZVwiKSldLCBbaXNUcnlGaW5hbGx5U3RhdGVtZW50LCBSLmFsd2F5cyhMaXN0Lm9mKFwiYm9keVwiLCBcImNhdGNoQ2xhdXNlXCIsIFwiZmluYWxpemVyXCIpKV0sIFtpc1ZhcmlhYmxlRGVjbGFyYXRpb25TdGF0ZW1lbnQsIFIuYWx3YXlzKExpc3Qub2YoXCJkZWNsYXJhdGlvblwiKSldLCBbaXNXaXRoU3RhdGVtZW50LCBSLmFsd2F5cyhMaXN0Lm9mKFwib2JqZWN0XCIsIFwiYm9keVwiKSldLCBbaXNXaGlsZVN0YXRlbWVudCwgUi5hbHdheXMoTGlzdC5vZihcInRlc3RcIiwgXCJib2R5XCIpKV0sIFtpc0Jsb2NrLCBSLmFsd2F5cyhMaXN0Lm9mKFwic3RhdGVtZW50c1wiKSldLCBbaXNDYXRjaENsYXVzZSwgUi5hbHdheXMoTGlzdC5vZihcImJpbmRpbmdcIiwgXCJib2R5XCIpKV0sIFtpc0RpcmVjdGl2ZSwgUi5hbHdheXMoTGlzdC5vZihcInJhd1ZhbHVlXCIpKV0sIFtpc0Zvcm1hbFBhcmFtZXRlcnMsIFIuYWx3YXlzKExpc3Qub2YoXCJpdGVtc1wiLCBcInJlc3RcIikpXSwgW2lzRnVuY3Rpb25Cb2R5LCBSLmFsd2F5cyhMaXN0Lm9mKFwiZGlyZWN0aXZlc1wiLCBcInN0YXRlbWVudHNcIikpXSwgW2lzRnVuY3Rpb25EZWNsYXJhdGlvbiwgUi5hbHdheXMoTGlzdC5vZihcIm5hbWVcIiwgXCJpc0dlbmVyYXRvclwiLCBcInBhcmFtc1wiLCBcImJvZHlcIikpXSwgW2lzU2NyaXB0LCBSLmFsd2F5cyhMaXN0Lm9mKFwiZGlyZWN0aXZlc1wiLCBcInN0YXRlbWVudHNcIikpXSwgW2lzU3ByZWFkRWxlbWVudCwgUi5hbHdheXMoTGlzdC5vZihcImV4cHJlc3Npb25cIikpXSwgW2lzU3VwZXIsIFIuYWx3YXlzKExpc3QoKSldLCBbaXNTd2l0Y2hDYXNlLCBSLmFsd2F5cyhMaXN0Lm9mKFwidGVzdFwiLCBcImNvbnNlcXVlbnRcIikpXSwgW2lzU3dpdGNoRGVmYXVsdCwgUi5hbHdheXMoTGlzdC5vZihcImNvbnNlcXVlbnRcIikpXSwgW2lzVGVtcGxhdGVFbGVtZW50LCBSLmFsd2F5cyhMaXN0Lm9mKFwicmF3VmFsdWVcIikpXSwgW2lzU3ludGF4VGVtcGxhdGUsIFIuYWx3YXlzKExpc3Qub2YoXCJ0ZW1wbGF0ZVwiKSldLCBbaXNWYXJpYWJsZURlY2xhcmF0aW9uLCBSLmFsd2F5cyhMaXN0Lm9mKFwia2luZFwiLCBcImRlY2xhcmF0b3JzXCIpKV0sIFtpc1ZhcmlhYmxlRGVjbGFyYXRvciwgUi5hbHdheXMoTGlzdC5vZihcImJpbmRpbmdcIiwgXCJpbml0XCIpKV0sIFtpc1BhcmVudGhlc2l6ZWRFeHByZXNzaW9uLCBSLmFsd2F5cyhMaXN0Lm9mKFwiaW5uZXJcIikpXSwgW1IuVCwgdHlwZV85MjkgPT4gYXNzZXJ0KGZhbHNlLCBcIk1pc3NpbmcgY2FzZSBpbiBmaWVsZHM6IFwiICsgdHlwZV85MjkudHlwZSldXSk7XG4iXX0=