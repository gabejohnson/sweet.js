"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processTemplate = processTemplate;
exports.replaceTemplate = replaceTemplate;

var _immutable = require("immutable");

var _ramdaFantasy = require("ramda-fantasy");

var _ramda = require("ramda");

var _ramda2 = _interopRequireDefault(_ramda);

var _syntax = require("./syntax");

var _syntax2 = _interopRequireDefault(_syntax);

var _errors = require("./errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isDolar_744 = function isDolar_744(s_752) {
  return s_752 && s_752 instanceof _syntax2.default && s_752.isIdentifier() && s_752.val() === "$";
};
var isDelimiter_745 = function isDelimiter_745(s_753) {
  return s_753 && typeof s_753.isDelimiter === "function" && s_753.isDelimiter();
};
var isBraces_746 = function isBraces_746(s_754) {
  return s_754 && typeof s_754.isBraces === "function" && s_754.isBraces();
};
var isParens_747 = function isParens_747(s_755) {
  return s_755 && typeof s_755.isParens === "function" && s_755.isParens();
};
var isBrackets_748 = function isBrackets_748(s_756) {
  return s_756 && typeof s_756.isBrackets === "function" && s_756.isBrackets();
};
var insertIntoDelimiter_749 = _ramda2.default.cond([[isBraces_746, function (s_757, r_758) {
  return _syntax2.default.fromBraces(r_758, s_757);
}], [isParens_747, function (s_759, r_760) {
  return _syntax2.default.fromParens(r_760, s_759);
}], [isBrackets_748, function (s_761, r_762) {
  return _syntax2.default.fromBrackets(r_762, s_761);
}]]);
var process_750 = function process_750(acc_763, s_764) {
  if (isBraces_746(s_764) && isDolar_744(acc_763.template.last())) {
    return { template: acc_763.template.push(_syntax2.default.fromBraces(_immutable.List.of(_syntax2.default.fromNumber(acc_763.interp.size)), s_764)), interp: acc_763.interp.push(s_764.inner()) };
  } else if (isDelimiter_745(s_764)) {
    var innerResult = processTemplate(s_764.inner(), acc_763.interp);
    return { template: acc_763.template.push(insertIntoDelimiter_749(s_764, innerResult.template)), interp: innerResult.interp };
  } else {
    return { template: acc_763.template.push(s_764), interp: acc_763.interp };
  }
};
var replace_751 = function replace_751(acc_765, s_766) {
  if (isBraces_746(s_766) && isDolar_744(acc_765.template.last())) {
    var index = s_766.inner().first().val();
    (0, _errors.assert)(acc_765.rep.size > index, "unknown replacement value");
    return { template: acc_765.template.pop().concat(acc_765.rep.get(index)), rep: acc_765.rep };
  } else if (isDelimiter_745(s_766)) {
    var innerResult = replaceTemplate(s_766.inner(), acc_765.rep);
    return { template: acc_765.template.push(insertIntoDelimiter_749(s_766, innerResult)), rep: acc_765.rep };
  } else {
    return { template: acc_765.template.push(s_766), rep: acc_765.rep };
  }
};
function processTemplate(temp_767) {
  var interp_768 = arguments.length <= 1 || arguments[1] === undefined ? (0, _immutable.List)() : arguments[1];

  return temp_767.reduce(process_750, { template: (0, _immutable.List)(), interp: interp_768 });
}
function replaceTemplate(temp_769, rep_770) {
  return temp_769.reduce(replace_751, { template: (0, _immutable.List)(), rep: rep_770 }).template;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3N3ZWV0L3RlbXBsYXRlLXByb2Nlc3Nvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztRQWlDZ0IsZSxHQUFBLGU7UUFHQSxlLEdBQUEsZTs7QUFwQ2hCOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBLElBQU0sY0FBYyxTQUFkLFdBQWM7QUFBQSxTQUFTLFNBQVMsaUNBQVQsSUFBb0MsTUFBTSxZQUFOLEVBQXBDLElBQTRELE1BQU0sR0FBTixPQUFnQixHQUFyRjtBQUFBLENBQXBCO0FBQ0EsSUFBTSxrQkFBa0IsU0FBbEIsZUFBa0I7QUFBQSxTQUFTLFNBQVMsT0FBTyxNQUFNLFdBQWIsS0FBNkIsVUFBdEMsSUFBb0QsTUFBTSxXQUFOLEVBQTdEO0FBQUEsQ0FBeEI7QUFDQSxJQUFNLGVBQWUsU0FBZixZQUFlO0FBQUEsU0FBUyxTQUFTLE9BQU8sTUFBTSxRQUFiLEtBQTBCLFVBQW5DLElBQWlELE1BQU0sUUFBTixFQUExRDtBQUFBLENBQXJCO0FBQ0EsSUFBTSxlQUFlLFNBQWYsWUFBZTtBQUFBLFNBQVMsU0FBUyxPQUFPLE1BQU0sUUFBYixLQUEwQixVQUFuQyxJQUFpRCxNQUFNLFFBQU4sRUFBMUQ7QUFBQSxDQUFyQjtBQUNBLElBQU0saUJBQWlCLFNBQWpCLGNBQWlCO0FBQUEsU0FBUyxTQUFTLE9BQU8sTUFBTSxVQUFiLEtBQTRCLFVBQXJDLElBQW1ELE1BQU0sVUFBTixFQUE1RDtBQUFBLENBQXZCO0FBQ0EsSUFBTSwwQkFBMEIsZ0JBQUUsSUFBRixDQUFPLENBQUMsQ0FBQyxZQUFELEVBQWUsVUFBQyxLQUFELEVBQVEsS0FBUjtBQUFBLFNBQWtCLGlCQUFPLFVBQVAsQ0FBa0IsS0FBbEIsRUFBeUIsS0FBekIsQ0FBbEI7QUFBQSxDQUFmLENBQUQsRUFBb0UsQ0FBQyxZQUFELEVBQWUsVUFBQyxLQUFELEVBQVEsS0FBUjtBQUFBLFNBQWtCLGlCQUFPLFVBQVAsQ0FBa0IsS0FBbEIsRUFBeUIsS0FBekIsQ0FBbEI7QUFBQSxDQUFmLENBQXBFLEVBQXVJLENBQUMsY0FBRCxFQUFpQixVQUFDLEtBQUQsRUFBUSxLQUFSO0FBQUEsU0FBa0IsaUJBQU8sWUFBUCxDQUFvQixLQUFwQixFQUEyQixLQUEzQixDQUFsQjtBQUFBLENBQWpCLENBQXZJLENBQVAsQ0FBaEM7QUFDQSxJQUFNLGNBQWMsU0FBZCxXQUFjLENBQUMsT0FBRCxFQUFVLEtBQVYsRUFBb0I7QUFDdEMsTUFBSSxhQUFhLEtBQWIsS0FBdUIsWUFBWSxRQUFRLFFBQVIsQ0FBaUIsSUFBakIsRUFBWixDQUEzQixFQUFpRTtBQUMvRCxXQUFPLEVBQUMsVUFBVSxRQUFRLFFBQVIsQ0FBaUIsSUFBakIsQ0FBc0IsaUJBQU8sVUFBUCxDQUFrQixnQkFBSyxFQUFMLENBQVEsaUJBQU8sVUFBUCxDQUFrQixRQUFRLE1BQVIsQ0FBZSxJQUFqQyxDQUFSLENBQWxCLEVBQW1FLEtBQW5FLENBQXRCLENBQVgsRUFBNkcsUUFBUSxRQUFRLE1BQVIsQ0FBZSxJQUFmLENBQW9CLE1BQU0sS0FBTixFQUFwQixDQUFySCxFQUFQO0FBQ0QsR0FGRCxNQUVPLElBQUksZ0JBQWdCLEtBQWhCLENBQUosRUFBNEI7QUFDakMsUUFBSSxjQUFjLGdCQUFnQixNQUFNLEtBQU4sRUFBaEIsRUFBK0IsUUFBUSxNQUF2QyxDQUFsQjtBQUNBLFdBQU8sRUFBQyxVQUFVLFFBQVEsUUFBUixDQUFpQixJQUFqQixDQUFzQix3QkFBd0IsS0FBeEIsRUFBK0IsWUFBWSxRQUEzQyxDQUF0QixDQUFYLEVBQXdGLFFBQVEsWUFBWSxNQUE1RyxFQUFQO0FBQ0QsR0FITSxNQUdBO0FBQ0wsV0FBTyxFQUFDLFVBQVUsUUFBUSxRQUFSLENBQWlCLElBQWpCLENBQXNCLEtBQXRCLENBQVgsRUFBeUMsUUFBUSxRQUFRLE1BQXpELEVBQVA7QUFDRDtBQUNGLENBVEQ7QUFVQSxJQUFNLGNBQWMsU0FBZCxXQUFjLENBQUMsT0FBRCxFQUFVLEtBQVYsRUFBb0I7QUFDdEMsTUFBSSxhQUFhLEtBQWIsS0FBdUIsWUFBWSxRQUFRLFFBQVIsQ0FBaUIsSUFBakIsRUFBWixDQUEzQixFQUFpRTtBQUMvRCxRQUFJLFFBQVEsTUFBTSxLQUFOLEdBQWMsS0FBZCxHQUFzQixHQUF0QixFQUFaO0FBQ0Esd0JBQU8sUUFBUSxHQUFSLENBQVksSUFBWixHQUFtQixLQUExQixFQUFpQywyQkFBakM7QUFDQSxXQUFPLEVBQUMsVUFBVSxRQUFRLFFBQVIsQ0FBaUIsR0FBakIsR0FBdUIsTUFBdkIsQ0FBOEIsUUFBUSxHQUFSLENBQVksR0FBWixDQUFnQixLQUFoQixDQUE5QixDQUFYLEVBQWtFLEtBQUssUUFBUSxHQUEvRSxFQUFQO0FBQ0QsR0FKRCxNQUlPLElBQUksZ0JBQWdCLEtBQWhCLENBQUosRUFBNEI7QUFDakMsUUFBSSxjQUFjLGdCQUFnQixNQUFNLEtBQU4sRUFBaEIsRUFBK0IsUUFBUSxHQUF2QyxDQUFsQjtBQUNBLFdBQU8sRUFBQyxVQUFVLFFBQVEsUUFBUixDQUFpQixJQUFqQixDQUFzQix3QkFBd0IsS0FBeEIsRUFBK0IsV0FBL0IsQ0FBdEIsQ0FBWCxFQUErRSxLQUFLLFFBQVEsR0FBNUYsRUFBUDtBQUNELEdBSE0sTUFHQTtBQUNMLFdBQU8sRUFBQyxVQUFVLFFBQVEsUUFBUixDQUFpQixJQUFqQixDQUFzQixLQUF0QixDQUFYLEVBQXlDLEtBQUssUUFBUSxHQUF0RCxFQUFQO0FBQ0Q7QUFDRixDQVhEO0FBWU8sU0FBUyxlQUFULENBQXlCLFFBQXpCLEVBQXdEO0FBQUEsTUFBckIsVUFBcUIseURBQVIsc0JBQVE7O0FBQzdELFNBQU8sU0FBUyxNQUFULENBQWdCLFdBQWhCLEVBQTZCLEVBQUMsVUFBVSxzQkFBWCxFQUFtQixRQUFRLFVBQTNCLEVBQTdCLENBQVA7QUFDRDtBQUNNLFNBQVMsZUFBVCxDQUF5QixRQUF6QixFQUFtQyxPQUFuQyxFQUE0QztBQUNqRCxTQUFPLFNBQVMsTUFBVCxDQUFnQixXQUFoQixFQUE2QixFQUFDLFVBQVUsc0JBQVgsRUFBbUIsS0FBSyxPQUF4QixFQUE3QixFQUErRCxRQUF0RTtBQUNEIiwiZmlsZSI6InRlbXBsYXRlLXByb2Nlc3Nvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TGlzdH0gZnJvbSBcImltbXV0YWJsZVwiO1xuaW1wb3J0IHtNYXliZX0gZnJvbSBcInJhbWRhLWZhbnRhc3lcIjtcbmltcG9ydCBfIGZyb20gXCJyYW1kYVwiO1xuaW1wb3J0IFN5bnRheCBmcm9tIFwiLi9zeW50YXhcIjtcbmltcG9ydCB7YXNzZXJ0fSBmcm9tIFwiLi9lcnJvcnNcIjtcbmNvbnN0IGlzRG9sYXJfNzQ0ID0gc183NTIgPT4gc183NTIgJiYgc183NTIgaW5zdGFuY2VvZiBTeW50YXggJiYgc183NTIuaXNJZGVudGlmaWVyKCkgJiYgc183NTIudmFsKCkgPT09IFwiJFwiO1xuY29uc3QgaXNEZWxpbWl0ZXJfNzQ1ID0gc183NTMgPT4gc183NTMgJiYgdHlwZW9mIHNfNzUzLmlzRGVsaW1pdGVyID09PSBcImZ1bmN0aW9uXCIgJiYgc183NTMuaXNEZWxpbWl0ZXIoKTtcbmNvbnN0IGlzQnJhY2VzXzc0NiA9IHNfNzU0ID0+IHNfNzU0ICYmIHR5cGVvZiBzXzc1NC5pc0JyYWNlcyA9PT0gXCJmdW5jdGlvblwiICYmIHNfNzU0LmlzQnJhY2VzKCk7XG5jb25zdCBpc1BhcmVuc183NDcgPSBzXzc1NSA9PiBzXzc1NSAmJiB0eXBlb2Ygc183NTUuaXNQYXJlbnMgPT09IFwiZnVuY3Rpb25cIiAmJiBzXzc1NS5pc1BhcmVucygpO1xuY29uc3QgaXNCcmFja2V0c183NDggPSBzXzc1NiA9PiBzXzc1NiAmJiB0eXBlb2Ygc183NTYuaXNCcmFja2V0cyA9PT0gXCJmdW5jdGlvblwiICYmIHNfNzU2LmlzQnJhY2tldHMoKTtcbmNvbnN0IGluc2VydEludG9EZWxpbWl0ZXJfNzQ5ID0gXy5jb25kKFtbaXNCcmFjZXNfNzQ2LCAoc183NTcsIHJfNzU4KSA9PiBTeW50YXguZnJvbUJyYWNlcyhyXzc1OCwgc183NTcpXSwgW2lzUGFyZW5zXzc0NywgKHNfNzU5LCByXzc2MCkgPT4gU3ludGF4LmZyb21QYXJlbnMocl83NjAsIHNfNzU5KV0sIFtpc0JyYWNrZXRzXzc0OCwgKHNfNzYxLCByXzc2MikgPT4gU3ludGF4LmZyb21CcmFja2V0cyhyXzc2Miwgc183NjEpXV0pO1xuY29uc3QgcHJvY2Vzc183NTAgPSAoYWNjXzc2Mywgc183NjQpID0+IHtcbiAgaWYgKGlzQnJhY2VzXzc0NihzXzc2NCkgJiYgaXNEb2xhcl83NDQoYWNjXzc2My50ZW1wbGF0ZS5sYXN0KCkpKSB7XG4gICAgcmV0dXJuIHt0ZW1wbGF0ZTogYWNjXzc2My50ZW1wbGF0ZS5wdXNoKFN5bnRheC5mcm9tQnJhY2VzKExpc3Qub2YoU3ludGF4LmZyb21OdW1iZXIoYWNjXzc2My5pbnRlcnAuc2l6ZSkpLCBzXzc2NCkpLCBpbnRlcnA6IGFjY183NjMuaW50ZXJwLnB1c2goc183NjQuaW5uZXIoKSl9O1xuICB9IGVsc2UgaWYgKGlzRGVsaW1pdGVyXzc0NShzXzc2NCkpIHtcbiAgICBsZXQgaW5uZXJSZXN1bHQgPSBwcm9jZXNzVGVtcGxhdGUoc183NjQuaW5uZXIoKSwgYWNjXzc2My5pbnRlcnApO1xuICAgIHJldHVybiB7dGVtcGxhdGU6IGFjY183NjMudGVtcGxhdGUucHVzaChpbnNlcnRJbnRvRGVsaW1pdGVyXzc0OShzXzc2NCwgaW5uZXJSZXN1bHQudGVtcGxhdGUpKSwgaW50ZXJwOiBpbm5lclJlc3VsdC5pbnRlcnB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7dGVtcGxhdGU6IGFjY183NjMudGVtcGxhdGUucHVzaChzXzc2NCksIGludGVycDogYWNjXzc2My5pbnRlcnB9O1xuICB9XG59O1xuY29uc3QgcmVwbGFjZV83NTEgPSAoYWNjXzc2NSwgc183NjYpID0+IHtcbiAgaWYgKGlzQnJhY2VzXzc0NihzXzc2NikgJiYgaXNEb2xhcl83NDQoYWNjXzc2NS50ZW1wbGF0ZS5sYXN0KCkpKSB7XG4gICAgbGV0IGluZGV4ID0gc183NjYuaW5uZXIoKS5maXJzdCgpLnZhbCgpO1xuICAgIGFzc2VydChhY2NfNzY1LnJlcC5zaXplID4gaW5kZXgsIFwidW5rbm93biByZXBsYWNlbWVudCB2YWx1ZVwiKTtcbiAgICByZXR1cm4ge3RlbXBsYXRlOiBhY2NfNzY1LnRlbXBsYXRlLnBvcCgpLmNvbmNhdChhY2NfNzY1LnJlcC5nZXQoaW5kZXgpKSwgcmVwOiBhY2NfNzY1LnJlcH07XG4gIH0gZWxzZSBpZiAoaXNEZWxpbWl0ZXJfNzQ1KHNfNzY2KSkge1xuICAgIGxldCBpbm5lclJlc3VsdCA9IHJlcGxhY2VUZW1wbGF0ZShzXzc2Ni5pbm5lcigpLCBhY2NfNzY1LnJlcCk7XG4gICAgcmV0dXJuIHt0ZW1wbGF0ZTogYWNjXzc2NS50ZW1wbGF0ZS5wdXNoKGluc2VydEludG9EZWxpbWl0ZXJfNzQ5KHNfNzY2LCBpbm5lclJlc3VsdCkpLCByZXA6IGFjY183NjUucmVwfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge3RlbXBsYXRlOiBhY2NfNzY1LnRlbXBsYXRlLnB1c2goc183NjYpLCByZXA6IGFjY183NjUucmVwfTtcbiAgfVxufTtcbmV4cG9ydCBmdW5jdGlvbiBwcm9jZXNzVGVtcGxhdGUodGVtcF83NjcsIGludGVycF83NjggPSBMaXN0KCkpIHtcbiAgcmV0dXJuIHRlbXBfNzY3LnJlZHVjZShwcm9jZXNzXzc1MCwge3RlbXBsYXRlOiBMaXN0KCksIGludGVycDogaW50ZXJwXzc2OH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJlcGxhY2VUZW1wbGF0ZSh0ZW1wXzc2OSwgcmVwXzc3MCkge1xuICByZXR1cm4gdGVtcF83NjkucmVkdWNlKHJlcGxhY2VfNzUxLCB7dGVtcGxhdGU6IExpc3QoKSwgcmVwOiByZXBfNzcwfSkudGVtcGxhdGU7XG59XG4iXX0=