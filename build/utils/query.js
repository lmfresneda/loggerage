"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var Query = (function () {
    function Query() {
    }
    return Query;
}());
exports.Query = Query;
var Queriable = (function () {
    function Queriable() {
        this.isQueryRequested = false;
    }
    Queriable.prototype.getQueryRequest = function () {
        var query = new Query();
        if (this._fromFilter != null)
            query.from = utils_1.Utils.getUnixDate(this._fromFilter, this._fromFormatFilter);
        if (this._toFilter != null)
            query.to = utils_1.Utils.getUnixDate(this._toFilter, this._fromFormatFilter);
        if (this._levelFilter != null)
            query.level = this._levelFilter;
        if (this._appFilter != null)
            query.app = this._appFilter;
        if (this._versionFilter != null)
            query.version = this._versionFilter;
        return query;
    };
    Queriable.prototype.from = function (from, dateStringFormat) {
        this._fromFilter = from;
        if (dateStringFormat)
            this._fromFormatFilter = dateStringFormat;
        this.isQueryRequested = true;
        return this;
    };
    Queriable.prototype.to = function (to, dateStringFormat) {
        this._toFilter = to;
        if (dateStringFormat)
            this._toFormatFilter = dateStringFormat;
        this.isQueryRequested = true;
        return this;
    };
    Queriable.prototype.level = function (level) {
        this._levelFilter = level;
        this.isQueryRequested = true;
        return this;
    };
    Queriable.prototype.app = function (app) {
        this._appFilter = app;
        this.isQueryRequested = true;
        return this;
    };
    Queriable.prototype.version = function (version) {
        this._versionFilter = version;
        this.isQueryRequested = true;
        return this;
    };
    Queriable.prototype.resetQuery = function () {
        if (this.isQueryRequested) {
            this.isQueryRequested = false;
            this._fromFormatFilter = null;
            this._fromFilter = null;
            this._toFormatFilter = null;
            this._toFilter = null;
            this._levelFilter = null;
            this._appFilter = null;
            this._versionFilter = null;
        }
        return this;
    };
    return Queriable;
}());
exports.Queriable = Queriable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvcXVlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxpQ0FBZ0M7QUFFaEM7SUFBQTtJQTBCQSxDQUFDO0lBQUQsWUFBQztBQUFELENBQUMsQUExQkQsSUEwQkM7QUExQlksc0JBQUs7QUE0QmxCO0lBQUE7UUFFRSxxQkFBZ0IsR0FBVyxLQUFLLENBQUM7SUFtRW5DLENBQUM7SUFqRVcsbUNBQWUsR0FBekI7UUFDRSxJQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1FBQzFCLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDO1lBQzFCLEtBQUssQ0FBQyxJQUFJLEdBQUcsYUFBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzNFLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDO1lBQ3hCLEtBQUssQ0FBQyxFQUFFLEdBQUcsYUFBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBRXZFLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDO1lBQzNCLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUNsQyxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQztZQUN6QixLQUFLLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDOUIsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUM7WUFDN0IsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsd0JBQUksR0FBSixVQUFLLElBQXFDLEVBQUUsZ0JBQXdCO1FBQ2xFLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLEVBQUUsQ0FBQSxDQUFDLGdCQUFnQixDQUFDO1lBQUMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGdCQUFnQixDQUFDO1FBQy9ELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7UUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxzQkFBRSxHQUFGLFVBQUcsRUFBbUMsRUFBRSxnQkFBd0I7UUFDOUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDcEIsRUFBRSxDQUFBLENBQUMsZ0JBQWdCLENBQUM7WUFBQyxJQUFJLENBQUMsZUFBZSxHQUFHLGdCQUFnQixDQUFDO1FBQzdELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7UUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCx5QkFBSyxHQUFMLFVBQU0sS0FBcUM7UUFDekMsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7UUFDMUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztRQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELHVCQUFHLEdBQUgsVUFBSSxHQUFVO1FBQ1osSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7UUFDdEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztRQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELDJCQUFPLEdBQVAsVUFBUSxPQUFxQjtRQUMzQixJQUFJLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQztRQUM5QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRVMsOEJBQVUsR0FBcEI7UUFDRSxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7WUFDOUIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztZQUM5QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUN4QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztZQUM1QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUN0QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztZQUN6QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztRQUM3QixDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFTSCxnQkFBQztBQUFELENBQUMsQUFyRUQsSUFxRUM7QUFyRVksOEJBQVMifQ==