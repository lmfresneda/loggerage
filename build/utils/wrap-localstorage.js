"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var WrapLocalStorage = (function () {
    function WrapLocalStorage(localStorage) {
        this._storage = localStorage;
    }
    WrapLocalStorage.prototype.getItem = function (app, query) {
        var logs = JSON.parse(this._storage.getItem(app) || "[]");
        if (query)
            logs = utils_1.Utils.getLogFiltered(logs, query);
        return logs;
    };
    WrapLocalStorage.prototype.setItem = function (app, value) {
        var logs = this.getItem(app);
        logs.push(value);
        this._storage.setItem(app, JSON.stringify(logs));
    };
    WrapLocalStorage.prototype.clear = function () {
        this._storage.clear();
    };
    return WrapLocalStorage;
}());
exports.WrapLocalStorage = WrapLocalStorage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JhcC1sb2NhbHN0b3JhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvd3JhcC1sb2NhbHN0b3JhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxpQ0FBZ0M7QUFHaEM7SUFJRSwwQkFBWSxZQUFnQjtRQUMxQixJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQztJQUMvQixDQUFDO0lBRUQsa0NBQU8sR0FBUCxVQUFRLEdBQVUsRUFBRSxLQUFZO1FBQzlCLElBQUksSUFBSSxHQUFxQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO1FBRTVFLEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQztZQUFDLElBQUksR0FBRyxhQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVuRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELGtDQUFPLEdBQVAsVUFBUSxHQUFVLEVBQUUsS0FBcUI7UUFDdkMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUUvQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELGdDQUFLLEdBQUw7UUFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFDSCx1QkFBQztBQUFELENBQUMsQUExQkQsSUEwQkM7QUExQlksNENBQWdCIn0=