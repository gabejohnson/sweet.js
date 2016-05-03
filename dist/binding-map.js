"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _immutable = require("immutable");

var _errors = require("./errors");

var _ramdaFantasy = require("ramda-fantasy");

var _syntax = require("./syntax");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BindingMap = function () {
  function BindingMap() {
    _classCallCheck(this, BindingMap);

    this._map = new Map();
  }

  _createClass(BindingMap, [{
    key: "add",
    value: function add(stx_16, _ref) {
      var binding = _ref.binding;
      var phase = _ref.phase;
      var _ref$skipDup = _ref.skipDup;
      var skipDup = _ref$skipDup === undefined ? false : _ref$skipDup;

      var stxName_17 = stx_16.val();
      var allScopeset_18 = stx_16.scopesets.all;
      var scopeset_19 = stx_16.scopesets.phase.has(phase) ? stx_16.scopesets.phase.get(phase) : (0, _immutable.List)();
      scopeset_19 = allScopeset_18.concat(scopeset_19);
      (0, _errors.assert)(phase != null, "must provide a phase for binding add");
      if (this._map.has(stxName_17)) {
        var scopesetBindingList = this._map.get(stxName_17);
        if (skipDup && scopesetBindingList.some(function (s_20) {
          return s_20.scopes.equals(scopeset_19);
        })) {
          return;
        }
        this._map.set(stxName_17, scopesetBindingList.push({ scopes: scopeset_19, binding: binding, alias: _ramdaFantasy.Maybe.Nothing() }));
      } else {
        this._map.set(stxName_17, _immutable.List.of({ scopes: scopeset_19, binding: binding, alias: _ramdaFantasy.Maybe.Nothing() }));
      }
    }
  }, {
    key: "addForward",
    value: function addForward(stx_21, forwardStx_22, binding_23, phase_24) {
      var stxName_25 = stx_21.token.value;
      var allScopeset_26 = stx_21.scopesets.all;
      var scopeset_27 = stx_21.scopesets.phase.has(phase_24) ? stx_21.scopesets.phase.get(phase_24) : (0, _immutable.List)();
      scopeset_27 = allScopeset_26.concat(scopeset_27);
      (0, _errors.assert)(phase_24 != null, "must provide a phase for binding add");
      if (this._map.has(stxName_25)) {
        var scopesetBindingList = this._map.get(stxName_25);
        this._map.set(stxName_25, scopesetBindingList.push({ scopes: scopeset_27, binding: binding_23, alias: _ramdaFantasy.Maybe.of(forwardStx_22) }));
      } else {
        this._map.set(stxName_25, _immutable.List.of({ scopes: scopeset_27, binding: binding_23, alias: _ramdaFantasy.Maybe.of(forwardStx_22) }));
      }
    }
  }, {
    key: "get",
    value: function get(stx_28) {
      return this._map.get(stx_28.token.value);
    }
  }]);

  return BindingMap;
}();

exports.default = BindingMap;
//# sourceMappingURL=data:application/json;base64,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QUNGOzs7d0JBQ0csTSxFQUFRO0FBQ1YsYUFBTyxLQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsT0FBTyxLQUFQLENBQWEsS0FBM0IsQ0FBUDtBQUNEOzs7Ozs7a0JBbkNrQixVIiwiZmlsZSI6ImJpbmRpbmctbWFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtMaXN0fSBmcm9tIFwiaW1tdXRhYmxlXCI7XG5pbXBvcnQge2V4cGVjdCwgYXNzZXJ0fSBmcm9tIFwiLi9lcnJvcnNcIjtcbmltcG9ydCB7TWF5YmV9IGZyb20gXCJyYW1kYS1mYW50YXN5XCI7XG5pbXBvcnQge0FMTF9QSEFTRVN9IGZyb20gXCIuL3N5bnRheFwiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmluZGluZ01hcCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX21hcCA9IG5ldyBNYXA7XG4gIH1cbiAgYWRkKHN0eF8xNiwge2JpbmRpbmcsIHBoYXNlLCBza2lwRHVwID0gZmFsc2V9KSB7XG4gICAgbGV0IHN0eE5hbWVfMTcgPSBzdHhfMTYudmFsKCk7XG4gICAgbGV0IGFsbFNjb3Blc2V0XzE4ID0gc3R4XzE2LnNjb3Blc2V0cy5hbGw7XG4gICAgbGV0IHNjb3Blc2V0XzE5ID0gc3R4XzE2LnNjb3Blc2V0cy5waGFzZS5oYXMocGhhc2UpID8gc3R4XzE2LnNjb3Blc2V0cy5waGFzZS5nZXQocGhhc2UpIDogTGlzdCgpO1xuICAgIHNjb3Blc2V0XzE5ID0gYWxsU2NvcGVzZXRfMTguY29uY2F0KHNjb3Blc2V0XzE5KTtcbiAgICBhc3NlcnQocGhhc2UgIT0gbnVsbCwgXCJtdXN0IHByb3ZpZGUgYSBwaGFzZSBmb3IgYmluZGluZyBhZGRcIik7XG4gICAgaWYgKHRoaXMuX21hcC5oYXMoc3R4TmFtZV8xNykpIHtcbiAgICAgIGxldCBzY29wZXNldEJpbmRpbmdMaXN0ID0gdGhpcy5fbWFwLmdldChzdHhOYW1lXzE3KTtcbiAgICAgIGlmIChza2lwRHVwICYmIHNjb3Blc2V0QmluZGluZ0xpc3Quc29tZShzXzIwID0+IHNfMjAuc2NvcGVzLmVxdWFscyhzY29wZXNldF8xOSkpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuX21hcC5zZXQoc3R4TmFtZV8xNywgc2NvcGVzZXRCaW5kaW5nTGlzdC5wdXNoKHtzY29wZXM6IHNjb3Blc2V0XzE5LCBiaW5kaW5nOiBiaW5kaW5nLCBhbGlhczogTWF5YmUuTm90aGluZygpfSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9tYXAuc2V0KHN0eE5hbWVfMTcsIExpc3Qub2Yoe3Njb3Blczogc2NvcGVzZXRfMTksIGJpbmRpbmc6IGJpbmRpbmcsIGFsaWFzOiBNYXliZS5Ob3RoaW5nKCl9KSk7XG4gICAgfVxuICB9XG4gIGFkZEZvcndhcmQoc3R4XzIxLCBmb3J3YXJkU3R4XzIyLCBiaW5kaW5nXzIzLCBwaGFzZV8yNCkge1xuICAgIGxldCBzdHhOYW1lXzI1ID0gc3R4XzIxLnRva2VuLnZhbHVlO1xuICAgIGxldCBhbGxTY29wZXNldF8yNiA9IHN0eF8yMS5zY29wZXNldHMuYWxsO1xuICAgIGxldCBzY29wZXNldF8yNyA9IHN0eF8yMS5zY29wZXNldHMucGhhc2UuaGFzKHBoYXNlXzI0KSA/IHN0eF8yMS5zY29wZXNldHMucGhhc2UuZ2V0KHBoYXNlXzI0KSA6IExpc3QoKTtcbiAgICBzY29wZXNldF8yNyA9IGFsbFNjb3Blc2V0XzI2LmNvbmNhdChzY29wZXNldF8yNyk7XG4gICAgYXNzZXJ0KHBoYXNlXzI0ICE9IG51bGwsIFwibXVzdCBwcm92aWRlIGEgcGhhc2UgZm9yIGJpbmRpbmcgYWRkXCIpO1xuICAgIGlmICh0aGlzLl9tYXAuaGFzKHN0eE5hbWVfMjUpKSB7XG4gICAgICBsZXQgc2NvcGVzZXRCaW5kaW5nTGlzdCA9IHRoaXMuX21hcC5nZXQoc3R4TmFtZV8yNSk7XG4gICAgICB0aGlzLl9tYXAuc2V0KHN0eE5hbWVfMjUsIHNjb3Blc2V0QmluZGluZ0xpc3QucHVzaCh7c2NvcGVzOiBzY29wZXNldF8yNywgYmluZGluZzogYmluZGluZ18yMywgYWxpYXM6IE1heWJlLm9mKGZvcndhcmRTdHhfMjIpfSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9tYXAuc2V0KHN0eE5hbWVfMjUsIExpc3Qub2Yoe3Njb3Blczogc2NvcGVzZXRfMjcsIGJpbmRpbmc6IGJpbmRpbmdfMjMsIGFsaWFzOiBNYXliZS5vZihmb3J3YXJkU3R4XzIyKX0pKTtcbiAgICB9XG4gIH1cbiAgZ2V0KHN0eF8yOCkge1xuICAgIHJldHVybiB0aGlzLl9tYXAuZ2V0KHN0eF8yOC50b2tlbi52YWx1ZSk7XG4gIH1cbn1cbiJdfQ==