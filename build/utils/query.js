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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvcXVlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxpQ0FBZ0M7QUFFaEM7SUFBQTtJQTBCQSxDQUFDO0lBQUQsWUFBQztBQUFELENBQUMsQUExQkQsSUEwQkM7QUExQlksc0JBQUs7QUE0QmxCO0lBQUE7UUFFRSxxQkFBZ0IsR0FBVyxLQUFLLENBQUM7SUFtRW5DLENBQUM7SUFqRUMsbUNBQWUsR0FBZjtRQUNFLElBQU0sS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7UUFDMUIsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUM7WUFDMUIsS0FBSyxDQUFDLElBQUksR0FBRyxhQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDM0UsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUM7WUFDeEIsS0FBSyxDQUFDLEVBQUUsR0FBRyxhQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFFdkUsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUM7WUFDM0IsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQ2xDLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDO1lBQ3pCLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUM5QixFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQztZQUM3QixLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDdEMsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCx3QkFBSSxHQUFKLFVBQUssSUFBcUMsRUFBRSxnQkFBd0I7UUFDbEUsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDeEIsRUFBRSxDQUFBLENBQUMsZ0JBQWdCLENBQUM7WUFBQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsZ0JBQWdCLENBQUM7UUFDL0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztRQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELHNCQUFFLEdBQUYsVUFBRyxFQUFtQyxFQUFFLGdCQUF3QjtRQUM5RCxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUNwQixFQUFFLENBQUEsQ0FBQyxnQkFBZ0IsQ0FBQztZQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsZ0JBQWdCLENBQUM7UUFDN0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztRQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELHlCQUFLLEdBQUwsVUFBTSxLQUFxQztRQUN6QyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUMxQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsdUJBQUcsR0FBSCxVQUFJLEdBQVU7UUFDWixJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztRQUN0QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsMkJBQU8sR0FBUCxVQUFRLE9BQXFCO1FBQzNCLElBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDO1FBQzlCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7UUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCw4QkFBVSxHQUFWO1FBQ0UsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUEsQ0FBQztZQUN4QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1lBQzlCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7WUFDOUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDeEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7WUFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDdEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7WUFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDdkIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7UUFDN0IsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBU0gsZ0JBQUM7QUFBRCxDQUFDLEFBckVELElBcUVDO0FBckVZLDhCQUFTIn0=