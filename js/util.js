define(["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function extend(src, dst) {
        var keys = Object.keys(dst);
        for (var i = 0, len = keys.length; i < len; i++) {
            src[keys[i]] = dst[keys[i]];
        }
        return src;
    }
    function replace(str, replacement) {
        return str.replace(/{{.*}}/, replacement);
    }
    exports.extend = extend;
    exports.replace = replace;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2pzbmV4dC91dGlsLmpzIl0sIm5hbWVzIjpbImV4dGVuZCIsInNyYyIsImRzdCIsImtleXMiLCJPYmplY3QiLCJpIiwibGVuIiwibGVuZ3RoIiwicmVwbGFjZSIsInN0ciIsInJlcGxhY2VtZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxhQUFTQSxNQUFULENBQWdCQyxHQUFoQixFQUFxQkMsR0FBckIsRUFBMEI7QUFDdEIsWUFBSUMsT0FBT0MsT0FBT0QsSUFBUCxDQUFZRCxHQUFaLENBQVg7QUFDQSxhQUFLLElBQUlHLElBQUksQ0FBUixFQUFXQyxNQUFNSCxLQUFLSSxNQUEzQixFQUFtQ0YsSUFBSUMsR0FBdkMsRUFBNENELEdBQTVDLEVBQWlEO0FBQzdDSixnQkFBSUUsS0FBS0UsQ0FBTCxDQUFKLElBQWVILElBQUlDLEtBQUtFLENBQUwsQ0FBSixDQUFmO0FBQ0g7QUFDRCxlQUFPSixHQUFQO0FBQ0g7QUFDRCxhQUFTTyxPQUFULENBQWlCQyxHQUFqQixFQUFzQkMsV0FBdEIsRUFBbUM7QUFDL0IsZUFBT0QsSUFBSUQsT0FBSixDQUFZLFFBQVosRUFBc0JFLFdBQXRCLENBQVA7QUFDSDtZQUVHVixNLEdBQUFBLE07WUFDQVEsTyxHQUFBQSxPIiwiZmlsZSI6InV0aWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBleHRlbmQoc3JjLCBkc3QpIHtcbiAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKGRzdCk7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGtleXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgc3JjW2tleXNbaV1dID0gZHN0W2tleXNbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gc3JjO1xufVxuZnVuY3Rpb24gcmVwbGFjZShzdHIsIHJlcGxhY2VtZW50KSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC97ey4qfX0vLCByZXBsYWNlbWVudCk7XG59XG5leHBvcnQge1xuICAgIGV4dGVuZCxcbiAgICByZXBsYWNlXG59OyJdfQ==