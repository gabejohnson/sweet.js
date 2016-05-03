"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _terms = require("./terms");

var _terms2 = _interopRequireDefault(_terms);

var _symbol = require("./symbol");

var _transforms = require("./transforms");

var _errors = require("./errors");

var _syntax = require("./syntax");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ScopeApplyingReducer = function () {
  function ScopeApplyingReducer(scope_0, context_1) {
    _classCallCheck(this, ScopeApplyingReducer);

    this.context = context_1;
    this.scope = scope_0;
  }

  _createClass(ScopeApplyingReducer, [{
    key: "transform",
    value: function transform(term_2) {
      var field_3 = "transform" + term_2.type;
      if (typeof this[field_3] === "function") {
        return this[field_3](term_2);
      }
      (0, _errors.assert)(false, "transform not implemented yet for: " + term_2.type);
    }
  }, {
    key: "transformFormalParameters",
    value: function transformFormalParameters(term_4) {
      var _this = this;

      var rest_5 = term_4.rest == null ? null : this.transform(term_4.rest);
      return new _terms2.default("FormalParameters", { items: term_4.items.map(function (it_6) {
          return _this.transform(it_6);
        }), rest: rest_5 });
    }
  }, {
    key: "transformBindingWithDefault",
    value: function transformBindingWithDefault(term_7) {
      return new _terms2.default("BindingWithDefault", { binding: this.transform(term_7.binding), init: term_7.init });
    }
  }, {
    key: "transformObjectBinding",
    value: function transformObjectBinding(term_8) {
      return term_8;
    }
  }, {
    key: "transformBindingPropertyIdentifier",
    value: function transformBindingPropertyIdentifier(term_9) {
      return new _terms2.default("BindingPropertyIdentifier", { binding: this.transform(term_9.binding), init: term_9.init });
    }
  }, {
    key: "transformBindingPropertyProperty",
    value: function transformBindingPropertyProperty(term_10) {
      return new _terms2.default("BindingPropertyProperty", { name: term_10.name, binding: this.transform(term_10.binding) });
    }
  }, {
    key: "transformArrayBinding",
    value: function transformArrayBinding(term_11) {
      var _this2 = this;

      return new _terms2.default("ArrayBinding", { elements: term_11.elements.map(function (el_12) {
          return _this2.transform(el_12);
        }), restElement: term_11.restElement == null ? null : this.transform(term_11.restElement) });
    }
  }, {
    key: "transformBindingIdentifier",
    value: function transformBindingIdentifier(term_13) {
      var name_14 = term_13.name.addScope(this.scope, this.context.bindings, _syntax.ALL_PHASES);
      var newBinding_15 = (0, _symbol.gensym)(name_14.val());
      this.context.env.set(newBinding_15.toString(), new _transforms.VarBindingTransform(name_14));
      this.context.bindings.add(name_14, { binding: newBinding_15, phase: this.context.phase, skipDup: true });
      return new _terms2.default("BindingIdentifier", { name: name_14 });
    }
  }]);

  return ScopeApplyingReducer;
}();

exports.default = ScopeApplyingReducer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3N3ZWV0L2FwcGx5LXNjb3BlLWluLXBhcmFtcy1yZWR1Y2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0lBQ3FCLG9CO0FBQ25CLGdDQUFZLE9BQVosRUFBcUIsU0FBckIsRUFBZ0M7QUFBQTs7QUFDOUIsU0FBSyxPQUFMLEdBQWUsU0FBZjtBQUNBLFNBQUssS0FBTCxHQUFhLE9BQWI7QUFDRDs7Ozs4QkFDUyxNLEVBQVE7QUFDaEIsVUFBSSxVQUFVLGNBQWMsT0FBTyxJQUFuQztBQUNBLFVBQUksT0FBTyxLQUFLLE9BQUwsQ0FBUCxLQUF5QixVQUE3QixFQUF5QztBQUN2QyxlQUFPLEtBQUssT0FBTCxFQUFjLE1BQWQsQ0FBUDtBQUNEO0FBQ0QsMEJBQU8sS0FBUCxFQUFjLHdDQUF3QyxPQUFPLElBQTdEO0FBQ0Q7Ozs4Q0FDeUIsTSxFQUFRO0FBQUE7O0FBQ2hDLFVBQUksU0FBUyxPQUFPLElBQVAsSUFBZSxJQUFmLEdBQXNCLElBQXRCLEdBQTZCLEtBQUssU0FBTCxDQUFlLE9BQU8sSUFBdEIsQ0FBMUM7QUFDQSxhQUFPLG9CQUFTLGtCQUFULEVBQTZCLEVBQUMsT0FBTyxPQUFPLEtBQVAsQ0FBYSxHQUFiLENBQWlCO0FBQUEsaUJBQVEsTUFBSyxTQUFMLENBQWUsSUFBZixDQUFSO0FBQUEsU0FBakIsQ0FBUixFQUF3RCxNQUFNLE1BQTlELEVBQTdCLENBQVA7QUFDRDs7O2dEQUMyQixNLEVBQVE7QUFDbEMsYUFBTyxvQkFBUyxvQkFBVCxFQUErQixFQUFDLFNBQVMsS0FBSyxTQUFMLENBQWUsT0FBTyxPQUF0QixDQUFWLEVBQTBDLE1BQU0sT0FBTyxJQUF2RCxFQUEvQixDQUFQO0FBQ0Q7OzsyQ0FDc0IsTSxFQUFRO0FBQzdCLGFBQU8sTUFBUDtBQUNEOzs7dURBQ2tDLE0sRUFBUTtBQUN6QyxhQUFPLG9CQUFTLDJCQUFULEVBQXNDLEVBQUMsU0FBUyxLQUFLLFNBQUwsQ0FBZSxPQUFPLE9BQXRCLENBQVYsRUFBMEMsTUFBTSxPQUFPLElBQXZELEVBQXRDLENBQVA7QUFDRDs7O3FEQUNnQyxPLEVBQVM7QUFDeEMsYUFBTyxvQkFBUyx5QkFBVCxFQUFvQyxFQUFDLE1BQU0sUUFBUSxJQUFmLEVBQXFCLFNBQVMsS0FBSyxTQUFMLENBQWUsUUFBUSxPQUF2QixDQUE5QixFQUFwQyxDQUFQO0FBQ0Q7OzswQ0FDcUIsTyxFQUFTO0FBQUE7O0FBQzdCLGFBQU8sb0JBQVMsY0FBVCxFQUF5QixFQUFDLFVBQVUsUUFBUSxRQUFSLENBQWlCLEdBQWpCLENBQXFCO0FBQUEsaUJBQVMsT0FBSyxTQUFMLENBQWUsS0FBZixDQUFUO0FBQUEsU0FBckIsQ0FBWCxFQUFpRSxhQUFhLFFBQVEsV0FBUixJQUF1QixJQUF2QixHQUE4QixJQUE5QixHQUFxQyxLQUFLLFNBQUwsQ0FBZSxRQUFRLFdBQXZCLENBQW5ILEVBQXpCLENBQVA7QUFDRDs7OytDQUMwQixPLEVBQVM7QUFDbEMsVUFBSSxVQUFVLFFBQVEsSUFBUixDQUFhLFFBQWIsQ0FBc0IsS0FBSyxLQUEzQixFQUFrQyxLQUFLLE9BQUwsQ0FBYSxRQUEvQyxxQkFBZDtBQUNBLFVBQUksZ0JBQWdCLG9CQUFPLFFBQVEsR0FBUixFQUFQLENBQXBCO0FBQ0EsV0FBSyxPQUFMLENBQWEsR0FBYixDQUFpQixHQUFqQixDQUFxQixjQUFjLFFBQWQsRUFBckIsRUFBK0Msb0NBQXdCLE9BQXhCLENBQS9DO0FBQ0EsV0FBSyxPQUFMLENBQWEsUUFBYixDQUFzQixHQUF0QixDQUEwQixPQUExQixFQUFtQyxFQUFDLFNBQVMsYUFBVixFQUF5QixPQUFPLEtBQUssT0FBTCxDQUFhLEtBQTdDLEVBQW9ELFNBQVMsSUFBN0QsRUFBbkM7QUFDQSxhQUFPLG9CQUFTLG1CQUFULEVBQThCLEVBQUMsTUFBTSxPQUFQLEVBQTlCLENBQVA7QUFDRDs7Ozs7O2tCQXJDa0Isb0IiLCJmaWxlIjoiYXBwbHktc2NvcGUtaW4tcGFyYW1zLXJlZHVjZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGVybSBmcm9tIFwiLi90ZXJtc1wiO1xuaW1wb3J0IHtnZW5zeW19IGZyb20gXCIuL3N5bWJvbFwiO1xuaW1wb3J0IHtWYXJCaW5kaW5nVHJhbnNmb3JtfSBmcm9tIFwiLi90cmFuc2Zvcm1zXCI7XG5pbXBvcnQge2Fzc2VydH0gZnJvbSBcIi4vZXJyb3JzXCI7XG5pbXBvcnQge0FMTF9QSEFTRVN9IGZyb20gXCIuL3N5bnRheFwiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NvcGVBcHBseWluZ1JlZHVjZXIge1xuICBjb25zdHJ1Y3RvcihzY29wZV8wLCBjb250ZXh0XzEpIHtcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0XzE7XG4gICAgdGhpcy5zY29wZSA9IHNjb3BlXzA7XG4gIH1cbiAgdHJhbnNmb3JtKHRlcm1fMikge1xuICAgIGxldCBmaWVsZF8zID0gXCJ0cmFuc2Zvcm1cIiArIHRlcm1fMi50eXBlO1xuICAgIGlmICh0eXBlb2YgdGhpc1tmaWVsZF8zXSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICByZXR1cm4gdGhpc1tmaWVsZF8zXSh0ZXJtXzIpO1xuICAgIH1cbiAgICBhc3NlcnQoZmFsc2UsIFwidHJhbnNmb3JtIG5vdCBpbXBsZW1lbnRlZCB5ZXQgZm9yOiBcIiArIHRlcm1fMi50eXBlKTtcbiAgfVxuICB0cmFuc2Zvcm1Gb3JtYWxQYXJhbWV0ZXJzKHRlcm1fNCkge1xuICAgIGxldCByZXN0XzUgPSB0ZXJtXzQucmVzdCA9PSBudWxsID8gbnVsbCA6IHRoaXMudHJhbnNmb3JtKHRlcm1fNC5yZXN0KTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJGb3JtYWxQYXJhbWV0ZXJzXCIsIHtpdGVtczogdGVybV80Lml0ZW1zLm1hcChpdF82ID0+IHRoaXMudHJhbnNmb3JtKGl0XzYpKSwgcmVzdDogcmVzdF81fSk7XG4gIH1cbiAgdHJhbnNmb3JtQmluZGluZ1dpdGhEZWZhdWx0KHRlcm1fNykge1xuICAgIHJldHVybiBuZXcgVGVybShcIkJpbmRpbmdXaXRoRGVmYXVsdFwiLCB7YmluZGluZzogdGhpcy50cmFuc2Zvcm0odGVybV83LmJpbmRpbmcpLCBpbml0OiB0ZXJtXzcuaW5pdH0pO1xuICB9XG4gIHRyYW5zZm9ybU9iamVjdEJpbmRpbmcodGVybV84KSB7XG4gICAgcmV0dXJuIHRlcm1fODtcbiAgfVxuICB0cmFuc2Zvcm1CaW5kaW5nUHJvcGVydHlJZGVudGlmaWVyKHRlcm1fOSkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkJpbmRpbmdQcm9wZXJ0eUlkZW50aWZpZXJcIiwge2JpbmRpbmc6IHRoaXMudHJhbnNmb3JtKHRlcm1fOS5iaW5kaW5nKSwgaW5pdDogdGVybV85LmluaXR9KTtcbiAgfVxuICB0cmFuc2Zvcm1CaW5kaW5nUHJvcGVydHlQcm9wZXJ0eSh0ZXJtXzEwKSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQmluZGluZ1Byb3BlcnR5UHJvcGVydHlcIiwge25hbWU6IHRlcm1fMTAubmFtZSwgYmluZGluZzogdGhpcy50cmFuc2Zvcm0odGVybV8xMC5iaW5kaW5nKX0pO1xuICB9XG4gIHRyYW5zZm9ybUFycmF5QmluZGluZyh0ZXJtXzExKSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQXJyYXlCaW5kaW5nXCIsIHtlbGVtZW50czogdGVybV8xMS5lbGVtZW50cy5tYXAoZWxfMTIgPT4gdGhpcy50cmFuc2Zvcm0oZWxfMTIpKSwgcmVzdEVsZW1lbnQ6IHRlcm1fMTEucmVzdEVsZW1lbnQgPT0gbnVsbCA/IG51bGwgOiB0aGlzLnRyYW5zZm9ybSh0ZXJtXzExLnJlc3RFbGVtZW50KX0pO1xuICB9XG4gIHRyYW5zZm9ybUJpbmRpbmdJZGVudGlmaWVyKHRlcm1fMTMpIHtcbiAgICBsZXQgbmFtZV8xNCA9IHRlcm1fMTMubmFtZS5hZGRTY29wZSh0aGlzLnNjb3BlLCB0aGlzLmNvbnRleHQuYmluZGluZ3MsIEFMTF9QSEFTRVMpO1xuICAgIGxldCBuZXdCaW5kaW5nXzE1ID0gZ2Vuc3ltKG5hbWVfMTQudmFsKCkpO1xuICAgIHRoaXMuY29udGV4dC5lbnYuc2V0KG5ld0JpbmRpbmdfMTUudG9TdHJpbmcoKSwgbmV3IFZhckJpbmRpbmdUcmFuc2Zvcm0obmFtZV8xNCkpO1xuICAgIHRoaXMuY29udGV4dC5iaW5kaW5ncy5hZGQobmFtZV8xNCwge2JpbmRpbmc6IG5ld0JpbmRpbmdfMTUsIHBoYXNlOiB0aGlzLmNvbnRleHQucGhhc2UsIHNraXBEdXA6IHRydWV9KTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJCaW5kaW5nSWRlbnRpZmllclwiLCB7bmFtZTogbmFtZV8xNH0pO1xuICB9XG59XG4iXX0=