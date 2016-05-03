"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Enforester = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _terms = require("./terms");

var _terms2 = _interopRequireDefault(_terms);

var _transforms = require("./transforms");

var _immutable = require("immutable");

var _errors = require("./errors");

var _operators = require("./operators");

var _syntax = require("./syntax");

var _syntax2 = _interopRequireDefault(_syntax);

var _scope = require("./scope");

var _loadSyntax = require("./load-syntax");

var _macroContext = require("./macro-context");

var _macroContext2 = _interopRequireDefault(_macroContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EXPR_LOOP_OPERATOR_37 = {};
var EXPR_LOOP_NO_CHANGE_38 = {};
var EXPR_LOOP_EXPANSION_39 = {};

var Enforester = exports.Enforester = function () {
  function Enforester(stxl_40, prev_41, context_42) {
    _classCallCheck(this, Enforester);

    this.done = false;
    (0, _errors.assert)(_immutable.List.isList(stxl_40), "expecting a list of terms to enforest");
    (0, _errors.assert)(_immutable.List.isList(prev_41), "expecting a list of terms to enforest");
    (0, _errors.assert)(context_42, "expecting a context to enforest");
    this.term = null;
    this.rest = stxl_40;
    this.prev = prev_41;
    this.context = context_42;
  }

  _createClass(Enforester, [{
    key: "peek",
    value: function peek() {
      var n_43 = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      return this.rest.get(n_43);
    }
  }, {
    key: "advance",
    value: function advance() {
      var ret_44 = this.rest.first();
      this.rest = this.rest.rest();
      return ret_44;
    }
  }, {
    key: "enforest",
    value: function enforest() {
      var type_45 = arguments.length <= 0 || arguments[0] === undefined ? "Module" : arguments[0];

      this.term = null;
      if (this.rest.size === 0) {
        this.done = true;
        return this.term;
      }
      if (this.isEOF(this.peek())) {
        this.term = new _terms2.default("EOF", {});
        this.advance();
        return this.term;
      }
      var result_46 = void 0;
      if (type_45 === "expression") {
        result_46 = this.enforestExpressionLoop();
      } else {
        result_46 = this.enforestModule();
      }
      if (this.rest.size === 0) {
        this.done = true;
      }
      return result_46;
    }
  }, {
    key: "enforestModule",
    value: function enforestModule() {
      return this.enforestBody();
    }
  }, {
    key: "enforestBody",
    value: function enforestBody() {
      return this.enforestModuleItem();
    }
  }, {
    key: "enforestModuleItem",
    value: function enforestModuleItem() {
      var lookahead_47 = this.peek();
      if (this.isKeyword(lookahead_47, "import")) {
        this.advance();
        return this.enforestImportDeclaration();
      } else if (this.isKeyword(lookahead_47, "export")) {
        this.advance();
        return this.enforestExportDeclaration();
      }
      return this.enforestStatement();
    }
  }, {
    key: "enforestExportDeclaration",
    value: function enforestExportDeclaration() {
      var lookahead_48 = this.peek();
      if (this.isPunctuator(lookahead_48, "*")) {
        this.advance();
        var moduleSpecifier = this.enforestFromClause();
        return new _terms2.default("ExportAllFrom", { moduleSpecifier: moduleSpecifier });
      } else if (this.isBraces(lookahead_48)) {
        var namedExports = this.enforestExportClause();
        var _moduleSpecifier = null;
        if (this.isIdentifier(this.peek(), "from")) {
          _moduleSpecifier = this.enforestFromClause();
        }
        return new _terms2.default("ExportFrom", { namedExports: namedExports, moduleSpecifier: _moduleSpecifier });
      } else if (this.isKeyword(lookahead_48, "class")) {
        return new _terms2.default("Export", { declaration: this.enforestClass({ isExpr: false }) });
      } else if (this.isFnDeclTransform(lookahead_48)) {
        return new _terms2.default("Export", { declaration: this.enforestFunction({ isExpr: false, inDefault: false }) });
      } else if (this.isKeyword(lookahead_48, "default")) {
        this.advance();
        if (this.isFnDeclTransform(this.peek())) {
          return new _terms2.default("ExportDefault", { body: this.enforestFunction({ isExpr: false, inDefault: true }) });
        } else if (this.isKeyword(this.peek(), "class")) {
          return new _terms2.default("ExportDefault", { body: this.enforestClass({ isExpr: false, inDefault: true }) });
        } else {
          var body = this.enforestExpressionLoop();
          this.consumeSemicolon();
          return new _terms2.default("ExportDefault", { body: body });
        }
      } else if (this.isVarDeclTransform(lookahead_48) || this.isLetDeclTransform(lookahead_48) || this.isConstDeclTransform(lookahead_48) || this.isSyntaxrecDeclTransform(lookahead_48) || this.isSyntaxDeclTransform(lookahead_48)) {
        return new _terms2.default("Export", { declaration: this.enforestVariableDeclaration() });
      }
      throw this.createError(lookahead_48, "unexpected syntax");
    }
  }, {
    key: "enforestExportClause",
    value: function enforestExportClause() {
      var enf_49 = new Enforester(this.matchCurlies(), (0, _immutable.List)(), this.context);
      var result_50 = [];
      while (enf_49.rest.size !== 0) {
        result_50.push(enf_49.enforestExportSpecifier());
        enf_49.consumeComma();
      }
      return (0, _immutable.List)(result_50);
    }
  }, {
    key: "enforestExportSpecifier",
    value: function enforestExportSpecifier() {
      var name_51 = this.enforestIdentifier();
      if (this.isIdentifier(this.peek(), "as")) {
        this.advance();
        var exportedName = this.enforestIdentifier();
        return new _terms2.default("ExportSpecifier", { name: name_51, exportedName: exportedName });
      }
      return new _terms2.default("ExportSpecifier", { name: null, exportedName: name_51 });
    }
  }, {
    key: "enforestImportDeclaration",
    value: function enforestImportDeclaration() {
      var lookahead_52 = this.peek();
      var defaultBinding_53 = null;
      var namedImports_54 = (0, _immutable.List)();
      var forSyntax_55 = false;
      if (this.isStringLiteral(lookahead_52)) {
        var moduleSpecifier = this.advance();
        this.consumeSemicolon();
        return new _terms2.default("Import", { defaultBinding: defaultBinding_53, namedImports: namedImports_54, moduleSpecifier: moduleSpecifier });
      }
      if (this.isIdentifier(lookahead_52) || this.isKeyword(lookahead_52)) {
        defaultBinding_53 = this.enforestBindingIdentifier();
        if (!this.isPunctuator(this.peek(), ",")) {
          var _moduleSpecifier2 = this.enforestFromClause();
          if (this.isKeyword(this.peek(), "for") && this.isIdentifier(this.peek(1), "syntax")) {
            this.advance();
            this.advance();
            forSyntax_55 = true;
          }
          return new _terms2.default("Import", { defaultBinding: defaultBinding_53, moduleSpecifier: _moduleSpecifier2, namedImports: (0, _immutable.List)(), forSyntax: forSyntax_55 });
        }
      }
      this.consumeComma();
      lookahead_52 = this.peek();
      if (this.isBraces(lookahead_52)) {
        var imports = this.enforestNamedImports();
        var fromClause = this.enforestFromClause();
        if (this.isKeyword(this.peek(), "for") && this.isIdentifier(this.peek(1), "syntax")) {
          this.advance();
          this.advance();
          forSyntax_55 = true;
        }
        return new _terms2.default("Import", { defaultBinding: defaultBinding_53, forSyntax: forSyntax_55, namedImports: imports, moduleSpecifier: fromClause });
      } else if (this.isPunctuator(lookahead_52, "*")) {
        var namespaceBinding = this.enforestNamespaceBinding();
        var _moduleSpecifier3 = this.enforestFromClause();
        if (this.isKeyword(this.peek(), "for") && this.isIdentifier(this.peek(1), "syntax")) {
          this.advance();
          this.advance();
          forSyntax_55 = true;
        }
        return new _terms2.default("ImportNamespace", { defaultBinding: defaultBinding_53, forSyntax: forSyntax_55, namespaceBinding: namespaceBinding, moduleSpecifier: _moduleSpecifier3 });
      }
      throw this.createError(lookahead_52, "unexpected syntax");
    }
  }, {
    key: "enforestNamespaceBinding",
    value: function enforestNamespaceBinding() {
      this.matchPunctuator("*");
      this.matchIdentifier("as");
      return this.enforestBindingIdentifier();
    }
  }, {
    key: "enforestNamedImports",
    value: function enforestNamedImports() {
      var enf_56 = new Enforester(this.matchCurlies(), (0, _immutable.List)(), this.context);
      var result_57 = [];
      while (enf_56.rest.size !== 0) {
        result_57.push(enf_56.enforestImportSpecifiers());
        enf_56.consumeComma();
      }
      return (0, _immutable.List)(result_57);
    }
  }, {
    key: "enforestImportSpecifiers",
    value: function enforestImportSpecifiers() {
      var lookahead_58 = this.peek();
      var name_59 = void 0;
      if (this.isIdentifier(lookahead_58) || this.isKeyword(lookahead_58)) {
        name_59 = this.advance();
        if (!this.isIdentifier(this.peek(), "as")) {
          return new _terms2.default("ImportSpecifier", { name: null, binding: new _terms2.default("BindingIdentifier", { name: name_59 }) });
        } else {
          this.matchIdentifier("as");
        }
      } else {
        throw this.createError(lookahead_58, "unexpected token in import specifier");
      }
      return new _terms2.default("ImportSpecifier", { name: name_59, binding: this.enforestBindingIdentifier() });
    }
  }, {
    key: "enforestFromClause",
    value: function enforestFromClause() {
      this.matchIdentifier("from");
      var lookahead_60 = this.matchStringLiteral();
      this.consumeSemicolon();
      return lookahead_60;
    }
  }, {
    key: "enforestStatementListItem",
    value: function enforestStatementListItem() {
      var lookahead_61 = this.peek();
      if (this.isFnDeclTransform(lookahead_61)) {
        return this.enforestFunctionDeclaration({ isExpr: false });
      } else if (this.isKeyword(lookahead_61, "class")) {
        return this.enforestClass({ isExpr: false });
      } else {
        return this.enforestStatement();
      }
    }
  }, {
    key: "enforestStatement",
    value: function enforestStatement() {
      var lookahead_62 = this.peek();
      if (this.term === null && this.isCompiletimeTransform(lookahead_62)) {
        this.rest = this.expandMacro().concat(this.rest);
        lookahead_62 = this.peek();
      }
      if (this.term === null && this.isBraces(lookahead_62)) {
        return this.enforestBlockStatement();
      }
      if (this.term === null && this.isWhileTransform(lookahead_62)) {
        return this.enforestWhileStatement();
      }
      if (this.term === null && this.isIfTransform(lookahead_62)) {
        return this.enforestIfStatement();
      }
      if (this.term === null && this.isForTransform(lookahead_62)) {
        return this.enforestForStatement();
      }
      if (this.term === null && this.isSwitchTransform(lookahead_62)) {
        return this.enforestSwitchStatement();
      }
      if (this.term === null && this.isBreakTransform(lookahead_62)) {
        return this.enforestBreakStatement();
      }
      if (this.term === null && this.isContinueTransform(lookahead_62)) {
        return this.enforestContinueStatement();
      }
      if (this.term === null && this.isDoTransform(lookahead_62)) {
        return this.enforestDoStatement();
      }
      if (this.term === null && this.isDebuggerTransform(lookahead_62)) {
        return this.enforestDebuggerStatement();
      }
      if (this.term === null && this.isWithTransform(lookahead_62)) {
        return this.enforestWithStatement();
      }
      if (this.term === null && this.isTryTransform(lookahead_62)) {
        return this.enforestTryStatement();
      }
      if (this.term === null && this.isThrowTransform(lookahead_62)) {
        return this.enforestThrowStatement();
      }
      if (this.term === null && this.isKeyword(lookahead_62, "class")) {
        return this.enforestClass({ isExpr: false });
      }
      if (this.term === null && this.isFnDeclTransform(lookahead_62)) {
        return this.enforestFunctionDeclaration();
      }
      if (this.term === null && this.isIdentifier(lookahead_62) && this.isPunctuator(this.peek(1), ":")) {
        return this.enforestLabeledStatement();
      }
      if (this.term === null && (this.isVarDeclTransform(lookahead_62) || this.isLetDeclTransform(lookahead_62) || this.isConstDeclTransform(lookahead_62) || this.isSyntaxrecDeclTransform(lookahead_62) || this.isSyntaxDeclTransform(lookahead_62))) {
        var stmt = new _terms2.default("VariableDeclarationStatement", { declaration: this.enforestVariableDeclaration() });
        this.consumeSemicolon();
        return stmt;
      }
      if (this.term === null && this.isReturnStmtTransform(lookahead_62)) {
        return this.enforestReturnStatement();
      }
      if (this.term === null && this.isPunctuator(lookahead_62, ";")) {
        this.advance();
        return new _terms2.default("EmptyStatement", {});
      }
      return this.enforestExpressionStatement();
    }
  }, {
    key: "enforestLabeledStatement",
    value: function enforestLabeledStatement() {
      var label_63 = this.matchIdentifier();
      var punc_64 = this.matchPunctuator(":");
      var stmt_65 = this.enforestStatement();
      return new _terms2.default("LabeledStatement", { label: label_63, body: stmt_65 });
    }
  }, {
    key: "enforestBreakStatement",
    value: function enforestBreakStatement() {
      this.matchKeyword("break");
      var lookahead_66 = this.peek();
      var label_67 = null;
      if (this.rest.size === 0 || this.isPunctuator(lookahead_66, ";")) {
        this.consumeSemicolon();
        return new _terms2.default("BreakStatement", { label: label_67 });
      }
      if (this.isIdentifier(lookahead_66) || this.isKeyword(lookahead_66, "yield") || this.isKeyword(lookahead_66, "let")) {
        label_67 = this.enforestIdentifier();
      }
      this.consumeSemicolon();
      return new _terms2.default("BreakStatement", { label: label_67 });
    }
  }, {
    key: "enforestTryStatement",
    value: function enforestTryStatement() {
      this.matchKeyword("try");
      var body_68 = this.enforestBlock();
      if (this.isKeyword(this.peek(), "catch")) {
        var catchClause = this.enforestCatchClause();
        if (this.isKeyword(this.peek(), "finally")) {
          this.advance();
          var finalizer = this.enforestBlock();
          return new _terms2.default("TryFinallyStatement", { body: body_68, catchClause: catchClause, finalizer: finalizer });
        }
        return new _terms2.default("TryCatchStatement", { body: body_68, catchClause: catchClause });
      }
      if (this.isKeyword(this.peek(), "finally")) {
        this.advance();
        var _finalizer = this.enforestBlock();
        return new _terms2.default("TryFinallyStatement", { body: body_68, catchClause: null, finalizer: _finalizer });
      }
      throw this.createError(this.peek(), "try with no catch or finally");
    }
  }, {
    key: "enforestCatchClause",
    value: function enforestCatchClause() {
      this.matchKeyword("catch");
      var bindingParens_69 = this.matchParens();
      var enf_70 = new Enforester(bindingParens_69, (0, _immutable.List)(), this.context);
      var binding_71 = enf_70.enforestBindingTarget();
      var body_72 = this.enforestBlock();
      return new _terms2.default("CatchClause", { binding: binding_71, body: body_72 });
    }
  }, {
    key: "enforestThrowStatement",
    value: function enforestThrowStatement() {
      this.matchKeyword("throw");
      var expression_73 = this.enforestExpression();
      this.consumeSemicolon();
      return new _terms2.default("ThrowStatement", { expression: expression_73 });
    }
  }, {
    key: "enforestWithStatement",
    value: function enforestWithStatement() {
      this.matchKeyword("with");
      var objParens_74 = this.matchParens();
      var enf_75 = new Enforester(objParens_74, (0, _immutable.List)(), this.context);
      var object_76 = enf_75.enforestExpression();
      var body_77 = this.enforestStatement();
      return new _terms2.default("WithStatement", { object: object_76, body: body_77 });
    }
  }, {
    key: "enforestDebuggerStatement",
    value: function enforestDebuggerStatement() {
      this.matchKeyword("debugger");
      return new _terms2.default("DebuggerStatement", {});
    }
  }, {
    key: "enforestDoStatement",
    value: function enforestDoStatement() {
      this.matchKeyword("do");
      var body_78 = this.enforestStatement();
      this.matchKeyword("while");
      var testBody_79 = this.matchParens();
      var enf_80 = new Enforester(testBody_79, (0, _immutable.List)(), this.context);
      var test_81 = enf_80.enforestExpression();
      this.consumeSemicolon();
      return new _terms2.default("DoWhileStatement", { body: body_78, test: test_81 });
    }
  }, {
    key: "enforestContinueStatement",
    value: function enforestContinueStatement() {
      var kwd_82 = this.matchKeyword("continue");
      var lookahead_83 = this.peek();
      var label_84 = null;
      if (this.rest.size === 0 || this.isPunctuator(lookahead_83, ";")) {
        this.consumeSemicolon();
        return new _terms2.default("ContinueStatement", { label: label_84 });
      }
      if (this.lineNumberEq(kwd_82, lookahead_83) && (this.isIdentifier(lookahead_83) || this.isKeyword(lookahead_83, "yield") || this.isKeyword(lookahead_83, "let"))) {
        label_84 = this.enforestIdentifier();
      }
      this.consumeSemicolon();
      return new _terms2.default("ContinueStatement", { label: label_84 });
    }
  }, {
    key: "enforestSwitchStatement",
    value: function enforestSwitchStatement() {
      this.matchKeyword("switch");
      var cond_85 = this.matchParens();
      var enf_86 = new Enforester(cond_85, (0, _immutable.List)(), this.context);
      var discriminant_87 = enf_86.enforestExpression();
      var body_88 = this.matchCurlies();
      if (body_88.size === 0) {
        return new _terms2.default("SwitchStatement", { discriminant: discriminant_87, cases: (0, _immutable.List)() });
      }
      enf_86 = new Enforester(body_88, (0, _immutable.List)(), this.context);
      var cases_89 = enf_86.enforestSwitchCases();
      var lookahead_90 = enf_86.peek();
      if (enf_86.isKeyword(lookahead_90, "default")) {
        var defaultCase = enf_86.enforestSwitchDefault();
        var postDefaultCases = enf_86.enforestSwitchCases();
        return new _terms2.default("SwitchStatementWithDefault", { discriminant: discriminant_87, preDefaultCases: cases_89, defaultCase: defaultCase, postDefaultCases: postDefaultCases });
      }
      return new _terms2.default("SwitchStatement", { discriminant: discriminant_87, cases: cases_89 });
    }
  }, {
    key: "enforestSwitchCases",
    value: function enforestSwitchCases() {
      var cases_91 = [];
      while (!(this.rest.size === 0 || this.isKeyword(this.peek(), "default"))) {
        cases_91.push(this.enforestSwitchCase());
      }
      return (0, _immutable.List)(cases_91);
    }
  }, {
    key: "enforestSwitchCase",
    value: function enforestSwitchCase() {
      this.matchKeyword("case");
      return new _terms2.default("SwitchCase", { test: this.enforestExpression(), consequent: this.enforestSwitchCaseBody() });
    }
  }, {
    key: "enforestSwitchCaseBody",
    value: function enforestSwitchCaseBody() {
      this.matchPunctuator(":");
      return this.enforestStatementListInSwitchCaseBody();
    }
  }, {
    key: "enforestStatementListInSwitchCaseBody",
    value: function enforestStatementListInSwitchCaseBody() {
      var result_92 = [];
      while (!(this.rest.size === 0 || this.isKeyword(this.peek(), "default") || this.isKeyword(this.peek(), "case"))) {
        result_92.push(this.enforestStatementListItem());
      }
      return (0, _immutable.List)(result_92);
    }
  }, {
    key: "enforestSwitchDefault",
    value: function enforestSwitchDefault() {
      this.matchKeyword("default");
      return new _terms2.default("SwitchDefault", { consequent: this.enforestSwitchCaseBody() });
    }
  }, {
    key: "enforestForStatement",
    value: function enforestForStatement() {
      this.matchKeyword("for");
      var cond_93 = this.matchParens();
      var enf_94 = new Enforester(cond_93, (0, _immutable.List)(), this.context);
      var lookahead_95 = void 0,
          test_96 = void 0,
          init_97 = void 0,
          right_98 = void 0,
          type_99 = void 0,
          left_100 = void 0,
          update_101 = void 0;
      if (enf_94.isPunctuator(enf_94.peek(), ";")) {
        enf_94.advance();
        if (!enf_94.isPunctuator(enf_94.peek(), ";")) {
          test_96 = enf_94.enforestExpression();
        }
        enf_94.matchPunctuator(";");
        if (enf_94.rest.size !== 0) {
          right_98 = enf_94.enforestExpression();
        }
        return new _terms2.default("ForStatement", { init: null, test: test_96, update: right_98, body: this.enforestStatement() });
      } else {
        lookahead_95 = enf_94.peek();
        if (enf_94.isVarDeclTransform(lookahead_95) || enf_94.isLetDeclTransform(lookahead_95) || enf_94.isConstDeclTransform(lookahead_95)) {
          init_97 = enf_94.enforestVariableDeclaration();
          lookahead_95 = enf_94.peek();
          if (this.isKeyword(lookahead_95, "in") || this.isIdentifier(lookahead_95, "of")) {
            if (this.isKeyword(lookahead_95, "in")) {
              enf_94.advance();
              right_98 = enf_94.enforestExpression();
              type_99 = "ForInStatement";
            } else if (this.isIdentifier(lookahead_95, "of")) {
              enf_94.advance();
              right_98 = enf_94.enforestExpression();
              type_99 = "ForOfStatement";
            }
            return new _terms2.default(type_99, { left: init_97, right: right_98, body: this.enforestStatement() });
          }
          enf_94.matchPunctuator(";");
          if (enf_94.isPunctuator(enf_94.peek(), ";")) {
            enf_94.advance();
            test_96 = null;
          } else {
            test_96 = enf_94.enforestExpression();
            enf_94.matchPunctuator(";");
          }
          update_101 = enf_94.enforestExpression();
        } else {
          if (this.isKeyword(enf_94.peek(1), "in") || this.isIdentifier(enf_94.peek(1), "of")) {
            left_100 = enf_94.enforestBindingIdentifier();
            var kind = enf_94.advance();
            if (this.isKeyword(kind, "in")) {
              type_99 = "ForInStatement";
            } else {
              type_99 = "ForOfStatement";
            }
            right_98 = enf_94.enforestExpression();
            return new _terms2.default(type_99, { left: left_100, right: right_98, body: this.enforestStatement() });
          }
          init_97 = enf_94.enforestExpression();
          enf_94.matchPunctuator(";");
          if (enf_94.isPunctuator(enf_94.peek(), ";")) {
            enf_94.advance();
            test_96 = null;
          } else {
            test_96 = enf_94.enforestExpression();
            enf_94.matchPunctuator(";");
          }
          update_101 = enf_94.enforestExpression();
        }
        return new _terms2.default("ForStatement", { init: init_97, test: test_96, update: update_101, body: this.enforestStatement() });
      }
    }
  }, {
    key: "enforestIfStatement",
    value: function enforestIfStatement() {
      this.matchKeyword("if");
      var cond_102 = this.matchParens();
      var enf_103 = new Enforester(cond_102, (0, _immutable.List)(), this.context);
      var lookahead_104 = enf_103.peek();
      var test_105 = enf_103.enforestExpression();
      if (test_105 === null) {
        throw enf_103.createError(lookahead_104, "expecting an expression");
      }
      var consequent_106 = this.enforestStatement();
      var alternate_107 = null;
      if (this.isKeyword(this.peek(), "else")) {
        this.advance();
        alternate_107 = this.enforestStatement();
      }
      return new _terms2.default("IfStatement", { test: test_105, consequent: consequent_106, alternate: alternate_107 });
    }
  }, {
    key: "enforestWhileStatement",
    value: function enforestWhileStatement() {
      this.matchKeyword("while");
      var cond_108 = this.matchParens();
      var enf_109 = new Enforester(cond_108, (0, _immutable.List)(), this.context);
      var lookahead_110 = enf_109.peek();
      var test_111 = enf_109.enforestExpression();
      if (test_111 === null) {
        throw enf_109.createError(lookahead_110, "expecting an expression");
      }
      var body_112 = this.enforestStatement();
      return new _terms2.default("WhileStatement", { test: test_111, body: body_112 });
    }
  }, {
    key: "enforestBlockStatement",
    value: function enforestBlockStatement() {
      return new _terms2.default("BlockStatement", { block: this.enforestBlock() });
    }
  }, {
    key: "enforestBlock",
    value: function enforestBlock() {
      var b_113 = this.matchCurlies();
      var body_114 = [];
      var enf_115 = new Enforester(b_113, (0, _immutable.List)(), this.context);
      while (enf_115.rest.size !== 0) {
        var lookahead = enf_115.peek();
        var stmt = enf_115.enforestStatement();
        if (stmt == null) {
          throw enf_115.createError(lookahead, "not a statement");
        }
        body_114.push(stmt);
      }
      return new _terms2.default("Block", { statements: (0, _immutable.List)(body_114) });
    }
  }, {
    key: "enforestClass",
    value: function enforestClass(_ref) {
      var isExpr = _ref.isExpr;
      var inDefault = _ref.inDefault;

      var kw_116 = this.advance();
      var name_117 = null,
          supr_118 = null;
      var type_119 = isExpr ? "ClassExpression" : "ClassDeclaration";
      if (this.isIdentifier(this.peek())) {
        name_117 = this.enforestBindingIdentifier();
      } else if (!isExpr) {
        if (inDefault) {
          name_117 = new _terms2.default("BindingIdentifier", { name: _syntax2.default.fromIdentifier("_default", kw_116) });
        } else {
          throw this.createError(this.peek(), "unexpected syntax");
        }
      }
      if (this.isKeyword(this.peek(), "extends")) {
        this.advance();
        supr_118 = this.enforestExpressionLoop();
      }
      var elements_120 = [];
      var enf_121 = new Enforester(this.matchCurlies(), (0, _immutable.List)(), this.context);
      while (enf_121.rest.size !== 0) {
        if (enf_121.isPunctuator(enf_121.peek(), ";")) {
          enf_121.advance();
          continue;
        }
        var isStatic = false;

        var _enf_121$enforestMeth = enf_121.enforestMethodDefinition();

        var methodOrKey = _enf_121$enforestMeth.methodOrKey;
        var kind = _enf_121$enforestMeth.kind;

        if (kind === "identifier" && methodOrKey.value.val() === "static") {
          isStatic = true;

          var _enf_121$enforestMeth2 = enf_121.enforestMethodDefinition();

          methodOrKey = _enf_121$enforestMeth2.methodOrKey;
          kind = _enf_121$enforestMeth2.kind;
        }
        if (kind === "method") {
          elements_120.push(new _terms2.default("ClassElement", { isStatic: isStatic, method: methodOrKey }));
        } else {
          throw this.createError(enf_121.peek(), "Only methods are allowed in classes");
        }
      }
      return new _terms2.default(type_119, { name: name_117, super: supr_118, elements: (0, _immutable.List)(elements_120) });
    }
  }, {
    key: "enforestBindingTarget",
    value: function enforestBindingTarget() {
      var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var allowPunctuator = _ref2.allowPunctuator;

      var lookahead_122 = this.peek();
      if (this.isIdentifier(lookahead_122) || this.isKeyword(lookahead_122) || allowPunctuator && this.isPunctuator(lookahead_122)) {
        return this.enforestBindingIdentifier({ allowPunctuator: allowPunctuator });
      } else if (this.isBrackets(lookahead_122)) {
        return this.enforestArrayBinding();
      } else if (this.isBraces(lookahead_122)) {
        return this.enforestObjectBinding();
      }
      (0, _errors.assert)(false, "not implemented yet");
    }
  }, {
    key: "enforestObjectBinding",
    value: function enforestObjectBinding() {
      var enf_123 = new Enforester(this.matchCurlies(), (0, _immutable.List)(), this.context);
      var properties_124 = [];
      while (enf_123.rest.size !== 0) {
        properties_124.push(enf_123.enforestBindingProperty());
        enf_123.consumeComma();
      }
      return new _terms2.default("ObjectBinding", { properties: (0, _immutable.List)(properties_124) });
    }
  }, {
    key: "enforestBindingProperty",
    value: function enforestBindingProperty() {
      var lookahead_125 = this.peek();

      var _enforestPropertyName = this.enforestPropertyName();

      var name = _enforestPropertyName.name;
      var binding = _enforestPropertyName.binding;

      if (this.isIdentifier(lookahead_125) || this.isKeyword(lookahead_125, "let") || this.isKeyword(lookahead_125, "yield")) {
        if (!this.isPunctuator(this.peek(), ":")) {
          var defaultValue = null;
          if (this.isAssign(this.peek())) {
            this.advance();
            var expr = this.enforestExpressionLoop();
            defaultValue = expr;
          }
          return new _terms2.default("BindingPropertyIdentifier", { binding: binding, init: defaultValue });
        }
      }
      this.matchPunctuator(":");
      binding = this.enforestBindingElement();
      return new _terms2.default("BindingPropertyProperty", { name: name, binding: binding });
    }
  }, {
    key: "enforestArrayBinding",
    value: function enforestArrayBinding() {
      var bracket_126 = this.matchSquares();
      var enf_127 = new Enforester(bracket_126, (0, _immutable.List)(), this.context);
      var elements_128 = [],
          restElement_129 = null;
      while (enf_127.rest.size !== 0) {
        var el = void 0;
        if (enf_127.isPunctuator(enf_127.peek(), ",")) {
          enf_127.consumeComma();
          el = null;
        } else {
          if (enf_127.isPunctuator(enf_127.peek(), "...")) {
            enf_127.advance();
            restElement_129 = enf_127.enforestBindingTarget();
            break;
          } else {
            el = enf_127.enforestBindingElement();
          }
          enf_127.consumeComma();
        }
        elements_128.push(el);
      }
      return new _terms2.default("ArrayBinding", { elements: (0, _immutable.List)(elements_128), restElement: restElement_129 });
    }
  }, {
    key: "enforestBindingElement",
    value: function enforestBindingElement() {
      var binding_130 = this.enforestBindingTarget();
      if (this.isAssign(this.peek())) {
        this.advance();
        var init = this.enforestExpressionLoop();
        binding_130 = new _terms2.default("BindingWithDefault", { binding: binding_130, init: init });
      }
      return binding_130;
    }
  }, {
    key: "enforestBindingIdentifier",
    value: function enforestBindingIdentifier() {
      var _ref3 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var allowPunctuator = _ref3.allowPunctuator;

      var name_131 = void 0;
      if (allowPunctuator && this.isPunctuator(this.peek())) {
        name_131 = this.enforestPunctuator();
      } else {
        name_131 = this.enforestIdentifier();
      }
      return new _terms2.default("BindingIdentifier", { name: name_131 });
    }
  }, {
    key: "enforestPunctuator",
    value: function enforestPunctuator() {
      var lookahead_132 = this.peek();
      if (this.isPunctuator(lookahead_132)) {
        return this.advance();
      }
      throw this.createError(lookahead_132, "expecting a punctuator");
    }
  }, {
    key: "enforestIdentifier",
    value: function enforestIdentifier() {
      var lookahead_133 = this.peek();
      if (this.isIdentifier(lookahead_133) || this.isKeyword(lookahead_133)) {
        return this.advance();
      }
      throw this.createError(lookahead_133, "expecting an identifier");
    }
  }, {
    key: "enforestReturnStatement",
    value: function enforestReturnStatement() {
      var kw_134 = this.advance();
      var lookahead_135 = this.peek();
      if (this.rest.size === 0 || lookahead_135 && !this.lineNumberEq(kw_134, lookahead_135)) {
        return new _terms2.default("ReturnStatement", { expression: null });
      }
      var term_136 = null;
      if (!this.isPunctuator(lookahead_135, ";")) {
        term_136 = this.enforestExpression();
        (0, _errors.expect)(term_136 != null, "Expecting an expression to follow return keyword", lookahead_135, this.rest);
      }
      this.consumeSemicolon();
      return new _terms2.default("ReturnStatement", { expression: term_136 });
    }
  }, {
    key: "enforestVariableDeclaration",
    value: function enforestVariableDeclaration() {
      var kind_137 = void 0;
      var lookahead_138 = this.advance();
      var kindSyn_139 = lookahead_138;
      var phase_140 = this.context.phase;
      if (kindSyn_139 && this.context.env.get(kindSyn_139.resolve(phase_140)) === _transforms.VariableDeclTransform) {
        kind_137 = "var";
      } else if (kindSyn_139 && this.context.env.get(kindSyn_139.resolve(phase_140)) === _transforms.LetDeclTransform) {
        kind_137 = "let";
      } else if (kindSyn_139 && this.context.env.get(kindSyn_139.resolve(phase_140)) === _transforms.ConstDeclTransform) {
        kind_137 = "const";
      } else if (kindSyn_139 && this.context.env.get(kindSyn_139.resolve(phase_140)) === _transforms.SyntaxDeclTransform) {
        kind_137 = "syntax";
      } else if (kindSyn_139 && this.context.env.get(kindSyn_139.resolve(phase_140)) === _transforms.SyntaxrecDeclTransform) {
        kind_137 = "syntaxrec";
      }
      var decls_141 = (0, _immutable.List)();
      while (true) {
        var term = this.enforestVariableDeclarator({ isSyntax: kind_137 === "syntax" || kind_137 === "syntaxrec" });
        var _lookahead_ = this.peek();
        decls_141 = decls_141.concat(term);
        if (this.isPunctuator(_lookahead_, ",")) {
          this.advance();
        } else {
          break;
        }
      }
      return new _terms2.default("VariableDeclaration", { kind: kind_137, declarators: decls_141 });
    }
  }, {
    key: "enforestVariableDeclarator",
    value: function enforestVariableDeclarator(_ref4) {
      var isSyntax = _ref4.isSyntax;

      var id_142 = this.enforestBindingTarget({ allowPunctuator: isSyntax });
      var lookahead_143 = this.peek();
      var init_144 = void 0,
          rest_145 = void 0;
      if (this.isPunctuator(lookahead_143, "=")) {
        this.advance();
        var enf = new Enforester(this.rest, (0, _immutable.List)(), this.context);
        init_144 = enf.enforest("expression");
        this.rest = enf.rest;
      } else {
        init_144 = null;
      }
      return new _terms2.default("VariableDeclarator", { binding: id_142, init: init_144 });
    }
  }, {
    key: "enforestExpressionStatement",
    value: function enforestExpressionStatement() {
      var start_146 = this.rest.get(0);
      var expr_147 = this.enforestExpression();
      if (expr_147 === null) {
        throw this.createError(start_146, "not a valid expression");
      }
      this.consumeSemicolon();
      return new _terms2.default("ExpressionStatement", { expression: expr_147 });
    }
  }, {
    key: "enforestExpression",
    value: function enforestExpression() {
      var left_148 = this.enforestExpressionLoop();
      var lookahead_149 = this.peek();
      if (this.isPunctuator(lookahead_149, ",")) {
        while (this.rest.size !== 0) {
          if (!this.isPunctuator(this.peek(), ",")) {
            break;
          }
          var operator = this.advance();
          var right = this.enforestExpressionLoop();
          left_148 = new _terms2.default("BinaryExpression", { left: left_148, operator: operator, right: right });
        }
      }
      this.term = null;
      return left_148;
    }
  }, {
    key: "enforestExpressionLoop",
    value: function enforestExpressionLoop() {
      this.term = null;
      this.opCtx = { prec: 0, combine: function combine(x_150) {
          return x_150;
        }, stack: (0, _immutable.List)() };
      do {
        var term = this.enforestAssignmentExpression();
        if (term === EXPR_LOOP_NO_CHANGE_38 && this.opCtx.stack.size > 0) {
          this.term = this.opCtx.combine(this.term);

          var _opCtx$stack$last = this.opCtx.stack.last();

          var prec = _opCtx$stack$last.prec;
          var combine = _opCtx$stack$last.combine;

          this.opCtx.prec = prec;
          this.opCtx.combine = combine;
          this.opCtx.stack = this.opCtx.stack.pop();
        } else if (term === EXPR_LOOP_NO_CHANGE_38) {
          break;
        } else if (term === EXPR_LOOP_OPERATOR_37 || term === EXPR_LOOP_EXPANSION_39) {
          this.term = null;
        } else {
          this.term = term;
        }
      } while (true);
      return this.term;
    }
  }, {
    key: "enforestAssignmentExpression",
    value: function enforestAssignmentExpression() {
      var lookahead_151 = this.peek();
      if (this.term === null && this.isTerm(lookahead_151)) {
        return this.advance();
      }
      if (this.term === null && this.isCompiletimeTransform(lookahead_151)) {
        var result = this.expandMacro();
        this.rest = result.concat(this.rest);
        return EXPR_LOOP_EXPANSION_39;
      }
      if (this.term === null && this.isKeyword(lookahead_151, "yield")) {
        return this.enforestYieldExpression();
      }
      if (this.term === null && this.isKeyword(lookahead_151, "class")) {
        return this.enforestClass({ isExpr: true });
      }
      if (this.term === null && this.isKeyword(lookahead_151, "super")) {
        this.advance();
        return new _terms2.default("Super", {});
      }
      if (this.term === null && (this.isIdentifier(lookahead_151) || this.isParens(lookahead_151)) && this.isPunctuator(this.peek(1), "=>") && this.lineNumberEq(lookahead_151, this.peek(1))) {
        return this.enforestArrowExpression();
      }
      if (this.term === null && this.isSyntaxTemplate(lookahead_151)) {
        return this.enforestSyntaxTemplate();
      }
      if (this.term === null && this.isSyntaxQuoteTransform(lookahead_151)) {
        return this.enforestSyntaxQuote();
      }
      if (this.term === null && this.isNewTransform(lookahead_151)) {
        return this.enforestNewExpression();
      }
      if (this.term === null && this.isKeyword(lookahead_151, "this")) {
        return new _terms2.default("ThisExpression", { stx: this.advance() });
      }
      if (this.term === null && (this.isIdentifier(lookahead_151) || this.isKeyword(lookahead_151, "let") || this.isKeyword(lookahead_151, "yield"))) {
        return new _terms2.default("IdentifierExpression", { name: this.advance() });
      }
      if (this.term === null && this.isNumericLiteral(lookahead_151)) {
        var num = this.advance();
        if (num.val() === 1 / 0) {
          return new _terms2.default("LiteralInfinityExpression", {});
        }
        return new _terms2.default("LiteralNumericExpression", { value: num });
      }
      if (this.term === null && this.isStringLiteral(lookahead_151)) {
        return new _terms2.default("LiteralStringExpression", { value: this.advance() });
      }
      if (this.term === null && this.isTemplate(lookahead_151)) {
        return new _terms2.default("TemplateExpression", { tag: null, elements: this.enforestTemplateElements() });
      }
      if (this.term === null && this.isBooleanLiteral(lookahead_151)) {
        return new _terms2.default("LiteralBooleanExpression", { value: this.advance() });
      }
      if (this.term === null && this.isNullLiteral(lookahead_151)) {
        this.advance();
        return new _terms2.default("LiteralNullExpression", {});
      }
      if (this.term === null && this.isRegularExpression(lookahead_151)) {
        var reStx = this.advance();
        var lastSlash = reStx.token.value.lastIndexOf("/");
        var pattern = reStx.token.value.slice(1, lastSlash);
        var flags = reStx.token.value.slice(lastSlash + 1);
        return new _terms2.default("LiteralRegExpExpression", { pattern: pattern, flags: flags });
      }
      if (this.term === null && this.isParens(lookahead_151)) {
        return new _terms2.default("ParenthesizedExpression", { inner: this.advance().inner() });
      }
      if (this.term === null && this.isFnDeclTransform(lookahead_151)) {
        return this.enforestFunctionExpression();
      }
      if (this.term === null && this.isBraces(lookahead_151)) {
        return this.enforestObjectExpression();
      }
      if (this.term === null && this.isBrackets(lookahead_151)) {
        return this.enforestArrayExpression();
      }
      if (this.term === null && this.isOperator(lookahead_151)) {
        return this.enforestUnaryExpression();
      }
      if (this.term && this.isUpdateOperator(lookahead_151)) {
        return this.enforestUpdateExpression();
      }
      if (this.term && this.isOperator(lookahead_151)) {
        return this.enforestBinaryExpression();
      }
      if (this.term && this.isPunctuator(lookahead_151, ".") && (this.isIdentifier(this.peek(1)) || this.isKeyword(this.peek(1)))) {
        return this.enforestStaticMemberExpression();
      }
      if (this.term && this.isBrackets(lookahead_151)) {
        return this.enforestComputedMemberExpression();
      }
      if (this.term && this.isParens(lookahead_151)) {
        var paren = this.advance();
        return new _terms2.default("CallExpression", { callee: this.term, arguments: paren.inner() });
      }
      if (this.term && this.isTemplate(lookahead_151)) {
        return new _terms2.default("TemplateExpression", { tag: this.term, elements: this.enforestTemplateElements() });
      }
      if (this.term && this.isAssign(lookahead_151)) {
        var binding = this.transformDestructuring(this.term);
        var op = this.advance();
        var enf = new Enforester(this.rest, (0, _immutable.List)(), this.context);
        var init = enf.enforest("expression");
        this.rest = enf.rest;
        if (op.val() === "=") {
          return new _terms2.default("AssignmentExpression", { binding: binding, expression: init });
        } else {
          return new _terms2.default("CompoundAssignmentExpression", { binding: binding, operator: op.val(), expression: init });
        }
      }
      if (this.term && this.isPunctuator(lookahead_151, "?")) {
        return this.enforestConditionalExpression();
      }
      return EXPR_LOOP_NO_CHANGE_38;
    }
  }, {
    key: "enforestArgumentList",
    value: function enforestArgumentList() {
      var result_152 = [];
      while (this.rest.size > 0) {
        var arg = void 0;
        if (this.isPunctuator(this.peek(), "...")) {
          this.advance();
          arg = new _terms2.default("SpreadElement", { expression: this.enforestExpressionLoop() });
        } else {
          arg = this.enforestExpressionLoop();
        }
        if (this.rest.size > 0) {
          this.matchPunctuator(",");
        }
        result_152.push(arg);
      }
      return (0, _immutable.List)(result_152);
    }
  }, {
    key: "enforestNewExpression",
    value: function enforestNewExpression() {
      this.matchKeyword("new");
      var callee_153 = void 0;
      if (this.isKeyword(this.peek(), "new")) {
        callee_153 = this.enforestNewExpression();
      } else if (this.isKeyword(this.peek(), "super")) {
        callee_153 = this.enforestExpressionLoop();
      } else if (this.isPunctuator(this.peek(), ".") && this.isIdentifier(this.peek(1), "target")) {
        this.advance();
        this.advance();
        return new _terms2.default("NewTargetExpression", {});
      } else {
        callee_153 = new _terms2.default("IdentifierExpression", { name: this.enforestIdentifier() });
      }
      var args_154 = void 0;
      if (this.isParens(this.peek())) {
        args_154 = this.matchParens();
      } else {
        args_154 = (0, _immutable.List)();
      }
      return new _terms2.default("NewExpression", { callee: callee_153, arguments: args_154 });
    }
  }, {
    key: "enforestComputedMemberExpression",
    value: function enforestComputedMemberExpression() {
      var enf_155 = new Enforester(this.matchSquares(), (0, _immutable.List)(), this.context);
      return new _terms2.default("ComputedMemberExpression", { object: this.term, expression: enf_155.enforestExpression() });
    }
  }, {
    key: "transformDestructuring",
    value: function transformDestructuring(term_156) {
      var _this = this;

      switch (term_156.type) {
        case "IdentifierExpression":
          return new _terms2.default("BindingIdentifier", { name: term_156.name });
        case "ParenthesizedExpression":
          if (term_156.inner.size === 1 && this.isIdentifier(term_156.inner.get(0))) {
            return new _terms2.default("BindingIdentifier", { name: term_156.inner.get(0) });
          }
        case "DataProperty":
          return new _terms2.default("BindingPropertyProperty", { name: term_156.name, binding: this.transformDestructuringWithDefault(term_156.expression) });
        case "ShorthandProperty":
          return new _terms2.default("BindingPropertyIdentifier", { binding: new _terms2.default("BindingIdentifier", { name: term_156.name }), init: null });
        case "ObjectExpression":
          return new _terms2.default("ObjectBinding", { properties: term_156.properties.map(function (t_157) {
              return _this.transformDestructuring(t_157);
            }) });
        case "ArrayExpression":
          var last = term_156.elements.last();
          if (last != null && last.type === "SpreadElement") {
            return new _terms2.default("ArrayBinding", { elements: term_156.elements.slice(0, -1).map(function (t_158) {
                return t_158 && _this.transformDestructuringWithDefault(t_158);
              }), restElement: this.transformDestructuringWithDefault(last.expression) });
          } else {
            return new _terms2.default("ArrayBinding", { elements: term_156.elements.map(function (t_159) {
                return t_159 && _this.transformDestructuringWithDefault(t_159);
              }), restElement: null });
          }
          return new _terms2.default("ArrayBinding", { elements: term_156.elements.map(function (t_160) {
              return t_160 && _this.transformDestructuring(t_160);
            }), restElement: null });
        case "StaticPropertyName":
          return new _terms2.default("BindingIdentifier", { name: term_156.value });
        case "ComputedMemberExpression":
        case "StaticMemberExpression":
        case "ArrayBinding":
        case "BindingIdentifier":
        case "BindingPropertyIdentifier":
        case "BindingPropertyProperty":
        case "BindingWithDefault":
        case "ObjectBinding":
          return term_156;
      }
      (0, _errors.assert)(false, "not implemented yet for " + term_156.type);
    }
  }, {
    key: "transformDestructuringWithDefault",
    value: function transformDestructuringWithDefault(term_161) {
      switch (term_161.type) {
        case "AssignmentExpression":
          return new _terms2.default("BindingWithDefault", { binding: this.transformDestructuring(term_161.binding), init: term_161.expression });
      }
      return this.transformDestructuring(term_161);
    }
  }, {
    key: "enforestArrowExpression",
    value: function enforestArrowExpression() {
      var enf_162 = void 0;
      if (this.isIdentifier(this.peek())) {
        enf_162 = new Enforester(_immutable.List.of(this.advance()), (0, _immutable.List)(), this.context);
      } else {
        var p = this.matchParens();
        enf_162 = new Enforester(p, (0, _immutable.List)(), this.context);
      }
      var params_163 = enf_162.enforestFormalParameters();
      this.matchPunctuator("=>");
      var body_164 = void 0;
      if (this.isBraces(this.peek())) {
        body_164 = this.matchCurlies();
      } else {
        enf_162 = new Enforester(this.rest, (0, _immutable.List)(), this.context);
        body_164 = enf_162.enforestExpressionLoop();
        this.rest = enf_162.rest;
      }
      return new _terms2.default("ArrowExpression", { params: params_163, body: body_164 });
    }
  }, {
    key: "enforestYieldExpression",
    value: function enforestYieldExpression() {
      var kwd_165 = this.matchKeyword("yield");
      var lookahead_166 = this.peek();
      if (this.rest.size === 0 || lookahead_166 && !this.lineNumberEq(kwd_165, lookahead_166)) {
        return new _terms2.default("YieldExpression", { expression: null });
      } else {
        var isGenerator = false;
        if (this.isPunctuator(this.peek(), "*")) {
          isGenerator = true;
          this.advance();
        }
        var expr = this.enforestExpression();
        var type = isGenerator ? "YieldGeneratorExpression" : "YieldExpression";
        return new _terms2.default(type, { expression: expr });
      }
    }
  }, {
    key: "enforestSyntaxTemplate",
    value: function enforestSyntaxTemplate() {
      return new _terms2.default("SyntaxTemplate", { template: this.advance() });
    }
  }, {
    key: "enforestSyntaxQuote",
    value: function enforestSyntaxQuote() {
      var name_167 = this.advance();
      return new _terms2.default("SyntaxQuote", { name: name_167, template: new _terms2.default("TemplateExpression", { tag: new _terms2.default("IdentifierExpression", { name: name_167 }), elements: this.enforestTemplateElements() }) });
    }
  }, {
    key: "enforestStaticMemberExpression",
    value: function enforestStaticMemberExpression() {
      var object_168 = this.term;
      var dot_169 = this.advance();
      var property_170 = this.advance();
      return new _terms2.default("StaticMemberExpression", { object: object_168, property: property_170 });
    }
  }, {
    key: "enforestArrayExpression",
    value: function enforestArrayExpression() {
      var arr_171 = this.advance();
      var elements_172 = [];
      var enf_173 = new Enforester(arr_171.inner(), (0, _immutable.List)(), this.context);
      while (enf_173.rest.size > 0) {
        var lookahead = enf_173.peek();
        if (enf_173.isPunctuator(lookahead, ",")) {
          enf_173.advance();
          elements_172.push(null);
        } else if (enf_173.isPunctuator(lookahead, "...")) {
          enf_173.advance();
          var expression = enf_173.enforestExpressionLoop();
          if (expression == null) {
            throw enf_173.createError(lookahead, "expecting expression");
          }
          elements_172.push(new _terms2.default("SpreadElement", { expression: expression }));
        } else {
          var term = enf_173.enforestExpressionLoop();
          if (term == null) {
            throw enf_173.createError(lookahead, "expected expression");
          }
          elements_172.push(term);
          enf_173.consumeComma();
        }
      }
      return new _terms2.default("ArrayExpression", { elements: (0, _immutable.List)(elements_172) });
    }
  }, {
    key: "enforestObjectExpression",
    value: function enforestObjectExpression() {
      var obj_174 = this.advance();
      var properties_175 = (0, _immutable.List)();
      var enf_176 = new Enforester(obj_174.inner(), (0, _immutable.List)(), this.context);
      var lastProp_177 = null;
      while (enf_176.rest.size > 0) {
        var prop = enf_176.enforestPropertyDefinition();
        enf_176.consumeComma();
        properties_175 = properties_175.concat(prop);
        if (lastProp_177 === prop) {
          throw enf_176.createError(prop, "invalid syntax in object");
        }
        lastProp_177 = prop;
      }
      return new _terms2.default("ObjectExpression", { properties: properties_175 });
    }
  }, {
    key: "enforestPropertyDefinition",
    value: function enforestPropertyDefinition() {
      var _enforestMethodDefini = this.enforestMethodDefinition();

      var methodOrKey = _enforestMethodDefini.methodOrKey;
      var kind = _enforestMethodDefini.kind;

      switch (kind) {
        case "method":
          return methodOrKey;
        case "identifier":
          if (this.isAssign(this.peek())) {
            this.advance();
            var init = this.enforestExpressionLoop();
            return new _terms2.default("BindingPropertyIdentifier", { init: init, binding: this.transformDestructuring(methodOrKey) });
          } else if (!this.isPunctuator(this.peek(), ":")) {
            return new _terms2.default("ShorthandProperty", { name: methodOrKey.value });
          }
      }
      this.matchPunctuator(":");
      var expr_178 = this.enforestExpressionLoop();
      return new _terms2.default("DataProperty", { name: methodOrKey, expression: expr_178 });
    }
  }, {
    key: "enforestMethodDefinition",
    value: function enforestMethodDefinition() {
      var lookahead_179 = this.peek();
      var isGenerator_180 = false;
      if (this.isPunctuator(lookahead_179, "*")) {
        isGenerator_180 = true;
        this.advance();
      }
      if (this.isIdentifier(lookahead_179, "get") && this.isPropertyName(this.peek(1))) {
        this.advance();

        var _enforestPropertyName2 = this.enforestPropertyName();

        var _name = _enforestPropertyName2.name;

        this.matchParens();
        var body = this.matchCurlies();
        return { methodOrKey: new _terms2.default("Getter", { name: _name, body: body }), kind: "method" };
      } else if (this.isIdentifier(lookahead_179, "set") && this.isPropertyName(this.peek(1))) {
        this.advance();

        var _enforestPropertyName3 = this.enforestPropertyName();

        var _name2 = _enforestPropertyName3.name;

        var enf = new Enforester(this.matchParens(), (0, _immutable.List)(), this.context);
        var param = enf.enforestBindingElement();
        var _body = this.matchCurlies();
        return { methodOrKey: new _terms2.default("Setter", { name: _name2, param: param, body: _body }), kind: "method" };
      }

      var _enforestPropertyName4 = this.enforestPropertyName();

      var name = _enforestPropertyName4.name;

      if (this.isParens(this.peek())) {
        var params = this.matchParens();
        var _enf = new Enforester(params, (0, _immutable.List)(), this.context);
        var formalParams = _enf.enforestFormalParameters();
        var _body2 = this.matchCurlies();
        return { methodOrKey: new _terms2.default("Method", { isGenerator: isGenerator_180, name: name, params: formalParams, body: _body2 }), kind: "method" };
      }
      return { methodOrKey: name, kind: this.isIdentifier(lookahead_179) || this.isKeyword(lookahead_179) ? "identifier" : "property" };
    }
  }, {
    key: "enforestPropertyName",
    value: function enforestPropertyName() {
      var lookahead_181 = this.peek();
      if (this.isStringLiteral(lookahead_181) || this.isNumericLiteral(lookahead_181)) {
        return { name: new _terms2.default("StaticPropertyName", { value: this.advance() }), binding: null };
      } else if (this.isBrackets(lookahead_181)) {
        var enf = new Enforester(this.matchSquares(), (0, _immutable.List)(), this.context);
        var expr = enf.enforestExpressionLoop();
        return { name: new _terms2.default("ComputedPropertyName", { expression: expr }), binding: null };
      }
      var name_182 = this.advance();
      return { name: new _terms2.default("StaticPropertyName", { value: name_182 }), binding: new _terms2.default("BindingIdentifier", { name: name_182 }) };
    }
  }, {
    key: "enforestFunction",
    value: function enforestFunction(_ref5) {
      var isExpr = _ref5.isExpr;
      var inDefault = _ref5.inDefault;
      var allowGenerator = _ref5.allowGenerator;

      var name_183 = null,
          params_184 = void 0,
          body_185 = void 0,
          rest_186 = void 0;
      var isGenerator_187 = false;
      var fnKeyword_188 = this.advance();
      var lookahead_189 = this.peek();
      var type_190 = isExpr ? "FunctionExpression" : "FunctionDeclaration";
      if (this.isPunctuator(lookahead_189, "*")) {
        isGenerator_187 = true;
        this.advance();
        lookahead_189 = this.peek();
      }
      if (!this.isParens(lookahead_189)) {
        name_183 = this.enforestBindingIdentifier();
      } else if (inDefault) {
        name_183 = new _terms2.default("BindingIdentifier", { name: _syntax2.default.fromIdentifier("*default*", fnKeyword_188) });
      }
      params_184 = this.matchParens();
      body_185 = this.matchCurlies();
      var enf_191 = new Enforester(params_184, (0, _immutable.List)(), this.context);
      var formalParams_192 = enf_191.enforestFormalParameters();
      return new _terms2.default(type_190, { name: name_183, isGenerator: isGenerator_187, params: formalParams_192, body: body_185 });
    }
  }, {
    key: "enforestFunctionExpression",
    value: function enforestFunctionExpression() {
      var name_193 = null,
          params_194 = void 0,
          body_195 = void 0,
          rest_196 = void 0;
      var isGenerator_197 = false;
      this.advance();
      var lookahead_198 = this.peek();
      if (this.isPunctuator(lookahead_198, "*")) {
        isGenerator_197 = true;
        this.advance();
        lookahead_198 = this.peek();
      }
      if (!this.isParens(lookahead_198)) {
        name_193 = this.enforestBindingIdentifier();
      }
      params_194 = this.matchParens();
      body_195 = this.matchCurlies();
      var enf_199 = new Enforester(params_194, (0, _immutable.List)(), this.context);
      var formalParams_200 = enf_199.enforestFormalParameters();
      return new _terms2.default("FunctionExpression", { name: name_193, isGenerator: isGenerator_197, params: formalParams_200, body: body_195 });
    }
  }, {
    key: "enforestFunctionDeclaration",
    value: function enforestFunctionDeclaration() {
      var name_201 = void 0,
          params_202 = void 0,
          body_203 = void 0,
          rest_204 = void 0;
      var isGenerator_205 = false;
      this.advance();
      var lookahead_206 = this.peek();
      if (this.isPunctuator(lookahead_206, "*")) {
        isGenerator_205 = true;
        this.advance();
      }
      name_201 = this.enforestBindingIdentifier();
      params_202 = this.matchParens();
      body_203 = this.matchCurlies();
      var enf_207 = new Enforester(params_202, (0, _immutable.List)(), this.context);
      var formalParams_208 = enf_207.enforestFormalParameters();
      return new _terms2.default("FunctionDeclaration", { name: name_201, isGenerator: isGenerator_205, params: formalParams_208, body: body_203 });
    }
  }, {
    key: "enforestFormalParameters",
    value: function enforestFormalParameters() {
      var items_209 = [];
      var rest_210 = null;
      while (this.rest.size !== 0) {
        var lookahead = this.peek();
        if (this.isPunctuator(lookahead, "...")) {
          this.matchPunctuator("...");
          rest_210 = this.enforestBindingIdentifier();
          break;
        }
        items_209.push(this.enforestParam());
        this.consumeComma();
      }
      return new _terms2.default("FormalParameters", { items: (0, _immutable.List)(items_209), rest: rest_210 });
    }
  }, {
    key: "enforestParam",
    value: function enforestParam() {
      return this.enforestBindingElement();
    }
  }, {
    key: "enforestUpdateExpression",
    value: function enforestUpdateExpression() {
      var operator_211 = this.matchUnaryOperator();
      return new _terms2.default("UpdateExpression", { isPrefix: false, operator: operator_211.val(), operand: this.transformDestructuring(this.term) });
    }
  }, {
    key: "enforestUnaryExpression",
    value: function enforestUnaryExpression() {
      var _this2 = this;

      var operator_212 = this.matchUnaryOperator();
      this.opCtx.stack = this.opCtx.stack.push({ prec: this.opCtx.prec, combine: this.opCtx.combine });
      this.opCtx.prec = 14;
      this.opCtx.combine = function (rightTerm_213) {
        var type_214 = void 0,
            term_215 = void 0,
            isPrefix_216 = void 0;
        if (operator_212.val() === "++" || operator_212.val() === "--") {
          type_214 = "UpdateExpression";
          term_215 = _this2.transformDestructuring(rightTerm_213);
          isPrefix_216 = true;
        } else {
          type_214 = "UnaryExpression";
          isPrefix_216 = undefined;
          term_215 = rightTerm_213;
        }
        return new _terms2.default(type_214, { operator: operator_212.val(), operand: term_215, isPrefix: isPrefix_216 });
      };
      return EXPR_LOOP_OPERATOR_37;
    }
  }, {
    key: "enforestConditionalExpression",
    value: function enforestConditionalExpression() {
      var test_217 = this.opCtx.combine(this.term);
      if (this.opCtx.stack.size > 0) {
        var _opCtx$stack$last2 = this.opCtx.stack.last();

        var prec = _opCtx$stack$last2.prec;
        var combine = _opCtx$stack$last2.combine;

        this.opCtx.stack = this.opCtx.stack.pop();
        this.opCtx.prec = prec;
        this.opCtx.combine = combine;
      }
      this.matchPunctuator("?");
      var enf_218 = new Enforester(this.rest, (0, _immutable.List)(), this.context);
      var consequent_219 = enf_218.enforestExpressionLoop();
      enf_218.matchPunctuator(":");
      enf_218 = new Enforester(enf_218.rest, (0, _immutable.List)(), this.context);
      var alternate_220 = enf_218.enforestExpressionLoop();
      this.rest = enf_218.rest;
      return new _terms2.default("ConditionalExpression", { test: test_217, consequent: consequent_219, alternate: alternate_220 });
    }
  }, {
    key: "enforestBinaryExpression",
    value: function enforestBinaryExpression() {
      var leftTerm_221 = this.term;
      var opStx_222 = this.peek();
      var op_223 = opStx_222.val();
      var opPrec_224 = (0, _operators.getOperatorPrec)(op_223);
      var opAssoc_225 = (0, _operators.getOperatorAssoc)(op_223);
      if ((0, _operators.operatorLt)(this.opCtx.prec, opPrec_224, opAssoc_225)) {
        this.opCtx.stack = this.opCtx.stack.push({ prec: this.opCtx.prec, combine: this.opCtx.combine });
        this.opCtx.prec = opPrec_224;
        this.opCtx.combine = function (rightTerm_226) {
          return new _terms2.default("BinaryExpression", { left: leftTerm_221, operator: opStx_222, right: rightTerm_226 });
        };
        this.advance();
        return EXPR_LOOP_OPERATOR_37;
      } else {
        var term = this.opCtx.combine(leftTerm_221);

        var _opCtx$stack$last3 = this.opCtx.stack.last();

        var prec = _opCtx$stack$last3.prec;
        var combine = _opCtx$stack$last3.combine;

        this.opCtx.stack = this.opCtx.stack.pop();
        this.opCtx.prec = prec;
        this.opCtx.combine = combine;
        return term;
      }
    }
  }, {
    key: "enforestTemplateElements",
    value: function enforestTemplateElements() {
      var _this3 = this;

      var lookahead_227 = this.matchTemplate();
      var elements_228 = lookahead_227.token.items.map(function (it_229) {
        if (it_229 instanceof _syntax2.default && it_229.isDelimiter()) {
          var enf = new Enforester(it_229.inner(), (0, _immutable.List)(), _this3.context);
          return enf.enforest("expression");
        }
        return new _terms2.default("TemplateElement", { rawValue: it_229.slice.text });
      });
      return elements_228;
    }
  }, {
    key: "expandMacro",
    value: function expandMacro(enforestType_230) {
      var _this4 = this;

      var name_231 = this.advance();
      var syntaxTransform_232 = this.getCompiletimeTransform(name_231);
      if (syntaxTransform_232 == null || typeof syntaxTransform_232.value !== "function") {
        throw this.createError(name_231, "the macro name was not bound to a value that could be invoked");
      }
      var useSiteScope_233 = (0, _scope.freshScope)("u");
      var introducedScope_234 = (0, _scope.freshScope)("i");
      this.context.useScope = useSiteScope_233;
      var ctx_235 = new _macroContext2.default(this, name_231, this.context, useSiteScope_233, introducedScope_234);
      var result_236 = (0, _loadSyntax.sanitizeReplacementValues)(syntaxTransform_232.value.call(null, ctx_235));
      if (!_immutable.List.isList(result_236)) {
        throw this.createError(name_231, "macro must return a list but got: " + result_236);
      }
      result_236 = result_236.map(function (stx_237) {
        if (!(stx_237 && typeof stx_237.addScope === "function")) {
          throw _this4.createError(name_231, "macro must return syntax objects or terms but got: " + stx_237);
        }
        return stx_237.addScope(introducedScope_234, _this4.context.bindings, _syntax.ALL_PHASES, { flip: true });
      });
      return result_236;
    }
  }, {
    key: "consumeSemicolon",
    value: function consumeSemicolon() {
      var lookahead_238 = this.peek();
      if (lookahead_238 && this.isPunctuator(lookahead_238, ";")) {
        this.advance();
      }
    }
  }, {
    key: "consumeComma",
    value: function consumeComma() {
      var lookahead_239 = this.peek();
      if (lookahead_239 && this.isPunctuator(lookahead_239, ",")) {
        this.advance();
      }
    }
  }, {
    key: "isTerm",
    value: function isTerm(term_240) {
      return term_240 && term_240 instanceof _terms2.default;
    }
  }, {
    key: "isEOF",
    value: function isEOF(term_241) {
      return term_241 && term_241 instanceof _syntax2.default && term_241.isEOF();
    }
  }, {
    key: "isIdentifier",
    value: function isIdentifier(term_242) {
      var val_243 = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      return term_242 && term_242 instanceof _syntax2.default && term_242.isIdentifier() && (val_243 === null || term_242.val() === val_243);
    }
  }, {
    key: "isPropertyName",
    value: function isPropertyName(term_244) {
      return this.isIdentifier(term_244) || this.isKeyword(term_244) || this.isNumericLiteral(term_244) || this.isStringLiteral(term_244) || this.isBrackets(term_244);
    }
  }, {
    key: "isNumericLiteral",
    value: function isNumericLiteral(term_245) {
      return term_245 && term_245 instanceof _syntax2.default && term_245.isNumericLiteral();
    }
  }, {
    key: "isStringLiteral",
    value: function isStringLiteral(term_246) {
      return term_246 && term_246 instanceof _syntax2.default && term_246.isStringLiteral();
    }
  }, {
    key: "isTemplate",
    value: function isTemplate(term_247) {
      return term_247 && term_247 instanceof _syntax2.default && term_247.isTemplate();
    }
  }, {
    key: "isBooleanLiteral",
    value: function isBooleanLiteral(term_248) {
      return term_248 && term_248 instanceof _syntax2.default && term_248.isBooleanLiteral();
    }
  }, {
    key: "isNullLiteral",
    value: function isNullLiteral(term_249) {
      return term_249 && term_249 instanceof _syntax2.default && term_249.isNullLiteral();
    }
  }, {
    key: "isRegularExpression",
    value: function isRegularExpression(term_250) {
      return term_250 && term_250 instanceof _syntax2.default && term_250.isRegularExpression();
    }
  }, {
    key: "isParens",
    value: function isParens(term_251) {
      return term_251 && term_251 instanceof _syntax2.default && term_251.isParens();
    }
  }, {
    key: "isBraces",
    value: function isBraces(term_252) {
      return term_252 && term_252 instanceof _syntax2.default && term_252.isBraces();
    }
  }, {
    key: "isBrackets",
    value: function isBrackets(term_253) {
      return term_253 && term_253 instanceof _syntax2.default && term_253.isBrackets();
    }
  }, {
    key: "isAssign",
    value: function isAssign(term_254) {
      if (this.isPunctuator(term_254)) {
        switch (term_254.val()) {
          case "=":
          case "|=":
          case "^=":
          case "&=":
          case "<<=":
          case ">>=":
          case ">>>=":
          case "+=":
          case "-=":
          case "*=":
          case "/=":
          case "%=":
            return true;
          default:
            return false;
        }
      }
      return false;
    }
  }, {
    key: "isKeyword",
    value: function isKeyword(term_255) {
      var val_256 = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      return term_255 && term_255 instanceof _syntax2.default && term_255.isKeyword() && (val_256 === null || term_255.val() === val_256);
    }
  }, {
    key: "isPunctuator",
    value: function isPunctuator(term_257) {
      var val_258 = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      return term_257 && term_257 instanceof _syntax2.default && term_257.isPunctuator() && (val_258 === null || term_257.val() === val_258);
    }
  }, {
    key: "isOperator",
    value: function isOperator(term_259) {
      return term_259 && term_259 instanceof _syntax2.default && (0, _operators.isOperator)(term_259);
    }
  }, {
    key: "isUpdateOperator",
    value: function isUpdateOperator(term_260) {
      return term_260 && term_260 instanceof _syntax2.default && term_260.isPunctuator() && (term_260.val() === "++" || term_260.val() === "--");
    }
  }, {
    key: "isFnDeclTransform",
    value: function isFnDeclTransform(term_261) {
      return term_261 && term_261 instanceof _syntax2.default && this.context.env.get(term_261.resolve(this.context.phase)) === _transforms.FunctionDeclTransform;
    }
  }, {
    key: "isVarDeclTransform",
    value: function isVarDeclTransform(term_262) {
      return term_262 && term_262 instanceof _syntax2.default && this.context.env.get(term_262.resolve(this.context.phase)) === _transforms.VariableDeclTransform;
    }
  }, {
    key: "isLetDeclTransform",
    value: function isLetDeclTransform(term_263) {
      return term_263 && term_263 instanceof _syntax2.default && this.context.env.get(term_263.resolve(this.context.phase)) === _transforms.LetDeclTransform;
    }
  }, {
    key: "isConstDeclTransform",
    value: function isConstDeclTransform(term_264) {
      return term_264 && term_264 instanceof _syntax2.default && this.context.env.get(term_264.resolve(this.context.phase)) === _transforms.ConstDeclTransform;
    }
  }, {
    key: "isSyntaxDeclTransform",
    value: function isSyntaxDeclTransform(term_265) {
      return term_265 && term_265 instanceof _syntax2.default && this.context.env.get(term_265.resolve(this.context.phase)) === _transforms.SyntaxDeclTransform;
    }
  }, {
    key: "isSyntaxrecDeclTransform",
    value: function isSyntaxrecDeclTransform(term_266) {
      return term_266 && term_266 instanceof _syntax2.default && this.context.env.get(term_266.resolve(this.context.phase)) === _transforms.SyntaxrecDeclTransform;
    }
  }, {
    key: "isSyntaxTemplate",
    value: function isSyntaxTemplate(term_267) {
      return term_267 && term_267 instanceof _syntax2.default && term_267.isSyntaxTemplate();
    }
  }, {
    key: "isSyntaxQuoteTransform",
    value: function isSyntaxQuoteTransform(term_268) {
      return term_268 && term_268 instanceof _syntax2.default && this.context.env.get(term_268.resolve(this.context.phase)) === _transforms.SyntaxQuoteTransform;
    }
  }, {
    key: "isReturnStmtTransform",
    value: function isReturnStmtTransform(term_269) {
      return term_269 && term_269 instanceof _syntax2.default && this.context.env.get(term_269.resolve(this.context.phase)) === _transforms.ReturnStatementTransform;
    }
  }, {
    key: "isWhileTransform",
    value: function isWhileTransform(term_270) {
      return term_270 && term_270 instanceof _syntax2.default && this.context.env.get(term_270.resolve(this.context.phase)) === _transforms.WhileTransform;
    }
  }, {
    key: "isForTransform",
    value: function isForTransform(term_271) {
      return term_271 && term_271 instanceof _syntax2.default && this.context.env.get(term_271.resolve(this.context.phase)) === _transforms.ForTransform;
    }
  }, {
    key: "isSwitchTransform",
    value: function isSwitchTransform(term_272) {
      return term_272 && term_272 instanceof _syntax2.default && this.context.env.get(term_272.resolve(this.context.phase)) === _transforms.SwitchTransform;
    }
  }, {
    key: "isBreakTransform",
    value: function isBreakTransform(term_273) {
      return term_273 && term_273 instanceof _syntax2.default && this.context.env.get(term_273.resolve(this.context.phase)) === _transforms.BreakTransform;
    }
  }, {
    key: "isContinueTransform",
    value: function isContinueTransform(term_274) {
      return term_274 && term_274 instanceof _syntax2.default && this.context.env.get(term_274.resolve(this.context.phase)) === _transforms.ContinueTransform;
    }
  }, {
    key: "isDoTransform",
    value: function isDoTransform(term_275) {
      return term_275 && term_275 instanceof _syntax2.default && this.context.env.get(term_275.resolve(this.context.phase)) === _transforms.DoTransform;
    }
  }, {
    key: "isDebuggerTransform",
    value: function isDebuggerTransform(term_276) {
      return term_276 && term_276 instanceof _syntax2.default && this.context.env.get(term_276.resolve(this.context.phase)) === _transforms.DebuggerTransform;
    }
  }, {
    key: "isWithTransform",
    value: function isWithTransform(term_277) {
      return term_277 && term_277 instanceof _syntax2.default && this.context.env.get(term_277.resolve(this.context.phase)) === _transforms.WithTransform;
    }
  }, {
    key: "isTryTransform",
    value: function isTryTransform(term_278) {
      return term_278 && term_278 instanceof _syntax2.default && this.context.env.get(term_278.resolve(this.context.phase)) === _transforms.TryTransform;
    }
  }, {
    key: "isThrowTransform",
    value: function isThrowTransform(term_279) {
      return term_279 && term_279 instanceof _syntax2.default && this.context.env.get(term_279.resolve(this.context.phase)) === _transforms.ThrowTransform;
    }
  }, {
    key: "isIfTransform",
    value: function isIfTransform(term_280) {
      return term_280 && term_280 instanceof _syntax2.default && this.context.env.get(term_280.resolve(this.context.phase)) === _transforms.IfTransform;
    }
  }, {
    key: "isNewTransform",
    value: function isNewTransform(term_281) {
      return term_281 && term_281 instanceof _syntax2.default && this.context.env.get(term_281.resolve(this.context.phase)) === _transforms.NewTransform;
    }
  }, {
    key: "isCompiletimeTransform",
    value: function isCompiletimeTransform(term_282) {
      return term_282 && term_282 instanceof _syntax2.default && (this.context.env.get(term_282.resolve(this.context.phase)) instanceof _transforms.CompiletimeTransform || this.context.store.get(term_282.resolve(this.context.phase)) instanceof _transforms.CompiletimeTransform);
    }
  }, {
    key: "getCompiletimeTransform",
    value: function getCompiletimeTransform(term_283) {
      if (this.context.env.has(term_283.resolve(this.context.phase))) {
        return this.context.env.get(term_283.resolve(this.context.phase));
      }
      return this.context.store.get(term_283.resolve(this.context.phase));
    }
  }, {
    key: "lineNumberEq",
    value: function lineNumberEq(a_284, b_285) {
      if (!(a_284 && b_285)) {
        return false;
      }
      (0, _errors.assert)(a_284 instanceof _syntax2.default, "expecting a syntax object");
      (0, _errors.assert)(b_285 instanceof _syntax2.default, "expecting a syntax object");
      return a_284.lineNumber() === b_285.lineNumber();
    }
  }, {
    key: "matchIdentifier",
    value: function matchIdentifier(val_286) {
      var lookahead_287 = this.advance();
      if (this.isIdentifier(lookahead_287)) {
        return lookahead_287;
      }
      throw this.createError(lookahead_287, "expecting an identifier");
    }
  }, {
    key: "matchKeyword",
    value: function matchKeyword(val_288) {
      var lookahead_289 = this.advance();
      if (this.isKeyword(lookahead_289, val_288)) {
        return lookahead_289;
      }
      throw this.createError(lookahead_289, "expecting " + val_288);
    }
  }, {
    key: "matchLiteral",
    value: function matchLiteral() {
      var lookahead_290 = this.advance();
      if (this.isNumericLiteral(lookahead_290) || this.isStringLiteral(lookahead_290) || this.isBooleanLiteral(lookahead_290) || this.isNullLiteral(lookahead_290) || this.isTemplate(lookahead_290) || this.isRegularExpression(lookahead_290)) {
        return lookahead_290;
      }
      throw this.createError(lookahead_290, "expecting a literal");
    }
  }, {
    key: "matchStringLiteral",
    value: function matchStringLiteral() {
      var lookahead_291 = this.advance();
      if (this.isStringLiteral(lookahead_291)) {
        return lookahead_291;
      }
      throw this.createError(lookahead_291, "expecting a string literal");
    }
  }, {
    key: "matchTemplate",
    value: function matchTemplate() {
      var lookahead_292 = this.advance();
      if (this.isTemplate(lookahead_292)) {
        return lookahead_292;
      }
      throw this.createError(lookahead_292, "expecting a template literal");
    }
  }, {
    key: "matchParens",
    value: function matchParens() {
      var lookahead_293 = this.advance();
      if (this.isParens(lookahead_293)) {
        return lookahead_293.inner();
      }
      throw this.createError(lookahead_293, "expecting parens");
    }
  }, {
    key: "matchCurlies",
    value: function matchCurlies() {
      var lookahead_294 = this.advance();
      if (this.isBraces(lookahead_294)) {
        return lookahead_294.inner();
      }
      throw this.createError(lookahead_294, "expecting curly braces");
    }
  }, {
    key: "matchSquares",
    value: function matchSquares() {
      var lookahead_295 = this.advance();
      if (this.isBrackets(lookahead_295)) {
        return lookahead_295.inner();
      }
      throw this.createError(lookahead_295, "expecting sqaure braces");
    }
  }, {
    key: "matchUnaryOperator",
    value: function matchUnaryOperator() {
      var lookahead_296 = this.advance();
      if ((0, _operators.isUnaryOperator)(lookahead_296)) {
        return lookahead_296;
      }
      throw this.createError(lookahead_296, "expecting a unary operator");
    }
  }, {
    key: "matchPunctuator",
    value: function matchPunctuator(val_297) {
      var lookahead_298 = this.advance();
      if (this.isPunctuator(lookahead_298)) {
        if (typeof val_297 !== "undefined") {
          if (lookahead_298.val() === val_297) {
            return lookahead_298;
          } else {
            throw this.createError(lookahead_298, "expecting a " + val_297 + " punctuator");
          }
        }
        return lookahead_298;
      }
      throw this.createError(lookahead_298, "expecting a punctuator");
    }
  }, {
    key: "createError",
    value: function createError(stx_299, message_300) {
      var ctx_301 = "";
      var offending_302 = stx_299;
      if (this.rest.size > 0) {
        ctx_301 = this.rest.slice(0, 20).map(function (term_303) {
          if (term_303.isDelimiter()) {
            return term_303.inner();
          }
          return _immutable.List.of(term_303);
        }).flatten().map(function (s_304) {
          if (s_304 === offending_302) {
            return "__" + s_304.val() + "__";
          }
          return s_304.val();
        }).join(" ");
      } else {
        ctx_301 = offending_302.toString();
      }
      return new Error(message_300 + "\n" + ctx_301);
    }
  }]);

  return Enforester;
}();
//# sourceMappingURL=data:application/json;base64,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bUJBQU8sYUFBUDtBQUNELFdBRkQsTUFFTztBQUNMLGtCQUFNLEtBQUssV0FBTCxDQUFpQixhQUFqQixFQUFnQyxpQkFBaUIsT0FBakIsR0FBMkIsYUFBM0QsQ0FBTjtBQUNEO0FBQ0Y7QUFDRCxlQUFPLGFBQVA7QUFDRDtBQUNELFlBQU0sS0FBSyxXQUFMLENBQWlCLGFBQWpCLEVBQWdDLHdCQUFoQyxDQUFOO0FBQ0Q7OztnQ0FDVyxPLEVBQVMsVyxFQUFhO0FBQ2hDLFVBQUksVUFBVSxFQUFkO0FBQ0EsVUFBSSxnQkFBZ0IsT0FBcEI7QUFDQSxVQUFJLEtBQUssSUFBTCxDQUFVLElBQVYsR0FBaUIsQ0FBckIsRUFBd0I7QUFDdEIsa0JBQVUsS0FBSyxJQUFMLENBQVUsS0FBVixDQUFnQixDQUFoQixFQUFtQixFQUFuQixFQUF1QixHQUF2QixDQUEyQixvQkFBWTtBQUMvQyxjQUFJLFNBQVMsV0FBVCxFQUFKLEVBQTRCO0FBQzFCLG1CQUFPLFNBQVMsS0FBVCxFQUFQO0FBQ0Q7QUFDRCxpQkFBTyxnQkFBSyxFQUFMLENBQVEsUUFBUixDQUFQO0FBQ0QsU0FMUyxFQUtQLE9BTE8sR0FLRyxHQUxILENBS08saUJBQVM7QUFDeEIsY0FBSSxVQUFVLGFBQWQsRUFBNkI7QUFDM0IsbUJBQU8sT0FBTyxNQUFNLEdBQU4sRUFBUCxHQUFxQixJQUE1QjtBQUNEO0FBQ0QsaUJBQU8sTUFBTSxHQUFOLEVBQVA7QUFDRCxTQVZTLEVBVVAsSUFWTyxDQVVGLEdBVkUsQ0FBVjtBQVdELE9BWkQsTUFZTztBQUNMLGtCQUFVLGNBQWMsUUFBZCxFQUFWO0FBQ0Q7QUFDRCxhQUFPLElBQUksS0FBSixDQUFVLGNBQWMsSUFBZCxHQUFxQixPQUEvQixDQUFQO0FBQ0QiLCJmaWxlIjoiZW5mb3Jlc3Rlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZXJtIGZyb20gXCIuL3Rlcm1zXCI7XG5pbXBvcnQge0Z1bmN0aW9uRGVjbFRyYW5zZm9ybSwgVmFyaWFibGVEZWNsVHJhbnNmb3JtLCBOZXdUcmFuc2Zvcm0sIExldERlY2xUcmFuc2Zvcm0sIENvbnN0RGVjbFRyYW5zZm9ybSwgU3ludGF4RGVjbFRyYW5zZm9ybSwgU3ludGF4cmVjRGVjbFRyYW5zZm9ybSwgU3ludGF4UXVvdGVUcmFuc2Zvcm0sIFJldHVyblN0YXRlbWVudFRyYW5zZm9ybSwgV2hpbGVUcmFuc2Zvcm0sIElmVHJhbnNmb3JtLCBGb3JUcmFuc2Zvcm0sIFN3aXRjaFRyYW5zZm9ybSwgQnJlYWtUcmFuc2Zvcm0sIENvbnRpbnVlVHJhbnNmb3JtLCBEb1RyYW5zZm9ybSwgRGVidWdnZXJUcmFuc2Zvcm0sIFdpdGhUcmFuc2Zvcm0sIFRyeVRyYW5zZm9ybSwgVGhyb3dUcmFuc2Zvcm0sIENvbXBpbGV0aW1lVHJhbnNmb3JtfSBmcm9tIFwiLi90cmFuc2Zvcm1zXCI7XG5pbXBvcnQge0xpc3R9IGZyb20gXCJpbW11dGFibGVcIjtcbmltcG9ydCB7ZXhwZWN0LCBhc3NlcnR9IGZyb20gXCIuL2Vycm9yc1wiO1xuaW1wb3J0IHtpc09wZXJhdG9yLCBpc1VuYXJ5T3BlcmF0b3IsIGdldE9wZXJhdG9yQXNzb2MsIGdldE9wZXJhdG9yUHJlYywgb3BlcmF0b3JMdH0gZnJvbSBcIi4vb3BlcmF0b3JzXCI7XG5pbXBvcnQgU3ludGF4LCB7QUxMX1BIQVNFU30gZnJvbSBcIi4vc3ludGF4XCI7XG5pbXBvcnQge2ZyZXNoU2NvcGV9IGZyb20gXCIuL3Njb3BlXCI7XG5pbXBvcnQge3Nhbml0aXplUmVwbGFjZW1lbnRWYWx1ZXN9IGZyb20gXCIuL2xvYWQtc3ludGF4XCI7XG5pbXBvcnQgTWFjcm9Db250ZXh0IGZyb20gXCIuL21hY3JvLWNvbnRleHRcIjtcbmNvbnN0IEVYUFJfTE9PUF9PUEVSQVRPUl8zNyA9IHt9O1xuY29uc3QgRVhQUl9MT09QX05PX0NIQU5HRV8zOCA9IHt9O1xuY29uc3QgRVhQUl9MT09QX0VYUEFOU0lPTl8zOSA9IHt9O1xuZXhwb3J0IGNsYXNzIEVuZm9yZXN0ZXIge1xuICBjb25zdHJ1Y3RvcihzdHhsXzQwLCBwcmV2XzQxLCBjb250ZXh0XzQyKSB7XG4gICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgYXNzZXJ0KExpc3QuaXNMaXN0KHN0eGxfNDApLCBcImV4cGVjdGluZyBhIGxpc3Qgb2YgdGVybXMgdG8gZW5mb3Jlc3RcIik7XG4gICAgYXNzZXJ0KExpc3QuaXNMaXN0KHByZXZfNDEpLCBcImV4cGVjdGluZyBhIGxpc3Qgb2YgdGVybXMgdG8gZW5mb3Jlc3RcIik7XG4gICAgYXNzZXJ0KGNvbnRleHRfNDIsIFwiZXhwZWN0aW5nIGEgY29udGV4dCB0byBlbmZvcmVzdFwiKTtcbiAgICB0aGlzLnRlcm0gPSBudWxsO1xuICAgIHRoaXMucmVzdCA9IHN0eGxfNDA7XG4gICAgdGhpcy5wcmV2ID0gcHJldl80MTtcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0XzQyO1xuICB9XG4gIHBlZWsobl80MyA9IDApIHtcbiAgICByZXR1cm4gdGhpcy5yZXN0LmdldChuXzQzKTtcbiAgfVxuICBhZHZhbmNlKCkge1xuICAgIGxldCByZXRfNDQgPSB0aGlzLnJlc3QuZmlyc3QoKTtcbiAgICB0aGlzLnJlc3QgPSB0aGlzLnJlc3QucmVzdCgpO1xuICAgIHJldHVybiByZXRfNDQ7XG4gIH1cbiAgZW5mb3Jlc3QodHlwZV80NSA9IFwiTW9kdWxlXCIpIHtcbiAgICB0aGlzLnRlcm0gPSBudWxsO1xuICAgIGlmICh0aGlzLnJlc3Quc2l6ZSA9PT0gMCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzLnRlcm07XG4gICAgfVxuICAgIGlmICh0aGlzLmlzRU9GKHRoaXMucGVlaygpKSkge1xuICAgICAgdGhpcy50ZXJtID0gbmV3IFRlcm0oXCJFT0ZcIiwge30pO1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICByZXR1cm4gdGhpcy50ZXJtO1xuICAgIH1cbiAgICBsZXQgcmVzdWx0XzQ2O1xuICAgIGlmICh0eXBlXzQ1ID09PSBcImV4cHJlc3Npb25cIikge1xuICAgICAgcmVzdWx0XzQ2ID0gdGhpcy5lbmZvcmVzdEV4cHJlc3Npb25Mb29wKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdF80NiA9IHRoaXMuZW5mb3Jlc3RNb2R1bGUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucmVzdC5zaXplID09PSAwKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0XzQ2O1xuICB9XG4gIGVuZm9yZXN0TW9kdWxlKCkge1xuICAgIHJldHVybiB0aGlzLmVuZm9yZXN0Qm9keSgpO1xuICB9XG4gIGVuZm9yZXN0Qm9keSgpIHtcbiAgICByZXR1cm4gdGhpcy5lbmZvcmVzdE1vZHVsZUl0ZW0oKTtcbiAgfVxuICBlbmZvcmVzdE1vZHVsZUl0ZW0oKSB7XG4gICAgbGV0IGxvb2thaGVhZF80NyA9IHRoaXMucGVlaygpO1xuICAgIGlmICh0aGlzLmlzS2V5d29yZChsb29rYWhlYWRfNDcsIFwiaW1wb3J0XCIpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIHJldHVybiB0aGlzLmVuZm9yZXN0SW1wb3J0RGVjbGFyYXRpb24oKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNLZXl3b3JkKGxvb2thaGVhZF80NywgXCJleHBvcnRcIikpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgcmV0dXJuIHRoaXMuZW5mb3Jlc3RFeHBvcnREZWNsYXJhdGlvbigpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5lbmZvcmVzdFN0YXRlbWVudCgpO1xuICB9XG4gIGVuZm9yZXN0RXhwb3J0RGVjbGFyYXRpb24oKSB7XG4gICAgbGV0IGxvb2thaGVhZF80OCA9IHRoaXMucGVlaygpO1xuICAgIGlmICh0aGlzLmlzUHVuY3R1YXRvcihsb29rYWhlYWRfNDgsIFwiKlwiKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICBsZXQgbW9kdWxlU3BlY2lmaWVyID0gdGhpcy5lbmZvcmVzdEZyb21DbGF1c2UoKTtcbiAgICAgIHJldHVybiBuZXcgVGVybShcIkV4cG9ydEFsbEZyb21cIiwge21vZHVsZVNwZWNpZmllcjogbW9kdWxlU3BlY2lmaWVyfSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzQnJhY2VzKGxvb2thaGVhZF80OCkpIHtcbiAgICAgIGxldCBuYW1lZEV4cG9ydHMgPSB0aGlzLmVuZm9yZXN0RXhwb3J0Q2xhdXNlKCk7XG4gICAgICBsZXQgbW9kdWxlU3BlY2lmaWVyID0gbnVsbDtcbiAgICAgIGlmICh0aGlzLmlzSWRlbnRpZmllcih0aGlzLnBlZWsoKSwgXCJmcm9tXCIpKSB7XG4gICAgICAgIG1vZHVsZVNwZWNpZmllciA9IHRoaXMuZW5mb3Jlc3RGcm9tQ2xhdXNlKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IFRlcm0oXCJFeHBvcnRGcm9tXCIsIHtuYW1lZEV4cG9ydHM6IG5hbWVkRXhwb3J0cywgbW9kdWxlU3BlY2lmaWVyOiBtb2R1bGVTcGVjaWZpZXJ9KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNLZXl3b3JkKGxvb2thaGVhZF80OCwgXCJjbGFzc1wiKSkge1xuICAgICAgcmV0dXJuIG5ldyBUZXJtKFwiRXhwb3J0XCIsIHtkZWNsYXJhdGlvbjogdGhpcy5lbmZvcmVzdENsYXNzKHtpc0V4cHI6IGZhbHNlfSl9KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNGbkRlY2xUcmFuc2Zvcm0obG9va2FoZWFkXzQ4KSkge1xuICAgICAgcmV0dXJuIG5ldyBUZXJtKFwiRXhwb3J0XCIsIHtkZWNsYXJhdGlvbjogdGhpcy5lbmZvcmVzdEZ1bmN0aW9uKHtpc0V4cHI6IGZhbHNlLCBpbkRlZmF1bHQ6IGZhbHNlfSl9KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNLZXl3b3JkKGxvb2thaGVhZF80OCwgXCJkZWZhdWx0XCIpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIGlmICh0aGlzLmlzRm5EZWNsVHJhbnNmb3JtKHRoaXMucGVlaygpKSkge1xuICAgICAgICByZXR1cm4gbmV3IFRlcm0oXCJFeHBvcnREZWZhdWx0XCIsIHtib2R5OiB0aGlzLmVuZm9yZXN0RnVuY3Rpb24oe2lzRXhwcjogZmFsc2UsIGluRGVmYXVsdDogdHJ1ZX0pfSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNLZXl3b3JkKHRoaXMucGVlaygpLCBcImNsYXNzXCIpKSB7XG4gICAgICAgIHJldHVybiBuZXcgVGVybShcIkV4cG9ydERlZmF1bHRcIiwge2JvZHk6IHRoaXMuZW5mb3Jlc3RDbGFzcyh7aXNFeHByOiBmYWxzZSwgaW5EZWZhdWx0OiB0cnVlfSl9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBib2R5ID0gdGhpcy5lbmZvcmVzdEV4cHJlc3Npb25Mb29wKCk7XG4gICAgICAgIHRoaXMuY29uc3VtZVNlbWljb2xvbigpO1xuICAgICAgICByZXR1cm4gbmV3IFRlcm0oXCJFeHBvcnREZWZhdWx0XCIsIHtib2R5OiBib2R5fSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzVmFyRGVjbFRyYW5zZm9ybShsb29rYWhlYWRfNDgpIHx8IHRoaXMuaXNMZXREZWNsVHJhbnNmb3JtKGxvb2thaGVhZF80OCkgfHwgdGhpcy5pc0NvbnN0RGVjbFRyYW5zZm9ybShsb29rYWhlYWRfNDgpIHx8IHRoaXMuaXNTeW50YXhyZWNEZWNsVHJhbnNmb3JtKGxvb2thaGVhZF80OCkgfHwgdGhpcy5pc1N5bnRheERlY2xUcmFuc2Zvcm0obG9va2FoZWFkXzQ4KSkge1xuICAgICAgcmV0dXJuIG5ldyBUZXJtKFwiRXhwb3J0XCIsIHtkZWNsYXJhdGlvbjogdGhpcy5lbmZvcmVzdFZhcmlhYmxlRGVjbGFyYXRpb24oKX0pO1xuICAgIH1cbiAgICB0aHJvdyB0aGlzLmNyZWF0ZUVycm9yKGxvb2thaGVhZF80OCwgXCJ1bmV4cGVjdGVkIHN5bnRheFwiKTtcbiAgfVxuICBlbmZvcmVzdEV4cG9ydENsYXVzZSgpIHtcbiAgICBsZXQgZW5mXzQ5ID0gbmV3IEVuZm9yZXN0ZXIodGhpcy5tYXRjaEN1cmxpZXMoKSwgTGlzdCgpLCB0aGlzLmNvbnRleHQpO1xuICAgIGxldCByZXN1bHRfNTAgPSBbXTtcbiAgICB3aGlsZSAoZW5mXzQ5LnJlc3Quc2l6ZSAhPT0gMCkge1xuICAgICAgcmVzdWx0XzUwLnB1c2goZW5mXzQ5LmVuZm9yZXN0RXhwb3J0U3BlY2lmaWVyKCkpO1xuICAgICAgZW5mXzQ5LmNvbnN1bWVDb21tYSgpO1xuICAgIH1cbiAgICByZXR1cm4gTGlzdChyZXN1bHRfNTApO1xuICB9XG4gIGVuZm9yZXN0RXhwb3J0U3BlY2lmaWVyKCkge1xuICAgIGxldCBuYW1lXzUxID0gdGhpcy5lbmZvcmVzdElkZW50aWZpZXIoKTtcbiAgICBpZiAodGhpcy5pc0lkZW50aWZpZXIodGhpcy5wZWVrKCksIFwiYXNcIikpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgbGV0IGV4cG9ydGVkTmFtZSA9IHRoaXMuZW5mb3Jlc3RJZGVudGlmaWVyKCk7XG4gICAgICByZXR1cm4gbmV3IFRlcm0oXCJFeHBvcnRTcGVjaWZpZXJcIiwge25hbWU6IG5hbWVfNTEsIGV4cG9ydGVkTmFtZTogZXhwb3J0ZWROYW1lfSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgVGVybShcIkV4cG9ydFNwZWNpZmllclwiLCB7bmFtZTogbnVsbCwgZXhwb3J0ZWROYW1lOiBuYW1lXzUxfSk7XG4gIH1cbiAgZW5mb3Jlc3RJbXBvcnREZWNsYXJhdGlvbigpIHtcbiAgICBsZXQgbG9va2FoZWFkXzUyID0gdGhpcy5wZWVrKCk7XG4gICAgbGV0IGRlZmF1bHRCaW5kaW5nXzUzID0gbnVsbDtcbiAgICBsZXQgbmFtZWRJbXBvcnRzXzU0ID0gTGlzdCgpO1xuICAgIGxldCBmb3JTeW50YXhfNTUgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5pc1N0cmluZ0xpdGVyYWwobG9va2FoZWFkXzUyKSkge1xuICAgICAgbGV0IG1vZHVsZVNwZWNpZmllciA9IHRoaXMuYWR2YW5jZSgpO1xuICAgICAgdGhpcy5jb25zdW1lU2VtaWNvbG9uKCk7XG4gICAgICByZXR1cm4gbmV3IFRlcm0oXCJJbXBvcnRcIiwge2RlZmF1bHRCaW5kaW5nOiBkZWZhdWx0QmluZGluZ181MywgbmFtZWRJbXBvcnRzOiBuYW1lZEltcG9ydHNfNTQsIG1vZHVsZVNwZWNpZmllcjogbW9kdWxlU3BlY2lmaWVyfSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmlzSWRlbnRpZmllcihsb29rYWhlYWRfNTIpIHx8IHRoaXMuaXNLZXl3b3JkKGxvb2thaGVhZF81MikpIHtcbiAgICAgIGRlZmF1bHRCaW5kaW5nXzUzID0gdGhpcy5lbmZvcmVzdEJpbmRpbmdJZGVudGlmaWVyKCk7XG4gICAgICBpZiAoIXRoaXMuaXNQdW5jdHVhdG9yKHRoaXMucGVlaygpLCBcIixcIikpIHtcbiAgICAgICAgbGV0IG1vZHVsZVNwZWNpZmllciA9IHRoaXMuZW5mb3Jlc3RGcm9tQ2xhdXNlKCk7XG4gICAgICAgIGlmICh0aGlzLmlzS2V5d29yZCh0aGlzLnBlZWsoKSwgXCJmb3JcIikgJiYgdGhpcy5pc0lkZW50aWZpZXIodGhpcy5wZWVrKDEpLCBcInN5bnRheFwiKSkge1xuICAgICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICAgIGZvclN5bnRheF81NSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBUZXJtKFwiSW1wb3J0XCIsIHtkZWZhdWx0QmluZGluZzogZGVmYXVsdEJpbmRpbmdfNTMsIG1vZHVsZVNwZWNpZmllcjogbW9kdWxlU3BlY2lmaWVyLCBuYW1lZEltcG9ydHM6IExpc3QoKSwgZm9yU3ludGF4OiBmb3JTeW50YXhfNTV9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jb25zdW1lQ29tbWEoKTtcbiAgICBsb29rYWhlYWRfNTIgPSB0aGlzLnBlZWsoKTtcbiAgICBpZiAodGhpcy5pc0JyYWNlcyhsb29rYWhlYWRfNTIpKSB7XG4gICAgICBsZXQgaW1wb3J0cyA9IHRoaXMuZW5mb3Jlc3ROYW1lZEltcG9ydHMoKTtcbiAgICAgIGxldCBmcm9tQ2xhdXNlID0gdGhpcy5lbmZvcmVzdEZyb21DbGF1c2UoKTtcbiAgICAgIGlmICh0aGlzLmlzS2V5d29yZCh0aGlzLnBlZWsoKSwgXCJmb3JcIikgJiYgdGhpcy5pc0lkZW50aWZpZXIodGhpcy5wZWVrKDEpLCBcInN5bnRheFwiKSkge1xuICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgIGZvclN5bnRheF81NSA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IFRlcm0oXCJJbXBvcnRcIiwge2RlZmF1bHRCaW5kaW5nOiBkZWZhdWx0QmluZGluZ181MywgZm9yU3ludGF4OiBmb3JTeW50YXhfNTUsIG5hbWVkSW1wb3J0czogaW1wb3J0cywgbW9kdWxlU3BlY2lmaWVyOiBmcm9tQ2xhdXNlfSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzUHVuY3R1YXRvcihsb29rYWhlYWRfNTIsIFwiKlwiKSkge1xuICAgICAgbGV0IG5hbWVzcGFjZUJpbmRpbmcgPSB0aGlzLmVuZm9yZXN0TmFtZXNwYWNlQmluZGluZygpO1xuICAgICAgbGV0IG1vZHVsZVNwZWNpZmllciA9IHRoaXMuZW5mb3Jlc3RGcm9tQ2xhdXNlKCk7XG4gICAgICBpZiAodGhpcy5pc0tleXdvcmQodGhpcy5wZWVrKCksIFwiZm9yXCIpICYmIHRoaXMuaXNJZGVudGlmaWVyKHRoaXMucGVlaygxKSwgXCJzeW50YXhcIikpIHtcbiAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICBmb3JTeW50YXhfNTUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBUZXJtKFwiSW1wb3J0TmFtZXNwYWNlXCIsIHtkZWZhdWx0QmluZGluZzogZGVmYXVsdEJpbmRpbmdfNTMsIGZvclN5bnRheDogZm9yU3ludGF4XzU1LCBuYW1lc3BhY2VCaW5kaW5nOiBuYW1lc3BhY2VCaW5kaW5nLCBtb2R1bGVTcGVjaWZpZXI6IG1vZHVsZVNwZWNpZmllcn0pO1xuICAgIH1cbiAgICB0aHJvdyB0aGlzLmNyZWF0ZUVycm9yKGxvb2thaGVhZF81MiwgXCJ1bmV4cGVjdGVkIHN5bnRheFwiKTtcbiAgfVxuICBlbmZvcmVzdE5hbWVzcGFjZUJpbmRpbmcoKSB7XG4gICAgdGhpcy5tYXRjaFB1bmN0dWF0b3IoXCIqXCIpO1xuICAgIHRoaXMubWF0Y2hJZGVudGlmaWVyKFwiYXNcIik7XG4gICAgcmV0dXJuIHRoaXMuZW5mb3Jlc3RCaW5kaW5nSWRlbnRpZmllcigpO1xuICB9XG4gIGVuZm9yZXN0TmFtZWRJbXBvcnRzKCkge1xuICAgIGxldCBlbmZfNTYgPSBuZXcgRW5mb3Jlc3Rlcih0aGlzLm1hdGNoQ3VybGllcygpLCBMaXN0KCksIHRoaXMuY29udGV4dCk7XG4gICAgbGV0IHJlc3VsdF81NyA9IFtdO1xuICAgIHdoaWxlIChlbmZfNTYucmVzdC5zaXplICE9PSAwKSB7XG4gICAgICByZXN1bHRfNTcucHVzaChlbmZfNTYuZW5mb3Jlc3RJbXBvcnRTcGVjaWZpZXJzKCkpO1xuICAgICAgZW5mXzU2LmNvbnN1bWVDb21tYSgpO1xuICAgIH1cbiAgICByZXR1cm4gTGlzdChyZXN1bHRfNTcpO1xuICB9XG4gIGVuZm9yZXN0SW1wb3J0U3BlY2lmaWVycygpIHtcbiAgICBsZXQgbG9va2FoZWFkXzU4ID0gdGhpcy5wZWVrKCk7XG4gICAgbGV0IG5hbWVfNTk7XG4gICAgaWYgKHRoaXMuaXNJZGVudGlmaWVyKGxvb2thaGVhZF81OCkgfHwgdGhpcy5pc0tleXdvcmQobG9va2FoZWFkXzU4KSkge1xuICAgICAgbmFtZV81OSA9IHRoaXMuYWR2YW5jZSgpO1xuICAgICAgaWYgKCF0aGlzLmlzSWRlbnRpZmllcih0aGlzLnBlZWsoKSwgXCJhc1wiKSkge1xuICAgICAgICByZXR1cm4gbmV3IFRlcm0oXCJJbXBvcnRTcGVjaWZpZXJcIiwge25hbWU6IG51bGwsIGJpbmRpbmc6IG5ldyBUZXJtKFwiQmluZGluZ0lkZW50aWZpZXJcIiwge25hbWU6IG5hbWVfNTl9KX0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tYXRjaElkZW50aWZpZXIoXCJhc1wiKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgdGhpcy5jcmVhdGVFcnJvcihsb29rYWhlYWRfNTgsIFwidW5leHBlY3RlZCB0b2tlbiBpbiBpbXBvcnQgc3BlY2lmaWVyXCIpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFRlcm0oXCJJbXBvcnRTcGVjaWZpZXJcIiwge25hbWU6IG5hbWVfNTksIGJpbmRpbmc6IHRoaXMuZW5mb3Jlc3RCaW5kaW5nSWRlbnRpZmllcigpfSk7XG4gIH1cbiAgZW5mb3Jlc3RGcm9tQ2xhdXNlKCkge1xuICAgIHRoaXMubWF0Y2hJZGVudGlmaWVyKFwiZnJvbVwiKTtcbiAgICBsZXQgbG9va2FoZWFkXzYwID0gdGhpcy5tYXRjaFN0cmluZ0xpdGVyYWwoKTtcbiAgICB0aGlzLmNvbnN1bWVTZW1pY29sb24oKTtcbiAgICByZXR1cm4gbG9va2FoZWFkXzYwO1xuICB9XG4gIGVuZm9yZXN0U3RhdGVtZW50TGlzdEl0ZW0oKSB7XG4gICAgbGV0IGxvb2thaGVhZF82MSA9IHRoaXMucGVlaygpO1xuICAgIGlmICh0aGlzLmlzRm5EZWNsVHJhbnNmb3JtKGxvb2thaGVhZF82MSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZm9yZXN0RnVuY3Rpb25EZWNsYXJhdGlvbih7aXNFeHByOiBmYWxzZX0pO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0tleXdvcmQobG9va2FoZWFkXzYxLCBcImNsYXNzXCIpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmZvcmVzdENsYXNzKHtpc0V4cHI6IGZhbHNlfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZm9yZXN0U3RhdGVtZW50KCk7XG4gICAgfVxuICB9XG4gIGVuZm9yZXN0U3RhdGVtZW50KCkge1xuICAgIGxldCBsb29rYWhlYWRfNjIgPSB0aGlzLnBlZWsoKTtcbiAgICBpZiAodGhpcy50ZXJtID09PSBudWxsICYmIHRoaXMuaXNDb21waWxldGltZVRyYW5zZm9ybShsb29rYWhlYWRfNjIpKSB7XG4gICAgICB0aGlzLnJlc3QgPSB0aGlzLmV4cGFuZE1hY3JvKCkuY29uY2F0KHRoaXMucmVzdCk7XG4gICAgICBsb29rYWhlYWRfNjIgPSB0aGlzLnBlZWsoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudGVybSA9PT0gbnVsbCAmJiB0aGlzLmlzQnJhY2VzKGxvb2thaGVhZF82MikpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZm9yZXN0QmxvY2tTdGF0ZW1lbnQoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudGVybSA9PT0gbnVsbCAmJiB0aGlzLmlzV2hpbGVUcmFuc2Zvcm0obG9va2FoZWFkXzYyKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5mb3Jlc3RXaGlsZVN0YXRlbWVudCgpO1xuICAgIH1cbiAgICBpZiAodGhpcy50ZXJtID09PSBudWxsICYmIHRoaXMuaXNJZlRyYW5zZm9ybShsb29rYWhlYWRfNjIpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmZvcmVzdElmU3RhdGVtZW50KCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnRlcm0gPT09IG51bGwgJiYgdGhpcy5pc0ZvclRyYW5zZm9ybShsb29rYWhlYWRfNjIpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmZvcmVzdEZvclN0YXRlbWVudCgpO1xuICAgIH1cbiAgICBpZiAodGhpcy50ZXJtID09PSBudWxsICYmIHRoaXMuaXNTd2l0Y2hUcmFuc2Zvcm0obG9va2FoZWFkXzYyKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5mb3Jlc3RTd2l0Y2hTdGF0ZW1lbnQoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudGVybSA9PT0gbnVsbCAmJiB0aGlzLmlzQnJlYWtUcmFuc2Zvcm0obG9va2FoZWFkXzYyKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5mb3Jlc3RCcmVha1N0YXRlbWVudCgpO1xuICAgIH1cbiAgICBpZiAodGhpcy50ZXJtID09PSBudWxsICYmIHRoaXMuaXNDb250aW51ZVRyYW5zZm9ybShsb29rYWhlYWRfNjIpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmZvcmVzdENvbnRpbnVlU3RhdGVtZW50KCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnRlcm0gPT09IG51bGwgJiYgdGhpcy5pc0RvVHJhbnNmb3JtKGxvb2thaGVhZF82MikpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZm9yZXN0RG9TdGF0ZW1lbnQoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudGVybSA9PT0gbnVsbCAmJiB0aGlzLmlzRGVidWdnZXJUcmFuc2Zvcm0obG9va2FoZWFkXzYyKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5mb3Jlc3REZWJ1Z2dlclN0YXRlbWVudCgpO1xuICAgIH1cbiAgICBpZiAodGhpcy50ZXJtID09PSBudWxsICYmIHRoaXMuaXNXaXRoVHJhbnNmb3JtKGxvb2thaGVhZF82MikpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZm9yZXN0V2l0aFN0YXRlbWVudCgpO1xuICAgIH1cbiAgICBpZiAodGhpcy50ZXJtID09PSBudWxsICYmIHRoaXMuaXNUcnlUcmFuc2Zvcm0obG9va2FoZWFkXzYyKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5mb3Jlc3RUcnlTdGF0ZW1lbnQoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudGVybSA9PT0gbnVsbCAmJiB0aGlzLmlzVGhyb3dUcmFuc2Zvcm0obG9va2FoZWFkXzYyKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5mb3Jlc3RUaHJvd1N0YXRlbWVudCgpO1xuICAgIH1cbiAgICBpZiAodGhpcy50ZXJtID09PSBudWxsICYmIHRoaXMuaXNLZXl3b3JkKGxvb2thaGVhZF82MiwgXCJjbGFzc1wiKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5mb3Jlc3RDbGFzcyh7aXNFeHByOiBmYWxzZX0pO1xuICAgIH1cbiAgICBpZiAodGhpcy50ZXJtID09PSBudWxsICYmIHRoaXMuaXNGbkRlY2xUcmFuc2Zvcm0obG9va2FoZWFkXzYyKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5mb3Jlc3RGdW5jdGlvbkRlY2xhcmF0aW9uKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnRlcm0gPT09IG51bGwgJiYgdGhpcy5pc0lkZW50aWZpZXIobG9va2FoZWFkXzYyKSAmJiB0aGlzLmlzUHVuY3R1YXRvcih0aGlzLnBlZWsoMSksIFwiOlwiKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5mb3Jlc3RMYWJlbGVkU3RhdGVtZW50KCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnRlcm0gPT09IG51bGwgJiYgKHRoaXMuaXNWYXJEZWNsVHJhbnNmb3JtKGxvb2thaGVhZF82MikgfHwgdGhpcy5pc0xldERlY2xUcmFuc2Zvcm0obG9va2FoZWFkXzYyKSB8fCB0aGlzLmlzQ29uc3REZWNsVHJhbnNmb3JtKGxvb2thaGVhZF82MikgfHwgdGhpcy5pc1N5bnRheHJlY0RlY2xUcmFuc2Zvcm0obG9va2FoZWFkXzYyKSB8fCB0aGlzLmlzU3ludGF4RGVjbFRyYW5zZm9ybShsb29rYWhlYWRfNjIpKSkge1xuICAgICAgbGV0IHN0bXQgPSBuZXcgVGVybShcIlZhcmlhYmxlRGVjbGFyYXRpb25TdGF0ZW1lbnRcIiwge2RlY2xhcmF0aW9uOiB0aGlzLmVuZm9yZXN0VmFyaWFibGVEZWNsYXJhdGlvbigpfSk7XG4gICAgICB0aGlzLmNvbnN1bWVTZW1pY29sb24oKTtcbiAgICAgIHJldHVybiBzdG10O1xuICAgIH1cbiAgICBpZiAodGhpcy50ZXJtID09PSBudWxsICYmIHRoaXMuaXNSZXR1cm5TdG10VHJhbnNmb3JtKGxvb2thaGVhZF82MikpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZm9yZXN0UmV0dXJuU3RhdGVtZW50KCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnRlcm0gPT09IG51bGwgJiYgdGhpcy5pc1B1bmN0dWF0b3IobG9va2FoZWFkXzYyLCBcIjtcIikpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgcmV0dXJuIG5ldyBUZXJtKFwiRW1wdHlTdGF0ZW1lbnRcIiwge30pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5lbmZvcmVzdEV4cHJlc3Npb25TdGF0ZW1lbnQoKTtcbiAgfVxuICBlbmZvcmVzdExhYmVsZWRTdGF0ZW1lbnQoKSB7XG4gICAgbGV0IGxhYmVsXzYzID0gdGhpcy5tYXRjaElkZW50aWZpZXIoKTtcbiAgICBsZXQgcHVuY182NCA9IHRoaXMubWF0Y2hQdW5jdHVhdG9yKFwiOlwiKTtcbiAgICBsZXQgc3RtdF82NSA9IHRoaXMuZW5mb3Jlc3RTdGF0ZW1lbnQoKTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJMYWJlbGVkU3RhdGVtZW50XCIsIHtsYWJlbDogbGFiZWxfNjMsIGJvZHk6IHN0bXRfNjV9KTtcbiAgfVxuICBlbmZvcmVzdEJyZWFrU3RhdGVtZW50KCkge1xuICAgIHRoaXMubWF0Y2hLZXl3b3JkKFwiYnJlYWtcIik7XG4gICAgbGV0IGxvb2thaGVhZF82NiA9IHRoaXMucGVlaygpO1xuICAgIGxldCBsYWJlbF82NyA9IG51bGw7XG4gICAgaWYgKHRoaXMucmVzdC5zaXplID09PSAwIHx8IHRoaXMuaXNQdW5jdHVhdG9yKGxvb2thaGVhZF82NiwgXCI7XCIpKSB7XG4gICAgICB0aGlzLmNvbnN1bWVTZW1pY29sb24oKTtcbiAgICAgIHJldHVybiBuZXcgVGVybShcIkJyZWFrU3RhdGVtZW50XCIsIHtsYWJlbDogbGFiZWxfNjd9KTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNJZGVudGlmaWVyKGxvb2thaGVhZF82NikgfHwgdGhpcy5pc0tleXdvcmQobG9va2FoZWFkXzY2LCBcInlpZWxkXCIpIHx8IHRoaXMuaXNLZXl3b3JkKGxvb2thaGVhZF82NiwgXCJsZXRcIikpIHtcbiAgICAgIGxhYmVsXzY3ID0gdGhpcy5lbmZvcmVzdElkZW50aWZpZXIoKTtcbiAgICB9XG4gICAgdGhpcy5jb25zdW1lU2VtaWNvbG9uKCk7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQnJlYWtTdGF0ZW1lbnRcIiwge2xhYmVsOiBsYWJlbF82N30pO1xuICB9XG4gIGVuZm9yZXN0VHJ5U3RhdGVtZW50KCkge1xuICAgIHRoaXMubWF0Y2hLZXl3b3JkKFwidHJ5XCIpO1xuICAgIGxldCBib2R5XzY4ID0gdGhpcy5lbmZvcmVzdEJsb2NrKCk7XG4gICAgaWYgKHRoaXMuaXNLZXl3b3JkKHRoaXMucGVlaygpLCBcImNhdGNoXCIpKSB7XG4gICAgICBsZXQgY2F0Y2hDbGF1c2UgPSB0aGlzLmVuZm9yZXN0Q2F0Y2hDbGF1c2UoKTtcbiAgICAgIGlmICh0aGlzLmlzS2V5d29yZCh0aGlzLnBlZWsoKSwgXCJmaW5hbGx5XCIpKSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICBsZXQgZmluYWxpemVyID0gdGhpcy5lbmZvcmVzdEJsb2NrKCk7XG4gICAgICAgIHJldHVybiBuZXcgVGVybShcIlRyeUZpbmFsbHlTdGF0ZW1lbnRcIiwge2JvZHk6IGJvZHlfNjgsIGNhdGNoQ2xhdXNlOiBjYXRjaENsYXVzZSwgZmluYWxpemVyOiBmaW5hbGl6ZXJ9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgVGVybShcIlRyeUNhdGNoU3RhdGVtZW50XCIsIHtib2R5OiBib2R5XzY4LCBjYXRjaENsYXVzZTogY2F0Y2hDbGF1c2V9KTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNLZXl3b3JkKHRoaXMucGVlaygpLCBcImZpbmFsbHlcIikpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgbGV0IGZpbmFsaXplciA9IHRoaXMuZW5mb3Jlc3RCbG9jaygpO1xuICAgICAgcmV0dXJuIG5ldyBUZXJtKFwiVHJ5RmluYWxseVN0YXRlbWVudFwiLCB7Ym9keTogYm9keV82OCwgY2F0Y2hDbGF1c2U6IG51bGwsIGZpbmFsaXplcjogZmluYWxpemVyfSk7XG4gICAgfVxuICAgIHRocm93IHRoaXMuY3JlYXRlRXJyb3IodGhpcy5wZWVrKCksIFwidHJ5IHdpdGggbm8gY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgfVxuICBlbmZvcmVzdENhdGNoQ2xhdXNlKCkge1xuICAgIHRoaXMubWF0Y2hLZXl3b3JkKFwiY2F0Y2hcIik7XG4gICAgbGV0IGJpbmRpbmdQYXJlbnNfNjkgPSB0aGlzLm1hdGNoUGFyZW5zKCk7XG4gICAgbGV0IGVuZl83MCA9IG5ldyBFbmZvcmVzdGVyKGJpbmRpbmdQYXJlbnNfNjksIExpc3QoKSwgdGhpcy5jb250ZXh0KTtcbiAgICBsZXQgYmluZGluZ183MSA9IGVuZl83MC5lbmZvcmVzdEJpbmRpbmdUYXJnZXQoKTtcbiAgICBsZXQgYm9keV83MiA9IHRoaXMuZW5mb3Jlc3RCbG9jaygpO1xuICAgIHJldHVybiBuZXcgVGVybShcIkNhdGNoQ2xhdXNlXCIsIHtiaW5kaW5nOiBiaW5kaW5nXzcxLCBib2R5OiBib2R5XzcyfSk7XG4gIH1cbiAgZW5mb3Jlc3RUaHJvd1N0YXRlbWVudCgpIHtcbiAgICB0aGlzLm1hdGNoS2V5d29yZChcInRocm93XCIpO1xuICAgIGxldCBleHByZXNzaW9uXzczID0gdGhpcy5lbmZvcmVzdEV4cHJlc3Npb24oKTtcbiAgICB0aGlzLmNvbnN1bWVTZW1pY29sb24oKTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJUaHJvd1N0YXRlbWVudFwiLCB7ZXhwcmVzc2lvbjogZXhwcmVzc2lvbl83M30pO1xuICB9XG4gIGVuZm9yZXN0V2l0aFN0YXRlbWVudCgpIHtcbiAgICB0aGlzLm1hdGNoS2V5d29yZChcIndpdGhcIik7XG4gICAgbGV0IG9ialBhcmVuc183NCA9IHRoaXMubWF0Y2hQYXJlbnMoKTtcbiAgICBsZXQgZW5mXzc1ID0gbmV3IEVuZm9yZXN0ZXIob2JqUGFyZW5zXzc0LCBMaXN0KCksIHRoaXMuY29udGV4dCk7XG4gICAgbGV0IG9iamVjdF83NiA9IGVuZl83NS5lbmZvcmVzdEV4cHJlc3Npb24oKTtcbiAgICBsZXQgYm9keV83NyA9IHRoaXMuZW5mb3Jlc3RTdGF0ZW1lbnQoKTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJXaXRoU3RhdGVtZW50XCIsIHtvYmplY3Q6IG9iamVjdF83NiwgYm9keTogYm9keV83N30pO1xuICB9XG4gIGVuZm9yZXN0RGVidWdnZXJTdGF0ZW1lbnQoKSB7XG4gICAgdGhpcy5tYXRjaEtleXdvcmQoXCJkZWJ1Z2dlclwiKTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJEZWJ1Z2dlclN0YXRlbWVudFwiLCB7fSk7XG4gIH1cbiAgZW5mb3Jlc3REb1N0YXRlbWVudCgpIHtcbiAgICB0aGlzLm1hdGNoS2V5d29yZChcImRvXCIpO1xuICAgIGxldCBib2R5Xzc4ID0gdGhpcy5lbmZvcmVzdFN0YXRlbWVudCgpO1xuICAgIHRoaXMubWF0Y2hLZXl3b3JkKFwid2hpbGVcIik7XG4gICAgbGV0IHRlc3RCb2R5Xzc5ID0gdGhpcy5tYXRjaFBhcmVucygpO1xuICAgIGxldCBlbmZfODAgPSBuZXcgRW5mb3Jlc3Rlcih0ZXN0Qm9keV83OSwgTGlzdCgpLCB0aGlzLmNvbnRleHQpO1xuICAgIGxldCB0ZXN0XzgxID0gZW5mXzgwLmVuZm9yZXN0RXhwcmVzc2lvbigpO1xuICAgIHRoaXMuY29uc3VtZVNlbWljb2xvbigpO1xuICAgIHJldHVybiBuZXcgVGVybShcIkRvV2hpbGVTdGF0ZW1lbnRcIiwge2JvZHk6IGJvZHlfNzgsIHRlc3Q6IHRlc3RfODF9KTtcbiAgfVxuICBlbmZvcmVzdENvbnRpbnVlU3RhdGVtZW50KCkge1xuICAgIGxldCBrd2RfODIgPSB0aGlzLm1hdGNoS2V5d29yZChcImNvbnRpbnVlXCIpO1xuICAgIGxldCBsb29rYWhlYWRfODMgPSB0aGlzLnBlZWsoKTtcbiAgICBsZXQgbGFiZWxfODQgPSBudWxsO1xuICAgIGlmICh0aGlzLnJlc3Quc2l6ZSA9PT0gMCB8fCB0aGlzLmlzUHVuY3R1YXRvcihsb29rYWhlYWRfODMsIFwiO1wiKSkge1xuICAgICAgdGhpcy5jb25zdW1lU2VtaWNvbG9uKCk7XG4gICAgICByZXR1cm4gbmV3IFRlcm0oXCJDb250aW51ZVN0YXRlbWVudFwiLCB7bGFiZWw6IGxhYmVsXzg0fSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmxpbmVOdW1iZXJFcShrd2RfODIsIGxvb2thaGVhZF84MykgJiYgKHRoaXMuaXNJZGVudGlmaWVyKGxvb2thaGVhZF84MykgfHwgdGhpcy5pc0tleXdvcmQobG9va2FoZWFkXzgzLCBcInlpZWxkXCIpIHx8IHRoaXMuaXNLZXl3b3JkKGxvb2thaGVhZF84MywgXCJsZXRcIikpKSB7XG4gICAgICBsYWJlbF84NCA9IHRoaXMuZW5mb3Jlc3RJZGVudGlmaWVyKCk7XG4gICAgfVxuICAgIHRoaXMuY29uc3VtZVNlbWljb2xvbigpO1xuICAgIHJldHVybiBuZXcgVGVybShcIkNvbnRpbnVlU3RhdGVtZW50XCIsIHtsYWJlbDogbGFiZWxfODR9KTtcbiAgfVxuICBlbmZvcmVzdFN3aXRjaFN0YXRlbWVudCgpIHtcbiAgICB0aGlzLm1hdGNoS2V5d29yZChcInN3aXRjaFwiKTtcbiAgICBsZXQgY29uZF84NSA9IHRoaXMubWF0Y2hQYXJlbnMoKTtcbiAgICBsZXQgZW5mXzg2ID0gbmV3IEVuZm9yZXN0ZXIoY29uZF84NSwgTGlzdCgpLCB0aGlzLmNvbnRleHQpO1xuICAgIGxldCBkaXNjcmltaW5hbnRfODcgPSBlbmZfODYuZW5mb3Jlc3RFeHByZXNzaW9uKCk7XG4gICAgbGV0IGJvZHlfODggPSB0aGlzLm1hdGNoQ3VybGllcygpO1xuICAgIGlmIChib2R5Xzg4LnNpemUgPT09IDApIHtcbiAgICAgIHJldHVybiBuZXcgVGVybShcIlN3aXRjaFN0YXRlbWVudFwiLCB7ZGlzY3JpbWluYW50OiBkaXNjcmltaW5hbnRfODcsIGNhc2VzOiBMaXN0KCl9KTtcbiAgICB9XG4gICAgZW5mXzg2ID0gbmV3IEVuZm9yZXN0ZXIoYm9keV84OCwgTGlzdCgpLCB0aGlzLmNvbnRleHQpO1xuICAgIGxldCBjYXNlc184OSA9IGVuZl84Ni5lbmZvcmVzdFN3aXRjaENhc2VzKCk7XG4gICAgbGV0IGxvb2thaGVhZF85MCA9IGVuZl84Ni5wZWVrKCk7XG4gICAgaWYgKGVuZl84Ni5pc0tleXdvcmQobG9va2FoZWFkXzkwLCBcImRlZmF1bHRcIikpIHtcbiAgICAgIGxldCBkZWZhdWx0Q2FzZSA9IGVuZl84Ni5lbmZvcmVzdFN3aXRjaERlZmF1bHQoKTtcbiAgICAgIGxldCBwb3N0RGVmYXVsdENhc2VzID0gZW5mXzg2LmVuZm9yZXN0U3dpdGNoQ2FzZXMoKTtcbiAgICAgIHJldHVybiBuZXcgVGVybShcIlN3aXRjaFN0YXRlbWVudFdpdGhEZWZhdWx0XCIsIHtkaXNjcmltaW5hbnQ6IGRpc2NyaW1pbmFudF84NywgcHJlRGVmYXVsdENhc2VzOiBjYXNlc184OSwgZGVmYXVsdENhc2U6IGRlZmF1bHRDYXNlLCBwb3N0RGVmYXVsdENhc2VzOiBwb3N0RGVmYXVsdENhc2VzfSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgVGVybShcIlN3aXRjaFN0YXRlbWVudFwiLCB7ZGlzY3JpbWluYW50OiBkaXNjcmltaW5hbnRfODcsIGNhc2VzOiBjYXNlc184OX0pO1xuICB9XG4gIGVuZm9yZXN0U3dpdGNoQ2FzZXMoKSB7XG4gICAgbGV0IGNhc2VzXzkxID0gW107XG4gICAgd2hpbGUgKCEodGhpcy5yZXN0LnNpemUgPT09IDAgfHwgdGhpcy5pc0tleXdvcmQodGhpcy5wZWVrKCksIFwiZGVmYXVsdFwiKSkpIHtcbiAgICAgIGNhc2VzXzkxLnB1c2godGhpcy5lbmZvcmVzdFN3aXRjaENhc2UoKSk7XG4gICAgfVxuICAgIHJldHVybiBMaXN0KGNhc2VzXzkxKTtcbiAgfVxuICBlbmZvcmVzdFN3aXRjaENhc2UoKSB7XG4gICAgdGhpcy5tYXRjaEtleXdvcmQoXCJjYXNlXCIpO1xuICAgIHJldHVybiBuZXcgVGVybShcIlN3aXRjaENhc2VcIiwge3Rlc3Q6IHRoaXMuZW5mb3Jlc3RFeHByZXNzaW9uKCksIGNvbnNlcXVlbnQ6IHRoaXMuZW5mb3Jlc3RTd2l0Y2hDYXNlQm9keSgpfSk7XG4gIH1cbiAgZW5mb3Jlc3RTd2l0Y2hDYXNlQm9keSgpIHtcbiAgICB0aGlzLm1hdGNoUHVuY3R1YXRvcihcIjpcIik7XG4gICAgcmV0dXJuIHRoaXMuZW5mb3Jlc3RTdGF0ZW1lbnRMaXN0SW5Td2l0Y2hDYXNlQm9keSgpO1xuICB9XG4gIGVuZm9yZXN0U3RhdGVtZW50TGlzdEluU3dpdGNoQ2FzZUJvZHkoKSB7XG4gICAgbGV0IHJlc3VsdF85MiA9IFtdO1xuICAgIHdoaWxlICghKHRoaXMucmVzdC5zaXplID09PSAwIHx8IHRoaXMuaXNLZXl3b3JkKHRoaXMucGVlaygpLCBcImRlZmF1bHRcIikgfHwgdGhpcy5pc0tleXdvcmQodGhpcy5wZWVrKCksIFwiY2FzZVwiKSkpIHtcbiAgICAgIHJlc3VsdF85Mi5wdXNoKHRoaXMuZW5mb3Jlc3RTdGF0ZW1lbnRMaXN0SXRlbSgpKTtcbiAgICB9XG4gICAgcmV0dXJuIExpc3QocmVzdWx0XzkyKTtcbiAgfVxuICBlbmZvcmVzdFN3aXRjaERlZmF1bHQoKSB7XG4gICAgdGhpcy5tYXRjaEtleXdvcmQoXCJkZWZhdWx0XCIpO1xuICAgIHJldHVybiBuZXcgVGVybShcIlN3aXRjaERlZmF1bHRcIiwge2NvbnNlcXVlbnQ6IHRoaXMuZW5mb3Jlc3RTd2l0Y2hDYXNlQm9keSgpfSk7XG4gIH1cbiAgZW5mb3Jlc3RGb3JTdGF0ZW1lbnQoKSB7XG4gICAgdGhpcy5tYXRjaEtleXdvcmQoXCJmb3JcIik7XG4gICAgbGV0IGNvbmRfOTMgPSB0aGlzLm1hdGNoUGFyZW5zKCk7XG4gICAgbGV0IGVuZl85NCA9IG5ldyBFbmZvcmVzdGVyKGNvbmRfOTMsIExpc3QoKSwgdGhpcy5jb250ZXh0KTtcbiAgICBsZXQgbG9va2FoZWFkXzk1LCB0ZXN0Xzk2LCBpbml0Xzk3LCByaWdodF85OCwgdHlwZV85OSwgbGVmdF8xMDAsIHVwZGF0ZV8xMDE7XG4gICAgaWYgKGVuZl85NC5pc1B1bmN0dWF0b3IoZW5mXzk0LnBlZWsoKSwgXCI7XCIpKSB7XG4gICAgICBlbmZfOTQuYWR2YW5jZSgpO1xuICAgICAgaWYgKCFlbmZfOTQuaXNQdW5jdHVhdG9yKGVuZl85NC5wZWVrKCksIFwiO1wiKSkge1xuICAgICAgICB0ZXN0Xzk2ID0gZW5mXzk0LmVuZm9yZXN0RXhwcmVzc2lvbigpO1xuICAgICAgfVxuICAgICAgZW5mXzk0Lm1hdGNoUHVuY3R1YXRvcihcIjtcIik7XG4gICAgICBpZiAoZW5mXzk0LnJlc3Quc2l6ZSAhPT0gMCkge1xuICAgICAgICByaWdodF85OCA9IGVuZl85NC5lbmZvcmVzdEV4cHJlc3Npb24oKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgVGVybShcIkZvclN0YXRlbWVudFwiLCB7aW5pdDogbnVsbCwgdGVzdDogdGVzdF85NiwgdXBkYXRlOiByaWdodF85OCwgYm9keTogdGhpcy5lbmZvcmVzdFN0YXRlbWVudCgpfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvb2thaGVhZF85NSA9IGVuZl85NC5wZWVrKCk7XG4gICAgICBpZiAoZW5mXzk0LmlzVmFyRGVjbFRyYW5zZm9ybShsb29rYWhlYWRfOTUpIHx8IGVuZl85NC5pc0xldERlY2xUcmFuc2Zvcm0obG9va2FoZWFkXzk1KSB8fCBlbmZfOTQuaXNDb25zdERlY2xUcmFuc2Zvcm0obG9va2FoZWFkXzk1KSkge1xuICAgICAgICBpbml0Xzk3ID0gZW5mXzk0LmVuZm9yZXN0VmFyaWFibGVEZWNsYXJhdGlvbigpO1xuICAgICAgICBsb29rYWhlYWRfOTUgPSBlbmZfOTQucGVlaygpO1xuICAgICAgICBpZiAodGhpcy5pc0tleXdvcmQobG9va2FoZWFkXzk1LCBcImluXCIpIHx8IHRoaXMuaXNJZGVudGlmaWVyKGxvb2thaGVhZF85NSwgXCJvZlwiKSkge1xuICAgICAgICAgIGlmICh0aGlzLmlzS2V5d29yZChsb29rYWhlYWRfOTUsIFwiaW5cIikpIHtcbiAgICAgICAgICAgIGVuZl85NC5hZHZhbmNlKCk7XG4gICAgICAgICAgICByaWdodF85OCA9IGVuZl85NC5lbmZvcmVzdEV4cHJlc3Npb24oKTtcbiAgICAgICAgICAgIHR5cGVfOTkgPSBcIkZvckluU3RhdGVtZW50XCI7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzSWRlbnRpZmllcihsb29rYWhlYWRfOTUsIFwib2ZcIikpIHtcbiAgICAgICAgICAgIGVuZl85NC5hZHZhbmNlKCk7XG4gICAgICAgICAgICByaWdodF85OCA9IGVuZl85NC5lbmZvcmVzdEV4cHJlc3Npb24oKTtcbiAgICAgICAgICAgIHR5cGVfOTkgPSBcIkZvck9mU3RhdGVtZW50XCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBuZXcgVGVybSh0eXBlXzk5LCB7bGVmdDogaW5pdF85NywgcmlnaHQ6IHJpZ2h0Xzk4LCBib2R5OiB0aGlzLmVuZm9yZXN0U3RhdGVtZW50KCl9KTtcbiAgICAgICAgfVxuICAgICAgICBlbmZfOTQubWF0Y2hQdW5jdHVhdG9yKFwiO1wiKTtcbiAgICAgICAgaWYgKGVuZl85NC5pc1B1bmN0dWF0b3IoZW5mXzk0LnBlZWsoKSwgXCI7XCIpKSB7XG4gICAgICAgICAgZW5mXzk0LmFkdmFuY2UoKTtcbiAgICAgICAgICB0ZXN0Xzk2ID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0ZXN0Xzk2ID0gZW5mXzk0LmVuZm9yZXN0RXhwcmVzc2lvbigpO1xuICAgICAgICAgIGVuZl85NC5tYXRjaFB1bmN0dWF0b3IoXCI7XCIpO1xuICAgICAgICB9XG4gICAgICAgIHVwZGF0ZV8xMDEgPSBlbmZfOTQuZW5mb3Jlc3RFeHByZXNzaW9uKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5pc0tleXdvcmQoZW5mXzk0LnBlZWsoMSksIFwiaW5cIikgfHwgdGhpcy5pc0lkZW50aWZpZXIoZW5mXzk0LnBlZWsoMSksIFwib2ZcIikpIHtcbiAgICAgICAgICBsZWZ0XzEwMCA9IGVuZl85NC5lbmZvcmVzdEJpbmRpbmdJZGVudGlmaWVyKCk7XG4gICAgICAgICAgbGV0IGtpbmQgPSBlbmZfOTQuYWR2YW5jZSgpO1xuICAgICAgICAgIGlmICh0aGlzLmlzS2V5d29yZChraW5kLCBcImluXCIpKSB7XG4gICAgICAgICAgICB0eXBlXzk5ID0gXCJGb3JJblN0YXRlbWVudFwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0eXBlXzk5ID0gXCJGb3JPZlN0YXRlbWVudFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICByaWdodF85OCA9IGVuZl85NC5lbmZvcmVzdEV4cHJlc3Npb24oKTtcbiAgICAgICAgICByZXR1cm4gbmV3IFRlcm0odHlwZV85OSwge2xlZnQ6IGxlZnRfMTAwLCByaWdodDogcmlnaHRfOTgsIGJvZHk6IHRoaXMuZW5mb3Jlc3RTdGF0ZW1lbnQoKX0pO1xuICAgICAgICB9XG4gICAgICAgIGluaXRfOTcgPSBlbmZfOTQuZW5mb3Jlc3RFeHByZXNzaW9uKCk7XG4gICAgICAgIGVuZl85NC5tYXRjaFB1bmN0dWF0b3IoXCI7XCIpO1xuICAgICAgICBpZiAoZW5mXzk0LmlzUHVuY3R1YXRvcihlbmZfOTQucGVlaygpLCBcIjtcIikpIHtcbiAgICAgICAgICBlbmZfOTQuYWR2YW5jZSgpO1xuICAgICAgICAgIHRlc3RfOTYgPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRlc3RfOTYgPSBlbmZfOTQuZW5mb3Jlc3RFeHByZXNzaW9uKCk7XG4gICAgICAgICAgZW5mXzk0Lm1hdGNoUHVuY3R1YXRvcihcIjtcIik7XG4gICAgICAgIH1cbiAgICAgICAgdXBkYXRlXzEwMSA9IGVuZl85NC5lbmZvcmVzdEV4cHJlc3Npb24oKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgVGVybShcIkZvclN0YXRlbWVudFwiLCB7aW5pdDogaW5pdF85NywgdGVzdDogdGVzdF85NiwgdXBkYXRlOiB1cGRhdGVfMTAxLCBib2R5OiB0aGlzLmVuZm9yZXN0U3RhdGVtZW50KCl9KTtcbiAgICB9XG4gIH1cbiAgZW5mb3Jlc3RJZlN0YXRlbWVudCgpIHtcbiAgICB0aGlzLm1hdGNoS2V5d29yZChcImlmXCIpO1xuICAgIGxldCBjb25kXzEwMiA9IHRoaXMubWF0Y2hQYXJlbnMoKTtcbiAgICBsZXQgZW5mXzEwMyA9IG5ldyBFbmZvcmVzdGVyKGNvbmRfMTAyLCBMaXN0KCksIHRoaXMuY29udGV4dCk7XG4gICAgbGV0IGxvb2thaGVhZF8xMDQgPSBlbmZfMTAzLnBlZWsoKTtcbiAgICBsZXQgdGVzdF8xMDUgPSBlbmZfMTAzLmVuZm9yZXN0RXhwcmVzc2lvbigpO1xuICAgIGlmICh0ZXN0XzEwNSA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgZW5mXzEwMy5jcmVhdGVFcnJvcihsb29rYWhlYWRfMTA0LCBcImV4cGVjdGluZyBhbiBleHByZXNzaW9uXCIpO1xuICAgIH1cbiAgICBsZXQgY29uc2VxdWVudF8xMDYgPSB0aGlzLmVuZm9yZXN0U3RhdGVtZW50KCk7XG4gICAgbGV0IGFsdGVybmF0ZV8xMDcgPSBudWxsO1xuICAgIGlmICh0aGlzLmlzS2V5d29yZCh0aGlzLnBlZWsoKSwgXCJlbHNlXCIpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIGFsdGVybmF0ZV8xMDcgPSB0aGlzLmVuZm9yZXN0U3RhdGVtZW50KCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgVGVybShcIklmU3RhdGVtZW50XCIsIHt0ZXN0OiB0ZXN0XzEwNSwgY29uc2VxdWVudDogY29uc2VxdWVudF8xMDYsIGFsdGVybmF0ZTogYWx0ZXJuYXRlXzEwN30pO1xuICB9XG4gIGVuZm9yZXN0V2hpbGVTdGF0ZW1lbnQoKSB7XG4gICAgdGhpcy5tYXRjaEtleXdvcmQoXCJ3aGlsZVwiKTtcbiAgICBsZXQgY29uZF8xMDggPSB0aGlzLm1hdGNoUGFyZW5zKCk7XG4gICAgbGV0IGVuZl8xMDkgPSBuZXcgRW5mb3Jlc3Rlcihjb25kXzEwOCwgTGlzdCgpLCB0aGlzLmNvbnRleHQpO1xuICAgIGxldCBsb29rYWhlYWRfMTEwID0gZW5mXzEwOS5wZWVrKCk7XG4gICAgbGV0IHRlc3RfMTExID0gZW5mXzEwOS5lbmZvcmVzdEV4cHJlc3Npb24oKTtcbiAgICBpZiAodGVzdF8xMTEgPT09IG51bGwpIHtcbiAgICAgIHRocm93IGVuZl8xMDkuY3JlYXRlRXJyb3IobG9va2FoZWFkXzExMCwgXCJleHBlY3RpbmcgYW4gZXhwcmVzc2lvblwiKTtcbiAgICB9XG4gICAgbGV0IGJvZHlfMTEyID0gdGhpcy5lbmZvcmVzdFN0YXRlbWVudCgpO1xuICAgIHJldHVybiBuZXcgVGVybShcIldoaWxlU3RhdGVtZW50XCIsIHt0ZXN0OiB0ZXN0XzExMSwgYm9keTogYm9keV8xMTJ9KTtcbiAgfVxuICBlbmZvcmVzdEJsb2NrU3RhdGVtZW50KCkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkJsb2NrU3RhdGVtZW50XCIsIHtibG9jazogdGhpcy5lbmZvcmVzdEJsb2NrKCl9KTtcbiAgfVxuICBlbmZvcmVzdEJsb2NrKCkge1xuICAgIGxldCBiXzExMyA9IHRoaXMubWF0Y2hDdXJsaWVzKCk7XG4gICAgbGV0IGJvZHlfMTE0ID0gW107XG4gICAgbGV0IGVuZl8xMTUgPSBuZXcgRW5mb3Jlc3RlcihiXzExMywgTGlzdCgpLCB0aGlzLmNvbnRleHQpO1xuICAgIHdoaWxlIChlbmZfMTE1LnJlc3Quc2l6ZSAhPT0gMCkge1xuICAgICAgbGV0IGxvb2thaGVhZCA9IGVuZl8xMTUucGVlaygpO1xuICAgICAgbGV0IHN0bXQgPSBlbmZfMTE1LmVuZm9yZXN0U3RhdGVtZW50KCk7XG4gICAgICBpZiAoc3RtdCA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IGVuZl8xMTUuY3JlYXRlRXJyb3IobG9va2FoZWFkLCBcIm5vdCBhIHN0YXRlbWVudFwiKTtcbiAgICAgIH1cbiAgICAgIGJvZHlfMTE0LnB1c2goc3RtdCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgVGVybShcIkJsb2NrXCIsIHtzdGF0ZW1lbnRzOiBMaXN0KGJvZHlfMTE0KX0pO1xuICB9XG4gIGVuZm9yZXN0Q2xhc3Moe2lzRXhwciwgaW5EZWZhdWx0fSkge1xuICAgIGxldCBrd18xMTYgPSB0aGlzLmFkdmFuY2UoKTtcbiAgICBsZXQgbmFtZV8xMTcgPSBudWxsLCBzdXByXzExOCA9IG51bGw7XG4gICAgbGV0IHR5cGVfMTE5ID0gaXNFeHByID8gXCJDbGFzc0V4cHJlc3Npb25cIiA6IFwiQ2xhc3NEZWNsYXJhdGlvblwiO1xuICAgIGlmICh0aGlzLmlzSWRlbnRpZmllcih0aGlzLnBlZWsoKSkpIHtcbiAgICAgIG5hbWVfMTE3ID0gdGhpcy5lbmZvcmVzdEJpbmRpbmdJZGVudGlmaWVyKCk7XG4gICAgfSBlbHNlIGlmICghaXNFeHByKSB7XG4gICAgICBpZiAoaW5EZWZhdWx0KSB7XG4gICAgICAgIG5hbWVfMTE3ID0gbmV3IFRlcm0oXCJCaW5kaW5nSWRlbnRpZmllclwiLCB7bmFtZTogU3ludGF4LmZyb21JZGVudGlmaWVyKFwiX2RlZmF1bHRcIiwga3dfMTE2KX0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgdGhpcy5jcmVhdGVFcnJvcih0aGlzLnBlZWsoKSwgXCJ1bmV4cGVjdGVkIHN5bnRheFwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuaXNLZXl3b3JkKHRoaXMucGVlaygpLCBcImV4dGVuZHNcIikpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgc3Vwcl8xMTggPSB0aGlzLmVuZm9yZXN0RXhwcmVzc2lvbkxvb3AoKTtcbiAgICB9XG4gICAgbGV0IGVsZW1lbnRzXzEyMCA9IFtdO1xuICAgIGxldCBlbmZfMTIxID0gbmV3IEVuZm9yZXN0ZXIodGhpcy5tYXRjaEN1cmxpZXMoKSwgTGlzdCgpLCB0aGlzLmNvbnRleHQpO1xuICAgIHdoaWxlIChlbmZfMTIxLnJlc3Quc2l6ZSAhPT0gMCkge1xuICAgICAgaWYgKGVuZl8xMjEuaXNQdW5jdHVhdG9yKGVuZl8xMjEucGVlaygpLCBcIjtcIikpIHtcbiAgICAgICAgZW5mXzEyMS5hZHZhbmNlKCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgbGV0IGlzU3RhdGljID0gZmFsc2U7XG4gICAgICBsZXQge21ldGhvZE9yS2V5LCBraW5kfSA9IGVuZl8xMjEuZW5mb3Jlc3RNZXRob2REZWZpbml0aW9uKCk7XG4gICAgICBpZiAoa2luZCA9PT0gXCJpZGVudGlmaWVyXCIgJiYgbWV0aG9kT3JLZXkudmFsdWUudmFsKCkgPT09IFwic3RhdGljXCIpIHtcbiAgICAgICAgaXNTdGF0aWMgPSB0cnVlO1xuICAgICAgICAoe21ldGhvZE9yS2V5LCBraW5kfSA9IGVuZl8xMjEuZW5mb3Jlc3RNZXRob2REZWZpbml0aW9uKCkpO1xuICAgICAgfVxuICAgICAgaWYgKGtpbmQgPT09IFwibWV0aG9kXCIpIHtcbiAgICAgICAgZWxlbWVudHNfMTIwLnB1c2gobmV3IFRlcm0oXCJDbGFzc0VsZW1lbnRcIiwge2lzU3RhdGljOiBpc1N0YXRpYywgbWV0aG9kOiBtZXRob2RPcktleX0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IHRoaXMuY3JlYXRlRXJyb3IoZW5mXzEyMS5wZWVrKCksIFwiT25seSBtZXRob2RzIGFyZSBhbGxvd2VkIGluIGNsYXNzZXNcIik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgVGVybSh0eXBlXzExOSwge25hbWU6IG5hbWVfMTE3LCBzdXBlcjogc3Vwcl8xMTgsIGVsZW1lbnRzOiBMaXN0KGVsZW1lbnRzXzEyMCl9KTtcbiAgfVxuICBlbmZvcmVzdEJpbmRpbmdUYXJnZXQoe2FsbG93UHVuY3R1YXRvcn0gPSB7fSkge1xuICAgIGxldCBsb29rYWhlYWRfMTIyID0gdGhpcy5wZWVrKCk7XG4gICAgaWYgKHRoaXMuaXNJZGVudGlmaWVyKGxvb2thaGVhZF8xMjIpIHx8IHRoaXMuaXNLZXl3b3JkKGxvb2thaGVhZF8xMjIpIHx8IGFsbG93UHVuY3R1YXRvciAmJiB0aGlzLmlzUHVuY3R1YXRvcihsb29rYWhlYWRfMTIyKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5mb3Jlc3RCaW5kaW5nSWRlbnRpZmllcih7YWxsb3dQdW5jdHVhdG9yOiBhbGxvd1B1bmN0dWF0b3J9KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNCcmFja2V0cyhsb29rYWhlYWRfMTIyKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5mb3Jlc3RBcnJheUJpbmRpbmcoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNCcmFjZXMobG9va2FoZWFkXzEyMikpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZm9yZXN0T2JqZWN0QmluZGluZygpO1xuICAgIH1cbiAgICBhc3NlcnQoZmFsc2UsIFwibm90IGltcGxlbWVudGVkIHlldFwiKTtcbiAgfVxuICBlbmZvcmVzdE9iamVjdEJpbmRpbmcoKSB7XG4gICAgbGV0IGVuZl8xMjMgPSBuZXcgRW5mb3Jlc3Rlcih0aGlzLm1hdGNoQ3VybGllcygpLCBMaXN0KCksIHRoaXMuY29udGV4dCk7XG4gICAgbGV0IHByb3BlcnRpZXNfMTI0ID0gW107XG4gICAgd2hpbGUgKGVuZl8xMjMucmVzdC5zaXplICE9PSAwKSB7XG4gICAgICBwcm9wZXJ0aWVzXzEyNC5wdXNoKGVuZl8xMjMuZW5mb3Jlc3RCaW5kaW5nUHJvcGVydHkoKSk7XG4gICAgICBlbmZfMTIzLmNvbnN1bWVDb21tYSgpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFRlcm0oXCJPYmplY3RCaW5kaW5nXCIsIHtwcm9wZXJ0aWVzOiBMaXN0KHByb3BlcnRpZXNfMTI0KX0pO1xuICB9XG4gIGVuZm9yZXN0QmluZGluZ1Byb3BlcnR5KCkge1xuICAgIGxldCBsb29rYWhlYWRfMTI1ID0gdGhpcy5wZWVrKCk7XG4gICAgbGV0IHtuYW1lLCBiaW5kaW5nfSA9IHRoaXMuZW5mb3Jlc3RQcm9wZXJ0eU5hbWUoKTtcbiAgICBpZiAodGhpcy5pc0lkZW50aWZpZXIobG9va2FoZWFkXzEyNSkgfHwgdGhpcy5pc0tleXdvcmQobG9va2FoZWFkXzEyNSwgXCJsZXRcIikgfHwgdGhpcy5pc0tleXdvcmQobG9va2FoZWFkXzEyNSwgXCJ5aWVsZFwiKSkge1xuICAgICAgaWYgKCF0aGlzLmlzUHVuY3R1YXRvcih0aGlzLnBlZWsoKSwgXCI6XCIpKSB7XG4gICAgICAgIGxldCBkZWZhdWx0VmFsdWUgPSBudWxsO1xuICAgICAgICBpZiAodGhpcy5pc0Fzc2lnbih0aGlzLnBlZWsoKSkpIHtcbiAgICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgICBsZXQgZXhwciA9IHRoaXMuZW5mb3Jlc3RFeHByZXNzaW9uTG9vcCgpO1xuICAgICAgICAgIGRlZmF1bHRWYWx1ZSA9IGV4cHI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBUZXJtKFwiQmluZGluZ1Byb3BlcnR5SWRlbnRpZmllclwiLCB7YmluZGluZzogYmluZGluZywgaW5pdDogZGVmYXVsdFZhbHVlfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubWF0Y2hQdW5jdHVhdG9yKFwiOlwiKTtcbiAgICBiaW5kaW5nID0gdGhpcy5lbmZvcmVzdEJpbmRpbmdFbGVtZW50KCk7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQmluZGluZ1Byb3BlcnR5UHJvcGVydHlcIiwge25hbWU6IG5hbWUsIGJpbmRpbmc6IGJpbmRpbmd9KTtcbiAgfVxuICBlbmZvcmVzdEFycmF5QmluZGluZygpIHtcbiAgICBsZXQgYnJhY2tldF8xMjYgPSB0aGlzLm1hdGNoU3F1YXJlcygpO1xuICAgIGxldCBlbmZfMTI3ID0gbmV3IEVuZm9yZXN0ZXIoYnJhY2tldF8xMjYsIExpc3QoKSwgdGhpcy5jb250ZXh0KTtcbiAgICBsZXQgZWxlbWVudHNfMTI4ID0gW10sIHJlc3RFbGVtZW50XzEyOSA9IG51bGw7XG4gICAgd2hpbGUgKGVuZl8xMjcucmVzdC5zaXplICE9PSAwKSB7XG4gICAgICBsZXQgZWw7XG4gICAgICBpZiAoZW5mXzEyNy5pc1B1bmN0dWF0b3IoZW5mXzEyNy5wZWVrKCksIFwiLFwiKSkge1xuICAgICAgICBlbmZfMTI3LmNvbnN1bWVDb21tYSgpO1xuICAgICAgICBlbCA9IG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZW5mXzEyNy5pc1B1bmN0dWF0b3IoZW5mXzEyNy5wZWVrKCksIFwiLi4uXCIpKSB7XG4gICAgICAgICAgZW5mXzEyNy5hZHZhbmNlKCk7XG4gICAgICAgICAgcmVzdEVsZW1lbnRfMTI5ID0gZW5mXzEyNy5lbmZvcmVzdEJpbmRpbmdUYXJnZXQoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbCA9IGVuZl8xMjcuZW5mb3Jlc3RCaW5kaW5nRWxlbWVudCgpO1xuICAgICAgICB9XG4gICAgICAgIGVuZl8xMjcuY29uc3VtZUNvbW1hKCk7XG4gICAgICB9XG4gICAgICBlbGVtZW50c18xMjgucHVzaChlbCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgVGVybShcIkFycmF5QmluZGluZ1wiLCB7ZWxlbWVudHM6IExpc3QoZWxlbWVudHNfMTI4KSwgcmVzdEVsZW1lbnQ6IHJlc3RFbGVtZW50XzEyOX0pO1xuICB9XG4gIGVuZm9yZXN0QmluZGluZ0VsZW1lbnQoKSB7XG4gICAgbGV0IGJpbmRpbmdfMTMwID0gdGhpcy5lbmZvcmVzdEJpbmRpbmdUYXJnZXQoKTtcbiAgICBpZiAodGhpcy5pc0Fzc2lnbih0aGlzLnBlZWsoKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgbGV0IGluaXQgPSB0aGlzLmVuZm9yZXN0RXhwcmVzc2lvbkxvb3AoKTtcbiAgICAgIGJpbmRpbmdfMTMwID0gbmV3IFRlcm0oXCJCaW5kaW5nV2l0aERlZmF1bHRcIiwge2JpbmRpbmc6IGJpbmRpbmdfMTMwLCBpbml0OiBpbml0fSk7XG4gICAgfVxuICAgIHJldHVybiBiaW5kaW5nXzEzMDtcbiAgfVxuICBlbmZvcmVzdEJpbmRpbmdJZGVudGlmaWVyKHthbGxvd1B1bmN0dWF0b3J9ID0ge30pIHtcbiAgICBsZXQgbmFtZV8xMzE7XG4gICAgaWYgKGFsbG93UHVuY3R1YXRvciAmJiB0aGlzLmlzUHVuY3R1YXRvcih0aGlzLnBlZWsoKSkpIHtcbiAgICAgIG5hbWVfMTMxID0gdGhpcy5lbmZvcmVzdFB1bmN0dWF0b3IoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZV8xMzEgPSB0aGlzLmVuZm9yZXN0SWRlbnRpZmllcigpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFRlcm0oXCJCaW5kaW5nSWRlbnRpZmllclwiLCB7bmFtZTogbmFtZV8xMzF9KTtcbiAgfVxuICBlbmZvcmVzdFB1bmN0dWF0b3IoKSB7XG4gICAgbGV0IGxvb2thaGVhZF8xMzIgPSB0aGlzLnBlZWsoKTtcbiAgICBpZiAodGhpcy5pc1B1bmN0dWF0b3IobG9va2FoZWFkXzEzMikpIHtcbiAgICAgIHJldHVybiB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG4gICAgdGhyb3cgdGhpcy5jcmVhdGVFcnJvcihsb29rYWhlYWRfMTMyLCBcImV4cGVjdGluZyBhIHB1bmN0dWF0b3JcIik7XG4gIH1cbiAgZW5mb3Jlc3RJZGVudGlmaWVyKCkge1xuICAgIGxldCBsb29rYWhlYWRfMTMzID0gdGhpcy5wZWVrKCk7XG4gICAgaWYgKHRoaXMuaXNJZGVudGlmaWVyKGxvb2thaGVhZF8xMzMpIHx8IHRoaXMuaXNLZXl3b3JkKGxvb2thaGVhZF8xMzMpKSB7XG4gICAgICByZXR1cm4gdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIHRocm93IHRoaXMuY3JlYXRlRXJyb3IobG9va2FoZWFkXzEzMywgXCJleHBlY3RpbmcgYW4gaWRlbnRpZmllclwiKTtcbiAgfVxuICBlbmZvcmVzdFJldHVyblN0YXRlbWVudCgpIHtcbiAgICBsZXQga3dfMTM0ID0gdGhpcy5hZHZhbmNlKCk7XG4gICAgbGV0IGxvb2thaGVhZF8xMzUgPSB0aGlzLnBlZWsoKTtcbiAgICBpZiAodGhpcy5yZXN0LnNpemUgPT09IDAgfHwgbG9va2FoZWFkXzEzNSAmJiAhdGhpcy5saW5lTnVtYmVyRXEoa3dfMTM0LCBsb29rYWhlYWRfMTM1KSkge1xuICAgICAgcmV0dXJuIG5ldyBUZXJtKFwiUmV0dXJuU3RhdGVtZW50XCIsIHtleHByZXNzaW9uOiBudWxsfSk7XG4gICAgfVxuICAgIGxldCB0ZXJtXzEzNiA9IG51bGw7XG4gICAgaWYgKCF0aGlzLmlzUHVuY3R1YXRvcihsb29rYWhlYWRfMTM1LCBcIjtcIikpIHtcbiAgICAgIHRlcm1fMTM2ID0gdGhpcy5lbmZvcmVzdEV4cHJlc3Npb24oKTtcbiAgICAgIGV4cGVjdCh0ZXJtXzEzNiAhPSBudWxsLCBcIkV4cGVjdGluZyBhbiBleHByZXNzaW9uIHRvIGZvbGxvdyByZXR1cm4ga2V5d29yZFwiLCBsb29rYWhlYWRfMTM1LCB0aGlzLnJlc3QpO1xuICAgIH1cbiAgICB0aGlzLmNvbnN1bWVTZW1pY29sb24oKTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJSZXR1cm5TdGF0ZW1lbnRcIiwge2V4cHJlc3Npb246IHRlcm1fMTM2fSk7XG4gIH1cbiAgZW5mb3Jlc3RWYXJpYWJsZURlY2xhcmF0aW9uKCkge1xuICAgIGxldCBraW5kXzEzNztcbiAgICBsZXQgbG9va2FoZWFkXzEzOCA9IHRoaXMuYWR2YW5jZSgpO1xuICAgIGxldCBraW5kU3luXzEzOSA9IGxvb2thaGVhZF8xMzg7XG4gICAgbGV0IHBoYXNlXzE0MCA9IHRoaXMuY29udGV4dC5waGFzZTtcbiAgICBpZiAoa2luZFN5bl8xMzkgJiYgdGhpcy5jb250ZXh0LmVudi5nZXQoa2luZFN5bl8xMzkucmVzb2x2ZShwaGFzZV8xNDApKSA9PT0gVmFyaWFibGVEZWNsVHJhbnNmb3JtKSB7XG4gICAgICBraW5kXzEzNyA9IFwidmFyXCI7XG4gICAgfSBlbHNlIGlmIChraW5kU3luXzEzOSAmJiB0aGlzLmNvbnRleHQuZW52LmdldChraW5kU3luXzEzOS5yZXNvbHZlKHBoYXNlXzE0MCkpID09PSBMZXREZWNsVHJhbnNmb3JtKSB7XG4gICAgICBraW5kXzEzNyA9IFwibGV0XCI7XG4gICAgfSBlbHNlIGlmIChraW5kU3luXzEzOSAmJiB0aGlzLmNvbnRleHQuZW52LmdldChraW5kU3luXzEzOS5yZXNvbHZlKHBoYXNlXzE0MCkpID09PSBDb25zdERlY2xUcmFuc2Zvcm0pIHtcbiAgICAgIGtpbmRfMTM3ID0gXCJjb25zdFwiO1xuICAgIH0gZWxzZSBpZiAoa2luZFN5bl8xMzkgJiYgdGhpcy5jb250ZXh0LmVudi5nZXQoa2luZFN5bl8xMzkucmVzb2x2ZShwaGFzZV8xNDApKSA9PT0gU3ludGF4RGVjbFRyYW5zZm9ybSkge1xuICAgICAga2luZF8xMzcgPSBcInN5bnRheFwiO1xuICAgIH0gZWxzZSBpZiAoa2luZFN5bl8xMzkgJiYgdGhpcy5jb250ZXh0LmVudi5nZXQoa2luZFN5bl8xMzkucmVzb2x2ZShwaGFzZV8xNDApKSA9PT0gU3ludGF4cmVjRGVjbFRyYW5zZm9ybSkge1xuICAgICAga2luZF8xMzcgPSBcInN5bnRheHJlY1wiO1xuICAgIH1cbiAgICBsZXQgZGVjbHNfMTQxID0gTGlzdCgpO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBsZXQgdGVybSA9IHRoaXMuZW5mb3Jlc3RWYXJpYWJsZURlY2xhcmF0b3Ioe2lzU3ludGF4OiBraW5kXzEzNyA9PT0gXCJzeW50YXhcIiB8fCBraW5kXzEzNyA9PT0gXCJzeW50YXhyZWNcIn0pO1xuICAgICAgbGV0IGxvb2thaGVhZF8xMzggPSB0aGlzLnBlZWsoKTtcbiAgICAgIGRlY2xzXzE0MSA9IGRlY2xzXzE0MS5jb25jYXQodGVybSk7XG4gICAgICBpZiAodGhpcy5pc1B1bmN0dWF0b3IobG9va2FoZWFkXzEzOCwgXCIsXCIpKSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgVGVybShcIlZhcmlhYmxlRGVjbGFyYXRpb25cIiwge2tpbmQ6IGtpbmRfMTM3LCBkZWNsYXJhdG9yczogZGVjbHNfMTQxfSk7XG4gIH1cbiAgZW5mb3Jlc3RWYXJpYWJsZURlY2xhcmF0b3Ioe2lzU3ludGF4fSkge1xuICAgIGxldCBpZF8xNDIgPSB0aGlzLmVuZm9yZXN0QmluZGluZ1RhcmdldCh7YWxsb3dQdW5jdHVhdG9yOiBpc1N5bnRheH0pO1xuICAgIGxldCBsb29rYWhlYWRfMTQzID0gdGhpcy5wZWVrKCk7XG4gICAgbGV0IGluaXRfMTQ0LCByZXN0XzE0NTtcbiAgICBpZiAodGhpcy5pc1B1bmN0dWF0b3IobG9va2FoZWFkXzE0MywgXCI9XCIpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIGxldCBlbmYgPSBuZXcgRW5mb3Jlc3Rlcih0aGlzLnJlc3QsIExpc3QoKSwgdGhpcy5jb250ZXh0KTtcbiAgICAgIGluaXRfMTQ0ID0gZW5mLmVuZm9yZXN0KFwiZXhwcmVzc2lvblwiKTtcbiAgICAgIHRoaXMucmVzdCA9IGVuZi5yZXN0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpbml0XzE0NCA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBuZXcgVGVybShcIlZhcmlhYmxlRGVjbGFyYXRvclwiLCB7YmluZGluZzogaWRfMTQyLCBpbml0OiBpbml0XzE0NH0pO1xuICB9XG4gIGVuZm9yZXN0RXhwcmVzc2lvblN0YXRlbWVudCgpIHtcbiAgICBsZXQgc3RhcnRfMTQ2ID0gdGhpcy5yZXN0LmdldCgwKTtcbiAgICBsZXQgZXhwcl8xNDcgPSB0aGlzLmVuZm9yZXN0RXhwcmVzc2lvbigpO1xuICAgIGlmIChleHByXzE0NyA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgdGhpcy5jcmVhdGVFcnJvcihzdGFydF8xNDYsIFwibm90IGEgdmFsaWQgZXhwcmVzc2lvblwiKTtcbiAgICB9XG4gICAgdGhpcy5jb25zdW1lU2VtaWNvbG9uKCk7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiRXhwcmVzc2lvblN0YXRlbWVudFwiLCB7ZXhwcmVzc2lvbjogZXhwcl8xNDd9KTtcbiAgfVxuICBlbmZvcmVzdEV4cHJlc3Npb24oKSB7XG4gICAgbGV0IGxlZnRfMTQ4ID0gdGhpcy5lbmZvcmVzdEV4cHJlc3Npb25Mb29wKCk7XG4gICAgbGV0IGxvb2thaGVhZF8xNDkgPSB0aGlzLnBlZWsoKTtcbiAgICBpZiAodGhpcy5pc1B1bmN0dWF0b3IobG9va2FoZWFkXzE0OSwgXCIsXCIpKSB7XG4gICAgICB3aGlsZSAodGhpcy5yZXN0LnNpemUgIT09IDApIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzUHVuY3R1YXRvcih0aGlzLnBlZWsoKSwgXCIsXCIpKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG9wZXJhdG9yID0gdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgIGxldCByaWdodCA9IHRoaXMuZW5mb3Jlc3RFeHByZXNzaW9uTG9vcCgpO1xuICAgICAgICBsZWZ0XzE0OCA9IG5ldyBUZXJtKFwiQmluYXJ5RXhwcmVzc2lvblwiLCB7bGVmdDogbGVmdF8xNDgsIG9wZXJhdG9yOiBvcGVyYXRvciwgcmlnaHQ6IHJpZ2h0fSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMudGVybSA9IG51bGw7XG4gICAgcmV0dXJuIGxlZnRfMTQ4O1xuICB9XG4gIGVuZm9yZXN0RXhwcmVzc2lvbkxvb3AoKSB7XG4gICAgdGhpcy50ZXJtID0gbnVsbDtcbiAgICB0aGlzLm9wQ3R4ID0ge3ByZWM6IDAsIGNvbWJpbmU6IHhfMTUwID0+IHhfMTUwLCBzdGFjazogTGlzdCgpfTtcbiAgICBkbyB7XG4gICAgICBsZXQgdGVybSA9IHRoaXMuZW5mb3Jlc3RBc3NpZ25tZW50RXhwcmVzc2lvbigpO1xuICAgICAgaWYgKHRlcm0gPT09IEVYUFJfTE9PUF9OT19DSEFOR0VfMzggJiYgdGhpcy5vcEN0eC5zdGFjay5zaXplID4gMCkge1xuICAgICAgICB0aGlzLnRlcm0gPSB0aGlzLm9wQ3R4LmNvbWJpbmUodGhpcy50ZXJtKTtcbiAgICAgICAgbGV0IHtwcmVjLCBjb21iaW5lfSA9IHRoaXMub3BDdHguc3RhY2subGFzdCgpO1xuICAgICAgICB0aGlzLm9wQ3R4LnByZWMgPSBwcmVjO1xuICAgICAgICB0aGlzLm9wQ3R4LmNvbWJpbmUgPSBjb21iaW5lO1xuICAgICAgICB0aGlzLm9wQ3R4LnN0YWNrID0gdGhpcy5vcEN0eC5zdGFjay5wb3AoKTtcbiAgICAgIH0gZWxzZSBpZiAodGVybSA9PT0gRVhQUl9MT09QX05PX0NIQU5HRV8zOCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSBpZiAodGVybSA9PT0gRVhQUl9MT09QX09QRVJBVE9SXzM3IHx8IHRlcm0gPT09IEVYUFJfTE9PUF9FWFBBTlNJT05fMzkpIHtcbiAgICAgICAgdGhpcy50ZXJtID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudGVybSA9IHRlcm07XG4gICAgICB9XG4gICAgfSB3aGlsZSAodHJ1ZSk7XG4gICAgcmV0dXJuIHRoaXMudGVybTtcbiAgfVxuICBlbmZvcmVzdEFzc2lnbm1lbnRFeHByZXNzaW9uKCkge1xuICAgIGxldCBsb29rYWhlYWRfMTUxID0gdGhpcy5wZWVrKCk7XG4gICAgaWYgKHRoaXMudGVybSA9PT0gbnVsbCAmJiB0aGlzLmlzVGVybShsb29rYWhlYWRfMTUxKSkge1xuICAgICAgcmV0dXJuIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy50ZXJtID09PSBudWxsICYmIHRoaXMuaXNDb21waWxldGltZVRyYW5zZm9ybShsb29rYWhlYWRfMTUxKSkge1xuICAgICAgbGV0IHJlc3VsdCA9IHRoaXMuZXhwYW5kTWFjcm8oKTtcbiAgICAgIHRoaXMucmVzdCA9IHJlc3VsdC5jb25jYXQodGhpcy5yZXN0KTtcbiAgICAgIHJldHVybiBFWFBSX0xPT1BfRVhQQU5TSU9OXzM5O1xuICAgIH1cbiAgICBpZiAodGhpcy50ZXJtID09PSBudWxsICYmIHRoaXMuaXNLZXl3b3JkKGxvb2thaGVhZF8xNTEsIFwieWllbGRcIikpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZm9yZXN0WWllbGRFeHByZXNzaW9uKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnRlcm0gPT09IG51bGwgJiYgdGhpcy5pc0tleXdvcmQobG9va2FoZWFkXzE1MSwgXCJjbGFzc1wiKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5mb3Jlc3RDbGFzcyh7aXNFeHByOiB0cnVlfSk7XG4gICAgfVxuICAgIGlmICh0aGlzLnRlcm0gPT09IG51bGwgJiYgdGhpcy5pc0tleXdvcmQobG9va2FoZWFkXzE1MSwgXCJzdXBlclwiKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICByZXR1cm4gbmV3IFRlcm0oXCJTdXBlclwiLCB7fSk7XG4gICAgfVxuICAgIGlmICh0aGlzLnRlcm0gPT09IG51bGwgJiYgKHRoaXMuaXNJZGVudGlmaWVyKGxvb2thaGVhZF8xNTEpIHx8IHRoaXMuaXNQYXJlbnMobG9va2FoZWFkXzE1MSkpICYmIHRoaXMuaXNQdW5jdHVhdG9yKHRoaXMucGVlaygxKSwgXCI9PlwiKSAmJiB0aGlzLmxpbmVOdW1iZXJFcShsb29rYWhlYWRfMTUxLCB0aGlzLnBlZWsoMSkpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmZvcmVzdEFycm93RXhwcmVzc2lvbigpO1xuICAgIH1cbiAgICBpZiAodGhpcy50ZXJtID09PSBudWxsICYmIHRoaXMuaXNTeW50YXhUZW1wbGF0ZShsb29rYWhlYWRfMTUxKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5mb3Jlc3RTeW50YXhUZW1wbGF0ZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy50ZXJtID09PSBudWxsICYmIHRoaXMuaXNTeW50YXhRdW90ZVRyYW5zZm9ybShsb29rYWhlYWRfMTUxKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5mb3Jlc3RTeW50YXhRdW90ZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy50ZXJtID09PSBudWxsICYmIHRoaXMuaXNOZXdUcmFuc2Zvcm0obG9va2FoZWFkXzE1MSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZm9yZXN0TmV3RXhwcmVzc2lvbigpO1xuICAgIH1cbiAgICBpZiAodGhpcy50ZXJtID09PSBudWxsICYmIHRoaXMuaXNLZXl3b3JkKGxvb2thaGVhZF8xNTEsIFwidGhpc1wiKSkge1xuICAgICAgcmV0dXJuIG5ldyBUZXJtKFwiVGhpc0V4cHJlc3Npb25cIiwge3N0eDogdGhpcy5hZHZhbmNlKCl9KTtcbiAgICB9XG4gICAgaWYgKHRoaXMudGVybSA9PT0gbnVsbCAmJiAodGhpcy5pc0lkZW50aWZpZXIobG9va2FoZWFkXzE1MSkgfHwgdGhpcy5pc0tleXdvcmQobG9va2FoZWFkXzE1MSwgXCJsZXRcIikgfHwgdGhpcy5pc0tleXdvcmQobG9va2FoZWFkXzE1MSwgXCJ5aWVsZFwiKSkpIHtcbiAgICAgIHJldHVybiBuZXcgVGVybShcIklkZW50aWZpZXJFeHByZXNzaW9uXCIsIHtuYW1lOiB0aGlzLmFkdmFuY2UoKX0pO1xuICAgIH1cbiAgICBpZiAodGhpcy50ZXJtID09PSBudWxsICYmIHRoaXMuaXNOdW1lcmljTGl0ZXJhbChsb29rYWhlYWRfMTUxKSkge1xuICAgICAgbGV0IG51bSA9IHRoaXMuYWR2YW5jZSgpO1xuICAgICAgaWYgKG51bS52YWwoKSA9PT0gMSAvIDApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUZXJtKFwiTGl0ZXJhbEluZmluaXR5RXhwcmVzc2lvblwiLCB7fSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IFRlcm0oXCJMaXRlcmFsTnVtZXJpY0V4cHJlc3Npb25cIiwge3ZhbHVlOiBudW19KTtcbiAgICB9XG4gICAgaWYgKHRoaXMudGVybSA9PT0gbnVsbCAmJiB0aGlzLmlzU3RyaW5nTGl0ZXJhbChsb29rYWhlYWRfMTUxKSkge1xuICAgICAgcmV0dXJuIG5ldyBUZXJtKFwiTGl0ZXJhbFN0cmluZ0V4cHJlc3Npb25cIiwge3ZhbHVlOiB0aGlzLmFkdmFuY2UoKX0pO1xuICAgIH1cbiAgICBpZiAodGhpcy50ZXJtID09PSBudWxsICYmIHRoaXMuaXNUZW1wbGF0ZShsb29rYWhlYWRfMTUxKSkge1xuICAgICAgcmV0dXJuIG5ldyBUZXJtKFwiVGVtcGxhdGVFeHByZXNzaW9uXCIsIHt0YWc6IG51bGwsIGVsZW1lbnRzOiB0aGlzLmVuZm9yZXN0VGVtcGxhdGVFbGVtZW50cygpfSk7XG4gICAgfVxuICAgIGlmICh0aGlzLnRlcm0gPT09IG51bGwgJiYgdGhpcy5pc0Jvb2xlYW5MaXRlcmFsKGxvb2thaGVhZF8xNTEpKSB7XG4gICAgICByZXR1cm4gbmV3IFRlcm0oXCJMaXRlcmFsQm9vbGVhbkV4cHJlc3Npb25cIiwge3ZhbHVlOiB0aGlzLmFkdmFuY2UoKX0pO1xuICAgIH1cbiAgICBpZiAodGhpcy50ZXJtID09PSBudWxsICYmIHRoaXMuaXNOdWxsTGl0ZXJhbChsb29rYWhlYWRfMTUxKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICByZXR1cm4gbmV3IFRlcm0oXCJMaXRlcmFsTnVsbEV4cHJlc3Npb25cIiwge30pO1xuICAgIH1cbiAgICBpZiAodGhpcy50ZXJtID09PSBudWxsICYmIHRoaXMuaXNSZWd1bGFyRXhwcmVzc2lvbihsb29rYWhlYWRfMTUxKSkge1xuICAgICAgbGV0IHJlU3R4ID0gdGhpcy5hZHZhbmNlKCk7XG4gICAgICBsZXQgbGFzdFNsYXNoID0gcmVTdHgudG9rZW4udmFsdWUubGFzdEluZGV4T2YoXCIvXCIpO1xuICAgICAgbGV0IHBhdHRlcm4gPSByZVN0eC50b2tlbi52YWx1ZS5zbGljZSgxLCBsYXN0U2xhc2gpO1xuICAgICAgbGV0IGZsYWdzID0gcmVTdHgudG9rZW4udmFsdWUuc2xpY2UobGFzdFNsYXNoICsgMSk7XG4gICAgICByZXR1cm4gbmV3IFRlcm0oXCJMaXRlcmFsUmVnRXhwRXhwcmVzc2lvblwiLCB7cGF0dGVybjogcGF0dGVybiwgZmxhZ3M6IGZsYWdzfSk7XG4gICAgfVxuICAgIGlmICh0aGlzLnRlcm0gPT09IG51bGwgJiYgdGhpcy5pc1BhcmVucyhsb29rYWhlYWRfMTUxKSkge1xuICAgICAgcmV0dXJuIG5ldyBUZXJtKFwiUGFyZW50aGVzaXplZEV4cHJlc3Npb25cIiwge2lubmVyOiB0aGlzLmFkdmFuY2UoKS5pbm5lcigpfSk7XG4gICAgfVxuICAgIGlmICh0aGlzLnRlcm0gPT09IG51bGwgJiYgdGhpcy5pc0ZuRGVjbFRyYW5zZm9ybShsb29rYWhlYWRfMTUxKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5mb3Jlc3RGdW5jdGlvbkV4cHJlc3Npb24oKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudGVybSA9PT0gbnVsbCAmJiB0aGlzLmlzQnJhY2VzKGxvb2thaGVhZF8xNTEpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmZvcmVzdE9iamVjdEV4cHJlc3Npb24oKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudGVybSA9PT0gbnVsbCAmJiB0aGlzLmlzQnJhY2tldHMobG9va2FoZWFkXzE1MSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZm9yZXN0QXJyYXlFeHByZXNzaW9uKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnRlcm0gPT09IG51bGwgJiYgdGhpcy5pc09wZXJhdG9yKGxvb2thaGVhZF8xNTEpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmZvcmVzdFVuYXJ5RXhwcmVzc2lvbigpO1xuICAgIH1cbiAgICBpZiAodGhpcy50ZXJtICYmIHRoaXMuaXNVcGRhdGVPcGVyYXRvcihsb29rYWhlYWRfMTUxKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5mb3Jlc3RVcGRhdGVFeHByZXNzaW9uKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnRlcm0gJiYgdGhpcy5pc09wZXJhdG9yKGxvb2thaGVhZF8xNTEpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmZvcmVzdEJpbmFyeUV4cHJlc3Npb24oKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudGVybSAmJiB0aGlzLmlzUHVuY3R1YXRvcihsb29rYWhlYWRfMTUxLCBcIi5cIikgJiYgKHRoaXMuaXNJZGVudGlmaWVyKHRoaXMucGVlaygxKSkgfHwgdGhpcy5pc0tleXdvcmQodGhpcy5wZWVrKDEpKSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZm9yZXN0U3RhdGljTWVtYmVyRXhwcmVzc2lvbigpO1xuICAgIH1cbiAgICBpZiAodGhpcy50ZXJtICYmIHRoaXMuaXNCcmFja2V0cyhsb29rYWhlYWRfMTUxKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5mb3Jlc3RDb21wdXRlZE1lbWJlckV4cHJlc3Npb24oKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudGVybSAmJiB0aGlzLmlzUGFyZW5zKGxvb2thaGVhZF8xNTEpKSB7XG4gICAgICBsZXQgcGFyZW4gPSB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIHJldHVybiBuZXcgVGVybShcIkNhbGxFeHByZXNzaW9uXCIsIHtjYWxsZWU6IHRoaXMudGVybSwgYXJndW1lbnRzOiBwYXJlbi5pbm5lcigpfSk7XG4gICAgfVxuICAgIGlmICh0aGlzLnRlcm0gJiYgdGhpcy5pc1RlbXBsYXRlKGxvb2thaGVhZF8xNTEpKSB7XG4gICAgICByZXR1cm4gbmV3IFRlcm0oXCJUZW1wbGF0ZUV4cHJlc3Npb25cIiwge3RhZzogdGhpcy50ZXJtLCBlbGVtZW50czogdGhpcy5lbmZvcmVzdFRlbXBsYXRlRWxlbWVudHMoKX0pO1xuICAgIH1cbiAgICBpZiAodGhpcy50ZXJtICYmIHRoaXMuaXNBc3NpZ24obG9va2FoZWFkXzE1MSkpIHtcbiAgICAgIGxldCBiaW5kaW5nID0gdGhpcy50cmFuc2Zvcm1EZXN0cnVjdHVyaW5nKHRoaXMudGVybSk7XG4gICAgICBsZXQgb3AgPSB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIGxldCBlbmYgPSBuZXcgRW5mb3Jlc3Rlcih0aGlzLnJlc3QsIExpc3QoKSwgdGhpcy5jb250ZXh0KTtcbiAgICAgIGxldCBpbml0ID0gZW5mLmVuZm9yZXN0KFwiZXhwcmVzc2lvblwiKTtcbiAgICAgIHRoaXMucmVzdCA9IGVuZi5yZXN0O1xuICAgICAgaWYgKG9wLnZhbCgpID09PSBcIj1cIikge1xuICAgICAgICByZXR1cm4gbmV3IFRlcm0oXCJBc3NpZ25tZW50RXhwcmVzc2lvblwiLCB7YmluZGluZzogYmluZGluZywgZXhwcmVzc2lvbjogaW5pdH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUZXJtKFwiQ29tcG91bmRBc3NpZ25tZW50RXhwcmVzc2lvblwiLCB7YmluZGluZzogYmluZGluZywgb3BlcmF0b3I6IG9wLnZhbCgpLCBleHByZXNzaW9uOiBpbml0fSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnRlcm0gJiYgdGhpcy5pc1B1bmN0dWF0b3IobG9va2FoZWFkXzE1MSwgXCI/XCIpKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmZvcmVzdENvbmRpdGlvbmFsRXhwcmVzc2lvbigpO1xuICAgIH1cbiAgICByZXR1cm4gRVhQUl9MT09QX05PX0NIQU5HRV8zODtcbiAgfVxuICBlbmZvcmVzdEFyZ3VtZW50TGlzdCgpIHtcbiAgICBsZXQgcmVzdWx0XzE1MiA9IFtdO1xuICAgIHdoaWxlICh0aGlzLnJlc3Quc2l6ZSA+IDApIHtcbiAgICAgIGxldCBhcmc7XG4gICAgICBpZiAodGhpcy5pc1B1bmN0dWF0b3IodGhpcy5wZWVrKCksIFwiLi4uXCIpKSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICBhcmcgPSBuZXcgVGVybShcIlNwcmVhZEVsZW1lbnRcIiwge2V4cHJlc3Npb246IHRoaXMuZW5mb3Jlc3RFeHByZXNzaW9uTG9vcCgpfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcmcgPSB0aGlzLmVuZm9yZXN0RXhwcmVzc2lvbkxvb3AoKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnJlc3Quc2l6ZSA+IDApIHtcbiAgICAgICAgdGhpcy5tYXRjaFB1bmN0dWF0b3IoXCIsXCIpO1xuICAgICAgfVxuICAgICAgcmVzdWx0XzE1Mi5wdXNoKGFyZyk7XG4gICAgfVxuICAgIHJldHVybiBMaXN0KHJlc3VsdF8xNTIpO1xuICB9XG4gIGVuZm9yZXN0TmV3RXhwcmVzc2lvbigpIHtcbiAgICB0aGlzLm1hdGNoS2V5d29yZChcIm5ld1wiKTtcbiAgICBsZXQgY2FsbGVlXzE1MztcbiAgICBpZiAodGhpcy5pc0tleXdvcmQodGhpcy5wZWVrKCksIFwibmV3XCIpKSB7XG4gICAgICBjYWxsZWVfMTUzID0gdGhpcy5lbmZvcmVzdE5ld0V4cHJlc3Npb24oKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNLZXl3b3JkKHRoaXMucGVlaygpLCBcInN1cGVyXCIpKSB7XG4gICAgICBjYWxsZWVfMTUzID0gdGhpcy5lbmZvcmVzdEV4cHJlc3Npb25Mb29wKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzUHVuY3R1YXRvcih0aGlzLnBlZWsoKSwgXCIuXCIpICYmIHRoaXMuaXNJZGVudGlmaWVyKHRoaXMucGVlaygxKSwgXCJ0YXJnZXRcIikpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICByZXR1cm4gbmV3IFRlcm0oXCJOZXdUYXJnZXRFeHByZXNzaW9uXCIsIHt9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGVlXzE1MyA9IG5ldyBUZXJtKFwiSWRlbnRpZmllckV4cHJlc3Npb25cIiwge25hbWU6IHRoaXMuZW5mb3Jlc3RJZGVudGlmaWVyKCl9KTtcbiAgICB9XG4gICAgbGV0IGFyZ3NfMTU0O1xuICAgIGlmICh0aGlzLmlzUGFyZW5zKHRoaXMucGVlaygpKSkge1xuICAgICAgYXJnc18xNTQgPSB0aGlzLm1hdGNoUGFyZW5zKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFyZ3NfMTU0ID0gTGlzdCgpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFRlcm0oXCJOZXdFeHByZXNzaW9uXCIsIHtjYWxsZWU6IGNhbGxlZV8xNTMsIGFyZ3VtZW50czogYXJnc18xNTR9KTtcbiAgfVxuICBlbmZvcmVzdENvbXB1dGVkTWVtYmVyRXhwcmVzc2lvbigpIHtcbiAgICBsZXQgZW5mXzE1NSA9IG5ldyBFbmZvcmVzdGVyKHRoaXMubWF0Y2hTcXVhcmVzKCksIExpc3QoKSwgdGhpcy5jb250ZXh0KTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJDb21wdXRlZE1lbWJlckV4cHJlc3Npb25cIiwge29iamVjdDogdGhpcy50ZXJtLCBleHByZXNzaW9uOiBlbmZfMTU1LmVuZm9yZXN0RXhwcmVzc2lvbigpfSk7XG4gIH1cbiAgdHJhbnNmb3JtRGVzdHJ1Y3R1cmluZyh0ZXJtXzE1Nikge1xuICAgIHN3aXRjaCAodGVybV8xNTYudHlwZSkge1xuICAgICAgY2FzZSBcIklkZW50aWZpZXJFeHByZXNzaW9uXCI6XG4gICAgICAgIHJldHVybiBuZXcgVGVybShcIkJpbmRpbmdJZGVudGlmaWVyXCIsIHtuYW1lOiB0ZXJtXzE1Ni5uYW1lfSk7XG4gICAgICBjYXNlIFwiUGFyZW50aGVzaXplZEV4cHJlc3Npb25cIjpcbiAgICAgICAgaWYgKHRlcm1fMTU2LmlubmVyLnNpemUgPT09IDEgJiYgdGhpcy5pc0lkZW50aWZpZXIodGVybV8xNTYuaW5uZXIuZ2V0KDApKSkge1xuICAgICAgICAgIHJldHVybiBuZXcgVGVybShcIkJpbmRpbmdJZGVudGlmaWVyXCIsIHtuYW1lOiB0ZXJtXzE1Ni5pbm5lci5nZXQoMCl9KTtcbiAgICAgICAgfVxuICAgICAgY2FzZSBcIkRhdGFQcm9wZXJ0eVwiOlxuICAgICAgICByZXR1cm4gbmV3IFRlcm0oXCJCaW5kaW5nUHJvcGVydHlQcm9wZXJ0eVwiLCB7bmFtZTogdGVybV8xNTYubmFtZSwgYmluZGluZzogdGhpcy50cmFuc2Zvcm1EZXN0cnVjdHVyaW5nV2l0aERlZmF1bHQodGVybV8xNTYuZXhwcmVzc2lvbil9KTtcbiAgICAgIGNhc2UgXCJTaG9ydGhhbmRQcm9wZXJ0eVwiOlxuICAgICAgICByZXR1cm4gbmV3IFRlcm0oXCJCaW5kaW5nUHJvcGVydHlJZGVudGlmaWVyXCIsIHtiaW5kaW5nOiBuZXcgVGVybShcIkJpbmRpbmdJZGVudGlmaWVyXCIsIHtuYW1lOiB0ZXJtXzE1Ni5uYW1lfSksIGluaXQ6IG51bGx9KTtcbiAgICAgIGNhc2UgXCJPYmplY3RFeHByZXNzaW9uXCI6XG4gICAgICAgIHJldHVybiBuZXcgVGVybShcIk9iamVjdEJpbmRpbmdcIiwge3Byb3BlcnRpZXM6IHRlcm1fMTU2LnByb3BlcnRpZXMubWFwKHRfMTU3ID0+IHRoaXMudHJhbnNmb3JtRGVzdHJ1Y3R1cmluZyh0XzE1NykpfSk7XG4gICAgICBjYXNlIFwiQXJyYXlFeHByZXNzaW9uXCI6XG4gICAgICAgIGxldCBsYXN0ID0gdGVybV8xNTYuZWxlbWVudHMubGFzdCgpO1xuICAgICAgICBpZiAobGFzdCAhPSBudWxsICYmIGxhc3QudHlwZSA9PT0gXCJTcHJlYWRFbGVtZW50XCIpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFRlcm0oXCJBcnJheUJpbmRpbmdcIiwge2VsZW1lbnRzOiB0ZXJtXzE1Ni5lbGVtZW50cy5zbGljZSgwLCAtMSkubWFwKHRfMTU4ID0+IHRfMTU4ICYmIHRoaXMudHJhbnNmb3JtRGVzdHJ1Y3R1cmluZ1dpdGhEZWZhdWx0KHRfMTU4KSksIHJlc3RFbGVtZW50OiB0aGlzLnRyYW5zZm9ybURlc3RydWN0dXJpbmdXaXRoRGVmYXVsdChsYXN0LmV4cHJlc3Npb24pfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBUZXJtKFwiQXJyYXlCaW5kaW5nXCIsIHtlbGVtZW50czogdGVybV8xNTYuZWxlbWVudHMubWFwKHRfMTU5ID0+IHRfMTU5ICYmIHRoaXMudHJhbnNmb3JtRGVzdHJ1Y3R1cmluZ1dpdGhEZWZhdWx0KHRfMTU5KSksIHJlc3RFbGVtZW50OiBudWxsfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBUZXJtKFwiQXJyYXlCaW5kaW5nXCIsIHtlbGVtZW50czogdGVybV8xNTYuZWxlbWVudHMubWFwKHRfMTYwID0+IHRfMTYwICYmIHRoaXMudHJhbnNmb3JtRGVzdHJ1Y3R1cmluZyh0XzE2MCkpLCByZXN0RWxlbWVudDogbnVsbH0pO1xuICAgICAgY2FzZSBcIlN0YXRpY1Byb3BlcnR5TmFtZVwiOlxuICAgICAgICByZXR1cm4gbmV3IFRlcm0oXCJCaW5kaW5nSWRlbnRpZmllclwiLCB7bmFtZTogdGVybV8xNTYudmFsdWV9KTtcbiAgICAgIGNhc2UgXCJDb21wdXRlZE1lbWJlckV4cHJlc3Npb25cIjpcbiAgICAgIGNhc2UgXCJTdGF0aWNNZW1iZXJFeHByZXNzaW9uXCI6XG4gICAgICBjYXNlIFwiQXJyYXlCaW5kaW5nXCI6XG4gICAgICBjYXNlIFwiQmluZGluZ0lkZW50aWZpZXJcIjpcbiAgICAgIGNhc2UgXCJCaW5kaW5nUHJvcGVydHlJZGVudGlmaWVyXCI6XG4gICAgICBjYXNlIFwiQmluZGluZ1Byb3BlcnR5UHJvcGVydHlcIjpcbiAgICAgIGNhc2UgXCJCaW5kaW5nV2l0aERlZmF1bHRcIjpcbiAgICAgIGNhc2UgXCJPYmplY3RCaW5kaW5nXCI6XG4gICAgICAgIHJldHVybiB0ZXJtXzE1NjtcbiAgICB9XG4gICAgYXNzZXJ0KGZhbHNlLCBcIm5vdCBpbXBsZW1lbnRlZCB5ZXQgZm9yIFwiICsgdGVybV8xNTYudHlwZSk7XG4gIH1cbiAgdHJhbnNmb3JtRGVzdHJ1Y3R1cmluZ1dpdGhEZWZhdWx0KHRlcm1fMTYxKSB7XG4gICAgc3dpdGNoICh0ZXJtXzE2MS50eXBlKSB7XG4gICAgICBjYXNlIFwiQXNzaWdubWVudEV4cHJlc3Npb25cIjpcbiAgICAgICAgcmV0dXJuIG5ldyBUZXJtKFwiQmluZGluZ1dpdGhEZWZhdWx0XCIsIHtiaW5kaW5nOiB0aGlzLnRyYW5zZm9ybURlc3RydWN0dXJpbmcodGVybV8xNjEuYmluZGluZyksIGluaXQ6IHRlcm1fMTYxLmV4cHJlc3Npb259KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtRGVzdHJ1Y3R1cmluZyh0ZXJtXzE2MSk7XG4gIH1cbiAgZW5mb3Jlc3RBcnJvd0V4cHJlc3Npb24oKSB7XG4gICAgbGV0IGVuZl8xNjI7XG4gICAgaWYgKHRoaXMuaXNJZGVudGlmaWVyKHRoaXMucGVlaygpKSkge1xuICAgICAgZW5mXzE2MiA9IG5ldyBFbmZvcmVzdGVyKExpc3Qub2YodGhpcy5hZHZhbmNlKCkpLCBMaXN0KCksIHRoaXMuY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBwID0gdGhpcy5tYXRjaFBhcmVucygpO1xuICAgICAgZW5mXzE2MiA9IG5ldyBFbmZvcmVzdGVyKHAsIExpc3QoKSwgdGhpcy5jb250ZXh0KTtcbiAgICB9XG4gICAgbGV0IHBhcmFtc18xNjMgPSBlbmZfMTYyLmVuZm9yZXN0Rm9ybWFsUGFyYW1ldGVycygpO1xuICAgIHRoaXMubWF0Y2hQdW5jdHVhdG9yKFwiPT5cIik7XG4gICAgbGV0IGJvZHlfMTY0O1xuICAgIGlmICh0aGlzLmlzQnJhY2VzKHRoaXMucGVlaygpKSkge1xuICAgICAgYm9keV8xNjQgPSB0aGlzLm1hdGNoQ3VybGllcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmZfMTYyID0gbmV3IEVuZm9yZXN0ZXIodGhpcy5yZXN0LCBMaXN0KCksIHRoaXMuY29udGV4dCk7XG4gICAgICBib2R5XzE2NCA9IGVuZl8xNjIuZW5mb3Jlc3RFeHByZXNzaW9uTG9vcCgpO1xuICAgICAgdGhpcy5yZXN0ID0gZW5mXzE2Mi5yZXN0O1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFRlcm0oXCJBcnJvd0V4cHJlc3Npb25cIiwge3BhcmFtczogcGFyYW1zXzE2MywgYm9keTogYm9keV8xNjR9KTtcbiAgfVxuICBlbmZvcmVzdFlpZWxkRXhwcmVzc2lvbigpIHtcbiAgICBsZXQga3dkXzE2NSA9IHRoaXMubWF0Y2hLZXl3b3JkKFwieWllbGRcIik7XG4gICAgbGV0IGxvb2thaGVhZF8xNjYgPSB0aGlzLnBlZWsoKTtcbiAgICBpZiAodGhpcy5yZXN0LnNpemUgPT09IDAgfHwgbG9va2FoZWFkXzE2NiAmJiAhdGhpcy5saW5lTnVtYmVyRXEoa3dkXzE2NSwgbG9va2FoZWFkXzE2NikpIHtcbiAgICAgIHJldHVybiBuZXcgVGVybShcIllpZWxkRXhwcmVzc2lvblwiLCB7ZXhwcmVzc2lvbjogbnVsbH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgaXNHZW5lcmF0b3IgPSBmYWxzZTtcbiAgICAgIGlmICh0aGlzLmlzUHVuY3R1YXRvcih0aGlzLnBlZWsoKSwgXCIqXCIpKSB7XG4gICAgICAgIGlzR2VuZXJhdG9yID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICB9XG4gICAgICBsZXQgZXhwciA9IHRoaXMuZW5mb3Jlc3RFeHByZXNzaW9uKCk7XG4gICAgICBsZXQgdHlwZSA9IGlzR2VuZXJhdG9yID8gXCJZaWVsZEdlbmVyYXRvckV4cHJlc3Npb25cIiA6IFwiWWllbGRFeHByZXNzaW9uXCI7XG4gICAgICByZXR1cm4gbmV3IFRlcm0odHlwZSwge2V4cHJlc3Npb246IGV4cHJ9KTtcbiAgICB9XG4gIH1cbiAgZW5mb3Jlc3RTeW50YXhUZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJTeW50YXhUZW1wbGF0ZVwiLCB7dGVtcGxhdGU6IHRoaXMuYWR2YW5jZSgpfSk7XG4gIH1cbiAgZW5mb3Jlc3RTeW50YXhRdW90ZSgpIHtcbiAgICBsZXQgbmFtZV8xNjcgPSB0aGlzLmFkdmFuY2UoKTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJTeW50YXhRdW90ZVwiLCB7bmFtZTogbmFtZV8xNjcsIHRlbXBsYXRlOiBuZXcgVGVybShcIlRlbXBsYXRlRXhwcmVzc2lvblwiLCB7dGFnOiBuZXcgVGVybShcIklkZW50aWZpZXJFeHByZXNzaW9uXCIsIHtuYW1lOiBuYW1lXzE2N30pLCBlbGVtZW50czogdGhpcy5lbmZvcmVzdFRlbXBsYXRlRWxlbWVudHMoKX0pfSk7XG4gIH1cbiAgZW5mb3Jlc3RTdGF0aWNNZW1iZXJFeHByZXNzaW9uKCkge1xuICAgIGxldCBvYmplY3RfMTY4ID0gdGhpcy50ZXJtO1xuICAgIGxldCBkb3RfMTY5ID0gdGhpcy5hZHZhbmNlKCk7XG4gICAgbGV0IHByb3BlcnR5XzE3MCA9IHRoaXMuYWR2YW5jZSgpO1xuICAgIHJldHVybiBuZXcgVGVybShcIlN0YXRpY01lbWJlckV4cHJlc3Npb25cIiwge29iamVjdDogb2JqZWN0XzE2OCwgcHJvcGVydHk6IHByb3BlcnR5XzE3MH0pO1xuICB9XG4gIGVuZm9yZXN0QXJyYXlFeHByZXNzaW9uKCkge1xuICAgIGxldCBhcnJfMTcxID0gdGhpcy5hZHZhbmNlKCk7XG4gICAgbGV0IGVsZW1lbnRzXzE3MiA9IFtdO1xuICAgIGxldCBlbmZfMTczID0gbmV3IEVuZm9yZXN0ZXIoYXJyXzE3MS5pbm5lcigpLCBMaXN0KCksIHRoaXMuY29udGV4dCk7XG4gICAgd2hpbGUgKGVuZl8xNzMucmVzdC5zaXplID4gMCkge1xuICAgICAgbGV0IGxvb2thaGVhZCA9IGVuZl8xNzMucGVlaygpO1xuICAgICAgaWYgKGVuZl8xNzMuaXNQdW5jdHVhdG9yKGxvb2thaGVhZCwgXCIsXCIpKSB7XG4gICAgICAgIGVuZl8xNzMuYWR2YW5jZSgpO1xuICAgICAgICBlbGVtZW50c18xNzIucHVzaChudWxsKTtcbiAgICAgIH0gZWxzZSBpZiAoZW5mXzE3My5pc1B1bmN0dWF0b3IobG9va2FoZWFkLCBcIi4uLlwiKSkge1xuICAgICAgICBlbmZfMTczLmFkdmFuY2UoKTtcbiAgICAgICAgbGV0IGV4cHJlc3Npb24gPSBlbmZfMTczLmVuZm9yZXN0RXhwcmVzc2lvbkxvb3AoKTtcbiAgICAgICAgaWYgKGV4cHJlc3Npb24gPT0gbnVsbCkge1xuICAgICAgICAgIHRocm93IGVuZl8xNzMuY3JlYXRlRXJyb3IobG9va2FoZWFkLCBcImV4cGVjdGluZyBleHByZXNzaW9uXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsZW1lbnRzXzE3Mi5wdXNoKG5ldyBUZXJtKFwiU3ByZWFkRWxlbWVudFwiLCB7ZXhwcmVzc2lvbjogZXhwcmVzc2lvbn0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB0ZXJtID0gZW5mXzE3My5lbmZvcmVzdEV4cHJlc3Npb25Mb29wKCk7XG4gICAgICAgIGlmICh0ZXJtID09IG51bGwpIHtcbiAgICAgICAgICB0aHJvdyBlbmZfMTczLmNyZWF0ZUVycm9yKGxvb2thaGVhZCwgXCJleHBlY3RlZCBleHByZXNzaW9uXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsZW1lbnRzXzE3Mi5wdXNoKHRlcm0pO1xuICAgICAgICBlbmZfMTczLmNvbnN1bWVDb21tYSgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IFRlcm0oXCJBcnJheUV4cHJlc3Npb25cIiwge2VsZW1lbnRzOiBMaXN0KGVsZW1lbnRzXzE3Mil9KTtcbiAgfVxuICBlbmZvcmVzdE9iamVjdEV4cHJlc3Npb24oKSB7XG4gICAgbGV0IG9ial8xNzQgPSB0aGlzLmFkdmFuY2UoKTtcbiAgICBsZXQgcHJvcGVydGllc18xNzUgPSBMaXN0KCk7XG4gICAgbGV0IGVuZl8xNzYgPSBuZXcgRW5mb3Jlc3RlcihvYmpfMTc0LmlubmVyKCksIExpc3QoKSwgdGhpcy5jb250ZXh0KTtcbiAgICBsZXQgbGFzdFByb3BfMTc3ID0gbnVsbDtcbiAgICB3aGlsZSAoZW5mXzE3Ni5yZXN0LnNpemUgPiAwKSB7XG4gICAgICBsZXQgcHJvcCA9IGVuZl8xNzYuZW5mb3Jlc3RQcm9wZXJ0eURlZmluaXRpb24oKTtcbiAgICAgIGVuZl8xNzYuY29uc3VtZUNvbW1hKCk7XG4gICAgICBwcm9wZXJ0aWVzXzE3NSA9IHByb3BlcnRpZXNfMTc1LmNvbmNhdChwcm9wKTtcbiAgICAgIGlmIChsYXN0UHJvcF8xNzcgPT09IHByb3ApIHtcbiAgICAgICAgdGhyb3cgZW5mXzE3Ni5jcmVhdGVFcnJvcihwcm9wLCBcImludmFsaWQgc3ludGF4IGluIG9iamVjdFwiKTtcbiAgICAgIH1cbiAgICAgIGxhc3RQcm9wXzE3NyA9IHByb3A7XG4gICAgfVxuICAgIHJldHVybiBuZXcgVGVybShcIk9iamVjdEV4cHJlc3Npb25cIiwge3Byb3BlcnRpZXM6IHByb3BlcnRpZXNfMTc1fSk7XG4gIH1cbiAgZW5mb3Jlc3RQcm9wZXJ0eURlZmluaXRpb24oKSB7XG4gICAgbGV0IHttZXRob2RPcktleSwga2luZH0gPSB0aGlzLmVuZm9yZXN0TWV0aG9kRGVmaW5pdGlvbigpO1xuICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgY2FzZSBcIm1ldGhvZFwiOlxuICAgICAgICByZXR1cm4gbWV0aG9kT3JLZXk7XG4gICAgICBjYXNlIFwiaWRlbnRpZmllclwiOlxuICAgICAgICBpZiAodGhpcy5pc0Fzc2lnbih0aGlzLnBlZWsoKSkpIHtcbiAgICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgICBsZXQgaW5pdCA9IHRoaXMuZW5mb3Jlc3RFeHByZXNzaW9uTG9vcCgpO1xuICAgICAgICAgIHJldHVybiBuZXcgVGVybShcIkJpbmRpbmdQcm9wZXJ0eUlkZW50aWZpZXJcIiwge2luaXQ6IGluaXQsIGJpbmRpbmc6IHRoaXMudHJhbnNmb3JtRGVzdHJ1Y3R1cmluZyhtZXRob2RPcktleSl9KTtcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5pc1B1bmN0dWF0b3IodGhpcy5wZWVrKCksIFwiOlwiKSkge1xuICAgICAgICAgIHJldHVybiBuZXcgVGVybShcIlNob3J0aGFuZFByb3BlcnR5XCIsIHtuYW1lOiBtZXRob2RPcktleS52YWx1ZX0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRoaXMubWF0Y2hQdW5jdHVhdG9yKFwiOlwiKTtcbiAgICBsZXQgZXhwcl8xNzggPSB0aGlzLmVuZm9yZXN0RXhwcmVzc2lvbkxvb3AoKTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJEYXRhUHJvcGVydHlcIiwge25hbWU6IG1ldGhvZE9yS2V5LCBleHByZXNzaW9uOiBleHByXzE3OH0pO1xuICB9XG4gIGVuZm9yZXN0TWV0aG9kRGVmaW5pdGlvbigpIHtcbiAgICBsZXQgbG9va2FoZWFkXzE3OSA9IHRoaXMucGVlaygpO1xuICAgIGxldCBpc0dlbmVyYXRvcl8xODAgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5pc1B1bmN0dWF0b3IobG9va2FoZWFkXzE3OSwgXCIqXCIpKSB7XG4gICAgICBpc0dlbmVyYXRvcl8xODAgPSB0cnVlO1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmlzSWRlbnRpZmllcihsb29rYWhlYWRfMTc5LCBcImdldFwiKSAmJiB0aGlzLmlzUHJvcGVydHlOYW1lKHRoaXMucGVlaygxKSkpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgbGV0IHtuYW1lfSA9IHRoaXMuZW5mb3Jlc3RQcm9wZXJ0eU5hbWUoKTtcbiAgICAgIHRoaXMubWF0Y2hQYXJlbnMoKTtcbiAgICAgIGxldCBib2R5ID0gdGhpcy5tYXRjaEN1cmxpZXMoKTtcbiAgICAgIHJldHVybiB7bWV0aG9kT3JLZXk6IG5ldyBUZXJtKFwiR2V0dGVyXCIsIHtuYW1lOiBuYW1lLCBib2R5OiBib2R5fSksIGtpbmQ6IFwibWV0aG9kXCJ9O1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0lkZW50aWZpZXIobG9va2FoZWFkXzE3OSwgXCJzZXRcIikgJiYgdGhpcy5pc1Byb3BlcnR5TmFtZSh0aGlzLnBlZWsoMSkpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIGxldCB7bmFtZX0gPSB0aGlzLmVuZm9yZXN0UHJvcGVydHlOYW1lKCk7XG4gICAgICBsZXQgZW5mID0gbmV3IEVuZm9yZXN0ZXIodGhpcy5tYXRjaFBhcmVucygpLCBMaXN0KCksIHRoaXMuY29udGV4dCk7XG4gICAgICBsZXQgcGFyYW0gPSBlbmYuZW5mb3Jlc3RCaW5kaW5nRWxlbWVudCgpO1xuICAgICAgbGV0IGJvZHkgPSB0aGlzLm1hdGNoQ3VybGllcygpO1xuICAgICAgcmV0dXJuIHttZXRob2RPcktleTogbmV3IFRlcm0oXCJTZXR0ZXJcIiwge25hbWU6IG5hbWUsIHBhcmFtOiBwYXJhbSwgYm9keTogYm9keX0pLCBraW5kOiBcIm1ldGhvZFwifTtcbiAgICB9XG4gICAgbGV0IHtuYW1lfSA9IHRoaXMuZW5mb3Jlc3RQcm9wZXJ0eU5hbWUoKTtcbiAgICBpZiAodGhpcy5pc1BhcmVucyh0aGlzLnBlZWsoKSkpIHtcbiAgICAgIGxldCBwYXJhbXMgPSB0aGlzLm1hdGNoUGFyZW5zKCk7XG4gICAgICBsZXQgZW5mID0gbmV3IEVuZm9yZXN0ZXIocGFyYW1zLCBMaXN0KCksIHRoaXMuY29udGV4dCk7XG4gICAgICBsZXQgZm9ybWFsUGFyYW1zID0gZW5mLmVuZm9yZXN0Rm9ybWFsUGFyYW1ldGVycygpO1xuICAgICAgbGV0IGJvZHkgPSB0aGlzLm1hdGNoQ3VybGllcygpO1xuICAgICAgcmV0dXJuIHttZXRob2RPcktleTogbmV3IFRlcm0oXCJNZXRob2RcIiwge2lzR2VuZXJhdG9yOiBpc0dlbmVyYXRvcl8xODAsIG5hbWU6IG5hbWUsIHBhcmFtczogZm9ybWFsUGFyYW1zLCBib2R5OiBib2R5fSksIGtpbmQ6IFwibWV0aG9kXCJ9O1xuICAgIH1cbiAgICByZXR1cm4ge21ldGhvZE9yS2V5OiBuYW1lLCBraW5kOiB0aGlzLmlzSWRlbnRpZmllcihsb29rYWhlYWRfMTc5KSB8fCB0aGlzLmlzS2V5d29yZChsb29rYWhlYWRfMTc5KSA/IFwiaWRlbnRpZmllclwiIDogXCJwcm9wZXJ0eVwifTtcbiAgfVxuICBlbmZvcmVzdFByb3BlcnR5TmFtZSgpIHtcbiAgICBsZXQgbG9va2FoZWFkXzE4MSA9IHRoaXMucGVlaygpO1xuICAgIGlmICh0aGlzLmlzU3RyaW5nTGl0ZXJhbChsb29rYWhlYWRfMTgxKSB8fCB0aGlzLmlzTnVtZXJpY0xpdGVyYWwobG9va2FoZWFkXzE4MSkpIHtcbiAgICAgIHJldHVybiB7bmFtZTogbmV3IFRlcm0oXCJTdGF0aWNQcm9wZXJ0eU5hbWVcIiwge3ZhbHVlOiB0aGlzLmFkdmFuY2UoKX0pLCBiaW5kaW5nOiBudWxsfTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNCcmFja2V0cyhsb29rYWhlYWRfMTgxKSkge1xuICAgICAgbGV0IGVuZiA9IG5ldyBFbmZvcmVzdGVyKHRoaXMubWF0Y2hTcXVhcmVzKCksIExpc3QoKSwgdGhpcy5jb250ZXh0KTtcbiAgICAgIGxldCBleHByID0gZW5mLmVuZm9yZXN0RXhwcmVzc2lvbkxvb3AoKTtcbiAgICAgIHJldHVybiB7bmFtZTogbmV3IFRlcm0oXCJDb21wdXRlZFByb3BlcnR5TmFtZVwiLCB7ZXhwcmVzc2lvbjogZXhwcn0pLCBiaW5kaW5nOiBudWxsfTtcbiAgICB9XG4gICAgbGV0IG5hbWVfMTgyID0gdGhpcy5hZHZhbmNlKCk7XG4gICAgcmV0dXJuIHtuYW1lOiBuZXcgVGVybShcIlN0YXRpY1Byb3BlcnR5TmFtZVwiLCB7dmFsdWU6IG5hbWVfMTgyfSksIGJpbmRpbmc6IG5ldyBUZXJtKFwiQmluZGluZ0lkZW50aWZpZXJcIiwge25hbWU6IG5hbWVfMTgyfSl9O1xuICB9XG4gIGVuZm9yZXN0RnVuY3Rpb24oe2lzRXhwciwgaW5EZWZhdWx0LCBhbGxvd0dlbmVyYXRvcn0pIHtcbiAgICBsZXQgbmFtZV8xODMgPSBudWxsLCBwYXJhbXNfMTg0LCBib2R5XzE4NSwgcmVzdF8xODY7XG4gICAgbGV0IGlzR2VuZXJhdG9yXzE4NyA9IGZhbHNlO1xuICAgIGxldCBmbktleXdvcmRfMTg4ID0gdGhpcy5hZHZhbmNlKCk7XG4gICAgbGV0IGxvb2thaGVhZF8xODkgPSB0aGlzLnBlZWsoKTtcbiAgICBsZXQgdHlwZV8xOTAgPSBpc0V4cHIgPyBcIkZ1bmN0aW9uRXhwcmVzc2lvblwiIDogXCJGdW5jdGlvbkRlY2xhcmF0aW9uXCI7XG4gICAgaWYgKHRoaXMuaXNQdW5jdHVhdG9yKGxvb2thaGVhZF8xODksIFwiKlwiKSkge1xuICAgICAgaXNHZW5lcmF0b3JfMTg3ID0gdHJ1ZTtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgbG9va2FoZWFkXzE4OSA9IHRoaXMucGVlaygpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuaXNQYXJlbnMobG9va2FoZWFkXzE4OSkpIHtcbiAgICAgIG5hbWVfMTgzID0gdGhpcy5lbmZvcmVzdEJpbmRpbmdJZGVudGlmaWVyKCk7XG4gICAgfSBlbHNlIGlmIChpbkRlZmF1bHQpIHtcbiAgICAgIG5hbWVfMTgzID0gbmV3IFRlcm0oXCJCaW5kaW5nSWRlbnRpZmllclwiLCB7bmFtZTogU3ludGF4LmZyb21JZGVudGlmaWVyKFwiKmRlZmF1bHQqXCIsIGZuS2V5d29yZF8xODgpfSk7XG4gICAgfVxuICAgIHBhcmFtc18xODQgPSB0aGlzLm1hdGNoUGFyZW5zKCk7XG4gICAgYm9keV8xODUgPSB0aGlzLm1hdGNoQ3VybGllcygpO1xuICAgIGxldCBlbmZfMTkxID0gbmV3IEVuZm9yZXN0ZXIocGFyYW1zXzE4NCwgTGlzdCgpLCB0aGlzLmNvbnRleHQpO1xuICAgIGxldCBmb3JtYWxQYXJhbXNfMTkyID0gZW5mXzE5MS5lbmZvcmVzdEZvcm1hbFBhcmFtZXRlcnMoKTtcbiAgICByZXR1cm4gbmV3IFRlcm0odHlwZV8xOTAsIHtuYW1lOiBuYW1lXzE4MywgaXNHZW5lcmF0b3I6IGlzR2VuZXJhdG9yXzE4NywgcGFyYW1zOiBmb3JtYWxQYXJhbXNfMTkyLCBib2R5OiBib2R5XzE4NX0pO1xuICB9XG4gIGVuZm9yZXN0RnVuY3Rpb25FeHByZXNzaW9uKCkge1xuICAgIGxldCBuYW1lXzE5MyA9IG51bGwsIHBhcmFtc18xOTQsIGJvZHlfMTk1LCByZXN0XzE5NjtcbiAgICBsZXQgaXNHZW5lcmF0b3JfMTk3ID0gZmFsc2U7XG4gICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgbGV0IGxvb2thaGVhZF8xOTggPSB0aGlzLnBlZWsoKTtcbiAgICBpZiAodGhpcy5pc1B1bmN0dWF0b3IobG9va2FoZWFkXzE5OCwgXCIqXCIpKSB7XG4gICAgICBpc0dlbmVyYXRvcl8xOTcgPSB0cnVlO1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICBsb29rYWhlYWRfMTk4ID0gdGhpcy5wZWVrKCk7XG4gICAgfVxuICAgIGlmICghdGhpcy5pc1BhcmVucyhsb29rYWhlYWRfMTk4KSkge1xuICAgICAgbmFtZV8xOTMgPSB0aGlzLmVuZm9yZXN0QmluZGluZ0lkZW50aWZpZXIoKTtcbiAgICB9XG4gICAgcGFyYW1zXzE5NCA9IHRoaXMubWF0Y2hQYXJlbnMoKTtcbiAgICBib2R5XzE5NSA9IHRoaXMubWF0Y2hDdXJsaWVzKCk7XG4gICAgbGV0IGVuZl8xOTkgPSBuZXcgRW5mb3Jlc3RlcihwYXJhbXNfMTk0LCBMaXN0KCksIHRoaXMuY29udGV4dCk7XG4gICAgbGV0IGZvcm1hbFBhcmFtc18yMDAgPSBlbmZfMTk5LmVuZm9yZXN0Rm9ybWFsUGFyYW1ldGVycygpO1xuICAgIHJldHVybiBuZXcgVGVybShcIkZ1bmN0aW9uRXhwcmVzc2lvblwiLCB7bmFtZTogbmFtZV8xOTMsIGlzR2VuZXJhdG9yOiBpc0dlbmVyYXRvcl8xOTcsIHBhcmFtczogZm9ybWFsUGFyYW1zXzIwMCwgYm9keTogYm9keV8xOTV9KTtcbiAgfVxuICBlbmZvcmVzdEZ1bmN0aW9uRGVjbGFyYXRpb24oKSB7XG4gICAgbGV0IG5hbWVfMjAxLCBwYXJhbXNfMjAyLCBib2R5XzIwMywgcmVzdF8yMDQ7XG4gICAgbGV0IGlzR2VuZXJhdG9yXzIwNSA9IGZhbHNlO1xuICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIGxldCBsb29rYWhlYWRfMjA2ID0gdGhpcy5wZWVrKCk7XG4gICAgaWYgKHRoaXMuaXNQdW5jdHVhdG9yKGxvb2thaGVhZF8yMDYsIFwiKlwiKSkge1xuICAgICAgaXNHZW5lcmF0b3JfMjA1ID0gdHJ1ZTtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgICBuYW1lXzIwMSA9IHRoaXMuZW5mb3Jlc3RCaW5kaW5nSWRlbnRpZmllcigpO1xuICAgIHBhcmFtc18yMDIgPSB0aGlzLm1hdGNoUGFyZW5zKCk7XG4gICAgYm9keV8yMDMgPSB0aGlzLm1hdGNoQ3VybGllcygpO1xuICAgIGxldCBlbmZfMjA3ID0gbmV3IEVuZm9yZXN0ZXIocGFyYW1zXzIwMiwgTGlzdCgpLCB0aGlzLmNvbnRleHQpO1xuICAgIGxldCBmb3JtYWxQYXJhbXNfMjA4ID0gZW5mXzIwNy5lbmZvcmVzdEZvcm1hbFBhcmFtZXRlcnMoKTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJGdW5jdGlvbkRlY2xhcmF0aW9uXCIsIHtuYW1lOiBuYW1lXzIwMSwgaXNHZW5lcmF0b3I6IGlzR2VuZXJhdG9yXzIwNSwgcGFyYW1zOiBmb3JtYWxQYXJhbXNfMjA4LCBib2R5OiBib2R5XzIwM30pO1xuICB9XG4gIGVuZm9yZXN0Rm9ybWFsUGFyYW1ldGVycygpIHtcbiAgICBsZXQgaXRlbXNfMjA5ID0gW107XG4gICAgbGV0IHJlc3RfMjEwID0gbnVsbDtcbiAgICB3aGlsZSAodGhpcy5yZXN0LnNpemUgIT09IDApIHtcbiAgICAgIGxldCBsb29rYWhlYWQgPSB0aGlzLnBlZWsoKTtcbiAgICAgIGlmICh0aGlzLmlzUHVuY3R1YXRvcihsb29rYWhlYWQsIFwiLi4uXCIpKSB7XG4gICAgICAgIHRoaXMubWF0Y2hQdW5jdHVhdG9yKFwiLi4uXCIpO1xuICAgICAgICByZXN0XzIxMCA9IHRoaXMuZW5mb3Jlc3RCaW5kaW5nSWRlbnRpZmllcigpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGl0ZW1zXzIwOS5wdXNoKHRoaXMuZW5mb3Jlc3RQYXJhbSgpKTtcbiAgICAgIHRoaXMuY29uc3VtZUNvbW1hKCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgVGVybShcIkZvcm1hbFBhcmFtZXRlcnNcIiwge2l0ZW1zOiBMaXN0KGl0ZW1zXzIwOSksIHJlc3Q6IHJlc3RfMjEwfSk7XG4gIH1cbiAgZW5mb3Jlc3RQYXJhbSgpIHtcbiAgICByZXR1cm4gdGhpcy5lbmZvcmVzdEJpbmRpbmdFbGVtZW50KCk7XG4gIH1cbiAgZW5mb3Jlc3RVcGRhdGVFeHByZXNzaW9uKCkge1xuICAgIGxldCBvcGVyYXRvcl8yMTEgPSB0aGlzLm1hdGNoVW5hcnlPcGVyYXRvcigpO1xuICAgIHJldHVybiBuZXcgVGVybShcIlVwZGF0ZUV4cHJlc3Npb25cIiwge2lzUHJlZml4OiBmYWxzZSwgb3BlcmF0b3I6IG9wZXJhdG9yXzIxMS52YWwoKSwgb3BlcmFuZDogdGhpcy50cmFuc2Zvcm1EZXN0cnVjdHVyaW5nKHRoaXMudGVybSl9KTtcbiAgfVxuICBlbmZvcmVzdFVuYXJ5RXhwcmVzc2lvbigpIHtcbiAgICBsZXQgb3BlcmF0b3JfMjEyID0gdGhpcy5tYXRjaFVuYXJ5T3BlcmF0b3IoKTtcbiAgICB0aGlzLm9wQ3R4LnN0YWNrID0gdGhpcy5vcEN0eC5zdGFjay5wdXNoKHtwcmVjOiB0aGlzLm9wQ3R4LnByZWMsIGNvbWJpbmU6IHRoaXMub3BDdHguY29tYmluZX0pO1xuICAgIHRoaXMub3BDdHgucHJlYyA9IDE0O1xuICAgIHRoaXMub3BDdHguY29tYmluZSA9IHJpZ2h0VGVybV8yMTMgPT4ge1xuICAgICAgbGV0IHR5cGVfMjE0LCB0ZXJtXzIxNSwgaXNQcmVmaXhfMjE2O1xuICAgICAgaWYgKG9wZXJhdG9yXzIxMi52YWwoKSA9PT0gXCIrK1wiIHx8IG9wZXJhdG9yXzIxMi52YWwoKSA9PT0gXCItLVwiKSB7XG4gICAgICAgIHR5cGVfMjE0ID0gXCJVcGRhdGVFeHByZXNzaW9uXCI7XG4gICAgICAgIHRlcm1fMjE1ID0gdGhpcy50cmFuc2Zvcm1EZXN0cnVjdHVyaW5nKHJpZ2h0VGVybV8yMTMpO1xuICAgICAgICBpc1ByZWZpeF8yMTYgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHlwZV8yMTQgPSBcIlVuYXJ5RXhwcmVzc2lvblwiO1xuICAgICAgICBpc1ByZWZpeF8yMTYgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRlcm1fMjE1ID0gcmlnaHRUZXJtXzIxMztcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgVGVybSh0eXBlXzIxNCwge29wZXJhdG9yOiBvcGVyYXRvcl8yMTIudmFsKCksIG9wZXJhbmQ6IHRlcm1fMjE1LCBpc1ByZWZpeDogaXNQcmVmaXhfMjE2fSk7XG4gICAgfTtcbiAgICByZXR1cm4gRVhQUl9MT09QX09QRVJBVE9SXzM3O1xuICB9XG4gIGVuZm9yZXN0Q29uZGl0aW9uYWxFeHByZXNzaW9uKCkge1xuICAgIGxldCB0ZXN0XzIxNyA9IHRoaXMub3BDdHguY29tYmluZSh0aGlzLnRlcm0pO1xuICAgIGlmICh0aGlzLm9wQ3R4LnN0YWNrLnNpemUgPiAwKSB7XG4gICAgICBsZXQge3ByZWMsIGNvbWJpbmV9ID0gdGhpcy5vcEN0eC5zdGFjay5sYXN0KCk7XG4gICAgICB0aGlzLm9wQ3R4LnN0YWNrID0gdGhpcy5vcEN0eC5zdGFjay5wb3AoKTtcbiAgICAgIHRoaXMub3BDdHgucHJlYyA9IHByZWM7XG4gICAgICB0aGlzLm9wQ3R4LmNvbWJpbmUgPSBjb21iaW5lO1xuICAgIH1cbiAgICB0aGlzLm1hdGNoUHVuY3R1YXRvcihcIj9cIik7XG4gICAgbGV0IGVuZl8yMTggPSBuZXcgRW5mb3Jlc3Rlcih0aGlzLnJlc3QsIExpc3QoKSwgdGhpcy5jb250ZXh0KTtcbiAgICBsZXQgY29uc2VxdWVudF8yMTkgPSBlbmZfMjE4LmVuZm9yZXN0RXhwcmVzc2lvbkxvb3AoKTtcbiAgICBlbmZfMjE4Lm1hdGNoUHVuY3R1YXRvcihcIjpcIik7XG4gICAgZW5mXzIxOCA9IG5ldyBFbmZvcmVzdGVyKGVuZl8yMTgucmVzdCwgTGlzdCgpLCB0aGlzLmNvbnRleHQpO1xuICAgIGxldCBhbHRlcm5hdGVfMjIwID0gZW5mXzIxOC5lbmZvcmVzdEV4cHJlc3Npb25Mb29wKCk7XG4gICAgdGhpcy5yZXN0ID0gZW5mXzIxOC5yZXN0O1xuICAgIHJldHVybiBuZXcgVGVybShcIkNvbmRpdGlvbmFsRXhwcmVzc2lvblwiLCB7dGVzdDogdGVzdF8yMTcsIGNvbnNlcXVlbnQ6IGNvbnNlcXVlbnRfMjE5LCBhbHRlcm5hdGU6IGFsdGVybmF0ZV8yMjB9KTtcbiAgfVxuICBlbmZvcmVzdEJpbmFyeUV4cHJlc3Npb24oKSB7XG4gICAgbGV0IGxlZnRUZXJtXzIyMSA9IHRoaXMudGVybTtcbiAgICBsZXQgb3BTdHhfMjIyID0gdGhpcy5wZWVrKCk7XG4gICAgbGV0IG9wXzIyMyA9IG9wU3R4XzIyMi52YWwoKTtcbiAgICBsZXQgb3BQcmVjXzIyNCA9IGdldE9wZXJhdG9yUHJlYyhvcF8yMjMpO1xuICAgIGxldCBvcEFzc29jXzIyNSA9IGdldE9wZXJhdG9yQXNzb2Mob3BfMjIzKTtcbiAgICBpZiAob3BlcmF0b3JMdCh0aGlzLm9wQ3R4LnByZWMsIG9wUHJlY18yMjQsIG9wQXNzb2NfMjI1KSkge1xuICAgICAgdGhpcy5vcEN0eC5zdGFjayA9IHRoaXMub3BDdHguc3RhY2sucHVzaCh7cHJlYzogdGhpcy5vcEN0eC5wcmVjLCBjb21iaW5lOiB0aGlzLm9wQ3R4LmNvbWJpbmV9KTtcbiAgICAgIHRoaXMub3BDdHgucHJlYyA9IG9wUHJlY18yMjQ7XG4gICAgICB0aGlzLm9wQ3R4LmNvbWJpbmUgPSByaWdodFRlcm1fMjI2ID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBUZXJtKFwiQmluYXJ5RXhwcmVzc2lvblwiLCB7bGVmdDogbGVmdFRlcm1fMjIxLCBvcGVyYXRvcjogb3BTdHhfMjIyLCByaWdodDogcmlnaHRUZXJtXzIyNn0pO1xuICAgICAgfTtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgcmV0dXJuIEVYUFJfTE9PUF9PUEVSQVRPUl8zNztcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHRlcm0gPSB0aGlzLm9wQ3R4LmNvbWJpbmUobGVmdFRlcm1fMjIxKTtcbiAgICAgIGxldCB7cHJlYywgY29tYmluZX0gPSB0aGlzLm9wQ3R4LnN0YWNrLmxhc3QoKTtcbiAgICAgIHRoaXMub3BDdHguc3RhY2sgPSB0aGlzLm9wQ3R4LnN0YWNrLnBvcCgpO1xuICAgICAgdGhpcy5vcEN0eC5wcmVjID0gcHJlYztcbiAgICAgIHRoaXMub3BDdHguY29tYmluZSA9IGNvbWJpbmU7XG4gICAgICByZXR1cm4gdGVybTtcbiAgICB9XG4gIH1cbiAgZW5mb3Jlc3RUZW1wbGF0ZUVsZW1lbnRzKCkge1xuICAgIGxldCBsb29rYWhlYWRfMjI3ID0gdGhpcy5tYXRjaFRlbXBsYXRlKCk7XG4gICAgbGV0IGVsZW1lbnRzXzIyOCA9IGxvb2thaGVhZF8yMjcudG9rZW4uaXRlbXMubWFwKGl0XzIyOSA9PiB7XG4gICAgICBpZiAoaXRfMjI5IGluc3RhbmNlb2YgU3ludGF4ICYmIGl0XzIyOS5pc0RlbGltaXRlcigpKSB7XG4gICAgICAgIGxldCBlbmYgPSBuZXcgRW5mb3Jlc3RlcihpdF8yMjkuaW5uZXIoKSwgTGlzdCgpLCB0aGlzLmNvbnRleHQpO1xuICAgICAgICByZXR1cm4gZW5mLmVuZm9yZXN0KFwiZXhwcmVzc2lvblwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgVGVybShcIlRlbXBsYXRlRWxlbWVudFwiLCB7cmF3VmFsdWU6IGl0XzIyOS5zbGljZS50ZXh0fSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGVsZW1lbnRzXzIyODtcbiAgfVxuICBleHBhbmRNYWNybyhlbmZvcmVzdFR5cGVfMjMwKSB7XG4gICAgbGV0IG5hbWVfMjMxID0gdGhpcy5hZHZhbmNlKCk7XG4gICAgbGV0IHN5bnRheFRyYW5zZm9ybV8yMzIgPSB0aGlzLmdldENvbXBpbGV0aW1lVHJhbnNmb3JtKG5hbWVfMjMxKTtcbiAgICBpZiAoc3ludGF4VHJhbnNmb3JtXzIzMiA9PSBudWxsIHx8IHR5cGVvZiBzeW50YXhUcmFuc2Zvcm1fMjMyLnZhbHVlICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRocm93IHRoaXMuY3JlYXRlRXJyb3IobmFtZV8yMzEsIFwidGhlIG1hY3JvIG5hbWUgd2FzIG5vdCBib3VuZCB0byBhIHZhbHVlIHRoYXQgY291bGQgYmUgaW52b2tlZFwiKTtcbiAgICB9XG4gICAgbGV0IHVzZVNpdGVTY29wZV8yMzMgPSBmcmVzaFNjb3BlKFwidVwiKTtcbiAgICBsZXQgaW50cm9kdWNlZFNjb3BlXzIzNCA9IGZyZXNoU2NvcGUoXCJpXCIpO1xuICAgIHRoaXMuY29udGV4dC51c2VTY29wZSA9IHVzZVNpdGVTY29wZV8yMzM7XG4gICAgbGV0IGN0eF8yMzUgPSBuZXcgTWFjcm9Db250ZXh0KHRoaXMsIG5hbWVfMjMxLCB0aGlzLmNvbnRleHQsIHVzZVNpdGVTY29wZV8yMzMsIGludHJvZHVjZWRTY29wZV8yMzQpO1xuICAgIGxldCByZXN1bHRfMjM2ID0gc2FuaXRpemVSZXBsYWNlbWVudFZhbHVlcyhzeW50YXhUcmFuc2Zvcm1fMjMyLnZhbHVlLmNhbGwobnVsbCwgY3R4XzIzNSkpO1xuICAgIGlmICghTGlzdC5pc0xpc3QocmVzdWx0XzIzNikpIHtcbiAgICAgIHRocm93IHRoaXMuY3JlYXRlRXJyb3IobmFtZV8yMzEsIFwibWFjcm8gbXVzdCByZXR1cm4gYSBsaXN0IGJ1dCBnb3Q6IFwiICsgcmVzdWx0XzIzNik7XG4gICAgfVxuICAgIHJlc3VsdF8yMzYgPSByZXN1bHRfMjM2Lm1hcChzdHhfMjM3ID0+IHtcbiAgICAgIGlmICghKHN0eF8yMzcgJiYgdHlwZW9mIHN0eF8yMzcuYWRkU2NvcGUgPT09IFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgdGhyb3cgdGhpcy5jcmVhdGVFcnJvcihuYW1lXzIzMSwgXCJtYWNybyBtdXN0IHJldHVybiBzeW50YXggb2JqZWN0cyBvciB0ZXJtcyBidXQgZ290OiBcIiArIHN0eF8yMzcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0eF8yMzcuYWRkU2NvcGUoaW50cm9kdWNlZFNjb3BlXzIzNCwgdGhpcy5jb250ZXh0LmJpbmRpbmdzLCBBTExfUEhBU0VTLCB7ZmxpcDogdHJ1ZX0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRfMjM2O1xuICB9XG4gIGNvbnN1bWVTZW1pY29sb24oKSB7XG4gICAgbGV0IGxvb2thaGVhZF8yMzggPSB0aGlzLnBlZWsoKTtcbiAgICBpZiAobG9va2FoZWFkXzIzOCAmJiB0aGlzLmlzUHVuY3R1YXRvcihsb29rYWhlYWRfMjM4LCBcIjtcIikpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgfVxuICBjb25zdW1lQ29tbWEoKSB7XG4gICAgbGV0IGxvb2thaGVhZF8yMzkgPSB0aGlzLnBlZWsoKTtcbiAgICBpZiAobG9va2FoZWFkXzIzOSAmJiB0aGlzLmlzUHVuY3R1YXRvcihsb29rYWhlYWRfMjM5LCBcIixcIikpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgfVxuICBpc1Rlcm0odGVybV8yNDApIHtcbiAgICByZXR1cm4gdGVybV8yNDAgJiYgdGVybV8yNDAgaW5zdGFuY2VvZiBUZXJtO1xuICB9XG4gIGlzRU9GKHRlcm1fMjQxKSB7XG4gICAgcmV0dXJuIHRlcm1fMjQxICYmIHRlcm1fMjQxIGluc3RhbmNlb2YgU3ludGF4ICYmIHRlcm1fMjQxLmlzRU9GKCk7XG4gIH1cbiAgaXNJZGVudGlmaWVyKHRlcm1fMjQyLCB2YWxfMjQzID0gbnVsbCkge1xuICAgIHJldHVybiB0ZXJtXzI0MiAmJiB0ZXJtXzI0MiBpbnN0YW5jZW9mIFN5bnRheCAmJiB0ZXJtXzI0Mi5pc0lkZW50aWZpZXIoKSAmJiAodmFsXzI0MyA9PT0gbnVsbCB8fCB0ZXJtXzI0Mi52YWwoKSA9PT0gdmFsXzI0Myk7XG4gIH1cbiAgaXNQcm9wZXJ0eU5hbWUodGVybV8yNDQpIHtcbiAgICByZXR1cm4gdGhpcy5pc0lkZW50aWZpZXIodGVybV8yNDQpIHx8IHRoaXMuaXNLZXl3b3JkKHRlcm1fMjQ0KSB8fCB0aGlzLmlzTnVtZXJpY0xpdGVyYWwodGVybV8yNDQpIHx8IHRoaXMuaXNTdHJpbmdMaXRlcmFsKHRlcm1fMjQ0KSB8fCB0aGlzLmlzQnJhY2tldHModGVybV8yNDQpO1xuICB9XG4gIGlzTnVtZXJpY0xpdGVyYWwodGVybV8yNDUpIHtcbiAgICByZXR1cm4gdGVybV8yNDUgJiYgdGVybV8yNDUgaW5zdGFuY2VvZiBTeW50YXggJiYgdGVybV8yNDUuaXNOdW1lcmljTGl0ZXJhbCgpO1xuICB9XG4gIGlzU3RyaW5nTGl0ZXJhbCh0ZXJtXzI0Nikge1xuICAgIHJldHVybiB0ZXJtXzI0NiAmJiB0ZXJtXzI0NiBpbnN0YW5jZW9mIFN5bnRheCAmJiB0ZXJtXzI0Ni5pc1N0cmluZ0xpdGVyYWwoKTtcbiAgfVxuICBpc1RlbXBsYXRlKHRlcm1fMjQ3KSB7XG4gICAgcmV0dXJuIHRlcm1fMjQ3ICYmIHRlcm1fMjQ3IGluc3RhbmNlb2YgU3ludGF4ICYmIHRlcm1fMjQ3LmlzVGVtcGxhdGUoKTtcbiAgfVxuICBpc0Jvb2xlYW5MaXRlcmFsKHRlcm1fMjQ4KSB7XG4gICAgcmV0dXJuIHRlcm1fMjQ4ICYmIHRlcm1fMjQ4IGluc3RhbmNlb2YgU3ludGF4ICYmIHRlcm1fMjQ4LmlzQm9vbGVhbkxpdGVyYWwoKTtcbiAgfVxuICBpc051bGxMaXRlcmFsKHRlcm1fMjQ5KSB7XG4gICAgcmV0dXJuIHRlcm1fMjQ5ICYmIHRlcm1fMjQ5IGluc3RhbmNlb2YgU3ludGF4ICYmIHRlcm1fMjQ5LmlzTnVsbExpdGVyYWwoKTtcbiAgfVxuICBpc1JlZ3VsYXJFeHByZXNzaW9uKHRlcm1fMjUwKSB7XG4gICAgcmV0dXJuIHRlcm1fMjUwICYmIHRlcm1fMjUwIGluc3RhbmNlb2YgU3ludGF4ICYmIHRlcm1fMjUwLmlzUmVndWxhckV4cHJlc3Npb24oKTtcbiAgfVxuICBpc1BhcmVucyh0ZXJtXzI1MSkge1xuICAgIHJldHVybiB0ZXJtXzI1MSAmJiB0ZXJtXzI1MSBpbnN0YW5jZW9mIFN5bnRheCAmJiB0ZXJtXzI1MS5pc1BhcmVucygpO1xuICB9XG4gIGlzQnJhY2VzKHRlcm1fMjUyKSB7XG4gICAgcmV0dXJuIHRlcm1fMjUyICYmIHRlcm1fMjUyIGluc3RhbmNlb2YgU3ludGF4ICYmIHRlcm1fMjUyLmlzQnJhY2VzKCk7XG4gIH1cbiAgaXNCcmFja2V0cyh0ZXJtXzI1Mykge1xuICAgIHJldHVybiB0ZXJtXzI1MyAmJiB0ZXJtXzI1MyBpbnN0YW5jZW9mIFN5bnRheCAmJiB0ZXJtXzI1My5pc0JyYWNrZXRzKCk7XG4gIH1cbiAgaXNBc3NpZ24odGVybV8yNTQpIHtcbiAgICBpZiAodGhpcy5pc1B1bmN0dWF0b3IodGVybV8yNTQpKSB7XG4gICAgICBzd2l0Y2ggKHRlcm1fMjU0LnZhbCgpKSB7XG4gICAgICAgIGNhc2UgXCI9XCI6XG4gICAgICAgIGNhc2UgXCJ8PVwiOlxuICAgICAgICBjYXNlIFwiXj1cIjpcbiAgICAgICAgY2FzZSBcIiY9XCI6XG4gICAgICAgIGNhc2UgXCI8PD1cIjpcbiAgICAgICAgY2FzZSBcIj4+PVwiOlxuICAgICAgICBjYXNlIFwiPj4+PVwiOlxuICAgICAgICBjYXNlIFwiKz1cIjpcbiAgICAgICAgY2FzZSBcIi09XCI6XG4gICAgICAgIGNhc2UgXCIqPVwiOlxuICAgICAgICBjYXNlIFwiLz1cIjpcbiAgICAgICAgY2FzZSBcIiU9XCI6XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaXNLZXl3b3JkKHRlcm1fMjU1LCB2YWxfMjU2ID0gbnVsbCkge1xuICAgIHJldHVybiB0ZXJtXzI1NSAmJiB0ZXJtXzI1NSBpbnN0YW5jZW9mIFN5bnRheCAmJiB0ZXJtXzI1NS5pc0tleXdvcmQoKSAmJiAodmFsXzI1NiA9PT0gbnVsbCB8fCB0ZXJtXzI1NS52YWwoKSA9PT0gdmFsXzI1Nik7XG4gIH1cbiAgaXNQdW5jdHVhdG9yKHRlcm1fMjU3LCB2YWxfMjU4ID0gbnVsbCkge1xuICAgIHJldHVybiB0ZXJtXzI1NyAmJiB0ZXJtXzI1NyBpbnN0YW5jZW9mIFN5bnRheCAmJiB0ZXJtXzI1Ny5pc1B1bmN0dWF0b3IoKSAmJiAodmFsXzI1OCA9PT0gbnVsbCB8fCB0ZXJtXzI1Ny52YWwoKSA9PT0gdmFsXzI1OCk7XG4gIH1cbiAgaXNPcGVyYXRvcih0ZXJtXzI1OSkge1xuICAgIHJldHVybiB0ZXJtXzI1OSAmJiB0ZXJtXzI1OSBpbnN0YW5jZW9mIFN5bnRheCAmJiBpc09wZXJhdG9yKHRlcm1fMjU5KTtcbiAgfVxuICBpc1VwZGF0ZU9wZXJhdG9yKHRlcm1fMjYwKSB7XG4gICAgcmV0dXJuIHRlcm1fMjYwICYmIHRlcm1fMjYwIGluc3RhbmNlb2YgU3ludGF4ICYmIHRlcm1fMjYwLmlzUHVuY3R1YXRvcigpICYmICh0ZXJtXzI2MC52YWwoKSA9PT0gXCIrK1wiIHx8IHRlcm1fMjYwLnZhbCgpID09PSBcIi0tXCIpO1xuICB9XG4gIGlzRm5EZWNsVHJhbnNmb3JtKHRlcm1fMjYxKSB7XG4gICAgcmV0dXJuIHRlcm1fMjYxICYmIHRlcm1fMjYxIGluc3RhbmNlb2YgU3ludGF4ICYmIHRoaXMuY29udGV4dC5lbnYuZ2V0KHRlcm1fMjYxLnJlc29sdmUodGhpcy5jb250ZXh0LnBoYXNlKSkgPT09IEZ1bmN0aW9uRGVjbFRyYW5zZm9ybTtcbiAgfVxuICBpc1ZhckRlY2xUcmFuc2Zvcm0odGVybV8yNjIpIHtcbiAgICByZXR1cm4gdGVybV8yNjIgJiYgdGVybV8yNjIgaW5zdGFuY2VvZiBTeW50YXggJiYgdGhpcy5jb250ZXh0LmVudi5nZXQodGVybV8yNjIucmVzb2x2ZSh0aGlzLmNvbnRleHQucGhhc2UpKSA9PT0gVmFyaWFibGVEZWNsVHJhbnNmb3JtO1xuICB9XG4gIGlzTGV0RGVjbFRyYW5zZm9ybSh0ZXJtXzI2Mykge1xuICAgIHJldHVybiB0ZXJtXzI2MyAmJiB0ZXJtXzI2MyBpbnN0YW5jZW9mIFN5bnRheCAmJiB0aGlzLmNvbnRleHQuZW52LmdldCh0ZXJtXzI2My5yZXNvbHZlKHRoaXMuY29udGV4dC5waGFzZSkpID09PSBMZXREZWNsVHJhbnNmb3JtO1xuICB9XG4gIGlzQ29uc3REZWNsVHJhbnNmb3JtKHRlcm1fMjY0KSB7XG4gICAgcmV0dXJuIHRlcm1fMjY0ICYmIHRlcm1fMjY0IGluc3RhbmNlb2YgU3ludGF4ICYmIHRoaXMuY29udGV4dC5lbnYuZ2V0KHRlcm1fMjY0LnJlc29sdmUodGhpcy5jb250ZXh0LnBoYXNlKSkgPT09IENvbnN0RGVjbFRyYW5zZm9ybTtcbiAgfVxuICBpc1N5bnRheERlY2xUcmFuc2Zvcm0odGVybV8yNjUpIHtcbiAgICByZXR1cm4gdGVybV8yNjUgJiYgdGVybV8yNjUgaW5zdGFuY2VvZiBTeW50YXggJiYgdGhpcy5jb250ZXh0LmVudi5nZXQodGVybV8yNjUucmVzb2x2ZSh0aGlzLmNvbnRleHQucGhhc2UpKSA9PT0gU3ludGF4RGVjbFRyYW5zZm9ybTtcbiAgfVxuICBpc1N5bnRheHJlY0RlY2xUcmFuc2Zvcm0odGVybV8yNjYpIHtcbiAgICByZXR1cm4gdGVybV8yNjYgJiYgdGVybV8yNjYgaW5zdGFuY2VvZiBTeW50YXggJiYgdGhpcy5jb250ZXh0LmVudi5nZXQodGVybV8yNjYucmVzb2x2ZSh0aGlzLmNvbnRleHQucGhhc2UpKSA9PT0gU3ludGF4cmVjRGVjbFRyYW5zZm9ybTtcbiAgfVxuICBpc1N5bnRheFRlbXBsYXRlKHRlcm1fMjY3KSB7XG4gICAgcmV0dXJuIHRlcm1fMjY3ICYmIHRlcm1fMjY3IGluc3RhbmNlb2YgU3ludGF4ICYmIHRlcm1fMjY3LmlzU3ludGF4VGVtcGxhdGUoKTtcbiAgfVxuICBpc1N5bnRheFF1b3RlVHJhbnNmb3JtKHRlcm1fMjY4KSB7XG4gICAgcmV0dXJuIHRlcm1fMjY4ICYmIHRlcm1fMjY4IGluc3RhbmNlb2YgU3ludGF4ICYmIHRoaXMuY29udGV4dC5lbnYuZ2V0KHRlcm1fMjY4LnJlc29sdmUodGhpcy5jb250ZXh0LnBoYXNlKSkgPT09IFN5bnRheFF1b3RlVHJhbnNmb3JtO1xuICB9XG4gIGlzUmV0dXJuU3RtdFRyYW5zZm9ybSh0ZXJtXzI2OSkge1xuICAgIHJldHVybiB0ZXJtXzI2OSAmJiB0ZXJtXzI2OSBpbnN0YW5jZW9mIFN5bnRheCAmJiB0aGlzLmNvbnRleHQuZW52LmdldCh0ZXJtXzI2OS5yZXNvbHZlKHRoaXMuY29udGV4dC5waGFzZSkpID09PSBSZXR1cm5TdGF0ZW1lbnRUcmFuc2Zvcm07XG4gIH1cbiAgaXNXaGlsZVRyYW5zZm9ybSh0ZXJtXzI3MCkge1xuICAgIHJldHVybiB0ZXJtXzI3MCAmJiB0ZXJtXzI3MCBpbnN0YW5jZW9mIFN5bnRheCAmJiB0aGlzLmNvbnRleHQuZW52LmdldCh0ZXJtXzI3MC5yZXNvbHZlKHRoaXMuY29udGV4dC5waGFzZSkpID09PSBXaGlsZVRyYW5zZm9ybTtcbiAgfVxuICBpc0ZvclRyYW5zZm9ybSh0ZXJtXzI3MSkge1xuICAgIHJldHVybiB0ZXJtXzI3MSAmJiB0ZXJtXzI3MSBpbnN0YW5jZW9mIFN5bnRheCAmJiB0aGlzLmNvbnRleHQuZW52LmdldCh0ZXJtXzI3MS5yZXNvbHZlKHRoaXMuY29udGV4dC5waGFzZSkpID09PSBGb3JUcmFuc2Zvcm07XG4gIH1cbiAgaXNTd2l0Y2hUcmFuc2Zvcm0odGVybV8yNzIpIHtcbiAgICByZXR1cm4gdGVybV8yNzIgJiYgdGVybV8yNzIgaW5zdGFuY2VvZiBTeW50YXggJiYgdGhpcy5jb250ZXh0LmVudi5nZXQodGVybV8yNzIucmVzb2x2ZSh0aGlzLmNvbnRleHQucGhhc2UpKSA9PT0gU3dpdGNoVHJhbnNmb3JtO1xuICB9XG4gIGlzQnJlYWtUcmFuc2Zvcm0odGVybV8yNzMpIHtcbiAgICByZXR1cm4gdGVybV8yNzMgJiYgdGVybV8yNzMgaW5zdGFuY2VvZiBTeW50YXggJiYgdGhpcy5jb250ZXh0LmVudi5nZXQodGVybV8yNzMucmVzb2x2ZSh0aGlzLmNvbnRleHQucGhhc2UpKSA9PT0gQnJlYWtUcmFuc2Zvcm07XG4gIH1cbiAgaXNDb250aW51ZVRyYW5zZm9ybSh0ZXJtXzI3NCkge1xuICAgIHJldHVybiB0ZXJtXzI3NCAmJiB0ZXJtXzI3NCBpbnN0YW5jZW9mIFN5bnRheCAmJiB0aGlzLmNvbnRleHQuZW52LmdldCh0ZXJtXzI3NC5yZXNvbHZlKHRoaXMuY29udGV4dC5waGFzZSkpID09PSBDb250aW51ZVRyYW5zZm9ybTtcbiAgfVxuICBpc0RvVHJhbnNmb3JtKHRlcm1fMjc1KSB7XG4gICAgcmV0dXJuIHRlcm1fMjc1ICYmIHRlcm1fMjc1IGluc3RhbmNlb2YgU3ludGF4ICYmIHRoaXMuY29udGV4dC5lbnYuZ2V0KHRlcm1fMjc1LnJlc29sdmUodGhpcy5jb250ZXh0LnBoYXNlKSkgPT09IERvVHJhbnNmb3JtO1xuICB9XG4gIGlzRGVidWdnZXJUcmFuc2Zvcm0odGVybV8yNzYpIHtcbiAgICByZXR1cm4gdGVybV8yNzYgJiYgdGVybV8yNzYgaW5zdGFuY2VvZiBTeW50YXggJiYgdGhpcy5jb250ZXh0LmVudi5nZXQodGVybV8yNzYucmVzb2x2ZSh0aGlzLmNvbnRleHQucGhhc2UpKSA9PT0gRGVidWdnZXJUcmFuc2Zvcm07XG4gIH1cbiAgaXNXaXRoVHJhbnNmb3JtKHRlcm1fMjc3KSB7XG4gICAgcmV0dXJuIHRlcm1fMjc3ICYmIHRlcm1fMjc3IGluc3RhbmNlb2YgU3ludGF4ICYmIHRoaXMuY29udGV4dC5lbnYuZ2V0KHRlcm1fMjc3LnJlc29sdmUodGhpcy5jb250ZXh0LnBoYXNlKSkgPT09IFdpdGhUcmFuc2Zvcm07XG4gIH1cbiAgaXNUcnlUcmFuc2Zvcm0odGVybV8yNzgpIHtcbiAgICByZXR1cm4gdGVybV8yNzggJiYgdGVybV8yNzggaW5zdGFuY2VvZiBTeW50YXggJiYgdGhpcy5jb250ZXh0LmVudi5nZXQodGVybV8yNzgucmVzb2x2ZSh0aGlzLmNvbnRleHQucGhhc2UpKSA9PT0gVHJ5VHJhbnNmb3JtO1xuICB9XG4gIGlzVGhyb3dUcmFuc2Zvcm0odGVybV8yNzkpIHtcbiAgICByZXR1cm4gdGVybV8yNzkgJiYgdGVybV8yNzkgaW5zdGFuY2VvZiBTeW50YXggJiYgdGhpcy5jb250ZXh0LmVudi5nZXQodGVybV8yNzkucmVzb2x2ZSh0aGlzLmNvbnRleHQucGhhc2UpKSA9PT0gVGhyb3dUcmFuc2Zvcm07XG4gIH1cbiAgaXNJZlRyYW5zZm9ybSh0ZXJtXzI4MCkge1xuICAgIHJldHVybiB0ZXJtXzI4MCAmJiB0ZXJtXzI4MCBpbnN0YW5jZW9mIFN5bnRheCAmJiB0aGlzLmNvbnRleHQuZW52LmdldCh0ZXJtXzI4MC5yZXNvbHZlKHRoaXMuY29udGV4dC5waGFzZSkpID09PSBJZlRyYW5zZm9ybTtcbiAgfVxuICBpc05ld1RyYW5zZm9ybSh0ZXJtXzI4MSkge1xuICAgIHJldHVybiB0ZXJtXzI4MSAmJiB0ZXJtXzI4MSBpbnN0YW5jZW9mIFN5bnRheCAmJiB0aGlzLmNvbnRleHQuZW52LmdldCh0ZXJtXzI4MS5yZXNvbHZlKHRoaXMuY29udGV4dC5waGFzZSkpID09PSBOZXdUcmFuc2Zvcm07XG4gIH1cbiAgaXNDb21waWxldGltZVRyYW5zZm9ybSh0ZXJtXzI4Mikge1xuICAgIHJldHVybiB0ZXJtXzI4MiAmJiB0ZXJtXzI4MiBpbnN0YW5jZW9mIFN5bnRheCAmJiAodGhpcy5jb250ZXh0LmVudi5nZXQodGVybV8yODIucmVzb2x2ZSh0aGlzLmNvbnRleHQucGhhc2UpKSBpbnN0YW5jZW9mIENvbXBpbGV0aW1lVHJhbnNmb3JtIHx8IHRoaXMuY29udGV4dC5zdG9yZS5nZXQodGVybV8yODIucmVzb2x2ZSh0aGlzLmNvbnRleHQucGhhc2UpKSBpbnN0YW5jZW9mIENvbXBpbGV0aW1lVHJhbnNmb3JtKTtcbiAgfVxuICBnZXRDb21waWxldGltZVRyYW5zZm9ybSh0ZXJtXzI4Mykge1xuICAgIGlmICh0aGlzLmNvbnRleHQuZW52Lmhhcyh0ZXJtXzI4My5yZXNvbHZlKHRoaXMuY29udGV4dC5waGFzZSkpKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmVudi5nZXQodGVybV8yODMucmVzb2x2ZSh0aGlzLmNvbnRleHQucGhhc2UpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC5zdG9yZS5nZXQodGVybV8yODMucmVzb2x2ZSh0aGlzLmNvbnRleHQucGhhc2UpKTtcbiAgfVxuICBsaW5lTnVtYmVyRXEoYV8yODQsIGJfMjg1KSB7XG4gICAgaWYgKCEoYV8yODQgJiYgYl8yODUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGFzc2VydChhXzI4NCBpbnN0YW5jZW9mIFN5bnRheCwgXCJleHBlY3RpbmcgYSBzeW50YXggb2JqZWN0XCIpO1xuICAgIGFzc2VydChiXzI4NSBpbnN0YW5jZW9mIFN5bnRheCwgXCJleHBlY3RpbmcgYSBzeW50YXggb2JqZWN0XCIpO1xuICAgIHJldHVybiBhXzI4NC5saW5lTnVtYmVyKCkgPT09IGJfMjg1LmxpbmVOdW1iZXIoKTtcbiAgfVxuICBtYXRjaElkZW50aWZpZXIodmFsXzI4Nikge1xuICAgIGxldCBsb29rYWhlYWRfMjg3ID0gdGhpcy5hZHZhbmNlKCk7XG4gICAgaWYgKHRoaXMuaXNJZGVudGlmaWVyKGxvb2thaGVhZF8yODcpKSB7XG4gICAgICByZXR1cm4gbG9va2FoZWFkXzI4NztcbiAgICB9XG4gICAgdGhyb3cgdGhpcy5jcmVhdGVFcnJvcihsb29rYWhlYWRfMjg3LCBcImV4cGVjdGluZyBhbiBpZGVudGlmaWVyXCIpO1xuICB9XG4gIG1hdGNoS2V5d29yZCh2YWxfMjg4KSB7XG4gICAgbGV0IGxvb2thaGVhZF8yODkgPSB0aGlzLmFkdmFuY2UoKTtcbiAgICBpZiAodGhpcy5pc0tleXdvcmQobG9va2FoZWFkXzI4OSwgdmFsXzI4OCkpIHtcbiAgICAgIHJldHVybiBsb29rYWhlYWRfMjg5O1xuICAgIH1cbiAgICB0aHJvdyB0aGlzLmNyZWF0ZUVycm9yKGxvb2thaGVhZF8yODksIFwiZXhwZWN0aW5nIFwiICsgdmFsXzI4OCk7XG4gIH1cbiAgbWF0Y2hMaXRlcmFsKCkge1xuICAgIGxldCBsb29rYWhlYWRfMjkwID0gdGhpcy5hZHZhbmNlKCk7XG4gICAgaWYgKHRoaXMuaXNOdW1lcmljTGl0ZXJhbChsb29rYWhlYWRfMjkwKSB8fCB0aGlzLmlzU3RyaW5nTGl0ZXJhbChsb29rYWhlYWRfMjkwKSB8fCB0aGlzLmlzQm9vbGVhbkxpdGVyYWwobG9va2FoZWFkXzI5MCkgfHwgdGhpcy5pc051bGxMaXRlcmFsKGxvb2thaGVhZF8yOTApIHx8IHRoaXMuaXNUZW1wbGF0ZShsb29rYWhlYWRfMjkwKSB8fCB0aGlzLmlzUmVndWxhckV4cHJlc3Npb24obG9va2FoZWFkXzI5MCkpIHtcbiAgICAgIHJldHVybiBsb29rYWhlYWRfMjkwO1xuICAgIH1cbiAgICB0aHJvdyB0aGlzLmNyZWF0ZUVycm9yKGxvb2thaGVhZF8yOTAsIFwiZXhwZWN0aW5nIGEgbGl0ZXJhbFwiKTtcbiAgfVxuICBtYXRjaFN0cmluZ0xpdGVyYWwoKSB7XG4gICAgbGV0IGxvb2thaGVhZF8yOTEgPSB0aGlzLmFkdmFuY2UoKTtcbiAgICBpZiAodGhpcy5pc1N0cmluZ0xpdGVyYWwobG9va2FoZWFkXzI5MSkpIHtcbiAgICAgIHJldHVybiBsb29rYWhlYWRfMjkxO1xuICAgIH1cbiAgICB0aHJvdyB0aGlzLmNyZWF0ZUVycm9yKGxvb2thaGVhZF8yOTEsIFwiZXhwZWN0aW5nIGEgc3RyaW5nIGxpdGVyYWxcIik7XG4gIH1cbiAgbWF0Y2hUZW1wbGF0ZSgpIHtcbiAgICBsZXQgbG9va2FoZWFkXzI5MiA9IHRoaXMuYWR2YW5jZSgpO1xuICAgIGlmICh0aGlzLmlzVGVtcGxhdGUobG9va2FoZWFkXzI5MikpIHtcbiAgICAgIHJldHVybiBsb29rYWhlYWRfMjkyO1xuICAgIH1cbiAgICB0aHJvdyB0aGlzLmNyZWF0ZUVycm9yKGxvb2thaGVhZF8yOTIsIFwiZXhwZWN0aW5nIGEgdGVtcGxhdGUgbGl0ZXJhbFwiKTtcbiAgfVxuICBtYXRjaFBhcmVucygpIHtcbiAgICBsZXQgbG9va2FoZWFkXzI5MyA9IHRoaXMuYWR2YW5jZSgpO1xuICAgIGlmICh0aGlzLmlzUGFyZW5zKGxvb2thaGVhZF8yOTMpKSB7XG4gICAgICByZXR1cm4gbG9va2FoZWFkXzI5My5pbm5lcigpO1xuICAgIH1cbiAgICB0aHJvdyB0aGlzLmNyZWF0ZUVycm9yKGxvb2thaGVhZF8yOTMsIFwiZXhwZWN0aW5nIHBhcmVuc1wiKTtcbiAgfVxuICBtYXRjaEN1cmxpZXMoKSB7XG4gICAgbGV0IGxvb2thaGVhZF8yOTQgPSB0aGlzLmFkdmFuY2UoKTtcbiAgICBpZiAodGhpcy5pc0JyYWNlcyhsb29rYWhlYWRfMjk0KSkge1xuICAgICAgcmV0dXJuIGxvb2thaGVhZF8yOTQuaW5uZXIoKTtcbiAgICB9XG4gICAgdGhyb3cgdGhpcy5jcmVhdGVFcnJvcihsb29rYWhlYWRfMjk0LCBcImV4cGVjdGluZyBjdXJseSBicmFjZXNcIik7XG4gIH1cbiAgbWF0Y2hTcXVhcmVzKCkge1xuICAgIGxldCBsb29rYWhlYWRfMjk1ID0gdGhpcy5hZHZhbmNlKCk7XG4gICAgaWYgKHRoaXMuaXNCcmFja2V0cyhsb29rYWhlYWRfMjk1KSkge1xuICAgICAgcmV0dXJuIGxvb2thaGVhZF8yOTUuaW5uZXIoKTtcbiAgICB9XG4gICAgdGhyb3cgdGhpcy5jcmVhdGVFcnJvcihsb29rYWhlYWRfMjk1LCBcImV4cGVjdGluZyBzcWF1cmUgYnJhY2VzXCIpO1xuICB9XG4gIG1hdGNoVW5hcnlPcGVyYXRvcigpIHtcbiAgICBsZXQgbG9va2FoZWFkXzI5NiA9IHRoaXMuYWR2YW5jZSgpO1xuICAgIGlmIChpc1VuYXJ5T3BlcmF0b3IobG9va2FoZWFkXzI5NikpIHtcbiAgICAgIHJldHVybiBsb29rYWhlYWRfMjk2O1xuICAgIH1cbiAgICB0aHJvdyB0aGlzLmNyZWF0ZUVycm9yKGxvb2thaGVhZF8yOTYsIFwiZXhwZWN0aW5nIGEgdW5hcnkgb3BlcmF0b3JcIik7XG4gIH1cbiAgbWF0Y2hQdW5jdHVhdG9yKHZhbF8yOTcpIHtcbiAgICBsZXQgbG9va2FoZWFkXzI5OCA9IHRoaXMuYWR2YW5jZSgpO1xuICAgIGlmICh0aGlzLmlzUHVuY3R1YXRvcihsb29rYWhlYWRfMjk4KSkge1xuICAgICAgaWYgKHR5cGVvZiB2YWxfMjk3ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmIChsb29rYWhlYWRfMjk4LnZhbCgpID09PSB2YWxfMjk3KSB7XG4gICAgICAgICAgcmV0dXJuIGxvb2thaGVhZF8yOTg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5jcmVhdGVFcnJvcihsb29rYWhlYWRfMjk4LCBcImV4cGVjdGluZyBhIFwiICsgdmFsXzI5NyArIFwiIHB1bmN0dWF0b3JcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBsb29rYWhlYWRfMjk4O1xuICAgIH1cbiAgICB0aHJvdyB0aGlzLmNyZWF0ZUVycm9yKGxvb2thaGVhZF8yOTgsIFwiZXhwZWN0aW5nIGEgcHVuY3R1YXRvclwiKTtcbiAgfVxuICBjcmVhdGVFcnJvcihzdHhfMjk5LCBtZXNzYWdlXzMwMCkge1xuICAgIGxldCBjdHhfMzAxID0gXCJcIjtcbiAgICBsZXQgb2ZmZW5kaW5nXzMwMiA9IHN0eF8yOTk7XG4gICAgaWYgKHRoaXMucmVzdC5zaXplID4gMCkge1xuICAgICAgY3R4XzMwMSA9IHRoaXMucmVzdC5zbGljZSgwLCAyMCkubWFwKHRlcm1fMzAzID0+IHtcbiAgICAgICAgaWYgKHRlcm1fMzAzLmlzRGVsaW1pdGVyKCkpIHtcbiAgICAgICAgICByZXR1cm4gdGVybV8zMDMuaW5uZXIoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTGlzdC5vZih0ZXJtXzMwMyk7XG4gICAgICB9KS5mbGF0dGVuKCkubWFwKHNfMzA0ID0+IHtcbiAgICAgICAgaWYgKHNfMzA0ID09PSBvZmZlbmRpbmdfMzAyKSB7XG4gICAgICAgICAgcmV0dXJuIFwiX19cIiArIHNfMzA0LnZhbCgpICsgXCJfX1wiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzXzMwNC52YWwoKTtcbiAgICAgIH0pLmpvaW4oXCIgXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdHhfMzAxID0gb2ZmZW5kaW5nXzMwMi50b1N0cmluZygpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEVycm9yKG1lc3NhZ2VfMzAwICsgXCJcXG5cIiArIGN0eF8zMDEpO1xuICB9XG59XG4iXX0=