"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var loggerage_level_1 = require("./loggerage-level");
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
        this.level_number = loggerage_level_1.LoggerageLevel[_level];
        this.message = _message;
        if (_app)
            this.app = _app;
        if (_version)
            this.version = _version;
    }
    return LoggerageObject;
}());
exports.LoggerageObject = LoggerageObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyYWdlLW9iamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2dnZXJhZ2Utb2JqZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscURBQW1EO0FBRW5EOztHQUVHO0FBQ0g7SUFvQ0U7Ozs7O09BS0c7SUFDSCx5QkFBWSxNQUFhLEVBQUUsUUFBZSxFQUFFLElBQVksRUFBRSxRQUF1QjtRQUMvRSxJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDdEIsSUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDakMsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7UUFDcEIsSUFBSSxDQUFDLFlBQVksR0FBRyxnQ0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDO1FBQ3hCLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQztZQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLEVBQUUsQ0FBQSxDQUFDLFFBQVEsQ0FBQztZQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDO0lBQ3ZDLENBQUM7SUFDSCxzQkFBQztBQUFELENBQUMsQUFyREQsSUFxREM7QUFyRFksMENBQWUifQ==