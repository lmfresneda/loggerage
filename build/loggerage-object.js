"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Each log
 */
var LoggerageObject = (function () {
    /**
     * Constructor
     * @param {string} _level
     * @param {string} _message
     * @param {string} _app     Optional
     */
    function LoggerageObject(_level, _message, _app, _version) {
        var ts = Date.now();
        var now = new Date(ts);
        this.timestamp = ts;
        this.date = now.toLocaleString();
        this.level = _level;
        this.message = _message;
        if (_app)
            this.app = _app;
        if (_version)
            this.version = _version;
    }
    return LoggerageObject;
}());
exports.LoggerageObject = LoggerageObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyYWdlLW9iamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2dnZXJhZ2Utb2JqZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0dBRUc7QUFDSDtJQStCRTs7Ozs7T0FLRztJQUNILHlCQUFZLE1BQWEsRUFBRSxRQUFlLEVBQUUsSUFBWSxFQUFFLFFBQXVCO1FBQy9FLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUN0QixJQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztRQUNwQixJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztRQUN4QixFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUM7WUFBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztRQUN6QixFQUFFLENBQUEsQ0FBQyxRQUFRLENBQUM7WUFBQyxJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztJQUN2QyxDQUFDO0lBQ0gsc0JBQUM7QUFBRCxDQUFDLEFBL0NELElBK0NDO0FBL0NZLDBDQUFlIn0=