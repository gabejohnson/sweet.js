"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _immutable = require("immutable");

var _terms = require("./terms");

var _terms2 = _interopRequireDefault(_terms);

var _scope = require("./scope");

var _applyScopeInParamsReducer = require("./apply-scope-in-params-reducer");

var _applyScopeInParamsReducer2 = _interopRequireDefault(_applyScopeInParamsReducer);

var _shiftReducer = require("shift-reducer");

var _shiftReducer2 = _interopRequireDefault(_shiftReducer);

var _compiler = require("./compiler");

var _compiler2 = _interopRequireDefault(_compiler);

var _syntax = require("./syntax");

var _syntax2 = _interopRequireDefault(_syntax);

var _serializer = require("./serializer");

var _enforester = require("./enforester");

var _errors = require("./errors");

var _templateProcessor = require("./template-processor.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TermExpander = function () {
  function TermExpander(context_771) {
    _classCallCheck(this, TermExpander);

    this.context = context_771;
  }

  _createClass(TermExpander, [{
    key: "expand",
    value: function expand(term_772) {
      var field_773 = "expand" + term_772.type;
      if (typeof this[field_773] === "function") {
        return this[field_773](term_772);
      }
      (0, _errors.assert)(false, "expand not implemented yet for: " + term_772.type);
    }
  }, {
    key: "expandTemplateExpression",
    value: function expandTemplateExpression(term_774) {
      return new _terms2.default("TemplateExpression", { tag: term_774.tag == null ? null : this.expand(term_774.tag), elements: term_774.elements.toArray() });
    }
  }, {
    key: "expandBreakStatement",
    value: function expandBreakStatement(term_775) {
      return new _terms2.default("BreakStatement", { label: term_775.label ? term_775.label.val() : null });
    }
  }, {
    key: "expandDoWhileStatement",
    value: function expandDoWhileStatement(term_776) {
      return new _terms2.default("DoWhileStatement", { body: this.expand(term_776.body), test: this.expand(term_776.test) });
    }
  }, {
    key: "expandWithStatement",
    value: function expandWithStatement(term_777) {
      return new _terms2.default("WithStatement", { body: this.expand(term_777.body), object: this.expand(term_777.object) });
    }
  }, {
    key: "expandDebuggerStatement",
    value: function expandDebuggerStatement(term_778) {
      return term_778;
    }
  }, {
    key: "expandContinueStatement",
    value: function expandContinueStatement(term_779) {
      return new _terms2.default("ContinueStatement", { label: term_779.label ? term_779.label.val() : null });
    }
  }, {
    key: "expandSwitchStatementWithDefault",
    value: function expandSwitchStatementWithDefault(term_780) {
      var _this = this;

      return new _terms2.default("SwitchStatementWithDefault", { discriminant: this.expand(term_780.discriminant), preDefaultCases: term_780.preDefaultCases.map(function (c_781) {
          return _this.expand(c_781);
        }).toArray(), defaultCase: this.expand(term_780.defaultCase), postDefaultCases: term_780.postDefaultCases.map(function (c_782) {
          return _this.expand(c_782);
        }).toArray() });
    }
  }, {
    key: "expandComputedMemberExpression",
    value: function expandComputedMemberExpression(term_783) {
      return new _terms2.default("ComputedMemberExpression", { object: this.expand(term_783.object), expression: this.expand(term_783.expression) });
    }
  }, {
    key: "expandSwitchStatement",
    value: function expandSwitchStatement(term_784) {
      var _this2 = this;

      return new _terms2.default("SwitchStatement", { discriminant: this.expand(term_784.discriminant), cases: term_784.cases.map(function (c_785) {
          return _this2.expand(c_785);
        }).toArray() });
    }
  }, {
    key: "expandFormalParameters",
    value: function expandFormalParameters(term_786) {
      var _this3 = this;

      var rest_787 = term_786.rest == null ? null : this.expand(term_786.rest);
      return new _terms2.default("FormalParameters", { items: term_786.items.map(function (i_788) {
          return _this3.expand(i_788);
        }), rest: rest_787 });
    }
  }, {
    key: "expandArrowExpression",
    value: function expandArrowExpression(term_789) {
      return this.doFunctionExpansion(term_789, "ArrowExpression");
    }
  }, {
    key: "expandSwitchDefault",
    value: function expandSwitchDefault(term_790) {
      var _this4 = this;

      return new _terms2.default("SwitchDefault", { consequent: term_790.consequent.map(function (c_791) {
          return _this4.expand(c_791);
        }).toArray() });
    }
  }, {
    key: "expandSwitchCase",
    value: function expandSwitchCase(term_792) {
      var _this5 = this;

      return new _terms2.default("SwitchCase", { test: this.expand(term_792.test), consequent: term_792.consequent.map(function (c_793) {
          return _this5.expand(c_793);
        }).toArray() });
    }
  }, {
    key: "expandForInStatement",
    value: function expandForInStatement(term_794) {
      return new _terms2.default("ForInStatement", { left: this.expand(term_794.left), right: this.expand(term_794.right), body: this.expand(term_794.body) });
    }
  }, {
    key: "expandTryCatchStatement",
    value: function expandTryCatchStatement(term_795) {
      return new _terms2.default("TryCatchStatement", { body: this.expand(term_795.body), catchClause: this.expand(term_795.catchClause) });
    }
  }, {
    key: "expandTryFinallyStatement",
    value: function expandTryFinallyStatement(term_796) {
      var catchClause_797 = term_796.catchClause == null ? null : this.expand(term_796.catchClause);
      return new _terms2.default("TryFinallyStatement", { body: this.expand(term_796.body), catchClause: catchClause_797, finalizer: this.expand(term_796.finalizer) });
    }
  }, {
    key: "expandCatchClause",
    value: function expandCatchClause(term_798) {
      return new _terms2.default("CatchClause", { binding: this.expand(term_798.binding), body: this.expand(term_798.body) });
    }
  }, {
    key: "expandThrowStatement",
    value: function expandThrowStatement(term_799) {
      return new _terms2.default("ThrowStatement", { expression: this.expand(term_799.expression) });
    }
  }, {
    key: "expandForOfStatement",
    value: function expandForOfStatement(term_800) {
      return new _terms2.default("ForOfStatement", { left: this.expand(term_800.left), right: this.expand(term_800.right), body: this.expand(term_800.body) });
    }
  }, {
    key: "expandBindingIdentifier",
    value: function expandBindingIdentifier(term_801) {
      return term_801;
    }
  }, {
    key: "expandBindingPropertyIdentifier",
    value: function expandBindingPropertyIdentifier(term_802) {
      return term_802;
    }
  }, {
    key: "expandBindingPropertyProperty",
    value: function expandBindingPropertyProperty(term_803) {
      return new _terms2.default("BindingPropertyProperty", { name: this.expand(term_803.name), binding: this.expand(term_803.binding) });
    }
  }, {
    key: "expandComputedPropertyName",
    value: function expandComputedPropertyName(term_804) {
      return new _terms2.default("ComputedPropertyName", { expression: this.expand(term_804.expression) });
    }
  }, {
    key: "expandObjectBinding",
    value: function expandObjectBinding(term_805) {
      var _this6 = this;

      return new _terms2.default("ObjectBinding", { properties: term_805.properties.map(function (t_806) {
          return _this6.expand(t_806);
        }).toArray() });
    }
  }, {
    key: "expandArrayBinding",
    value: function expandArrayBinding(term_807) {
      var _this7 = this;

      var restElement_808 = term_807.restElement == null ? null : this.expand(term_807.restElement);
      return new _terms2.default("ArrayBinding", { elements: term_807.elements.map(function (t_809) {
          return t_809 == null ? null : _this7.expand(t_809);
        }).toArray(), restElement: restElement_808 });
    }
  }, {
    key: "expandBindingWithDefault",
    value: function expandBindingWithDefault(term_810) {
      return new _terms2.default("BindingWithDefault", { binding: this.expand(term_810.binding), init: this.expand(term_810.init) });
    }
  }, {
    key: "expandShorthandProperty",
    value: function expandShorthandProperty(term_811) {
      return new _terms2.default("DataProperty", { name: new _terms2.default("StaticPropertyName", { value: term_811.name }), expression: new _terms2.default("IdentifierExpression", { name: term_811.name }) });
    }
  }, {
    key: "expandForStatement",
    value: function expandForStatement(term_812) {
      var init_813 = term_812.init == null ? null : this.expand(term_812.init);
      var test_814 = term_812.test == null ? null : this.expand(term_812.test);
      var update_815 = term_812.update == null ? null : this.expand(term_812.update);
      var body_816 = this.expand(term_812.body);
      return new _terms2.default("ForStatement", { init: init_813, test: test_814, update: update_815, body: body_816 });
    }
  }, {
    key: "expandYieldExpression",
    value: function expandYieldExpression(term_817) {
      var expr_818 = term_817.expression == null ? null : this.expand(term_817.expression);
      return new _terms2.default("YieldExpression", { expression: expr_818 });
    }
  }, {
    key: "expandYieldGeneratorExpression",
    value: function expandYieldGeneratorExpression(term_819) {
      var expr_820 = term_819.expression == null ? null : this.expand(term_819.expression);
      return new _terms2.default("YieldGeneratorExpression", { expression: expr_820 });
    }
  }, {
    key: "expandWhileStatement",
    value: function expandWhileStatement(term_821) {
      return new _terms2.default("WhileStatement", { test: this.expand(term_821.test), body: this.expand(term_821.body) });
    }
  }, {
    key: "expandIfStatement",
    value: function expandIfStatement(term_822) {
      var consequent_823 = term_822.consequent == null ? null : this.expand(term_822.consequent);
      var alternate_824 = term_822.alternate == null ? null : this.expand(term_822.alternate);
      return new _terms2.default("IfStatement", { test: this.expand(term_822.test), consequent: consequent_823, alternate: alternate_824 });
    }
  }, {
    key: "expandBlockStatement",
    value: function expandBlockStatement(term_825) {
      return new _terms2.default("BlockStatement", { block: this.expand(term_825.block) });
    }
  }, {
    key: "expandBlock",
    value: function expandBlock(term_826) {
      var _this8 = this;

      return new _terms2.default("Block", { statements: term_826.statements.map(function (s_827) {
          return _this8.expand(s_827);
        }).toArray() });
    }
  }, {
    key: "expandVariableDeclarationStatement",
    value: function expandVariableDeclarationStatement(term_828) {
      return new _terms2.default("VariableDeclarationStatement", { declaration: this.expand(term_828.declaration) });
    }
  }, {
    key: "expandReturnStatement",
    value: function expandReturnStatement(term_829) {
      if (term_829.expression == null) {
        return term_829;
      }
      return new _terms2.default("ReturnStatement", { expression: this.expand(term_829.expression) });
    }
  }, {
    key: "expandClassDeclaration",
    value: function expandClassDeclaration(term_830) {
      var _this9 = this;

      return new _terms2.default("ClassDeclaration", { name: term_830.name == null ? null : this.expand(term_830.name), super: term_830.super == null ? null : this.expand(term_830.super), elements: term_830.elements.map(function (el_831) {
          return _this9.expand(el_831);
        }).toArray() });
    }
  }, {
    key: "expandClassExpression",
    value: function expandClassExpression(term_832) {
      var _this10 = this;

      return new _terms2.default("ClassExpression", { name: term_832.name == null ? null : this.expand(term_832.name), super: term_832.super == null ? null : this.expand(term_832.super), elements: term_832.elements.map(function (el_833) {
          return _this10.expand(el_833);
        }).toArray() });
    }
  }, {
    key: "expandClassElement",
    value: function expandClassElement(term_834) {
      return new _terms2.default("ClassElement", { isStatic: term_834.isStatic, method: this.expand(term_834.method) });
    }
  }, {
    key: "expandThisExpression",
    value: function expandThisExpression(term_835) {
      return term_835;
    }
  }, {
    key: "expandSyntaxTemplate",
    value: function expandSyntaxTemplate(term_836) {
      var _this11 = this;

      var r_837 = (0, _templateProcessor.processTemplate)(term_836.template.inner());
      var str_838 = _syntax2.default.fromString(_serializer.serializer.write(r_837.template));
      var callee_839 = new _terms2.default("IdentifierExpression", { name: _syntax2.default.fromIdentifier("syntaxTemplate") });
      var expandedInterps_840 = r_837.interp.map(function (i_842) {
        var enf_843 = new _enforester.Enforester(i_842, (0, _immutable.List)(), _this11.context);
        return _this11.expand(enf_843.enforest("expression"));
      });
      var args_841 = _immutable.List.of(new _terms2.default("LiteralStringExpression", { value: str_838 })).concat(expandedInterps_840);
      return new _terms2.default("CallExpression", { callee: callee_839, arguments: args_841 });
    }
  }, {
    key: "expandSyntaxQuote",
    value: function expandSyntaxQuote(term_844) {
      var str_845 = new _terms2.default("LiteralStringExpression", { value: _syntax2.default.fromString(_serializer.serializer.write(term_844.name)) });
      return new _terms2.default("TemplateExpression", { tag: term_844.template.tag, elements: term_844.template.elements.push(str_845).push(new _terms2.default("TemplateElement", { rawValue: "" })).toArray() });
    }
  }, {
    key: "expandStaticMemberExpression",
    value: function expandStaticMemberExpression(term_846) {
      return new _terms2.default("StaticMemberExpression", { object: this.expand(term_846.object), property: term_846.property });
    }
  }, {
    key: "expandArrayExpression",
    value: function expandArrayExpression(term_847) {
      var _this12 = this;

      return new _terms2.default("ArrayExpression", { elements: term_847.elements.map(function (t_848) {
          return t_848 == null ? t_848 : _this12.expand(t_848);
        }) });
    }
  }, {
    key: "expandImport",
    value: function expandImport(term_849) {
      return term_849;
    }
  }, {
    key: "expandImportNamespace",
    value: function expandImportNamespace(term_850) {
      return term_850;
    }
  }, {
    key: "expandExport",
    value: function expandExport(term_851) {
      return new _terms2.default("Export", { declaration: this.expand(term_851.declaration) });
    }
  }, {
    key: "expandExportDefault",
    value: function expandExportDefault(term_852) {
      return new _terms2.default("ExportDefault", { body: this.expand(term_852.body) });
    }
  }, {
    key: "expandExportFrom",
    value: function expandExportFrom(term_853) {
      return term_853;
    }
  }, {
    key: "expandExportAllFrom",
    value: function expandExportAllFrom(term_854) {
      return term_854;
    }
  }, {
    key: "expandExportSpecifier",
    value: function expandExportSpecifier(term_855) {
      return term_855;
    }
  }, {
    key: "expandStaticPropertyName",
    value: function expandStaticPropertyName(term_856) {
      return term_856;
    }
  }, {
    key: "expandDataProperty",
    value: function expandDataProperty(term_857) {
      return new _terms2.default("DataProperty", { name: this.expand(term_857.name), expression: this.expand(term_857.expression) });
    }
  }, {
    key: "expandObjectExpression",
    value: function expandObjectExpression(term_858) {
      var _this13 = this;

      return new _terms2.default("ObjectExpression", { properties: term_858.properties.map(function (t_859) {
          return _this13.expand(t_859);
        }) });
    }
  }, {
    key: "expandVariableDeclarator",
    value: function expandVariableDeclarator(term_860) {
      var init_861 = term_860.init == null ? null : this.expand(term_860.init);
      return new _terms2.default("VariableDeclarator", { binding: this.expand(term_860.binding), init: init_861 });
    }
  }, {
    key: "expandVariableDeclaration",
    value: function expandVariableDeclaration(term_862) {
      var _this14 = this;

      return new _terms2.default("VariableDeclaration", { kind: term_862.kind, declarators: term_862.declarators.map(function (d_863) {
          return _this14.expand(d_863);
        }) });
    }
  }, {
    key: "expandParenthesizedExpression",
    value: function expandParenthesizedExpression(term_864) {
      if (term_864.inner.size === 0) {
        throw new Error("unexpected end of input");
      }
      var enf_865 = new _enforester.Enforester(term_864.inner, (0, _immutable.List)(), this.context);
      var lookahead_866 = enf_865.peek();
      var t_867 = enf_865.enforestExpression();
      if (t_867 == null || enf_865.rest.size > 0) {
        throw enf_865.createError(lookahead_866, "unexpected syntax");
      }
      return this.expand(t_867);
    }
  }, {
    key: "expandUnaryExpression",
    value: function expandUnaryExpression(term_868) {
      return new _terms2.default("UnaryExpression", { operator: term_868.operator, operand: this.expand(term_868.operand) });
    }
  }, {
    key: "expandUpdateExpression",
    value: function expandUpdateExpression(term_869) {
      return new _terms2.default("UpdateExpression", { isPrefix: term_869.isPrefix, operator: term_869.operator, operand: this.expand(term_869.operand) });
    }
  }, {
    key: "expandBinaryExpression",
    value: function expandBinaryExpression(term_870) {
      var left_871 = this.expand(term_870.left);
      var right_872 = this.expand(term_870.right);
      return new _terms2.default("BinaryExpression", { left: left_871, operator: term_870.operator, right: right_872 });
    }
  }, {
    key: "expandConditionalExpression",
    value: function expandConditionalExpression(term_873) {
      return new _terms2.default("ConditionalExpression", { test: this.expand(term_873.test), consequent: this.expand(term_873.consequent), alternate: this.expand(term_873.alternate) });
    }
  }, {
    key: "expandNewTargetExpression",
    value: function expandNewTargetExpression(term_874) {
      return term_874;
    }
  }, {
    key: "expandNewExpression",
    value: function expandNewExpression(term_875) {
      var _this15 = this;

      var callee_876 = this.expand(term_875.callee);
      var enf_877 = new _enforester.Enforester(term_875.arguments, (0, _immutable.List)(), this.context);
      var args_878 = enf_877.enforestArgumentList().map(function (arg_879) {
        return _this15.expand(arg_879);
      });
      return new _terms2.default("NewExpression", { callee: callee_876, arguments: args_878.toArray() });
    }
  }, {
    key: "expandSuper",
    value: function expandSuper(term_880) {
      return term_880;
    }
  }, {
    key: "expandCallExpression",
    value: function expandCallExpression(term_881) {
      var _this16 = this;

      var callee_882 = this.expand(term_881.callee);
      var enf_883 = new _enforester.Enforester(term_881.arguments, (0, _immutable.List)(), this.context);
      var args_884 = enf_883.enforestArgumentList().map(function (arg_885) {
        return _this16.expand(arg_885);
      });
      return new _terms2.default("CallExpression", { callee: callee_882, arguments: args_884 });
    }
  }, {
    key: "expandSpreadElement",
    value: function expandSpreadElement(term_886) {
      return new _terms2.default("SpreadElement", { expression: this.expand(term_886.expression) });
    }
  }, {
    key: "expandExpressionStatement",
    value: function expandExpressionStatement(term_887) {
      var child_888 = this.expand(term_887.expression);
      return new _terms2.default("ExpressionStatement", { expression: child_888 });
    }
  }, {
    key: "expandLabeledStatement",
    value: function expandLabeledStatement(term_889) {
      return new _terms2.default("LabeledStatement", { label: term_889.label.val(), body: this.expand(term_889.body) });
    }
  }, {
    key: "doFunctionExpansion",
    value: function doFunctionExpansion(term_890, type_891) {
      var _this17 = this;

      var scope_892 = (0, _scope.freshScope)("fun");
      var red_893 = new _applyScopeInParamsReducer2.default(scope_892, this.context);
      var params_894 = void 0;
      if (type_891 !== "Getter" && type_891 !== "Setter") {
        params_894 = red_893.transform(term_890.params);
        params_894 = this.expand(params_894);
      }
      this.context.currentScope.push(scope_892);
      var compiler_895 = new _compiler2.default(this.context.phase, this.context.env, this.context.store, this.context);
      var markedBody_896 = void 0,
          bodyTerm_897 = void 0;
      if (term_890.body instanceof _terms2.default) {
        bodyTerm_897 = this.expand(term_890.body.addScope(scope_892, this.context.bindings, _syntax.ALL_PHASES));
      } else {
        markedBody_896 = term_890.body.map(function (b_898) {
          return b_898.addScope(scope_892, _this17.context.bindings, _syntax.ALL_PHASES);
        });
        bodyTerm_897 = new _terms2.default("FunctionBody", { directives: (0, _immutable.List)(), statements: compiler_895.compile(markedBody_896) });
      }
      this.context.currentScope.pop();
      if (type_891 === "Getter") {
        return new _terms2.default(type_891, { name: this.expand(term_890.name), body: bodyTerm_897 });
      } else if (type_891 === "Setter") {
        return new _terms2.default(type_891, { name: this.expand(term_890.name), param: term_890.param, body: bodyTerm_897 });
      }
      return new _terms2.default(type_891, { name: term_890.name, isGenerator: term_890.isGenerator, params: params_894, body: bodyTerm_897 });
    }
  }, {
    key: "expandMethod",
    value: function expandMethod(term_899) {
      return this.doFunctionExpansion(term_899, "Method");
    }
  }, {
    key: "expandSetter",
    value: function expandSetter(term_900) {
      return this.doFunctionExpansion(term_900, "Setter");
    }
  }, {
    key: "expandGetter",
    value: function expandGetter(term_901) {
      return this.doFunctionExpansion(term_901, "Getter");
    }
  }, {
    key: "expandFunctionDeclaration",
    value: function expandFunctionDeclaration(term_902) {
      return this.doFunctionExpansion(term_902, "FunctionDeclaration");
    }
  }, {
    key: "expandFunctionExpression",
    value: function expandFunctionExpression(term_903) {
      return this.doFunctionExpansion(term_903, "FunctionExpression");
    }
  }, {
    key: "expandCompoundAssignmentExpression",
    value: function expandCompoundAssignmentExpression(term_904) {
      return new _terms2.default("CompoundAssignmentExpression", { binding: this.expand(term_904.binding), operator: term_904.operator, expression: this.expand(term_904.expression) });
    }
  }, {
    key: "expandAssignmentExpression",
    value: function expandAssignmentExpression(term_905) {
      return new _terms2.default("AssignmentExpression", { binding: this.expand(term_905.binding), expression: this.expand(term_905.expression) });
    }
  }, {
    key: "expandEmptyStatement",
    value: function expandEmptyStatement(term_906) {
      return term_906;
    }
  }, {
    key: "expandLiteralBooleanExpression",
    value: function expandLiteralBooleanExpression(term_907) {
      return term_907;
    }
  }, {
    key: "expandLiteralNumericExpression",
    value: function expandLiteralNumericExpression(term_908) {
      return term_908;
    }
  }, {
    key: "expandLiteralInfinityExpression",
    value: function expandLiteralInfinityExpression(term_909) {
      return term_909;
    }
  }, {
    key: "expandIdentifierExpression",
    value: function expandIdentifierExpression(term_910) {
      var trans_911 = this.context.env.get(term_910.name.resolve(this.context.phase));
      if (trans_911) {
        return new _terms2.default("IdentifierExpression", { name: trans_911.id });
      }
      return term_910;
    }
  }, {
    key: "expandLiteralNullExpression",
    value: function expandLiteralNullExpression(term_912) {
      return term_912;
    }
  }, {
    key: "expandLiteralStringExpression",
    value: function expandLiteralStringExpression(term_913) {
      return term_913;
    }
  }, {
    key: "expandLiteralRegExpExpression",
    value: function expandLiteralRegExpExpression(term_914) {
      return term_914;
    }
  }]);

  return TermExpander;
}();

exports.default = TermExpander;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3N3ZWV0L3Rlcm0tZXhwYW5kZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztJQUNxQixZO0FBQ25CLHdCQUFZLFdBQVosRUFBeUI7QUFBQTs7QUFDdkIsU0FBSyxPQUFMLEdBQWUsV0FBZjtBQUNEOzs7OzJCQUNNLFEsRUFBVTtBQUNmLFVBQUksWUFBWSxXQUFXLFNBQVMsSUFBcEM7QUFDQSxVQUFJLE9BQU8sS0FBSyxTQUFMLENBQVAsS0FBMkIsVUFBL0IsRUFBMkM7QUFDekMsZUFBTyxLQUFLLFNBQUwsRUFBZ0IsUUFBaEIsQ0FBUDtBQUNEO0FBQ0QsMEJBQU8sS0FBUCxFQUFjLHFDQUFxQyxTQUFTLElBQTVEO0FBQ0Q7Ozs2Q0FDd0IsUSxFQUFVO0FBQ2pDLGFBQU8sb0JBQVMsb0JBQVQsRUFBK0IsRUFBQyxLQUFLLFNBQVMsR0FBVCxJQUFnQixJQUFoQixHQUF1QixJQUF2QixHQUE4QixLQUFLLE1BQUwsQ0FBWSxTQUFTLEdBQXJCLENBQXBDLEVBQStELFVBQVUsU0FBUyxRQUFULENBQWtCLE9BQWxCLEVBQXpFLEVBQS9CLENBQVA7QUFDRDs7O3lDQUNvQixRLEVBQVU7QUFDN0IsYUFBTyxvQkFBUyxnQkFBVCxFQUEyQixFQUFDLE9BQU8sU0FBUyxLQUFULEdBQWlCLFNBQVMsS0FBVCxDQUFlLEdBQWYsRUFBakIsR0FBd0MsSUFBaEQsRUFBM0IsQ0FBUDtBQUNEOzs7MkNBQ3NCLFEsRUFBVTtBQUMvQixhQUFPLG9CQUFTLGtCQUFULEVBQTZCLEVBQUMsTUFBTSxLQUFLLE1BQUwsQ0FBWSxTQUFTLElBQXJCLENBQVAsRUFBbUMsTUFBTSxLQUFLLE1BQUwsQ0FBWSxTQUFTLElBQXJCLENBQXpDLEVBQTdCLENBQVA7QUFDRDs7O3dDQUNtQixRLEVBQVU7QUFDNUIsYUFBTyxvQkFBUyxl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QXJCLENBQVYsRUFBeUMsVUFBVSxTQUFTLFFBQTVELEVBQXNFLFlBQVksS0FBSyxNQUFMLENBQVksU0FBUyxVQUFyQixDQUFsRixFQUF6QyxDQUFQO0FBQ0Q7OzsrQ0FDMEIsUSxFQUFVO0FBQ25DLGFBQU8sb0JBQVMsc0JBQVQsRUFBaUMsRUFBQyxTQUFTLEtBQUssTUFBTCxDQUFZLFNBQVMsT0FBckIsQ0FBVixFQUF5QyxZQUFZLEtBQUssTUFBTCxDQUFZLFNBQVMsVUFBckIsQ0FBckQsRUFBakMsQ0FBUDtBQUNEOzs7eUNBQ29CLFEsRUFBVTtBQUM3QixhQUFPLFFBQVA7QUFDRDs7O21EQUM4QixRLEVBQVU7QUFDdkMsYUFBTyxRQUFQO0FBQ0Q7OzttREFDOEIsUSxFQUFVO0FBQ3ZDLGFBQU8sUUFBUDtBQUNEOzs7b0RBQytCLFEsRUFBVTtBQUN4QyxhQUFPLFFBQVA7QUFDRDs7OytDQUMwQixRLEVBQVU7QUFDbkMsVUFBSSxZQUFZLEtBQUssT0FBTCxDQUFhLEdBQWIsQ0FBaUIsR0FBakIsQ0FBcUIsU0FBUyxJQUFULENBQWMsT0FBZCxDQUFzQixLQUFLLE9BQUwsQ0FBYSxLQUFuQyxDQUFyQixDQUFoQjtBQUNBLFVBQUksU0FBSixFQUFlO0FBQ2IsZUFBTyxvQkFBUyxzQkFBVCxFQUFpQyxFQUFDLE1BQU0sVUFBVSxFQUFqQixFQUFqQyxDQUFQO0FBQ0Q7QUFDRCxhQUFPLFFBQVA7QUFDRDs7O2dEQUMyQixRLEVBQVU7QUFDcEMsYUFBTyxRQUFQO0FBQ0Q7OztrREFDNkIsUSxFQUFVO0FBQ3RDLGFBQU8sUUFBUDtBQUNEOzs7a0RBQzZCLFEsRUFBVTtBQUN0QyxhQUFPLFFBQVA7QUFDRDs7Ozs7O2tCQTFVa0IsWSIsImZpbGUiOiJ0ZXJtLWV4cGFuZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtMaXN0fSBmcm9tIFwiaW1tdXRhYmxlXCI7XG5pbXBvcnQgVGVybSwge2lzRU9GLCBpc0JpbmRpbmdJZGVudGlmaWVyLCBpc0Z1bmN0aW9uRGVjbGFyYXRpb24sIGlzRnVuY3Rpb25FeHByZXNzaW9uLCBpc0Z1bmN0aW9uVGVybSwgaXNGdW5jdGlvbldpdGhOYW1lLCBpc1N5bnRheERlY2xhcmF0aW9uLCBpc1ZhcmlhYmxlRGVjbGFyYXRpb24sIGlzVmFyaWFibGVEZWNsYXJhdGlvblN0YXRlbWVudCwgaXNJbXBvcnQsIGlzRXhwb3J0fSBmcm9tIFwiLi90ZXJtc1wiO1xuaW1wb3J0IHtTY29wZSwgZnJlc2hTY29wZX0gZnJvbSBcIi4vc2NvcGVcIjtcbmltcG9ydCBBcHBseVNjb3BlSW5QYXJhbXNSZWR1Y2VyIGZyb20gXCIuL2FwcGx5LXNjb3BlLWluLXBhcmFtcy1yZWR1Y2VyXCI7XG5pbXBvcnQgcmVkdWNlciwge01vbm9pZGFsUmVkdWNlcn0gZnJvbSBcInNoaWZ0LXJlZHVjZXJcIjtcbmltcG9ydCBDb21waWxlciBmcm9tIFwiLi9jb21waWxlclwiO1xuaW1wb3J0IFN5bnRheCwge0FMTF9QSEFTRVN9IGZyb20gXCIuL3N5bnRheFwiO1xuaW1wb3J0IHtzZXJpYWxpemVyLCBtYWtlRGVzZXJpYWxpemVyfSBmcm9tIFwiLi9zZXJpYWxpemVyXCI7XG5pbXBvcnQge2VuZm9yZXN0RXhwciwgRW5mb3Jlc3Rlcn0gZnJvbSBcIi4vZW5mb3Jlc3RlclwiO1xuaW1wb3J0IHthc3NlcnR9IGZyb20gXCIuL2Vycm9yc1wiO1xuaW1wb3J0IHtwcm9jZXNzVGVtcGxhdGV9IGZyb20gXCIuL3RlbXBsYXRlLXByb2Nlc3Nvci5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVybUV4cGFuZGVyIHtcbiAgY29uc3RydWN0b3IoY29udGV4dF83NzEpIHtcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0Xzc3MTtcbiAgfVxuICBleHBhbmQodGVybV83NzIpIHtcbiAgICBsZXQgZmllbGRfNzczID0gXCJleHBhbmRcIiArIHRlcm1fNzcyLnR5cGU7XG4gICAgaWYgKHR5cGVvZiB0aGlzW2ZpZWxkXzc3M10gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgcmV0dXJuIHRoaXNbZmllbGRfNzczXSh0ZXJtXzc3Mik7XG4gICAgfVxuICAgIGFzc2VydChmYWxzZSwgXCJleHBhbmQgbm90IGltcGxlbWVudGVkIHlldCBmb3I6IFwiICsgdGVybV83NzIudHlwZSk7XG4gIH1cbiAgZXhwYW5kVGVtcGxhdGVFeHByZXNzaW9uKHRlcm1fNzc0KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiVGVtcGxhdGVFeHByZXNzaW9uXCIsIHt0YWc6IHRlcm1fNzc0LnRhZyA9PSBudWxsID8gbnVsbCA6IHRoaXMuZXhwYW5kKHRlcm1fNzc0LnRhZyksIGVsZW1lbnRzOiB0ZXJtXzc3NC5lbGVtZW50cy50b0FycmF5KCl9KTtcbiAgfVxuICBleHBhbmRCcmVha1N0YXRlbWVudCh0ZXJtXzc3NSkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkJyZWFrU3RhdGVtZW50XCIsIHtsYWJlbDogdGVybV83NzUubGFiZWwgPyB0ZXJtXzc3NS5sYWJlbC52YWwoKSA6IG51bGx9KTtcbiAgfVxuICBleHBhbmREb1doaWxlU3RhdGVtZW50KHRlcm1fNzc2KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiRG9XaGlsZVN0YXRlbWVudFwiLCB7Ym9keTogdGhpcy5leHBhbmQodGVybV83NzYuYm9keSksIHRlc3Q6IHRoaXMuZXhwYW5kKHRlcm1fNzc2LnRlc3QpfSk7XG4gIH1cbiAgZXhwYW5kV2l0aFN0YXRlbWVudCh0ZXJtXzc3Nykge1xuICAgIHJldHVybiBuZXcgVGVybShcIldpdGhTdGF0ZW1lbnRcIiwge2JvZHk6IHRoaXMuZXhwYW5kKHRlcm1fNzc3LmJvZHkpLCBvYmplY3Q6IHRoaXMuZXhwYW5kKHRlcm1fNzc3Lm9iamVjdCl9KTtcbiAgfVxuICBleHBhbmREZWJ1Z2dlclN0YXRlbWVudCh0ZXJtXzc3OCkge1xuICAgIHJldHVybiB0ZXJtXzc3ODtcbiAgfVxuICBleHBhbmRDb250aW51ZVN0YXRlbWVudCh0ZXJtXzc3OSkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkNvbnRpbnVlU3RhdGVtZW50XCIsIHtsYWJlbDogdGVybV83NzkubGFiZWwgPyB0ZXJtXzc3OS5sYWJlbC52YWwoKSA6IG51bGx9KTtcbiAgfVxuICBleHBhbmRTd2l0Y2hTdGF0ZW1lbnRXaXRoRGVmYXVsdCh0ZXJtXzc4MCkge1xuICAgIHJldHVybiBuZXcgVGVybShcIlN3aXRjaFN0YXRlbWVudFdpdGhEZWZhdWx0XCIsIHtkaXNjcmltaW5hbnQ6IHRoaXMuZXhwYW5kKHRlcm1fNzgwLmRpc2NyaW1pbmFudCksIHByZURlZmF1bHRDYXNlczogdGVybV83ODAucHJlRGVmYXVsdENhc2VzLm1hcChjXzc4MSA9PiB0aGlzLmV4cGFuZChjXzc4MSkpLnRvQXJyYXkoKSwgZGVmYXVsdENhc2U6IHRoaXMuZXhwYW5kKHRlcm1fNzgwLmRlZmF1bHRDYXNlKSwgcG9zdERlZmF1bHRDYXNlczogdGVybV83ODAucG9zdERlZmF1bHRDYXNlcy5tYXAoY183ODIgPT4gdGhpcy5leHBhbmQoY183ODIpKS50b0FycmF5KCl9KTtcbiAgfVxuICBleHBhbmRDb21wdXRlZE1lbWJlckV4cHJlc3Npb24odGVybV83ODMpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJDb21wdXRlZE1lbWJlckV4cHJlc3Npb25cIiwge29iamVjdDogdGhpcy5leHBhbmQodGVybV83ODMub2JqZWN0KSwgZXhwcmVzc2lvbjogdGhpcy5leHBhbmQodGVybV83ODMuZXhwcmVzc2lvbil9KTtcbiAgfVxuICBleHBhbmRTd2l0Y2hTdGF0ZW1lbnQodGVybV83ODQpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJTd2l0Y2hTdGF0ZW1lbnRcIiwge2Rpc2NyaW1pbmFudDogdGhpcy5leHBhbmQodGVybV83ODQuZGlzY3JpbWluYW50KSwgY2FzZXM6IHRlcm1fNzg0LmNhc2VzLm1hcChjXzc4NSA9PiB0aGlzLmV4cGFuZChjXzc4NSkpLnRvQXJyYXkoKX0pO1xuICB9XG4gIGV4cGFuZEZvcm1hbFBhcmFtZXRlcnModGVybV83ODYpIHtcbiAgICBsZXQgcmVzdF83ODcgPSB0ZXJtXzc4Ni5yZXN0ID09IG51bGwgPyBudWxsIDogdGhpcy5leHBhbmQodGVybV83ODYucmVzdCk7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiRm9ybWFsUGFyYW1ldGVyc1wiLCB7aXRlbXM6IHRlcm1fNzg2Lml0ZW1zLm1hcChpXzc4OCA9PiB0aGlzLmV4cGFuZChpXzc4OCkpLCByZXN0OiByZXN0Xzc4N30pO1xuICB9XG4gIGV4cGFuZEFycm93RXhwcmVzc2lvbih0ZXJtXzc4OSkge1xuICAgIHJldHVybiB0aGlzLmRvRnVuY3Rpb25FeHBhbnNpb24odGVybV83ODksIFwiQXJyb3dFeHByZXNzaW9uXCIpO1xuICB9XG4gIGV4cGFuZFN3aXRjaERlZmF1bHQodGVybV83OTApIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJTd2l0Y2hEZWZhdWx0XCIsIHtjb25zZXF1ZW50OiB0ZXJtXzc5MC5jb25zZXF1ZW50Lm1hcChjXzc5MSA9PiB0aGlzLmV4cGFuZChjXzc5MSkpLnRvQXJyYXkoKX0pO1xuICB9XG4gIGV4cGFuZFN3aXRjaENhc2UodGVybV83OTIpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJTd2l0Y2hDYXNlXCIsIHt0ZXN0OiB0aGlzLmV4cGFuZCh0ZXJtXzc5Mi50ZXN0KSwgY29uc2VxdWVudDogdGVybV83OTIuY29uc2VxdWVudC5tYXAoY183OTMgPT4gdGhpcy5leHBhbmQoY183OTMpKS50b0FycmF5KCl9KTtcbiAgfVxuICBleHBhbmRGb3JJblN0YXRlbWVudCh0ZXJtXzc5NCkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkZvckluU3RhdGVtZW50XCIsIHtsZWZ0OiB0aGlzLmV4cGFuZCh0ZXJtXzc5NC5sZWZ0KSwgcmlnaHQ6IHRoaXMuZXhwYW5kKHRlcm1fNzk0LnJpZ2h0KSwgYm9keTogdGhpcy5leHBhbmQodGVybV83OTQuYm9keSl9KTtcbiAgfVxuICBleHBhbmRUcnlDYXRjaFN0YXRlbWVudCh0ZXJtXzc5NSkge1xuICAgIHJldHVybiBuZXcgVGVybShcIlRyeUNhdGNoU3RhdGVtZW50XCIsIHtib2R5OiB0aGlzLmV4cGFuZCh0ZXJtXzc5NS5ib2R5KSwgY2F0Y2hDbGF1c2U6IHRoaXMuZXhwYW5kKHRlcm1fNzk1LmNhdGNoQ2xhdXNlKX0pO1xuICB9XG4gIGV4cGFuZFRyeUZpbmFsbHlTdGF0ZW1lbnQodGVybV83OTYpIHtcbiAgICBsZXQgY2F0Y2hDbGF1c2VfNzk3ID0gdGVybV83OTYuY2F0Y2hDbGF1c2UgPT0gbnVsbCA/IG51bGwgOiB0aGlzLmV4cGFuZCh0ZXJtXzc5Ni5jYXRjaENsYXVzZSk7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiVHJ5RmluYWxseVN0YXRlbWVudFwiLCB7Ym9keTogdGhpcy5leHBhbmQodGVybV83OTYuYm9keSksIGNhdGNoQ2xhdXNlOiBjYXRjaENsYXVzZV83OTcsIGZpbmFsaXplcjogdGhpcy5leHBhbmQodGVybV83OTYuZmluYWxpemVyKX0pO1xuICB9XG4gIGV4cGFuZENhdGNoQ2xhdXNlKHRlcm1fNzk4KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQ2F0Y2hDbGF1c2VcIiwge2JpbmRpbmc6IHRoaXMuZXhwYW5kKHRlcm1fNzk4LmJpbmRpbmcpLCBib2R5OiB0aGlzLmV4cGFuZCh0ZXJtXzc5OC5ib2R5KX0pO1xuICB9XG4gIGV4cGFuZFRocm93U3RhdGVtZW50KHRlcm1fNzk5KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiVGhyb3dTdGF0ZW1lbnRcIiwge2V4cHJlc3Npb246IHRoaXMuZXhwYW5kKHRlcm1fNzk5LmV4cHJlc3Npb24pfSk7XG4gIH1cbiAgZXhwYW5kRm9yT2ZTdGF0ZW1lbnQodGVybV84MDApIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJGb3JPZlN0YXRlbWVudFwiLCB7bGVmdDogdGhpcy5leHBhbmQodGVybV84MDAubGVmdCksIHJpZ2h0OiB0aGlzLmV4cGFuZCh0ZXJtXzgwMC5yaWdodCksIGJvZHk6IHRoaXMuZXhwYW5kKHRlcm1fODAwLmJvZHkpfSk7XG4gIH1cbiAgZXhwYW5kQmluZGluZ0lkZW50aWZpZXIodGVybV84MDEpIHtcbiAgICByZXR1cm4gdGVybV84MDE7XG4gIH1cbiAgZXhwYW5kQmluZGluZ1Byb3BlcnR5SWRlbnRpZmllcih0ZXJtXzgwMikge1xuICAgIHJldHVybiB0ZXJtXzgwMjtcbiAgfVxuICBleHBhbmRCaW5kaW5nUHJvcGVydHlQcm9wZXJ0eSh0ZXJtXzgwMykge1xuICAgIHJldHVybiBuZXcgVGVybShcIkJpbmRpbmdQcm9wZXJ0eVByb3BlcnR5XCIsIHtuYW1lOiB0aGlzLmV4cGFuZCh0ZXJtXzgwMy5uYW1lKSwgYmluZGluZzogdGhpcy5leHBhbmQodGVybV84MDMuYmluZGluZyl9KTtcbiAgfVxuICBleHBhbmRDb21wdXRlZFByb3BlcnR5TmFtZSh0ZXJtXzgwNCkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkNvbXB1dGVkUHJvcGVydHlOYW1lXCIsIHtleHByZXNzaW9uOiB0aGlzLmV4cGFuZCh0ZXJtXzgwNC5leHByZXNzaW9uKX0pO1xuICB9XG4gIGV4cGFuZE9iamVjdEJpbmRpbmcodGVybV84MDUpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJPYmplY3RCaW5kaW5nXCIsIHtwcm9wZXJ0aWVzOiB0ZXJtXzgwNS5wcm9wZXJ0aWVzLm1hcCh0XzgwNiA9PiB0aGlzLmV4cGFuZCh0XzgwNikpLnRvQXJyYXkoKX0pO1xuICB9XG4gIGV4cGFuZEFycmF5QmluZGluZyh0ZXJtXzgwNykge1xuICAgIGxldCByZXN0RWxlbWVudF84MDggPSB0ZXJtXzgwNy5yZXN0RWxlbWVudCA9PSBudWxsID8gbnVsbCA6IHRoaXMuZXhwYW5kKHRlcm1fODA3LnJlc3RFbGVtZW50KTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJBcnJheUJpbmRpbmdcIiwge2VsZW1lbnRzOiB0ZXJtXzgwNy5lbGVtZW50cy5tYXAodF84MDkgPT4gdF84MDkgPT0gbnVsbCA/IG51bGwgOiB0aGlzLmV4cGFuZCh0XzgwOSkpLnRvQXJyYXkoKSwgcmVzdEVsZW1lbnQ6IHJlc3RFbGVtZW50XzgwOH0pO1xuICB9XG4gIGV4cGFuZEJpbmRpbmdXaXRoRGVmYXVsdCh0ZXJtXzgxMCkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkJpbmRpbmdXaXRoRGVmYXVsdFwiLCB7YmluZGluZzogdGhpcy5leHBhbmQodGVybV84MTAuYmluZGluZyksIGluaXQ6IHRoaXMuZXhwYW5kKHRlcm1fODEwLmluaXQpfSk7XG4gIH1cbiAgZXhwYW5kU2hvcnRoYW5kUHJvcGVydHkodGVybV84MTEpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJEYXRhUHJvcGVydHlcIiwge25hbWU6IG5ldyBUZXJtKFwiU3RhdGljUHJvcGVydHlOYW1lXCIsIHt2YWx1ZTogdGVybV84MTEubmFtZX0pLCBleHByZXNzaW9uOiBuZXcgVGVybShcIklkZW50aWZpZXJFeHByZXNzaW9uXCIsIHtuYW1lOiB0ZXJtXzgxMS5uYW1lfSl9KTtcbiAgfVxuICBleHBhbmRGb3JTdGF0ZW1lbnQodGVybV84MTIpIHtcbiAgICBsZXQgaW5pdF84MTMgPSB0ZXJtXzgxMi5pbml0ID09IG51bGwgPyBudWxsIDogdGhpcy5leHBhbmQodGVybV84MTIuaW5pdCk7XG4gICAgbGV0IHRlc3RfODE0ID0gdGVybV84MTIudGVzdCA9PSBudWxsID8gbnVsbCA6IHRoaXMuZXhwYW5kKHRlcm1fODEyLnRlc3QpO1xuICAgIGxldCB1cGRhdGVfODE1ID0gdGVybV84MTIudXBkYXRlID09IG51bGwgPyBudWxsIDogdGhpcy5leHBhbmQodGVybV84MTIudXBkYXRlKTtcbiAgICBsZXQgYm9keV84MTYgPSB0aGlzLmV4cGFuZCh0ZXJtXzgxMi5ib2R5KTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJGb3JTdGF0ZW1lbnRcIiwge2luaXQ6IGluaXRfODEzLCB0ZXN0OiB0ZXN0XzgxNCwgdXBkYXRlOiB1cGRhdGVfODE1LCBib2R5OiBib2R5XzgxNn0pO1xuICB9XG4gIGV4cGFuZFlpZWxkRXhwcmVzc2lvbih0ZXJtXzgxNykge1xuICAgIGxldCBleHByXzgxOCA9IHRlcm1fODE3LmV4cHJlc3Npb24gPT0gbnVsbCA/IG51bGwgOiB0aGlzLmV4cGFuZCh0ZXJtXzgxNy5leHByZXNzaW9uKTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJZaWVsZEV4cHJlc3Npb25cIiwge2V4cHJlc3Npb246IGV4cHJfODE4fSk7XG4gIH1cbiAgZXhwYW5kWWllbGRHZW5lcmF0b3JFeHByZXNzaW9uKHRlcm1fODE5KSB7XG4gICAgbGV0IGV4cHJfODIwID0gdGVybV84MTkuZXhwcmVzc2lvbiA9PSBudWxsID8gbnVsbCA6IHRoaXMuZXhwYW5kKHRlcm1fODE5LmV4cHJlc3Npb24pO1xuICAgIHJldHVybiBuZXcgVGVybShcIllpZWxkR2VuZXJhdG9yRXhwcmVzc2lvblwiLCB7ZXhwcmVzc2lvbjogZXhwcl84MjB9KTtcbiAgfVxuICBleHBhbmRXaGlsZVN0YXRlbWVudCh0ZXJtXzgyMSkge1xuICAgIHJldHVybiBuZXcgVGVybShcIldoaWxlU3RhdGVtZW50XCIsIHt0ZXN0OiB0aGlzLmV4cGFuZCh0ZXJtXzgyMS50ZXN0KSwgYm9keTogdGhpcy5leHBhbmQodGVybV84MjEuYm9keSl9KTtcbiAgfVxuICBleHBhbmRJZlN0YXRlbWVudCh0ZXJtXzgyMikge1xuICAgIGxldCBjb25zZXF1ZW50XzgyMyA9IHRlcm1fODIyLmNvbnNlcXVlbnQgPT0gbnVsbCA/IG51bGwgOiB0aGlzLmV4cGFuZCh0ZXJtXzgyMi5jb25zZXF1ZW50KTtcbiAgICBsZXQgYWx0ZXJuYXRlXzgyNCA9IHRlcm1fODIyLmFsdGVybmF0ZSA9PSBudWxsID8gbnVsbCA6IHRoaXMuZXhwYW5kKHRlcm1fODIyLmFsdGVybmF0ZSk7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiSWZTdGF0ZW1lbnRcIiwge3Rlc3Q6IHRoaXMuZXhwYW5kKHRlcm1fODIyLnRlc3QpLCBjb25zZXF1ZW50OiBjb25zZXF1ZW50XzgyMywgYWx0ZXJuYXRlOiBhbHRlcm5hdGVfODI0fSk7XG4gIH1cbiAgZXhwYW5kQmxvY2tTdGF0ZW1lbnQodGVybV84MjUpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJCbG9ja1N0YXRlbWVudFwiLCB7YmxvY2s6IHRoaXMuZXhwYW5kKHRlcm1fODI1LmJsb2NrKX0pO1xuICB9XG4gIGV4cGFuZEJsb2NrKHRlcm1fODI2KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQmxvY2tcIiwge3N0YXRlbWVudHM6IHRlcm1fODI2LnN0YXRlbWVudHMubWFwKHNfODI3ID0+IHRoaXMuZXhwYW5kKHNfODI3KSkudG9BcnJheSgpfSk7XG4gIH1cbiAgZXhwYW5kVmFyaWFibGVEZWNsYXJhdGlvblN0YXRlbWVudCh0ZXJtXzgyOCkge1xuICAgIHJldHVybiBuZXcgVGVybShcIlZhcmlhYmxlRGVjbGFyYXRpb25TdGF0ZW1lbnRcIiwge2RlY2xhcmF0aW9uOiB0aGlzLmV4cGFuZCh0ZXJtXzgyOC5kZWNsYXJhdGlvbil9KTtcbiAgfVxuICBleHBhbmRSZXR1cm5TdGF0ZW1lbnQodGVybV84MjkpIHtcbiAgICBpZiAodGVybV84MjkuZXhwcmVzc2lvbiA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGVybV84Mjk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgVGVybShcIlJldHVyblN0YXRlbWVudFwiLCB7ZXhwcmVzc2lvbjogdGhpcy5leHBhbmQodGVybV84MjkuZXhwcmVzc2lvbil9KTtcbiAgfVxuICBleHBhbmRDbGFzc0RlY2xhcmF0aW9uKHRlcm1fODMwKSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQ2xhc3NEZWNsYXJhdGlvblwiLCB7bmFtZTogdGVybV84MzAubmFtZSA9PSBudWxsID8gbnVsbCA6IHRoaXMuZXhwYW5kKHRlcm1fODMwLm5hbWUpLCBzdXBlcjogdGVybV84MzAuc3VwZXIgPT0gbnVsbCA/IG51bGwgOiB0aGlzLmV4cGFuZCh0ZXJtXzgzMC5zdXBlciksIGVsZW1lbnRzOiB0ZXJtXzgzMC5lbGVtZW50cy5tYXAoZWxfODMxID0+IHRoaXMuZXhwYW5kKGVsXzgzMSkpLnRvQXJyYXkoKX0pO1xuICB9XG4gIGV4cGFuZENsYXNzRXhwcmVzc2lvbih0ZXJtXzgzMikge1xuICAgIHJldHVybiBuZXcgVGVybShcIkNsYXNzRXhwcmVzc2lvblwiLCB7bmFtZTogdGVybV84MzIubmFtZSA9PSBudWxsID8gbnVsbCA6IHRoaXMuZXhwYW5kKHRlcm1fODMyLm5hbWUpLCBzdXBlcjogdGVybV84MzIuc3VwZXIgPT0gbnVsbCA/IG51bGwgOiB0aGlzLmV4cGFuZCh0ZXJtXzgzMi5zdXBlciksIGVsZW1lbnRzOiB0ZXJtXzgzMi5lbGVtZW50cy5tYXAoZWxfODMzID0+IHRoaXMuZXhwYW5kKGVsXzgzMykpLnRvQXJyYXkoKX0pO1xuICB9XG4gIGV4cGFuZENsYXNzRWxlbWVudCh0ZXJtXzgzNCkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkNsYXNzRWxlbWVudFwiLCB7aXNTdGF0aWM6IHRlcm1fODM0LmlzU3RhdGljLCBtZXRob2Q6IHRoaXMuZXhwYW5kKHRlcm1fODM0Lm1ldGhvZCl9KTtcbiAgfVxuICBleHBhbmRUaGlzRXhwcmVzc2lvbih0ZXJtXzgzNSkge1xuICAgIHJldHVybiB0ZXJtXzgzNTtcbiAgfVxuICBleHBhbmRTeW50YXhUZW1wbGF0ZSh0ZXJtXzgzNikge1xuICAgIGxldCByXzgzNyA9IHByb2Nlc3NUZW1wbGF0ZSh0ZXJtXzgzNi50ZW1wbGF0ZS5pbm5lcigpKTtcbiAgICBsZXQgc3RyXzgzOCA9IFN5bnRheC5mcm9tU3RyaW5nKHNlcmlhbGl6ZXIud3JpdGUocl84MzcudGVtcGxhdGUpKTtcbiAgICBsZXQgY2FsbGVlXzgzOSA9IG5ldyBUZXJtKFwiSWRlbnRpZmllckV4cHJlc3Npb25cIiwge25hbWU6IFN5bnRheC5mcm9tSWRlbnRpZmllcihcInN5bnRheFRlbXBsYXRlXCIpfSk7XG4gICAgbGV0IGV4cGFuZGVkSW50ZXJwc184NDAgPSByXzgzNy5pbnRlcnAubWFwKGlfODQyID0+IHtcbiAgICAgIGxldCBlbmZfODQzID0gbmV3IEVuZm9yZXN0ZXIoaV84NDIsIExpc3QoKSwgdGhpcy5jb250ZXh0KTtcbiAgICAgIHJldHVybiB0aGlzLmV4cGFuZChlbmZfODQzLmVuZm9yZXN0KFwiZXhwcmVzc2lvblwiKSk7XG4gICAgfSk7XG4gICAgbGV0IGFyZ3NfODQxID0gTGlzdC5vZihuZXcgVGVybShcIkxpdGVyYWxTdHJpbmdFeHByZXNzaW9uXCIsIHt2YWx1ZTogc3RyXzgzOH0pKS5jb25jYXQoZXhwYW5kZWRJbnRlcnBzXzg0MCk7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQ2FsbEV4cHJlc3Npb25cIiwge2NhbGxlZTogY2FsbGVlXzgzOSwgYXJndW1lbnRzOiBhcmdzXzg0MX0pO1xuICB9XG4gIGV4cGFuZFN5bnRheFF1b3RlKHRlcm1fODQ0KSB7XG4gICAgbGV0IHN0cl84NDUgPSBuZXcgVGVybShcIkxpdGVyYWxTdHJpbmdFeHByZXNzaW9uXCIsIHt2YWx1ZTogU3ludGF4LmZyb21TdHJpbmcoc2VyaWFsaXplci53cml0ZSh0ZXJtXzg0NC5uYW1lKSl9KTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJUZW1wbGF0ZUV4cHJlc3Npb25cIiwge3RhZzogdGVybV84NDQudGVtcGxhdGUudGFnLCBlbGVtZW50czogdGVybV84NDQudGVtcGxhdGUuZWxlbWVudHMucHVzaChzdHJfODQ1KS5wdXNoKG5ldyBUZXJtKFwiVGVtcGxhdGVFbGVtZW50XCIsIHtyYXdWYWx1ZTogXCJcIn0pKS50b0FycmF5KCl9KTtcbiAgfVxuICBleHBhbmRTdGF0aWNNZW1iZXJFeHByZXNzaW9uKHRlcm1fODQ2KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiU3RhdGljTWVtYmVyRXhwcmVzc2lvblwiLCB7b2JqZWN0OiB0aGlzLmV4cGFuZCh0ZXJtXzg0Ni5vYmplY3QpLCBwcm9wZXJ0eTogdGVybV84NDYucHJvcGVydHl9KTtcbiAgfVxuICBleHBhbmRBcnJheUV4cHJlc3Npb24odGVybV84NDcpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJBcnJheUV4cHJlc3Npb25cIiwge2VsZW1lbnRzOiB0ZXJtXzg0Ny5lbGVtZW50cy5tYXAodF84NDggPT4gdF84NDggPT0gbnVsbCA/IHRfODQ4IDogdGhpcy5leHBhbmQodF84NDgpKX0pO1xuICB9XG4gIGV4cGFuZEltcG9ydCh0ZXJtXzg0OSkge1xuICAgIHJldHVybiB0ZXJtXzg0OTtcbiAgfVxuICBleHBhbmRJbXBvcnROYW1lc3BhY2UodGVybV84NTApIHtcbiAgICByZXR1cm4gdGVybV84NTA7XG4gIH1cbiAgZXhwYW5kRXhwb3J0KHRlcm1fODUxKSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiRXhwb3J0XCIsIHtkZWNsYXJhdGlvbjogdGhpcy5leHBhbmQodGVybV84NTEuZGVjbGFyYXRpb24pfSk7XG4gIH1cbiAgZXhwYW5kRXhwb3J0RGVmYXVsdCh0ZXJtXzg1Mikge1xuICAgIHJldHVybiBuZXcgVGVybShcIkV4cG9ydERlZmF1bHRcIiwge2JvZHk6IHRoaXMuZXhwYW5kKHRlcm1fODUyLmJvZHkpfSk7XG4gIH1cbiAgZXhwYW5kRXhwb3J0RnJvbSh0ZXJtXzg1Mykge1xuICAgIHJldHVybiB0ZXJtXzg1MztcbiAgfVxuICBleHBhbmRFeHBvcnRBbGxGcm9tKHRlcm1fODU0KSB7XG4gICAgcmV0dXJuIHRlcm1fODU0O1xuICB9XG4gIGV4cGFuZEV4cG9ydFNwZWNpZmllcih0ZXJtXzg1NSkge1xuICAgIHJldHVybiB0ZXJtXzg1NTtcbiAgfVxuICBleHBhbmRTdGF0aWNQcm9wZXJ0eU5hbWUodGVybV84NTYpIHtcbiAgICByZXR1cm4gdGVybV84NTY7XG4gIH1cbiAgZXhwYW5kRGF0YVByb3BlcnR5KHRlcm1fODU3KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiRGF0YVByb3BlcnR5XCIsIHtuYW1lOiB0aGlzLmV4cGFuZCh0ZXJtXzg1Ny5uYW1lKSwgZXhwcmVzc2lvbjogdGhpcy5leHBhbmQodGVybV84NTcuZXhwcmVzc2lvbil9KTtcbiAgfVxuICBleHBhbmRPYmplY3RFeHByZXNzaW9uKHRlcm1fODU4KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiT2JqZWN0RXhwcmVzc2lvblwiLCB7cHJvcGVydGllczogdGVybV84NTgucHJvcGVydGllcy5tYXAodF84NTkgPT4gdGhpcy5leHBhbmQodF84NTkpKX0pO1xuICB9XG4gIGV4cGFuZFZhcmlhYmxlRGVjbGFyYXRvcih0ZXJtXzg2MCkge1xuICAgIGxldCBpbml0Xzg2MSA9IHRlcm1fODYwLmluaXQgPT0gbnVsbCA/IG51bGwgOiB0aGlzLmV4cGFuZCh0ZXJtXzg2MC5pbml0KTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJWYXJpYWJsZURlY2xhcmF0b3JcIiwge2JpbmRpbmc6IHRoaXMuZXhwYW5kKHRlcm1fODYwLmJpbmRpbmcpLCBpbml0OiBpbml0Xzg2MX0pO1xuICB9XG4gIGV4cGFuZFZhcmlhYmxlRGVjbGFyYXRpb24odGVybV84NjIpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJWYXJpYWJsZURlY2xhcmF0aW9uXCIsIHtraW5kOiB0ZXJtXzg2Mi5raW5kLCBkZWNsYXJhdG9yczogdGVybV84NjIuZGVjbGFyYXRvcnMubWFwKGRfODYzID0+IHRoaXMuZXhwYW5kKGRfODYzKSl9KTtcbiAgfVxuICBleHBhbmRQYXJlbnRoZXNpemVkRXhwcmVzc2lvbih0ZXJtXzg2NCkge1xuICAgIGlmICh0ZXJtXzg2NC5pbm5lci5zaXplID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bmV4cGVjdGVkIGVuZCBvZiBpbnB1dFwiKTtcbiAgICB9XG4gICAgbGV0IGVuZl84NjUgPSBuZXcgRW5mb3Jlc3Rlcih0ZXJtXzg2NC5pbm5lciwgTGlzdCgpLCB0aGlzLmNvbnRleHQpO1xuICAgIGxldCBsb29rYWhlYWRfODY2ID0gZW5mXzg2NS5wZWVrKCk7XG4gICAgbGV0IHRfODY3ID0gZW5mXzg2NS5lbmZvcmVzdEV4cHJlc3Npb24oKTtcbiAgICBpZiAodF84NjcgPT0gbnVsbCB8fCBlbmZfODY1LnJlc3Quc2l6ZSA+IDApIHtcbiAgICAgIHRocm93IGVuZl84NjUuY3JlYXRlRXJyb3IobG9va2FoZWFkXzg2NiwgXCJ1bmV4cGVjdGVkIHN5bnRheFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZXhwYW5kKHRfODY3KTtcbiAgfVxuICBleHBhbmRVbmFyeUV4cHJlc3Npb24odGVybV84NjgpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJVbmFyeUV4cHJlc3Npb25cIiwge29wZXJhdG9yOiB0ZXJtXzg2OC5vcGVyYXRvciwgb3BlcmFuZDogdGhpcy5leHBhbmQodGVybV84Njgub3BlcmFuZCl9KTtcbiAgfVxuICBleHBhbmRVcGRhdGVFeHByZXNzaW9uKHRlcm1fODY5KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiVXBkYXRlRXhwcmVzc2lvblwiLCB7aXNQcmVmaXg6IHRlcm1fODY5LmlzUHJlZml4LCBvcGVyYXRvcjogdGVybV84Njkub3BlcmF0b3IsIG9wZXJhbmQ6IHRoaXMuZXhwYW5kKHRlcm1fODY5Lm9wZXJhbmQpfSk7XG4gIH1cbiAgZXhwYW5kQmluYXJ5RXhwcmVzc2lvbih0ZXJtXzg3MCkge1xuICAgIGxldCBsZWZ0Xzg3MSA9IHRoaXMuZXhwYW5kKHRlcm1fODcwLmxlZnQpO1xuICAgIGxldCByaWdodF84NzIgPSB0aGlzLmV4cGFuZCh0ZXJtXzg3MC5yaWdodCk7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQmluYXJ5RXhwcmVzc2lvblwiLCB7bGVmdDogbGVmdF84NzEsIG9wZXJhdG9yOiB0ZXJtXzg3MC5vcGVyYXRvciwgcmlnaHQ6IHJpZ2h0Xzg3Mn0pO1xuICB9XG4gIGV4cGFuZENvbmRpdGlvbmFsRXhwcmVzc2lvbih0ZXJtXzg3Mykge1xuICAgIHJldHVybiBuZXcgVGVybShcIkNvbmRpdGlvbmFsRXhwcmVzc2lvblwiLCB7dGVzdDogdGhpcy5leHBhbmQodGVybV84NzMudGVzdCksIGNvbnNlcXVlbnQ6IHRoaXMuZXhwYW5kKHRlcm1fODczLmNvbnNlcXVlbnQpLCBhbHRlcm5hdGU6IHRoaXMuZXhwYW5kKHRlcm1fODczLmFsdGVybmF0ZSl9KTtcbiAgfVxuICBleHBhbmROZXdUYXJnZXRFeHByZXNzaW9uKHRlcm1fODc0KSB7XG4gICAgcmV0dXJuIHRlcm1fODc0O1xuICB9XG4gIGV4cGFuZE5ld0V4cHJlc3Npb24odGVybV84NzUpIHtcbiAgICBsZXQgY2FsbGVlXzg3NiA9IHRoaXMuZXhwYW5kKHRlcm1fODc1LmNhbGxlZSk7XG4gICAgbGV0IGVuZl84NzcgPSBuZXcgRW5mb3Jlc3Rlcih0ZXJtXzg3NS5hcmd1bWVudHMsIExpc3QoKSwgdGhpcy5jb250ZXh0KTtcbiAgICBsZXQgYXJnc184NzggPSBlbmZfODc3LmVuZm9yZXN0QXJndW1lbnRMaXN0KCkubWFwKGFyZ184NzkgPT4gdGhpcy5leHBhbmQoYXJnXzg3OSkpO1xuICAgIHJldHVybiBuZXcgVGVybShcIk5ld0V4cHJlc3Npb25cIiwge2NhbGxlZTogY2FsbGVlXzg3NiwgYXJndW1lbnRzOiBhcmdzXzg3OC50b0FycmF5KCl9KTtcbiAgfVxuICBleHBhbmRTdXBlcih0ZXJtXzg4MCkge1xuICAgIHJldHVybiB0ZXJtXzg4MDtcbiAgfVxuICBleHBhbmRDYWxsRXhwcmVzc2lvbih0ZXJtXzg4MSkge1xuICAgIGxldCBjYWxsZWVfODgyID0gdGhpcy5leHBhbmQodGVybV84ODEuY2FsbGVlKTtcbiAgICBsZXQgZW5mXzg4MyA9IG5ldyBFbmZvcmVzdGVyKHRlcm1fODgxLmFyZ3VtZW50cywgTGlzdCgpLCB0aGlzLmNvbnRleHQpO1xuICAgIGxldCBhcmdzXzg4NCA9IGVuZl84ODMuZW5mb3Jlc3RBcmd1bWVudExpc3QoKS5tYXAoYXJnXzg4NSA9PiB0aGlzLmV4cGFuZChhcmdfODg1KSk7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQ2FsbEV4cHJlc3Npb25cIiwge2NhbGxlZTogY2FsbGVlXzg4MiwgYXJndW1lbnRzOiBhcmdzXzg4NH0pO1xuICB9XG4gIGV4cGFuZFNwcmVhZEVsZW1lbnQodGVybV84ODYpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJTcHJlYWRFbGVtZW50XCIsIHtleHByZXNzaW9uOiB0aGlzLmV4cGFuZCh0ZXJtXzg4Ni5leHByZXNzaW9uKX0pO1xuICB9XG4gIGV4cGFuZEV4cHJlc3Npb25TdGF0ZW1lbnQodGVybV84ODcpIHtcbiAgICBsZXQgY2hpbGRfODg4ID0gdGhpcy5leHBhbmQodGVybV84ODcuZXhwcmVzc2lvbik7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiRXhwcmVzc2lvblN0YXRlbWVudFwiLCB7ZXhwcmVzc2lvbjogY2hpbGRfODg4fSk7XG4gIH1cbiAgZXhwYW5kTGFiZWxlZFN0YXRlbWVudCh0ZXJtXzg4OSkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkxhYmVsZWRTdGF0ZW1lbnRcIiwge2xhYmVsOiB0ZXJtXzg4OS5sYWJlbC52YWwoKSwgYm9keTogdGhpcy5leHBhbmQodGVybV84ODkuYm9keSl9KTtcbiAgfVxuICBkb0Z1bmN0aW9uRXhwYW5zaW9uKHRlcm1fODkwLCB0eXBlXzg5MSkge1xuICAgIGxldCBzY29wZV84OTIgPSBmcmVzaFNjb3BlKFwiZnVuXCIpO1xuICAgIGxldCByZWRfODkzID0gbmV3IEFwcGx5U2NvcGVJblBhcmFtc1JlZHVjZXIoc2NvcGVfODkyLCB0aGlzLmNvbnRleHQpO1xuICAgIGxldCBwYXJhbXNfODk0O1xuICAgIGlmICh0eXBlXzg5MSAhPT0gXCJHZXR0ZXJcIiAmJiB0eXBlXzg5MSAhPT0gXCJTZXR0ZXJcIikge1xuICAgICAgcGFyYW1zXzg5NCA9IHJlZF84OTMudHJhbnNmb3JtKHRlcm1fODkwLnBhcmFtcyk7XG4gICAgICBwYXJhbXNfODk0ID0gdGhpcy5leHBhbmQocGFyYW1zXzg5NCk7XG4gICAgfVxuICAgIHRoaXMuY29udGV4dC5jdXJyZW50U2NvcGUucHVzaChzY29wZV84OTIpO1xuICAgIGxldCBjb21waWxlcl84OTUgPSBuZXcgQ29tcGlsZXIodGhpcy5jb250ZXh0LnBoYXNlLCB0aGlzLmNvbnRleHQuZW52LCB0aGlzLmNvbnRleHQuc3RvcmUsIHRoaXMuY29udGV4dCk7XG4gICAgbGV0IG1hcmtlZEJvZHlfODk2LCBib2R5VGVybV84OTc7XG4gICAgaWYgKHRlcm1fODkwLmJvZHkgaW5zdGFuY2VvZiBUZXJtKSB7XG4gICAgICBib2R5VGVybV84OTcgPSB0aGlzLmV4cGFuZCh0ZXJtXzg5MC5ib2R5LmFkZFNjb3BlKHNjb3BlXzg5MiwgdGhpcy5jb250ZXh0LmJpbmRpbmdzLCBBTExfUEhBU0VTKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1hcmtlZEJvZHlfODk2ID0gdGVybV84OTAuYm9keS5tYXAoYl84OTggPT4gYl84OTguYWRkU2NvcGUoc2NvcGVfODkyLCB0aGlzLmNvbnRleHQuYmluZGluZ3MsIEFMTF9QSEFTRVMpKTtcbiAgICAgIGJvZHlUZXJtXzg5NyA9IG5ldyBUZXJtKFwiRnVuY3Rpb25Cb2R5XCIsIHtkaXJlY3RpdmVzOiBMaXN0KCksIHN0YXRlbWVudHM6IGNvbXBpbGVyXzg5NS5jb21waWxlKG1hcmtlZEJvZHlfODk2KX0pO1xuICAgIH1cbiAgICB0aGlzLmNvbnRleHQuY3VycmVudFNjb3BlLnBvcCgpO1xuICAgIGlmICh0eXBlXzg5MSA9PT0gXCJHZXR0ZXJcIikge1xuICAgICAgcmV0dXJuIG5ldyBUZXJtKHR5cGVfODkxLCB7bmFtZTogdGhpcy5leHBhbmQodGVybV84OTAubmFtZSksIGJvZHk6IGJvZHlUZXJtXzg5N30pO1xuICAgIH0gZWxzZSBpZiAodHlwZV84OTEgPT09IFwiU2V0dGVyXCIpIHtcbiAgICAgIHJldHVybiBuZXcgVGVybSh0eXBlXzg5MSwge25hbWU6IHRoaXMuZXhwYW5kKHRlcm1fODkwLm5hbWUpLCBwYXJhbTogdGVybV84OTAucGFyYW0sIGJvZHk6IGJvZHlUZXJtXzg5N30pO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFRlcm0odHlwZV84OTEsIHtuYW1lOiB0ZXJtXzg5MC5uYW1lLCBpc0dlbmVyYXRvcjogdGVybV84OTAuaXNHZW5lcmF0b3IsIHBhcmFtczogcGFyYW1zXzg5NCwgYm9keTogYm9keVRlcm1fODk3fSk7XG4gIH1cbiAgZXhwYW5kTWV0aG9kKHRlcm1fODk5KSB7XG4gICAgcmV0dXJuIHRoaXMuZG9GdW5jdGlvbkV4cGFuc2lvbih0ZXJtXzg5OSwgXCJNZXRob2RcIik7XG4gIH1cbiAgZXhwYW5kU2V0dGVyKHRlcm1fOTAwKSB7XG4gICAgcmV0dXJuIHRoaXMuZG9GdW5jdGlvbkV4cGFuc2lvbih0ZXJtXzkwMCwgXCJTZXR0ZXJcIik7XG4gIH1cbiAgZXhwYW5kR2V0dGVyKHRlcm1fOTAxKSB7XG4gICAgcmV0dXJuIHRoaXMuZG9GdW5jdGlvbkV4cGFuc2lvbih0ZXJtXzkwMSwgXCJHZXR0ZXJcIik7XG4gIH1cbiAgZXhwYW5kRnVuY3Rpb25EZWNsYXJhdGlvbih0ZXJtXzkwMikge1xuICAgIHJldHVybiB0aGlzLmRvRnVuY3Rpb25FeHBhbnNpb24odGVybV85MDIsIFwiRnVuY3Rpb25EZWNsYXJhdGlvblwiKTtcbiAgfVxuICBleHBhbmRGdW5jdGlvbkV4cHJlc3Npb24odGVybV85MDMpIHtcbiAgICByZXR1cm4gdGhpcy5kb0Z1bmN0aW9uRXhwYW5zaW9uKHRlcm1fOTAzLCBcIkZ1bmN0aW9uRXhwcmVzc2lvblwiKTtcbiAgfVxuICBleHBhbmRDb21wb3VuZEFzc2lnbm1lbnRFeHByZXNzaW9uKHRlcm1fOTA0KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQ29tcG91bmRBc3NpZ25tZW50RXhwcmVzc2lvblwiLCB7YmluZGluZzogdGhpcy5leHBhbmQodGVybV85MDQuYmluZGluZyksIG9wZXJhdG9yOiB0ZXJtXzkwNC5vcGVyYXRvciwgZXhwcmVzc2lvbjogdGhpcy5leHBhbmQodGVybV85MDQuZXhwcmVzc2lvbil9KTtcbiAgfVxuICBleHBhbmRBc3NpZ25tZW50RXhwcmVzc2lvbih0ZXJtXzkwNSkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkFzc2lnbm1lbnRFeHByZXNzaW9uXCIsIHtiaW5kaW5nOiB0aGlzLmV4cGFuZCh0ZXJtXzkwNS5iaW5kaW5nKSwgZXhwcmVzc2lvbjogdGhpcy5leHBhbmQodGVybV85MDUuZXhwcmVzc2lvbil9KTtcbiAgfVxuICBleHBhbmRFbXB0eVN0YXRlbWVudCh0ZXJtXzkwNikge1xuICAgIHJldHVybiB0ZXJtXzkwNjtcbiAgfVxuICBleHBhbmRMaXRlcmFsQm9vbGVhbkV4cHJlc3Npb24odGVybV85MDcpIHtcbiAgICByZXR1cm4gdGVybV85MDc7XG4gIH1cbiAgZXhwYW5kTGl0ZXJhbE51bWVyaWNFeHByZXNzaW9uKHRlcm1fOTA4KSB7XG4gICAgcmV0dXJuIHRlcm1fOTA4O1xuICB9XG4gIGV4cGFuZExpdGVyYWxJbmZpbml0eUV4cHJlc3Npb24odGVybV85MDkpIHtcbiAgICByZXR1cm4gdGVybV85MDk7XG4gIH1cbiAgZXhwYW5kSWRlbnRpZmllckV4cHJlc3Npb24odGVybV85MTApIHtcbiAgICBsZXQgdHJhbnNfOTExID0gdGhpcy5jb250ZXh0LmVudi5nZXQodGVybV85MTAubmFtZS5yZXNvbHZlKHRoaXMuY29udGV4dC5waGFzZSkpO1xuICAgIGlmICh0cmFuc185MTEpIHtcbiAgICAgIHJldHVybiBuZXcgVGVybShcIklkZW50aWZpZXJFeHByZXNzaW9uXCIsIHtuYW1lOiB0cmFuc185MTEuaWR9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRlcm1fOTEwO1xuICB9XG4gIGV4cGFuZExpdGVyYWxOdWxsRXhwcmVzc2lvbih0ZXJtXzkxMikge1xuICAgIHJldHVybiB0ZXJtXzkxMjtcbiAgfVxuICBleHBhbmRMaXRlcmFsU3RyaW5nRXhwcmVzc2lvbih0ZXJtXzkxMykge1xuICAgIHJldHVybiB0ZXJtXzkxMztcbiAgfVxuICBleHBhbmRMaXRlcmFsUmVnRXhwRXhwcmVzc2lvbih0ZXJtXzkxNCkge1xuICAgIHJldHVybiB0ZXJtXzkxNDtcbiAgfVxufVxuIl19