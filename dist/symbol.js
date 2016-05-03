"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gensym = gensym;
var internedMap_674 = new Map();
var counter_675 = 0;
function gensym(name_678) {
  var prefix_679 = name_678 == null ? "s_" : name_678 + "_";
  var sym_680 = new Symbol_676(prefix_679 + counter_675);
  counter_675++;
  return sym_680;
}
function Symbol_676(name_681) {
  this.name = name_681;
}
Symbol_676.prototype.toString = function () {
  return this.name;
};
function makeSymbol_677(name_682) {
  if (internedMap_674.has(name_682)) {
    return internedMap_674.get(name_682);
  } else {
    var sym = new Symbol_676(name_682);
    internedMap_674.set(name_682, sym);
    return sym;
  }
}
exports.Symbol = makeSymbol_677;
exports.SymbolClass = Symbol_676;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3N3ZWV0L3N5bWJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztRQUVnQixNLEdBQUEsTTtBQUZoQixJQUFJLGtCQUFrQixJQUFJLEdBQUosRUFBdEI7QUFDQSxJQUFJLGNBQWMsQ0FBbEI7QUFDTyxTQUFTLE1BQVQsQ0FBZ0IsUUFBaEIsRUFBMEI7QUFDL0IsTUFBSSxhQUFhLFlBQVksSUFBWixHQUFtQixJQUFuQixHQUEwQixXQUFXLEdBQXREO0FBQ0EsTUFBSSxVQUFVLElBQUksVUFBSixDQUFlLGFBQWEsV0FBNUIsQ0FBZDtBQUNBO0FBQ0EsU0FBTyxPQUFQO0FBQ0Q7QUFDRCxTQUFTLFVBQVQsQ0FBb0IsUUFBcEIsRUFBOEI7QUFDNUIsT0FBSyxJQUFMLEdBQVksUUFBWjtBQUNEO0FBQ0QsV0FBVyxTQUFYLENBQXFCLFFBQXJCLEdBQWdDLFlBQVk7QUFDMUMsU0FBTyxLQUFLLElBQVo7QUFDRCxDQUZEO0FBR0EsU0FBUyxjQUFULENBQXdCLFFBQXhCLEVBQWtDO0FBQ2hDLE1BQUksZ0JBQWdCLEdBQWhCLENBQW9CLFFBQXBCLENBQUosRUFBbUM7QUFDakMsV0FBTyxnQkFBZ0IsR0FBaEIsQ0FBb0IsUUFBcEIsQ0FBUDtBQUNELEdBRkQsTUFFTztBQUNMLFFBQUksTUFBTSxJQUFJLFVBQUosQ0FBZSxRQUFmLENBQVY7QUFDQSxvQkFBZ0IsR0FBaEIsQ0FBb0IsUUFBcEIsRUFBOEIsR0FBOUI7QUFDQSxXQUFPLEdBQVA7QUFDRDtBQUNGO1FBQ3lCLE0sR0FBbEIsYztRQUF3QyxXLEdBQWQsVSIsImZpbGUiOiJzeW1ib2wuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgaW50ZXJuZWRNYXBfNjc0ID0gbmV3IE1hcDtcbmxldCBjb3VudGVyXzY3NSA9IDA7XG5leHBvcnQgZnVuY3Rpb24gZ2Vuc3ltKG5hbWVfNjc4KSB7XG4gIGxldCBwcmVmaXhfNjc5ID0gbmFtZV82NzggPT0gbnVsbCA/IFwic19cIiA6IG5hbWVfNjc4ICsgXCJfXCI7XG4gIGxldCBzeW1fNjgwID0gbmV3IFN5bWJvbF82NzYocHJlZml4XzY3OSArIGNvdW50ZXJfNjc1KTtcbiAgY291bnRlcl82NzUrKztcbiAgcmV0dXJuIHN5bV82ODA7XG59XG5mdW5jdGlvbiBTeW1ib2xfNjc2KG5hbWVfNjgxKSB7XG4gIHRoaXMubmFtZSA9IG5hbWVfNjgxO1xufVxuU3ltYm9sXzY3Ni5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLm5hbWU7XG59O1xuZnVuY3Rpb24gbWFrZVN5bWJvbF82NzcobmFtZV82ODIpIHtcbiAgaWYgKGludGVybmVkTWFwXzY3NC5oYXMobmFtZV82ODIpKSB7XG4gICAgcmV0dXJuIGludGVybmVkTWFwXzY3NC5nZXQobmFtZV82ODIpO1xuICB9IGVsc2Uge1xuICAgIGxldCBzeW0gPSBuZXcgU3ltYm9sXzY3NihuYW1lXzY4Mik7XG4gICAgaW50ZXJuZWRNYXBfNjc0LnNldChuYW1lXzY4Miwgc3ltKTtcbiAgICByZXR1cm4gc3ltO1xuICB9XG59XG5leHBvcnQge21ha2VTeW1ib2xfNjc3IGFzIFN5bWJvbCwgU3ltYm9sXzY3NiBhcyBTeW1ib2xDbGFzc307XG4iXX0=