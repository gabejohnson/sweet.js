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
  function TermExpander(context_772) {
    _classCallCheck(this, TermExpander);

    this.context = context_772;
  }

  _createClass(TermExpander, [{
    key: "expand",
    value: function expand(term_773) {
      var field_774 = "expand" + term_773.type;
      if (typeof this[field_774] === "function") {
        return this[field_774](term_773);
      }
      (0, _errors.assert)(false, "expand not implemented yet for: " + term_773.type);
    }
  }, {
    key: "expandTemplateExpression",
    value: function expandTemplateExpression(term_775) {
      return new _terms2.default("TemplateExpression", { tag: term_775.tag == null ? null : this.expand(term_775.tag), elements: term_775.elements.toArray() });
    }
  }, {
    key: "expandBreakStatement",
    value: function expandBreakStatement(term_776) {
      return new _terms2.default("BreakStatement", { label: term_776.label ? term_776.label.val() : null });
    }
  }, {
    key: "expandDoWhileStatement",
    value: function expandDoWhileStatement(term_777) {
      return new _terms2.default("DoWhileStatement", { body: this.expand(term_777.body), test: this.expand(term_777.test) });
    }
  }, {
    key: "expandWithStatement",
    value: function expandWithStatement(term_778) {
      return new _terms2.default("WithStatement", { body: this.expand(term_778.body), object: this.expand(term_778.object) });
    }
  }, {
    key: "expandDebuggerStatement",
    value: function expandDebuggerStatement(term_779) {
      return term_779;
    }
  }, {
    key: "expandContinueStatement",
    value: function expandContinueStatement(term_780) {
      return new _terms2.default("ContinueStatement", { label: term_780.label ? term_780.label.val() : null });
    }
  }, {
    key: "expandSwitchStatementWithDefault",
    value: function expandSwitchStatementWithDefault(term_781) {
      var _this = this;

      return new _terms2.default("SwitchStatementWithDefault", { discriminant: this.expand(term_781.discriminant), preDefaultCases: term_781.preDefaultCases.map(function (c_782) {
          return _this.expand(c_782);
        }).toArray(), defaultCase: this.expand(term_781.defaultCase), postDefaultCases: term_781.postDefaultCases.map(function (c_783) {
          return _this.expand(c_783);
        }).toArray() });
    }
  }, {
    key: "expandComputedMemberExpression",
    value: function expandComputedMemberExpression(term_784) {
      return new _terms2.default("ComputedMemberExpression", { object: this.expand(term_784.object), expression: this.expand(term_784.expression) });
    }
  }, {
    key: "expandSwitchStatement",
    value: function expandSwitchStatement(term_785) {
      var _this2 = this;

      return new _terms2.default("SwitchStatement", { discriminant: this.expand(term_785.discriminant), cases: term_785.cases.map(function (c_786) {
          return _this2.expand(c_786);
        }).toArray() });
    }
  }, {
    key: "expandFormalParameters",
    value: function expandFormalParameters(term_787) {
      var _this3 = this;

      var rest_788 = term_787.rest == null ? null : this.expand(term_787.rest);
      return new _terms2.default("FormalParameters", { items: term_787.items.map(function (i_789) {
          return _this3.expand(i_789);
        }), rest: rest_788 });
    }
  }, {
    key: "expandArrowExpression",
    value: function expandArrowExpression(term_790) {
      return this.doFunctionExpansion(term_790, "ArrowExpression");
    }
  }, {
    key: "expandSwitchDefault",
    value: function expandSwitchDefault(term_791) {
      var _this4 = this;

      return new _terms2.default("SwitchDefault", { consequent: term_791.consequent.map(function (c_792) {
          return _this4.expand(c_792);
        }).toArray() });
    }
  }, {
    key: "expandSwitchCase",
    value: function expandSwitchCase(term_793) {
      var _this5 = this;

      return new _terms2.default("SwitchCase", { test: this.expand(term_793.test), consequent: term_793.consequent.map(function (c_794) {
          return _this5.expand(c_794);
        }).toArray() });
    }
  }, {
    key: "expandForInStatement",
    value: function expandForInStatement(term_795) {
      return new _terms2.default("ForInStatement", { left: this.expand(term_795.left), right: this.expand(term_795.right), body: this.expand(term_795.body) });
    }
  }, {
    key: "expandTryCatchStatement",
    value: function expandTryCatchStatement(term_796) {
      return new _terms2.default("TryCatchStatement", { body: this.expand(term_796.body), catchClause: this.expand(term_796.catchClause) });
    }
  }, {
    key: "expandTryFinallyStatement",
    value: function expandTryFinallyStatement(term_797) {
      var catchClause_798 = term_797.catchClause == null ? null : this.expand(term_797.catchClause);
      return new _terms2.default("TryFinallyStatement", { body: this.expand(term_797.body), catchClause: catchClause_798, finalizer: this.expand(term_797.finalizer) });
    }
  }, {
    key: "expandCatchClause",
    value: function expandCatchClause(term_799) {
      return new _terms2.default("CatchClause", { binding: this.expand(term_799.binding), body: this.expand(term_799.body) });
    }
  }, {
    key: "expandThrowStatement",
    value: function expandThrowStatement(term_800) {
      return new _terms2.default("ThrowStatement", { expression: this.expand(term_800.expression) });
    }
  }, {
    key: "expandForOfStatement",
    value: function expandForOfStatement(term_801) {
      return new _terms2.default("ForOfStatement", { left: this.expand(term_801.left), right: this.expand(term_801.right), body: this.expand(term_801.body) });
    }
  }, {
    key: "expandBindingIdentifier",
    value: function expandBindingIdentifier(term_802) {
      return term_802;
    }
  }, {
    key: "expandBindingPropertyIdentifier",
    value: function expandBindingPropertyIdentifier(term_803) {
      return term_803;
    }
  }, {
    key: "expandBindingPropertyProperty",
    value: function expandBindingPropertyProperty(term_804) {
      return new _terms2.default("BindingPropertyProperty", { name: this.expand(term_804.name), binding: this.expand(term_804.binding) });
    }
  }, {
    key: "expandComputedPropertyName",
    value: function expandComputedPropertyName(term_805) {
      return new _terms2.default("ComputedPropertyName", { expression: this.expand(term_805.expression) });
    }
  }, {
    key: "expandObjectBinding",
    value: function expandObjectBinding(term_806) {
      var _this6 = this;

      return new _terms2.default("ObjectBinding", { properties: term_806.properties.map(function (t_807) {
          return _this6.expand(t_807);
        }).toArray() });
    }
  }, {
    key: "expandArrayBinding",
    value: function expandArrayBinding(term_808) {
      var _this7 = this;

      var restElement_809 = term_808.restElement == null ? null : this.expand(term_808.restElement);
      return new _terms2.default("ArrayBinding", { elements: term_808.elements.map(function (t_810) {
          return t_810 == null ? null : _this7.expand(t_810);
        }).toArray(), restElement: restElement_809 });
    }
  }, {
    key: "expandBindingWithDefault",
    value: function expandBindingWithDefault(term_811) {
      return new _terms2.default("BindingWithDefault", { binding: this.expand(term_811.binding), init: this.expand(term_811.init) });
    }
  }, {
    key: "expandShorthandProperty",
    value: function expandShorthandProperty(term_812) {
      return new _terms2.default("DataProperty", { name: new _terms2.default("StaticPropertyName", { value: term_812.name }), expression: new _terms2.default("IdentifierExpression", { name: term_812.name }) });
    }
  }, {
    key: "expandForStatement",
    value: function expandForStatement(term_813) {
      var init_814 = term_813.init == null ? null : this.expand(term_813.init);
      var test_815 = term_813.test == null ? null : this.expand(term_813.test);
      var update_816 = term_813.update == null ? null : this.expand(term_813.update);
      var body_817 = this.expand(term_813.body);
      return new _terms2.default("ForStatement", { init: init_814, test: test_815, update: update_816, body: body_817 });
    }
  }, {
    key: "expandYieldExpression",
    value: function expandYieldExpression(term_818) {
      var expr_819 = term_818.expression == null ? null : this.expand(term_818.expression);
      return new _terms2.default("YieldExpression", { expression: expr_819 });
    }
  }, {
    key: "expandYieldGeneratorExpression",
    value: function expandYieldGeneratorExpression(term_820) {
      var expr_821 = term_820.expression == null ? null : this.expand(term_820.expression);
      return new _terms2.default("YieldGeneratorExpression", { expression: expr_821 });
    }
  }, {
    key: "expandWhileStatement",
    value: function expandWhileStatement(term_822) {
      return new _terms2.default("WhileStatement", { test: this.expand(term_822.test), body: this.expand(term_822.body) });
    }
  }, {
    key: "expandIfStatement",
    value: function expandIfStatement(term_823) {
      var consequent_824 = term_823.consequent == null ? null : this.expand(term_823.consequent);
      var alternate_825 = term_823.alternate == null ? null : this.expand(term_823.alternate);
      return new _terms2.default("IfStatement", { test: this.expand(term_823.test), consequent: consequent_824, alternate: alternate_825 });
    }
  }, {
    key: "expandBlockStatement",
    value: function expandBlockStatement(term_826) {
      return new _terms2.default("BlockStatement", { block: this.expand(term_826.block) });
    }
  }, {
    key: "expandBlock",
    value: function expandBlock(term_827) {
      var _this8 = this;

      return new _terms2.default("Block", { statements: term_827.statements.map(function (s_828) {
          return _this8.expand(s_828);
        }).toArray() });
    }
  }, {
    key: "expandVariableDeclarationStatement",
    value: function expandVariableDeclarationStatement(term_829) {
      return new _terms2.default("VariableDeclarationStatement", { declaration: this.expand(term_829.declaration) });
    }
  }, {
    key: "expandReturnStatement",
    value: function expandReturnStatement(term_830) {
      if (term_830.expression == null) {
        return term_830;
      }
      return new _terms2.default("ReturnStatement", { expression: this.expand(term_830.expression) });
    }
  }, {
    key: "expandClassDeclaration",
    value: function expandClassDeclaration(term_831) {
      var _this9 = this;

      return new _terms2.default("ClassDeclaration", { name: term_831.name == null ? null : this.expand(term_831.name), super: term_831.super == null ? null : this.expand(term_831.super), elements: term_831.elements.map(function (el_832) {
          return _this9.expand(el_832);
        }).toArray() });
    }
  }, {
    key: "expandClassExpression",
    value: function expandClassExpression(term_833) {
      var _this10 = this;

      return new _terms2.default("ClassExpression", { name: term_833.name == null ? null : this.expand(term_833.name), super: term_833.super == null ? null : this.expand(term_833.super), elements: term_833.elements.map(function (el_834) {
          return _this10.expand(el_834);
        }).toArray() });
    }
  }, {
    key: "expandClassElement",
    value: function expandClassElement(term_835) {
      return new _terms2.default("ClassElement", { isStatic: term_835.isStatic, method: this.expand(term_835.method) });
    }
  }, {
    key: "expandThisExpression",
    value: function expandThisExpression(term_836) {
      return term_836;
    }
  }, {
    key: "expandSyntaxTemplate",
    value: function expandSyntaxTemplate(term_837) {
      var _this11 = this;

      var r_838 = (0, _templateProcessor.processTemplate)(term_837.template.inner());
      var str_839 = _syntax2.default.fromString(_serializer.serializer.write(r_838.template));
      var callee_840 = new _terms2.default("IdentifierExpression", { name: _syntax2.default.fromIdentifier("syntaxTemplate") });
      var expandedInterps_841 = r_838.interp.map(function (i_843) {
        var enf_844 = new _enforester.Enforester(i_843, (0, _immutable.List)(), _this11.context);
        return _this11.expand(enf_844.enforest("expression"));
      });
      var args_842 = _immutable.List.of(new _terms2.default("LiteralStringExpression", { value: str_839 })).concat(expandedInterps_841);
      return new _terms2.default("CallExpression", { callee: callee_840, arguments: args_842 });
    }
  }, {
    key: "expandSyntaxQuote",
    value: function expandSyntaxQuote(term_845) {
      var str_846 = new _terms2.default("LiteralStringExpression", { value: _syntax2.default.fromString(_serializer.serializer.write(term_845.name)) });
      return new _terms2.default("TemplateExpression", { tag: term_845.template.tag, elements: term_845.template.elements.push(str_846).push(new _terms2.default("TemplateElement", { rawValue: "" })).toArray() });
    }
  }, {
    key: "expandStaticMemberExpression",
    value: function expandStaticMemberExpression(term_847) {
      return new _terms2.default("StaticMemberExpression", { object: this.expand(term_847.object), property: term_847.property });
    }
  }, {
    key: "expandArrayExpression",
    value: function expandArrayExpression(term_848) {
      var _this12 = this;

      return new _terms2.default("ArrayExpression", { elements: term_848.elements.map(function (t_849) {
          return t_849 == null ? t_849 : _this12.expand(t_849);
        }) });
    }
  }, {
    key: "expandImport",
    value: function expandImport(term_850) {
      return term_850;
    }
  }, {
    key: "expandImportNamespace",
    value: function expandImportNamespace(term_851) {
      return term_851;
    }
  }, {
    key: "expandExport",
    value: function expandExport(term_852) {
      return new _terms2.default("Export", { declaration: this.expand(term_852.declaration) });
    }
  }, {
    key: "expandExportDefault",
    value: function expandExportDefault(term_853) {
      return new _terms2.default("ExportDefault", { body: this.expand(term_853.body) });
    }
  }, {
    key: "expandExportFrom",
    value: function expandExportFrom(term_854) {
      return term_854;
    }
  }, {
    key: "expandExportAllFrom",
    value: function expandExportAllFrom(term_855) {
      return term_855;
    }
  }, {
    key: "expandExportSpecifier",
    value: function expandExportSpecifier(term_856) {
      return term_856;
    }
  }, {
    key: "expandStaticPropertyName",
    value: function expandStaticPropertyName(term_857) {
      return term_857;
    }
  }, {
    key: "expandDataProperty",
    value: function expandDataProperty(term_858) {
      return new _terms2.default("DataProperty", { name: this.expand(term_858.name), expression: this.expand(term_858.expression) });
    }
  }, {
    key: "expandObjectExpression",
    value: function expandObjectExpression(term_859) {
      var _this13 = this;

      return new _terms2.default("ObjectExpression", { properties: term_859.properties.map(function (t_860) {
          return _this13.expand(t_860);
        }) });
    }
  }, {
    key: "expandVariableDeclarator",
    value: function expandVariableDeclarator(term_861) {
      var init_862 = term_861.init == null ? null : this.expand(term_861.init);
      return new _terms2.default("VariableDeclarator", { binding: this.expand(term_861.binding), init: init_862 });
    }
  }, {
    key: "expandVariableDeclaration",
    value: function expandVariableDeclaration(term_863) {
      var _this14 = this;

      return new _terms2.default("VariableDeclaration", { kind: term_863.kind, declarators: term_863.declarators.map(function (d_864) {
          return _this14.expand(d_864);
        }) });
    }
  }, {
    key: "expandParenthesizedExpression",
    value: function expandParenthesizedExpression(term_865) {
      if (term_865.inner.size === 0) {
        throw new Error("unexpected end of input");
      }
      var enf_866 = new _enforester.Enforester(term_865.inner, (0, _immutable.List)(), this.context);
      var lookahead_867 = enf_866.peek();
      var t_868 = enf_866.enforestExpression();
      if (t_868 == null || enf_866.rest.size > 0) {
        throw enf_866.createError(lookahead_867, "unexpected syntax");
      }
      return this.expand(t_868);
    }
  }, {
    key: "expandUnaryExpression",
    value: function expandUnaryExpression(term_869) {
      return new _terms2.default("UnaryExpression", { operator: term_869.operator, operand: this.expand(term_869.operand) });
    }
  }, {
    key: "expandUpdateExpression",
    value: function expandUpdateExpression(term_870) {
      return new _terms2.default("UpdateExpression", { isPrefix: term_870.isPrefix, operator: term_870.operator, operand: this.expand(term_870.operand) });
    }
  }, {
    key: "expandBinaryExpression",
    value: function expandBinaryExpression(term_871) {
      var left_872 = this.expand(term_871.left);
      var right_873 = this.expand(term_871.right);
      return new _terms2.default("BinaryExpression", { left: left_872, operator: term_871.operator, right: right_873 });
    }
  }, {
    key: "expandConditionalExpression",
    value: function expandConditionalExpression(term_874) {
      return new _terms2.default("ConditionalExpression", { test: this.expand(term_874.test), consequent: this.expand(term_874.consequent), alternate: this.expand(term_874.alternate) });
    }
  }, {
    key: "expandNewTargetExpression",
    value: function expandNewTargetExpression(term_875) {
      return term_875;
    }
  }, {
    key: "expandNewExpression",
    value: function expandNewExpression(term_876) {
      var _this15 = this;

      var callee_877 = this.expand(term_876.callee);
      var enf_878 = new _enforester.Enforester(term_876.arguments, (0, _immutable.List)(), this.context);
      var args_879 = enf_878.enforestArgumentList().map(function (arg_880) {
        return _this15.expand(arg_880);
      });
      return new _terms2.default("NewExpression", { callee: callee_877, arguments: args_879.toArray() });
    }
  }, {
    key: "expandSuper",
    value: function expandSuper(term_881) {
      return term_881;
    }
  }, {
    key: "expandCallExpression",
    value: function expandCallExpression(term_882) {
      var _this16 = this;

      var callee_883 = this.expand(term_882.callee);
      var enf_884 = new _enforester.Enforester(term_882.arguments, (0, _immutable.List)(), this.context);
      var args_885 = enf_884.enforestArgumentList().map(function (arg_886) {
        return _this16.expand(arg_886);
      });
      return new _terms2.default("CallExpression", { callee: callee_883, arguments: args_885 });
    }
  }, {
    key: "expandSpreadElement",
    value: function expandSpreadElement(term_887) {
      return new _terms2.default("SpreadElement", { expression: this.expand(term_887.expression) });
    }
  }, {
    key: "expandExpressionStatement",
    value: function expandExpressionStatement(term_888) {
      var child_889 = this.expand(term_888.expression);
      return new _terms2.default("ExpressionStatement", { expression: child_889 });
    }
  }, {
    key: "expandLabeledStatement",
    value: function expandLabeledStatement(term_890) {
      return new _terms2.default("LabeledStatement", { label: term_890.label.val(), body: this.expand(term_890.body) });
    }
  }, {
    key: "doFunctionExpansion",
    value: function doFunctionExpansion(term_891, type_892) {
      var _this17 = this;

      var scope_893 = (0, _scope.freshScope)("fun");
      var red_894 = new _applyScopeInParamsReducer2.default(scope_893, this.context);
      var params_895 = void 0;
      if (type_892 !== "Getter" && type_892 !== "Setter") {
        params_895 = red_894.transform(term_891.params);
        params_895 = this.expand(params_895);
      }
      this.context.currentScope.push(scope_893);
      var compiler_896 = new _compiler2.default(this.context.phase, this.context.env, this.context.store, this.context);
      var markedBody_897 = void 0,
          bodyTerm_898 = void 0;
      if (term_891.body instanceof _terms2.default) {
        bodyTerm_898 = this.expand(term_891.body.addScope(scope_893, this.context.bindings, _syntax.ALL_PHASES));
      } else {
        markedBody_897 = term_891.body.map(function (b_899) {
          return b_899.addScope(scope_893, _this17.context.bindings, _syntax.ALL_PHASES);
        });
        bodyTerm_898 = new _terms2.default("FunctionBody", { directives: (0, _immutable.List)(), statements: compiler_896.compile(markedBody_897) });
      }
      this.context.currentScope.pop();
      if (type_892 === "Getter") {
        return new _terms2.default(type_892, { name: this.expand(term_891.name), body: bodyTerm_898 });
      } else if (type_892 === "Setter") {
        return new _terms2.default(type_892, { name: this.expand(term_891.name), param: term_891.param, body: bodyTerm_898 });
      }
      return new _terms2.default(type_892, { name: term_891.name, isGenerator: term_891.isGenerator, params: params_895, body: bodyTerm_898 });
    }
  }, {
    key: "expandMethod",
    value: function expandMethod(term_900) {
      return this.doFunctionExpansion(term_900, "Method");
    }
  }, {
    key: "expandSetter",
    value: function expandSetter(term_901) {
      return this.doFunctionExpansion(term_901, "Setter");
    }
  }, {
    key: "expandGetter",
    value: function expandGetter(term_902) {
      return this.doFunctionExpansion(term_902, "Getter");
    }
  }, {
    key: "expandFunctionDeclaration",
    value: function expandFunctionDeclaration(term_903) {
      return this.doFunctionExpansion(term_903, "FunctionDeclaration");
    }
  }, {
    key: "expandFunctionExpression",
    value: function expandFunctionExpression(term_904) {
      return this.doFunctionExpansion(term_904, "FunctionExpression");
    }
  }, {
    key: "expandCompoundAssignmentExpression",
    value: function expandCompoundAssignmentExpression(term_905) {
      return new _terms2.default("CompoundAssignmentExpression", { binding: this.expand(term_905.binding), operator: term_905.operator, expression: this.expand(term_905.expression) });
    }
  }, {
    key: "expandAssignmentExpression",
    value: function expandAssignmentExpression(term_906) {
      return new _terms2.default("AssignmentExpression", { binding: this.expand(term_906.binding), expression: this.expand(term_906.expression) });
    }
  }, {
    key: "expandEmptyStatement",
    value: function expandEmptyStatement(term_907) {
      return term_907;
    }
  }, {
    key: "expandLiteralBooleanExpression",
    value: function expandLiteralBooleanExpression(term_908) {
      return term_908;
    }
  }, {
    key: "expandLiteralNumericExpression",
    value: function expandLiteralNumericExpression(term_909) {
      return term_909;
    }
  }, {
    key: "expandLiteralInfinityExpression",
    value: function expandLiteralInfinityExpression(term_910) {
      return term_910;
    }
  }, {
    key: "expandIdentifierExpression",
    value: function expandIdentifierExpression(term_911) {
      var trans_912 = this.context.env.get(term_911.name.resolve(this.context.phase));
      if (trans_912) {
        return new _terms2.default("IdentifierExpression", { name: trans_912.id });
      }
      return term_911;
    }
  }, {
    key: "expandLiteralNullExpression",
    value: function expandLiteralNullExpression(term_913) {
      return term_913;
    }
  }, {
    key: "expandLiteralStringExpression",
    value: function expandLiteralStringExpression(term_914) {
      return term_914;
    }
  }, {
    key: "expandLiteralRegExpExpression",
    value: function expandLiteralRegExpExpression(term_915) {
      return term_915;
    }
  }]);

  return TermExpander;
}();

exports.default = TermExpander;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3N3ZWV0L3Rlcm0tZXhwYW5kZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztJQUNxQixZO0FBQ25CLHdCQUFZLFdBQVosRUFBeUI7QUFBQTs7QUFDdkIsU0FBSyxPQUFMLEdBQWUsV0FBZjtBQUNEOzs7OzJCQUNNLFEsRUFBVTtBQUNmLFVBQUksWUFBWSxXQUFXLFNBQVMsSUFBcEM7QUFDQSxVQUFJLE9BQU8sS0FBSyxTQUFMLENBQVAsS0FBMkIsVUFBL0IsRUFBMkM7QUFDekMsZUFBTyxLQUFLLFNBQUwsRUFBZ0IsUUFBaEIsQ0FBUDtBQUNEO0FBQ0QsMEJBQU8sS0FBUCxFQUFjLHFDQUFxQyxTQUFTLElBQTVEO0FBQ0Q7Ozs2Q0FDd0IsUSxFQUFVO0FBQ2pDLGFBQU8sb0JBQVMsb0JBQVQsRUFBK0IsRUFBQyxLQUFLLFNBQVMsR0FBVCxJQUFnQixJQUFoQixHQUF1QixJQUF2QixHQUE4QixLQUFLLE1BQUwsQ0FBWSxTQUFTLEdBQXJCLENBQXBDLEVBQStELFVBQVUsU0FBUyxRQUFULENBQWtCLE9BQWxCLEVBQXpFLEVBQS9CLENBQVA7QUFDRDs7O3lDQUNvQixRLEVBQVU7QUFDN0IsYUFBTyxvQkFBUyxnQkFBVCxFQUEyQixFQUFDLE9BQU8sU0FBUyxLQUFULEdBQWlCLFNBQVMsS0FBVCxDQUFlLEdBQWYsRUFBakIsR0FBd0MsSUFBaEQsRUFBM0IsQ0FBUDtBQUNEOzs7MkNBQ3NCLFEsRUFBVTtBQUMvQixhQUFPLG9CQUFTLGtCQUFULEVBQTZCLEVBQUMsTUFBTSxLQUFLLE1BQUwsQ0FBWSxTQUFTLElBQXJCLENBQVAsRUFBbUMsTUFBTSxLQUFLLE1BQUwsQ0FBWSxTQUFTLElBQXJCLENBQXpDLEVBQTdCLENBQVA7QUFDRDs7O3dDQUNtQixRLEVBQVU7QUFDNUIsYUFBTyxvQkFBUyxl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QXJCLENBQVYsRUFBeUMsVUFBVSxTQUFTLFFBQTVELEVBQXNFLFlBQVksS0FBSyxNQUFMLENBQVksU0FBUyxVQUFyQixDQUFsRixFQUF6QyxDQUFQO0FBQ0Q7OzsrQ0FDMEIsUSxFQUFVO0FBQ25DLGFBQU8sb0JBQVMsc0JBQVQsRUFBaUMsRUFBQyxTQUFTLEtBQUssTUFBTCxDQUFZLFNBQVMsT0FBckIsQ0FBVixFQUF5QyxZQUFZLEtBQUssTUFBTCxDQUFZLFNBQVMsVUFBckIsQ0FBckQsRUFBakMsQ0FBUDtBQUNEOzs7eUNBQ29CLFEsRUFBVTtBQUM3QixhQUFPLFFBQVA7QUFDRDs7O21EQUM4QixRLEVBQVU7QUFDdkMsYUFBTyxRQUFQO0FBQ0Q7OzttREFDOEIsUSxFQUFVO0FBQ3ZDLGFBQU8sUUFBUDtBQUNEOzs7b0RBQytCLFEsRUFBVTtBQUN4QyxhQUFPLFFBQVA7QUFDRDs7OytDQUMwQixRLEVBQVU7QUFDbkMsVUFBSSxZQUFZLEtBQUssT0FBTCxDQUFhLEdBQWIsQ0FBaUIsR0FBakIsQ0FBcUIsU0FBUyxJQUFULENBQWMsT0FBZCxDQUFzQixLQUFLLE9BQUwsQ0FBYSxLQUFuQyxDQUFyQixDQUFoQjtBQUNBLFVBQUksU0FBSixFQUFlO0FBQ2IsZUFBTyxvQkFBUyxzQkFBVCxFQUFpQyxFQUFDLE1BQU0sVUFBVSxFQUFqQixFQUFqQyxDQUFQO0FBQ0Q7QUFDRCxhQUFPLFFBQVA7QUFDRDs7O2dEQUMyQixRLEVBQVU7QUFDcEMsYUFBTyxRQUFQO0FBQ0Q7OztrREFDNkIsUSxFQUFVO0FBQ3RDLGFBQU8sUUFBUDtBQUNEOzs7a0RBQzZCLFEsRUFBVTtBQUN0QyxhQUFPLFFBQVA7QUFDRDs7Ozs7O2tCQTFVa0IsWSIsImZpbGUiOiJ0ZXJtLWV4cGFuZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtMaXN0fSBmcm9tIFwiaW1tdXRhYmxlXCI7XG5pbXBvcnQgVGVybSwge2lzRU9GLCBpc0JpbmRpbmdJZGVudGlmaWVyLCBpc0Z1bmN0aW9uRGVjbGFyYXRpb24sIGlzRnVuY3Rpb25FeHByZXNzaW9uLCBpc0Z1bmN0aW9uVGVybSwgaXNGdW5jdGlvbldpdGhOYW1lLCBpc1N5bnRheERlY2xhcmF0aW9uLCBpc1ZhcmlhYmxlRGVjbGFyYXRpb24sIGlzVmFyaWFibGVEZWNsYXJhdGlvblN0YXRlbWVudCwgaXNJbXBvcnQsIGlzRXhwb3J0fSBmcm9tIFwiLi90ZXJtc1wiO1xuaW1wb3J0IHtTY29wZSwgZnJlc2hTY29wZX0gZnJvbSBcIi4vc2NvcGVcIjtcbmltcG9ydCBBcHBseVNjb3BlSW5QYXJhbXNSZWR1Y2VyIGZyb20gXCIuL2FwcGx5LXNjb3BlLWluLXBhcmFtcy1yZWR1Y2VyXCI7XG5pbXBvcnQgcmVkdWNlciwge01vbm9pZGFsUmVkdWNlcn0gZnJvbSBcInNoaWZ0LXJlZHVjZXJcIjtcbmltcG9ydCBDb21waWxlciBmcm9tIFwiLi9jb21waWxlclwiO1xuaW1wb3J0IFN5bnRheCwge0FMTF9QSEFTRVN9IGZyb20gXCIuL3N5bnRheFwiO1xuaW1wb3J0IHtzZXJpYWxpemVyLCBtYWtlRGVzZXJpYWxpemVyfSBmcm9tIFwiLi9zZXJpYWxpemVyXCI7XG5pbXBvcnQge2VuZm9yZXN0RXhwciwgRW5mb3Jlc3Rlcn0gZnJvbSBcIi4vZW5mb3Jlc3RlclwiO1xuaW1wb3J0IHthc3NlcnR9IGZyb20gXCIuL2Vycm9yc1wiO1xuaW1wb3J0IHtwcm9jZXNzVGVtcGxhdGV9IGZyb20gXCIuL3RlbXBsYXRlLXByb2Nlc3Nvci5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVybUV4cGFuZGVyIHtcbiAgY29uc3RydWN0b3IoY29udGV4dF83NzIpIHtcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0Xzc3MjtcbiAgfVxuICBleHBhbmQodGVybV83NzMpIHtcbiAgICBsZXQgZmllbGRfNzc0ID0gXCJleHBhbmRcIiArIHRlcm1fNzczLnR5cGU7XG4gICAgaWYgKHR5cGVvZiB0aGlzW2ZpZWxkXzc3NF0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgcmV0dXJuIHRoaXNbZmllbGRfNzc0XSh0ZXJtXzc3Myk7XG4gICAgfVxuICAgIGFzc2VydChmYWxzZSwgXCJleHBhbmQgbm90IGltcGxlbWVudGVkIHlldCBmb3I6IFwiICsgdGVybV83NzMudHlwZSk7XG4gIH1cbiAgZXhwYW5kVGVtcGxhdGVFeHByZXNzaW9uKHRlcm1fNzc1KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiVGVtcGxhdGVFeHByZXNzaW9uXCIsIHt0YWc6IHRlcm1fNzc1LnRhZyA9PSBudWxsID8gbnVsbCA6IHRoaXMuZXhwYW5kKHRlcm1fNzc1LnRhZyksIGVsZW1lbnRzOiB0ZXJtXzc3NS5lbGVtZW50cy50b0FycmF5KCl9KTtcbiAgfVxuICBleHBhbmRCcmVha1N0YXRlbWVudCh0ZXJtXzc3Nikge1xuICAgIHJldHVybiBuZXcgVGVybShcIkJyZWFrU3RhdGVtZW50XCIsIHtsYWJlbDogdGVybV83NzYubGFiZWwgPyB0ZXJtXzc3Ni5sYWJlbC52YWwoKSA6IG51bGx9KTtcbiAgfVxuICBleHBhbmREb1doaWxlU3RhdGVtZW50KHRlcm1fNzc3KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiRG9XaGlsZVN0YXRlbWVudFwiLCB7Ym9keTogdGhpcy5leHBhbmQodGVybV83NzcuYm9keSksIHRlc3Q6IHRoaXMuZXhwYW5kKHRlcm1fNzc3LnRlc3QpfSk7XG4gIH1cbiAgZXhwYW5kV2l0aFN0YXRlbWVudCh0ZXJtXzc3OCkge1xuICAgIHJldHVybiBuZXcgVGVybShcIldpdGhTdGF0ZW1lbnRcIiwge2JvZHk6IHRoaXMuZXhwYW5kKHRlcm1fNzc4LmJvZHkpLCBvYmplY3Q6IHRoaXMuZXhwYW5kKHRlcm1fNzc4Lm9iamVjdCl9KTtcbiAgfVxuICBleHBhbmREZWJ1Z2dlclN0YXRlbWVudCh0ZXJtXzc3OSkge1xuICAgIHJldHVybiB0ZXJtXzc3OTtcbiAgfVxuICBleHBhbmRDb250aW51ZVN0YXRlbWVudCh0ZXJtXzc4MCkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkNvbnRpbnVlU3RhdGVtZW50XCIsIHtsYWJlbDogdGVybV83ODAubGFiZWwgPyB0ZXJtXzc4MC5sYWJlbC52YWwoKSA6IG51bGx9KTtcbiAgfVxuICBleHBhbmRTd2l0Y2hTdGF0ZW1lbnRXaXRoRGVmYXVsdCh0ZXJtXzc4MSkge1xuICAgIHJldHVybiBuZXcgVGVybShcIlN3aXRjaFN0YXRlbWVudFdpdGhEZWZhdWx0XCIsIHtkaXNjcmltaW5hbnQ6IHRoaXMuZXhwYW5kKHRlcm1fNzgxLmRpc2NyaW1pbmFudCksIHByZURlZmF1bHRDYXNlczogdGVybV83ODEucHJlRGVmYXVsdENhc2VzLm1hcChjXzc4MiA9PiB0aGlzLmV4cGFuZChjXzc4MikpLnRvQXJyYXkoKSwgZGVmYXVsdENhc2U6IHRoaXMuZXhwYW5kKHRlcm1fNzgxLmRlZmF1bHRDYXNlKSwgcG9zdERlZmF1bHRDYXNlczogdGVybV83ODEucG9zdERlZmF1bHRDYXNlcy5tYXAoY183ODMgPT4gdGhpcy5leHBhbmQoY183ODMpKS50b0FycmF5KCl9KTtcbiAgfVxuICBleHBhbmRDb21wdXRlZE1lbWJlckV4cHJlc3Npb24odGVybV83ODQpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJDb21wdXRlZE1lbWJlckV4cHJlc3Npb25cIiwge29iamVjdDogdGhpcy5leHBhbmQodGVybV83ODQub2JqZWN0KSwgZXhwcmVzc2lvbjogdGhpcy5leHBhbmQodGVybV83ODQuZXhwcmVzc2lvbil9KTtcbiAgfVxuICBleHBhbmRTd2l0Y2hTdGF0ZW1lbnQodGVybV83ODUpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJTd2l0Y2hTdGF0ZW1lbnRcIiwge2Rpc2NyaW1pbmFudDogdGhpcy5leHBhbmQodGVybV83ODUuZGlzY3JpbWluYW50KSwgY2FzZXM6IHRlcm1fNzg1LmNhc2VzLm1hcChjXzc4NiA9PiB0aGlzLmV4cGFuZChjXzc4NikpLnRvQXJyYXkoKX0pO1xuICB9XG4gIGV4cGFuZEZvcm1hbFBhcmFtZXRlcnModGVybV83ODcpIHtcbiAgICBsZXQgcmVzdF83ODggPSB0ZXJtXzc4Ny5yZXN0ID09IG51bGwgPyBudWxsIDogdGhpcy5leHBhbmQodGVybV83ODcucmVzdCk7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiRm9ybWFsUGFyYW1ldGVyc1wiLCB7aXRlbXM6IHRlcm1fNzg3Lml0ZW1zLm1hcChpXzc4OSA9PiB0aGlzLmV4cGFuZChpXzc4OSkpLCByZXN0OiByZXN0Xzc4OH0pO1xuICB9XG4gIGV4cGFuZEFycm93RXhwcmVzc2lvbih0ZXJtXzc5MCkge1xuICAgIHJldHVybiB0aGlzLmRvRnVuY3Rpb25FeHBhbnNpb24odGVybV83OTAsIFwiQXJyb3dFeHByZXNzaW9uXCIpO1xuICB9XG4gIGV4cGFuZFN3aXRjaERlZmF1bHQodGVybV83OTEpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJTd2l0Y2hEZWZhdWx0XCIsIHtjb25zZXF1ZW50OiB0ZXJtXzc5MS5jb25zZXF1ZW50Lm1hcChjXzc5MiA9PiB0aGlzLmV4cGFuZChjXzc5MikpLnRvQXJyYXkoKX0pO1xuICB9XG4gIGV4cGFuZFN3aXRjaENhc2UodGVybV83OTMpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJTd2l0Y2hDYXNlXCIsIHt0ZXN0OiB0aGlzLmV4cGFuZCh0ZXJtXzc5My50ZXN0KSwgY29uc2VxdWVudDogdGVybV83OTMuY29uc2VxdWVudC5tYXAoY183OTQgPT4gdGhpcy5leHBhbmQoY183OTQpKS50b0FycmF5KCl9KTtcbiAgfVxuICBleHBhbmRGb3JJblN0YXRlbWVudCh0ZXJtXzc5NSkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkZvckluU3RhdGVtZW50XCIsIHtsZWZ0OiB0aGlzLmV4cGFuZCh0ZXJtXzc5NS5sZWZ0KSwgcmlnaHQ6IHRoaXMuZXhwYW5kKHRlcm1fNzk1LnJpZ2h0KSwgYm9keTogdGhpcy5leHBhbmQodGVybV83OTUuYm9keSl9KTtcbiAgfVxuICBleHBhbmRUcnlDYXRjaFN0YXRlbWVudCh0ZXJtXzc5Nikge1xuICAgIHJldHVybiBuZXcgVGVybShcIlRyeUNhdGNoU3RhdGVtZW50XCIsIHtib2R5OiB0aGlzLmV4cGFuZCh0ZXJtXzc5Ni5ib2R5KSwgY2F0Y2hDbGF1c2U6IHRoaXMuZXhwYW5kKHRlcm1fNzk2LmNhdGNoQ2xhdXNlKX0pO1xuICB9XG4gIGV4cGFuZFRyeUZpbmFsbHlTdGF0ZW1lbnQodGVybV83OTcpIHtcbiAgICBsZXQgY2F0Y2hDbGF1c2VfNzk4ID0gdGVybV83OTcuY2F0Y2hDbGF1c2UgPT0gbnVsbCA/IG51bGwgOiB0aGlzLmV4cGFuZCh0ZXJtXzc5Ny5jYXRjaENsYXVzZSk7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiVHJ5RmluYWxseVN0YXRlbWVudFwiLCB7Ym9keTogdGhpcy5leHBhbmQodGVybV83OTcuYm9keSksIGNhdGNoQ2xhdXNlOiBjYXRjaENsYXVzZV83OTgsIGZpbmFsaXplcjogdGhpcy5leHBhbmQodGVybV83OTcuZmluYWxpemVyKX0pO1xuICB9XG4gIGV4cGFuZENhdGNoQ2xhdXNlKHRlcm1fNzk5KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQ2F0Y2hDbGF1c2VcIiwge2JpbmRpbmc6IHRoaXMuZXhwYW5kKHRlcm1fNzk5LmJpbmRpbmcpLCBib2R5OiB0aGlzLmV4cGFuZCh0ZXJtXzc5OS5ib2R5KX0pO1xuICB9XG4gIGV4cGFuZFRocm93U3RhdGVtZW50KHRlcm1fODAwKSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiVGhyb3dTdGF0ZW1lbnRcIiwge2V4cHJlc3Npb246IHRoaXMuZXhwYW5kKHRlcm1fODAwLmV4cHJlc3Npb24pfSk7XG4gIH1cbiAgZXhwYW5kRm9yT2ZTdGF0ZW1lbnQodGVybV84MDEpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJGb3JPZlN0YXRlbWVudFwiLCB7bGVmdDogdGhpcy5leHBhbmQodGVybV84MDEubGVmdCksIHJpZ2h0OiB0aGlzLmV4cGFuZCh0ZXJtXzgwMS5yaWdodCksIGJvZHk6IHRoaXMuZXhwYW5kKHRlcm1fODAxLmJvZHkpfSk7XG4gIH1cbiAgZXhwYW5kQmluZGluZ0lkZW50aWZpZXIodGVybV84MDIpIHtcbiAgICByZXR1cm4gdGVybV84MDI7XG4gIH1cbiAgZXhwYW5kQmluZGluZ1Byb3BlcnR5SWRlbnRpZmllcih0ZXJtXzgwMykge1xuICAgIHJldHVybiB0ZXJtXzgwMztcbiAgfVxuICBleHBhbmRCaW5kaW5nUHJvcGVydHlQcm9wZXJ0eSh0ZXJtXzgwNCkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkJpbmRpbmdQcm9wZXJ0eVByb3BlcnR5XCIsIHtuYW1lOiB0aGlzLmV4cGFuZCh0ZXJtXzgwNC5uYW1lKSwgYmluZGluZzogdGhpcy5leHBhbmQodGVybV84MDQuYmluZGluZyl9KTtcbiAgfVxuICBleHBhbmRDb21wdXRlZFByb3BlcnR5TmFtZSh0ZXJtXzgwNSkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkNvbXB1dGVkUHJvcGVydHlOYW1lXCIsIHtleHByZXNzaW9uOiB0aGlzLmV4cGFuZCh0ZXJtXzgwNS5leHByZXNzaW9uKX0pO1xuICB9XG4gIGV4cGFuZE9iamVjdEJpbmRpbmcodGVybV84MDYpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJPYmplY3RCaW5kaW5nXCIsIHtwcm9wZXJ0aWVzOiB0ZXJtXzgwNi5wcm9wZXJ0aWVzLm1hcCh0XzgwNyA9PiB0aGlzLmV4cGFuZCh0XzgwNykpLnRvQXJyYXkoKX0pO1xuICB9XG4gIGV4cGFuZEFycmF5QmluZGluZyh0ZXJtXzgwOCkge1xuICAgIGxldCByZXN0RWxlbWVudF84MDkgPSB0ZXJtXzgwOC5yZXN0RWxlbWVudCA9PSBudWxsID8gbnVsbCA6IHRoaXMuZXhwYW5kKHRlcm1fODA4LnJlc3RFbGVtZW50KTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJBcnJheUJpbmRpbmdcIiwge2VsZW1lbnRzOiB0ZXJtXzgwOC5lbGVtZW50cy5tYXAodF84MTAgPT4gdF84MTAgPT0gbnVsbCA/IG51bGwgOiB0aGlzLmV4cGFuZCh0XzgxMCkpLnRvQXJyYXkoKSwgcmVzdEVsZW1lbnQ6IHJlc3RFbGVtZW50XzgwOX0pO1xuICB9XG4gIGV4cGFuZEJpbmRpbmdXaXRoRGVmYXVsdCh0ZXJtXzgxMSkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkJpbmRpbmdXaXRoRGVmYXVsdFwiLCB7YmluZGluZzogdGhpcy5leHBhbmQodGVybV84MTEuYmluZGluZyksIGluaXQ6IHRoaXMuZXhwYW5kKHRlcm1fODExLmluaXQpfSk7XG4gIH1cbiAgZXhwYW5kU2hvcnRoYW5kUHJvcGVydHkodGVybV84MTIpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJEYXRhUHJvcGVydHlcIiwge25hbWU6IG5ldyBUZXJtKFwiU3RhdGljUHJvcGVydHlOYW1lXCIsIHt2YWx1ZTogdGVybV84MTIubmFtZX0pLCBleHByZXNzaW9uOiBuZXcgVGVybShcIklkZW50aWZpZXJFeHByZXNzaW9uXCIsIHtuYW1lOiB0ZXJtXzgxMi5uYW1lfSl9KTtcbiAgfVxuICBleHBhbmRGb3JTdGF0ZW1lbnQodGVybV84MTMpIHtcbiAgICBsZXQgaW5pdF84MTQgPSB0ZXJtXzgxMy5pbml0ID09IG51bGwgPyBudWxsIDogdGhpcy5leHBhbmQodGVybV84MTMuaW5pdCk7XG4gICAgbGV0IHRlc3RfODE1ID0gdGVybV84MTMudGVzdCA9PSBudWxsID8gbnVsbCA6IHRoaXMuZXhwYW5kKHRlcm1fODEzLnRlc3QpO1xuICAgIGxldCB1cGRhdGVfODE2ID0gdGVybV84MTMudXBkYXRlID09IG51bGwgPyBudWxsIDogdGhpcy5leHBhbmQodGVybV84MTMudXBkYXRlKTtcbiAgICBsZXQgYm9keV84MTcgPSB0aGlzLmV4cGFuZCh0ZXJtXzgxMy5ib2R5KTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJGb3JTdGF0ZW1lbnRcIiwge2luaXQ6IGluaXRfODE0LCB0ZXN0OiB0ZXN0XzgxNSwgdXBkYXRlOiB1cGRhdGVfODE2LCBib2R5OiBib2R5XzgxN30pO1xuICB9XG4gIGV4cGFuZFlpZWxkRXhwcmVzc2lvbih0ZXJtXzgxOCkge1xuICAgIGxldCBleHByXzgxOSA9IHRlcm1fODE4LmV4cHJlc3Npb24gPT0gbnVsbCA/IG51bGwgOiB0aGlzLmV4cGFuZCh0ZXJtXzgxOC5leHByZXNzaW9uKTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJZaWVsZEV4cHJlc3Npb25cIiwge2V4cHJlc3Npb246IGV4cHJfODE5fSk7XG4gIH1cbiAgZXhwYW5kWWllbGRHZW5lcmF0b3JFeHByZXNzaW9uKHRlcm1fODIwKSB7XG4gICAgbGV0IGV4cHJfODIxID0gdGVybV84MjAuZXhwcmVzc2lvbiA9PSBudWxsID8gbnVsbCA6IHRoaXMuZXhwYW5kKHRlcm1fODIwLmV4cHJlc3Npb24pO1xuICAgIHJldHVybiBuZXcgVGVybShcIllpZWxkR2VuZXJhdG9yRXhwcmVzc2lvblwiLCB7ZXhwcmVzc2lvbjogZXhwcl84MjF9KTtcbiAgfVxuICBleHBhbmRXaGlsZVN0YXRlbWVudCh0ZXJtXzgyMikge1xuICAgIHJldHVybiBuZXcgVGVybShcIldoaWxlU3RhdGVtZW50XCIsIHt0ZXN0OiB0aGlzLmV4cGFuZCh0ZXJtXzgyMi50ZXN0KSwgYm9keTogdGhpcy5leHBhbmQodGVybV84MjIuYm9keSl9KTtcbiAgfVxuICBleHBhbmRJZlN0YXRlbWVudCh0ZXJtXzgyMykge1xuICAgIGxldCBjb25zZXF1ZW50XzgyNCA9IHRlcm1fODIzLmNvbnNlcXVlbnQgPT0gbnVsbCA/IG51bGwgOiB0aGlzLmV4cGFuZCh0ZXJtXzgyMy5jb25zZXF1ZW50KTtcbiAgICBsZXQgYWx0ZXJuYXRlXzgyNSA9IHRlcm1fODIzLmFsdGVybmF0ZSA9PSBudWxsID8gbnVsbCA6IHRoaXMuZXhwYW5kKHRlcm1fODIzLmFsdGVybmF0ZSk7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiSWZTdGF0ZW1lbnRcIiwge3Rlc3Q6IHRoaXMuZXhwYW5kKHRlcm1fODIzLnRlc3QpLCBjb25zZXF1ZW50OiBjb25zZXF1ZW50XzgyNCwgYWx0ZXJuYXRlOiBhbHRlcm5hdGVfODI1fSk7XG4gIH1cbiAgZXhwYW5kQmxvY2tTdGF0ZW1lbnQodGVybV84MjYpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJCbG9ja1N0YXRlbWVudFwiLCB7YmxvY2s6IHRoaXMuZXhwYW5kKHRlcm1fODI2LmJsb2NrKX0pO1xuICB9XG4gIGV4cGFuZEJsb2NrKHRlcm1fODI3KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQmxvY2tcIiwge3N0YXRlbWVudHM6IHRlcm1fODI3LnN0YXRlbWVudHMubWFwKHNfODI4ID0+IHRoaXMuZXhwYW5kKHNfODI4KSkudG9BcnJheSgpfSk7XG4gIH1cbiAgZXhwYW5kVmFyaWFibGVEZWNsYXJhdGlvblN0YXRlbWVudCh0ZXJtXzgyOSkge1xuICAgIHJldHVybiBuZXcgVGVybShcIlZhcmlhYmxlRGVjbGFyYXRpb25TdGF0ZW1lbnRcIiwge2RlY2xhcmF0aW9uOiB0aGlzLmV4cGFuZCh0ZXJtXzgyOS5kZWNsYXJhdGlvbil9KTtcbiAgfVxuICBleHBhbmRSZXR1cm5TdGF0ZW1lbnQodGVybV84MzApIHtcbiAgICBpZiAodGVybV84MzAuZXhwcmVzc2lvbiA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGVybV84MzA7XG4gICAgfVxuICAgIHJldHVybiBuZXcgVGVybShcIlJldHVyblN0YXRlbWVudFwiLCB7ZXhwcmVzc2lvbjogdGhpcy5leHBhbmQodGVybV84MzAuZXhwcmVzc2lvbil9KTtcbiAgfVxuICBleHBhbmRDbGFzc0RlY2xhcmF0aW9uKHRlcm1fODMxKSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQ2xhc3NEZWNsYXJhdGlvblwiLCB7bmFtZTogdGVybV84MzEubmFtZSA9PSBudWxsID8gbnVsbCA6IHRoaXMuZXhwYW5kKHRlcm1fODMxLm5hbWUpLCBzdXBlcjogdGVybV84MzEuc3VwZXIgPT0gbnVsbCA/IG51bGwgOiB0aGlzLmV4cGFuZCh0ZXJtXzgzMS5zdXBlciksIGVsZW1lbnRzOiB0ZXJtXzgzMS5lbGVtZW50cy5tYXAoZWxfODMyID0+IHRoaXMuZXhwYW5kKGVsXzgzMikpLnRvQXJyYXkoKX0pO1xuICB9XG4gIGV4cGFuZENsYXNzRXhwcmVzc2lvbih0ZXJtXzgzMykge1xuICAgIHJldHVybiBuZXcgVGVybShcIkNsYXNzRXhwcmVzc2lvblwiLCB7bmFtZTogdGVybV84MzMubmFtZSA9PSBudWxsID8gbnVsbCA6IHRoaXMuZXhwYW5kKHRlcm1fODMzLm5hbWUpLCBzdXBlcjogdGVybV84MzMuc3VwZXIgPT0gbnVsbCA/IG51bGwgOiB0aGlzLmV4cGFuZCh0ZXJtXzgzMy5zdXBlciksIGVsZW1lbnRzOiB0ZXJtXzgzMy5lbGVtZW50cy5tYXAoZWxfODM0ID0+IHRoaXMuZXhwYW5kKGVsXzgzNCkpLnRvQXJyYXkoKX0pO1xuICB9XG4gIGV4cGFuZENsYXNzRWxlbWVudCh0ZXJtXzgzNSkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkNsYXNzRWxlbWVudFwiLCB7aXNTdGF0aWM6IHRlcm1fODM1LmlzU3RhdGljLCBtZXRob2Q6IHRoaXMuZXhwYW5kKHRlcm1fODM1Lm1ldGhvZCl9KTtcbiAgfVxuICBleHBhbmRUaGlzRXhwcmVzc2lvbih0ZXJtXzgzNikge1xuICAgIHJldHVybiB0ZXJtXzgzNjtcbiAgfVxuICBleHBhbmRTeW50YXhUZW1wbGF0ZSh0ZXJtXzgzNykge1xuICAgIGxldCByXzgzOCA9IHByb2Nlc3NUZW1wbGF0ZSh0ZXJtXzgzNy50ZW1wbGF0ZS5pbm5lcigpKTtcbiAgICBsZXQgc3RyXzgzOSA9IFN5bnRheC5mcm9tU3RyaW5nKHNlcmlhbGl6ZXIud3JpdGUocl84MzgudGVtcGxhdGUpKTtcbiAgICBsZXQgY2FsbGVlXzg0MCA9IG5ldyBUZXJtKFwiSWRlbnRpZmllckV4cHJlc3Npb25cIiwge25hbWU6IFN5bnRheC5mcm9tSWRlbnRpZmllcihcInN5bnRheFRlbXBsYXRlXCIpfSk7XG4gICAgbGV0IGV4cGFuZGVkSW50ZXJwc184NDEgPSByXzgzOC5pbnRlcnAubWFwKGlfODQzID0+IHtcbiAgICAgIGxldCBlbmZfODQ0ID0gbmV3IEVuZm9yZXN0ZXIoaV84NDMsIExpc3QoKSwgdGhpcy5jb250ZXh0KTtcbiAgICAgIHJldHVybiB0aGlzLmV4cGFuZChlbmZfODQ0LmVuZm9yZXN0KFwiZXhwcmVzc2lvblwiKSk7XG4gICAgfSk7XG4gICAgbGV0IGFyZ3NfODQyID0gTGlzdC5vZihuZXcgVGVybShcIkxpdGVyYWxTdHJpbmdFeHByZXNzaW9uXCIsIHt2YWx1ZTogc3RyXzgzOX0pKS5jb25jYXQoZXhwYW5kZWRJbnRlcnBzXzg0MSk7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQ2FsbEV4cHJlc3Npb25cIiwge2NhbGxlZTogY2FsbGVlXzg0MCwgYXJndW1lbnRzOiBhcmdzXzg0Mn0pO1xuICB9XG4gIGV4cGFuZFN5bnRheFF1b3RlKHRlcm1fODQ1KSB7XG4gICAgbGV0IHN0cl84NDYgPSBuZXcgVGVybShcIkxpdGVyYWxTdHJpbmdFeHByZXNzaW9uXCIsIHt2YWx1ZTogU3ludGF4LmZyb21TdHJpbmcoc2VyaWFsaXplci53cml0ZSh0ZXJtXzg0NS5uYW1lKSl9KTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJUZW1wbGF0ZUV4cHJlc3Npb25cIiwge3RhZzogdGVybV84NDUudGVtcGxhdGUudGFnLCBlbGVtZW50czogdGVybV84NDUudGVtcGxhdGUuZWxlbWVudHMucHVzaChzdHJfODQ2KS5wdXNoKG5ldyBUZXJtKFwiVGVtcGxhdGVFbGVtZW50XCIsIHtyYXdWYWx1ZTogXCJcIn0pKS50b0FycmF5KCl9KTtcbiAgfVxuICBleHBhbmRTdGF0aWNNZW1iZXJFeHByZXNzaW9uKHRlcm1fODQ3KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiU3RhdGljTWVtYmVyRXhwcmVzc2lvblwiLCB7b2JqZWN0OiB0aGlzLmV4cGFuZCh0ZXJtXzg0Ny5vYmplY3QpLCBwcm9wZXJ0eTogdGVybV84NDcucHJvcGVydHl9KTtcbiAgfVxuICBleHBhbmRBcnJheUV4cHJlc3Npb24odGVybV84NDgpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJBcnJheUV4cHJlc3Npb25cIiwge2VsZW1lbnRzOiB0ZXJtXzg0OC5lbGVtZW50cy5tYXAodF84NDkgPT4gdF84NDkgPT0gbnVsbCA/IHRfODQ5IDogdGhpcy5leHBhbmQodF84NDkpKX0pO1xuICB9XG4gIGV4cGFuZEltcG9ydCh0ZXJtXzg1MCkge1xuICAgIHJldHVybiB0ZXJtXzg1MDtcbiAgfVxuICBleHBhbmRJbXBvcnROYW1lc3BhY2UodGVybV84NTEpIHtcbiAgICByZXR1cm4gdGVybV84NTE7XG4gIH1cbiAgZXhwYW5kRXhwb3J0KHRlcm1fODUyKSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiRXhwb3J0XCIsIHtkZWNsYXJhdGlvbjogdGhpcy5leHBhbmQodGVybV84NTIuZGVjbGFyYXRpb24pfSk7XG4gIH1cbiAgZXhwYW5kRXhwb3J0RGVmYXVsdCh0ZXJtXzg1Mykge1xuICAgIHJldHVybiBuZXcgVGVybShcIkV4cG9ydERlZmF1bHRcIiwge2JvZHk6IHRoaXMuZXhwYW5kKHRlcm1fODUzLmJvZHkpfSk7XG4gIH1cbiAgZXhwYW5kRXhwb3J0RnJvbSh0ZXJtXzg1NCkge1xuICAgIHJldHVybiB0ZXJtXzg1NDtcbiAgfVxuICBleHBhbmRFeHBvcnRBbGxGcm9tKHRlcm1fODU1KSB7XG4gICAgcmV0dXJuIHRlcm1fODU1O1xuICB9XG4gIGV4cGFuZEV4cG9ydFNwZWNpZmllcih0ZXJtXzg1Nikge1xuICAgIHJldHVybiB0ZXJtXzg1NjtcbiAgfVxuICBleHBhbmRTdGF0aWNQcm9wZXJ0eU5hbWUodGVybV84NTcpIHtcbiAgICByZXR1cm4gdGVybV84NTc7XG4gIH1cbiAgZXhwYW5kRGF0YVByb3BlcnR5KHRlcm1fODU4KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiRGF0YVByb3BlcnR5XCIsIHtuYW1lOiB0aGlzLmV4cGFuZCh0ZXJtXzg1OC5uYW1lKSwgZXhwcmVzc2lvbjogdGhpcy5leHBhbmQodGVybV84NTguZXhwcmVzc2lvbil9KTtcbiAgfVxuICBleHBhbmRPYmplY3RFeHByZXNzaW9uKHRlcm1fODU5KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiT2JqZWN0RXhwcmVzc2lvblwiLCB7cHJvcGVydGllczogdGVybV84NTkucHJvcGVydGllcy5tYXAodF84NjAgPT4gdGhpcy5leHBhbmQodF84NjApKX0pO1xuICB9XG4gIGV4cGFuZFZhcmlhYmxlRGVjbGFyYXRvcih0ZXJtXzg2MSkge1xuICAgIGxldCBpbml0Xzg2MiA9IHRlcm1fODYxLmluaXQgPT0gbnVsbCA/IG51bGwgOiB0aGlzLmV4cGFuZCh0ZXJtXzg2MS5pbml0KTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJWYXJpYWJsZURlY2xhcmF0b3JcIiwge2JpbmRpbmc6IHRoaXMuZXhwYW5kKHRlcm1fODYxLmJpbmRpbmcpLCBpbml0OiBpbml0Xzg2Mn0pO1xuICB9XG4gIGV4cGFuZFZhcmlhYmxlRGVjbGFyYXRpb24odGVybV84NjMpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJWYXJpYWJsZURlY2xhcmF0aW9uXCIsIHtraW5kOiB0ZXJtXzg2My5raW5kLCBkZWNsYXJhdG9yczogdGVybV84NjMuZGVjbGFyYXRvcnMubWFwKGRfODY0ID0+IHRoaXMuZXhwYW5kKGRfODY0KSl9KTtcbiAgfVxuICBleHBhbmRQYXJlbnRoZXNpemVkRXhwcmVzc2lvbih0ZXJtXzg2NSkge1xuICAgIGlmICh0ZXJtXzg2NS5pbm5lci5zaXplID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bmV4cGVjdGVkIGVuZCBvZiBpbnB1dFwiKTtcbiAgICB9XG4gICAgbGV0IGVuZl84NjYgPSBuZXcgRW5mb3Jlc3Rlcih0ZXJtXzg2NS5pbm5lciwgTGlzdCgpLCB0aGlzLmNvbnRleHQpO1xuICAgIGxldCBsb29rYWhlYWRfODY3ID0gZW5mXzg2Ni5wZWVrKCk7XG4gICAgbGV0IHRfODY4ID0gZW5mXzg2Ni5lbmZvcmVzdEV4cHJlc3Npb24oKTtcbiAgICBpZiAodF84NjggPT0gbnVsbCB8fCBlbmZfODY2LnJlc3Quc2l6ZSA+IDApIHtcbiAgICAgIHRocm93IGVuZl84NjYuY3JlYXRlRXJyb3IobG9va2FoZWFkXzg2NywgXCJ1bmV4cGVjdGVkIHN5bnRheFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZXhwYW5kKHRfODY4KTtcbiAgfVxuICBleHBhbmRVbmFyeUV4cHJlc3Npb24odGVybV84NjkpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJVbmFyeUV4cHJlc3Npb25cIiwge29wZXJhdG9yOiB0ZXJtXzg2OS5vcGVyYXRvciwgb3BlcmFuZDogdGhpcy5leHBhbmQodGVybV84Njkub3BlcmFuZCl9KTtcbiAgfVxuICBleHBhbmRVcGRhdGVFeHByZXNzaW9uKHRlcm1fODcwKSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiVXBkYXRlRXhwcmVzc2lvblwiLCB7aXNQcmVmaXg6IHRlcm1fODcwLmlzUHJlZml4LCBvcGVyYXRvcjogdGVybV84NzAub3BlcmF0b3IsIG9wZXJhbmQ6IHRoaXMuZXhwYW5kKHRlcm1fODcwLm9wZXJhbmQpfSk7XG4gIH1cbiAgZXhwYW5kQmluYXJ5RXhwcmVzc2lvbih0ZXJtXzg3MSkge1xuICAgIGxldCBsZWZ0Xzg3MiA9IHRoaXMuZXhwYW5kKHRlcm1fODcxLmxlZnQpO1xuICAgIGxldCByaWdodF84NzMgPSB0aGlzLmV4cGFuZCh0ZXJtXzg3MS5yaWdodCk7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQmluYXJ5RXhwcmVzc2lvblwiLCB7bGVmdDogbGVmdF84NzIsIG9wZXJhdG9yOiB0ZXJtXzg3MS5vcGVyYXRvciwgcmlnaHQ6IHJpZ2h0Xzg3M30pO1xuICB9XG4gIGV4cGFuZENvbmRpdGlvbmFsRXhwcmVzc2lvbih0ZXJtXzg3NCkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkNvbmRpdGlvbmFsRXhwcmVzc2lvblwiLCB7dGVzdDogdGhpcy5leHBhbmQodGVybV84NzQudGVzdCksIGNvbnNlcXVlbnQ6IHRoaXMuZXhwYW5kKHRlcm1fODc0LmNvbnNlcXVlbnQpLCBhbHRlcm5hdGU6IHRoaXMuZXhwYW5kKHRlcm1fODc0LmFsdGVybmF0ZSl9KTtcbiAgfVxuICBleHBhbmROZXdUYXJnZXRFeHByZXNzaW9uKHRlcm1fODc1KSB7XG4gICAgcmV0dXJuIHRlcm1fODc1O1xuICB9XG4gIGV4cGFuZE5ld0V4cHJlc3Npb24odGVybV84NzYpIHtcbiAgICBsZXQgY2FsbGVlXzg3NyA9IHRoaXMuZXhwYW5kKHRlcm1fODc2LmNhbGxlZSk7XG4gICAgbGV0IGVuZl84NzggPSBuZXcgRW5mb3Jlc3Rlcih0ZXJtXzg3Ni5hcmd1bWVudHMsIExpc3QoKSwgdGhpcy5jb250ZXh0KTtcbiAgICBsZXQgYXJnc184NzkgPSBlbmZfODc4LmVuZm9yZXN0QXJndW1lbnRMaXN0KCkubWFwKGFyZ184ODAgPT4gdGhpcy5leHBhbmQoYXJnXzg4MCkpO1xuICAgIHJldHVybiBuZXcgVGVybShcIk5ld0V4cHJlc3Npb25cIiwge2NhbGxlZTogY2FsbGVlXzg3NywgYXJndW1lbnRzOiBhcmdzXzg3OS50b0FycmF5KCl9KTtcbiAgfVxuICBleHBhbmRTdXBlcih0ZXJtXzg4MSkge1xuICAgIHJldHVybiB0ZXJtXzg4MTtcbiAgfVxuICBleHBhbmRDYWxsRXhwcmVzc2lvbih0ZXJtXzg4Mikge1xuICAgIGxldCBjYWxsZWVfODgzID0gdGhpcy5leHBhbmQodGVybV84ODIuY2FsbGVlKTtcbiAgICBsZXQgZW5mXzg4NCA9IG5ldyBFbmZvcmVzdGVyKHRlcm1fODgyLmFyZ3VtZW50cywgTGlzdCgpLCB0aGlzLmNvbnRleHQpO1xuICAgIGxldCBhcmdzXzg4NSA9IGVuZl84ODQuZW5mb3Jlc3RBcmd1bWVudExpc3QoKS5tYXAoYXJnXzg4NiA9PiB0aGlzLmV4cGFuZChhcmdfODg2KSk7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQ2FsbEV4cHJlc3Npb25cIiwge2NhbGxlZTogY2FsbGVlXzg4MywgYXJndW1lbnRzOiBhcmdzXzg4NX0pO1xuICB9XG4gIGV4cGFuZFNwcmVhZEVsZW1lbnQodGVybV84ODcpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJTcHJlYWRFbGVtZW50XCIsIHtleHByZXNzaW9uOiB0aGlzLmV4cGFuZCh0ZXJtXzg4Ny5leHByZXNzaW9uKX0pO1xuICB9XG4gIGV4cGFuZEV4cHJlc3Npb25TdGF0ZW1lbnQodGVybV84ODgpIHtcbiAgICBsZXQgY2hpbGRfODg5ID0gdGhpcy5leHBhbmQodGVybV84ODguZXhwcmVzc2lvbik7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiRXhwcmVzc2lvblN0YXRlbWVudFwiLCB7ZXhwcmVzc2lvbjogY2hpbGRfODg5fSk7XG4gIH1cbiAgZXhwYW5kTGFiZWxlZFN0YXRlbWVudCh0ZXJtXzg5MCkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkxhYmVsZWRTdGF0ZW1lbnRcIiwge2xhYmVsOiB0ZXJtXzg5MC5sYWJlbC52YWwoKSwgYm9keTogdGhpcy5leHBhbmQodGVybV84OTAuYm9keSl9KTtcbiAgfVxuICBkb0Z1bmN0aW9uRXhwYW5zaW9uKHRlcm1fODkxLCB0eXBlXzg5Mikge1xuICAgIGxldCBzY29wZV84OTMgPSBmcmVzaFNjb3BlKFwiZnVuXCIpO1xuICAgIGxldCByZWRfODk0ID0gbmV3IEFwcGx5U2NvcGVJblBhcmFtc1JlZHVjZXIoc2NvcGVfODkzLCB0aGlzLmNvbnRleHQpO1xuICAgIGxldCBwYXJhbXNfODk1O1xuICAgIGlmICh0eXBlXzg5MiAhPT0gXCJHZXR0ZXJcIiAmJiB0eXBlXzg5MiAhPT0gXCJTZXR0ZXJcIikge1xuICAgICAgcGFyYW1zXzg5NSA9IHJlZF84OTQudHJhbnNmb3JtKHRlcm1fODkxLnBhcmFtcyk7XG4gICAgICBwYXJhbXNfODk1ID0gdGhpcy5leHBhbmQocGFyYW1zXzg5NSk7XG4gICAgfVxuICAgIHRoaXMuY29udGV4dC5jdXJyZW50U2NvcGUucHVzaChzY29wZV84OTMpO1xuICAgIGxldCBjb21waWxlcl84OTYgPSBuZXcgQ29tcGlsZXIodGhpcy5jb250ZXh0LnBoYXNlLCB0aGlzLmNvbnRleHQuZW52LCB0aGlzLmNvbnRleHQuc3RvcmUsIHRoaXMuY29udGV4dCk7XG4gICAgbGV0IG1hcmtlZEJvZHlfODk3LCBib2R5VGVybV84OTg7XG4gICAgaWYgKHRlcm1fODkxLmJvZHkgaW5zdGFuY2VvZiBUZXJtKSB7XG4gICAgICBib2R5VGVybV84OTggPSB0aGlzLmV4cGFuZCh0ZXJtXzg5MS5ib2R5LmFkZFNjb3BlKHNjb3BlXzg5MywgdGhpcy5jb250ZXh0LmJpbmRpbmdzLCBBTExfUEhBU0VTKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1hcmtlZEJvZHlfODk3ID0gdGVybV84OTEuYm9keS5tYXAoYl84OTkgPT4gYl84OTkuYWRkU2NvcGUoc2NvcGVfODkzLCB0aGlzLmNvbnRleHQuYmluZGluZ3MsIEFMTF9QSEFTRVMpKTtcbiAgICAgIGJvZHlUZXJtXzg5OCA9IG5ldyBUZXJtKFwiRnVuY3Rpb25Cb2R5XCIsIHtkaXJlY3RpdmVzOiBMaXN0KCksIHN0YXRlbWVudHM6IGNvbXBpbGVyXzg5Ni5jb21waWxlKG1hcmtlZEJvZHlfODk3KX0pO1xuICAgIH1cbiAgICB0aGlzLmNvbnRleHQuY3VycmVudFNjb3BlLnBvcCgpO1xuICAgIGlmICh0eXBlXzg5MiA9PT0gXCJHZXR0ZXJcIikge1xuICAgICAgcmV0dXJuIG5ldyBUZXJtKHR5cGVfODkyLCB7bmFtZTogdGhpcy5leHBhbmQodGVybV84OTEubmFtZSksIGJvZHk6IGJvZHlUZXJtXzg5OH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZV84OTIgPT09IFwiU2V0dGVyXCIpIHtcbiAgICAgIHJldHVybiBuZXcgVGVybSh0eXBlXzg5Miwge25hbWU6IHRoaXMuZXhwYW5kKHRlcm1fODkxLm5hbWUpLCBwYXJhbTogdGVybV84OTEucGFyYW0sIGJvZHk6IGJvZHlUZXJtXzg5OH0pO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFRlcm0odHlwZV84OTIsIHtuYW1lOiB0ZXJtXzg5MS5uYW1lLCBpc0dlbmVyYXRvcjogdGVybV84OTEuaXNHZW5lcmF0b3IsIHBhcmFtczogcGFyYW1zXzg5NSwgYm9keTogYm9keVRlcm1fODk4fSk7XG4gIH1cbiAgZXhwYW5kTWV0aG9kKHRlcm1fOTAwKSB7XG4gICAgcmV0dXJuIHRoaXMuZG9GdW5jdGlvbkV4cGFuc2lvbih0ZXJtXzkwMCwgXCJNZXRob2RcIik7XG4gIH1cbiAgZXhwYW5kU2V0dGVyKHRlcm1fOTAxKSB7XG4gICAgcmV0dXJuIHRoaXMuZG9GdW5jdGlvbkV4cGFuc2lvbih0ZXJtXzkwMSwgXCJTZXR0ZXJcIik7XG4gIH1cbiAgZXhwYW5kR2V0dGVyKHRlcm1fOTAyKSB7XG4gICAgcmV0dXJuIHRoaXMuZG9GdW5jdGlvbkV4cGFuc2lvbih0ZXJtXzkwMiwgXCJHZXR0ZXJcIik7XG4gIH1cbiAgZXhwYW5kRnVuY3Rpb25EZWNsYXJhdGlvbih0ZXJtXzkwMykge1xuICAgIHJldHVybiB0aGlzLmRvRnVuY3Rpb25FeHBhbnNpb24odGVybV85MDMsIFwiRnVuY3Rpb25EZWNsYXJhdGlvblwiKTtcbiAgfVxuICBleHBhbmRGdW5jdGlvbkV4cHJlc3Npb24odGVybV85MDQpIHtcbiAgICByZXR1cm4gdGhpcy5kb0Z1bmN0aW9uRXhwYW5zaW9uKHRlcm1fOTA0LCBcIkZ1bmN0aW9uRXhwcmVzc2lvblwiKTtcbiAgfVxuICBleHBhbmRDb21wb3VuZEFzc2lnbm1lbnRFeHByZXNzaW9uKHRlcm1fOTA1KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQ29tcG91bmRBc3NpZ25tZW50RXhwcmVzc2lvblwiLCB7YmluZGluZzogdGhpcy5leHBhbmQodGVybV85MDUuYmluZGluZyksIG9wZXJhdG9yOiB0ZXJtXzkwNS5vcGVyYXRvciwgZXhwcmVzc2lvbjogdGhpcy5leHBhbmQodGVybV85MDUuZXhwcmVzc2lvbil9KTtcbiAgfVxuICBleHBhbmRBc3NpZ25tZW50RXhwcmVzc2lvbih0ZXJtXzkwNikge1xuICAgIHJldHVybiBuZXcgVGVybShcIkFzc2lnbm1lbnRFeHByZXNzaW9uXCIsIHtiaW5kaW5nOiB0aGlzLmV4cGFuZCh0ZXJtXzkwNi5iaW5kaW5nKSwgZXhwcmVzc2lvbjogdGhpcy5leHBhbmQodGVybV85MDYuZXhwcmVzc2lvbil9KTtcbiAgfVxuICBleHBhbmRFbXB0eVN0YXRlbWVudCh0ZXJtXzkwNykge1xuICAgIHJldHVybiB0ZXJtXzkwNztcbiAgfVxuICBleHBhbmRMaXRlcmFsQm9vbGVhbkV4cHJlc3Npb24odGVybV85MDgpIHtcbiAgICByZXR1cm4gdGVybV85MDg7XG4gIH1cbiAgZXhwYW5kTGl0ZXJhbE51bWVyaWNFeHByZXNzaW9uKHRlcm1fOTA5KSB7XG4gICAgcmV0dXJuIHRlcm1fOTA5O1xuICB9XG4gIGV4cGFuZExpdGVyYWxJbmZpbml0eUV4cHJlc3Npb24odGVybV85MTApIHtcbiAgICByZXR1cm4gdGVybV85MTA7XG4gIH1cbiAgZXhwYW5kSWRlbnRpZmllckV4cHJlc3Npb24odGVybV85MTEpIHtcbiAgICBsZXQgdHJhbnNfOTEyID0gdGhpcy5jb250ZXh0LmVudi5nZXQodGVybV85MTEubmFtZS5yZXNvbHZlKHRoaXMuY29udGV4dC5waGFzZSkpO1xuICAgIGlmICh0cmFuc185MTIpIHtcbiAgICAgIHJldHVybiBuZXcgVGVybShcIklkZW50aWZpZXJFeHByZXNzaW9uXCIsIHtuYW1lOiB0cmFuc185MTIuaWR9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRlcm1fOTExO1xuICB9XG4gIGV4cGFuZExpdGVyYWxOdWxsRXhwcmVzc2lvbih0ZXJtXzkxMykge1xuICAgIHJldHVybiB0ZXJtXzkxMztcbiAgfVxuICBleHBhbmRMaXRlcmFsU3RyaW5nRXhwcmVzc2lvbih0ZXJtXzkxNCkge1xuICAgIHJldHVybiB0ZXJtXzkxNDtcbiAgfVxuICBleHBhbmRMaXRlcmFsUmVnRXhwRXhwcmVzc2lvbih0ZXJtXzkxNSkge1xuICAgIHJldHVybiB0ZXJtXzkxNTtcbiAgfVxufVxuIl19