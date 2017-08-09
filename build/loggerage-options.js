"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var loggerage_level_1 = require("./loggerage-level");
/**
 * Options for Loggerage constructor
 */
var LoggerageOptions = (function () {
    function LoggerageOptions() {
        /**
         * Indicate if storage is default localStorage.
         * @default true
         * @type {boolean}
         */
        this.isLocalStorage = true;
        /**
         * If true, will not be displayed console logs
         * @default false
         * @type {boolean}
         */
        this.silence = false;
        /**
         * Version aplicatton
         * @default 1
         * @type {Number|String}
         */
        this.version = 1;
        /**
         * Default log level if call .log() method directly
         * @default LoggerageLevel.DEBUG
         * @type {LoggerageLevel}
         */
        this.defaultLogLevel = loggerage_level_1.LoggerageLevel.DEBUG;
    }
    return LoggerageOptions;
}());
exports.LoggerageOptions = LoggerageOptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyYWdlLW9wdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvbG9nZ2VyYWdlLW9wdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBbUQ7QUFHbkQ7O0dBRUc7QUFDSDtJQUFBO1FBQ0U7Ozs7V0FJRztRQUNILG1CQUFjLEdBQVcsSUFBSSxDQUFDO1FBQzlCOzs7O1dBSUc7UUFDSCxZQUFPLEdBQVcsS0FBSyxDQUFDO1FBQ3hCOzs7O1dBSUc7UUFDSCxZQUFPLEdBQWlCLENBQUMsQ0FBQztRQUMxQjs7OztXQUlHO1FBQ0gsb0JBQWUsR0FBa0IsZ0NBQWMsQ0FBQyxLQUFLLENBQUM7SUFPeEQsQ0FBQztJQUFELHVCQUFDO0FBQUQsQ0FBQyxBQS9CRCxJQStCQztBQS9CWSw0Q0FBZ0IifQ==