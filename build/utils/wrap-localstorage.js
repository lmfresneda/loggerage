"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WrapLocalStorage = (function () {
    function WrapLocalStorage(localStorage) {
        this._storage = localStorage;
    }
    WrapLocalStorage.prototype.getItem = function (app) {
        var logs = JSON.parse(this._storage.getItem(app) || "[]");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JhcC1sb2NhbHN0b3JhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvd3JhcC1sb2NhbHN0b3JhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQTtJQUlFLDBCQUFZLFlBQWdCO1FBQzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDO0lBQy9CLENBQUM7SUFFRCxrQ0FBTyxHQUFQLFVBQVEsR0FBVTtRQUNoQixJQUFJLElBQUksR0FBMEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQztRQUNqRixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELGtDQUFPLEdBQVAsVUFBUSxHQUFVLEVBQUUsS0FBcUI7UUFDdkMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUUvQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELGdDQUFLLEdBQUw7UUFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFDSCx1QkFBQztBQUFELENBQUMsQUF2QkQsSUF1QkM7QUF2QlksNENBQWdCIn0=