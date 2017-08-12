"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var Downloadable = (function () {
    function Downloadable() {
    }
    /**
     * Download the log in a file
     * @param type File type (csv || txt)
     * @returns {Loggerage}
     */
    Downloadable.prototype.downloadFileLog = function (type) {
        if (type === void 0) { type = "txt"; }
        if (Blob && (window.URL || window["webkitURL"])) {
            console.info("The file is building now");
            var contenido = "";
            switch (type.toLowerCase()) {
                case "txt":
                    contenido = utils_1.Utils.buildTxtContent(this.getLog());
                    break;
                case "csv":
                    contenido = utils_1.Utils.buildCsvContent(this.getLog());
                    break;
            }
            var blob = utils_1.Utils.getBlob(contenido, type);
            var nameFile = this.getApp() + "_" + Date.now() + "_log." + type.toLowerCase();
            utils_1.Utils.downloadBlob(blob, nameFile);
        }
        else {
            throw new Error("Your browser does not support File APIs. Visit http://browsehappy.com for update or your official page browser.");
        }
        this.resetQuery();
        return this;
    };
    /**
     * Download the log in a file
     * @param type     File type (csv || txt) txt by default
     * @param callback    Is a function that recived two params. The first param is an error if occurs, otherwise is null. The second param is blob.
     * @returns {void}
     */
    Downloadable.prototype.downloadFileLogAsync = function (type, callback) {
        var _this = this;
        if (type === void 0) { type = "txt"; }
        if (Blob && ((window || global).URL || (window || global)["webkitURL"])) {
            console.info("The file is building now");
            var contenido_1 = "";
            this.getLogAsync(function (err, logs) {
                if (err)
                    return callback(err);
                switch (type.toLowerCase()) {
                    case "txt":
                        contenido_1 = utils_1.Utils.buildTxtContent(logs);
                        break;
                    case "csv":
                        contenido_1 = utils_1.Utils.buildCsvContent(logs);
                        break;
                }
                var blob = utils_1.Utils.getBlob(contenido_1, type);
                var nameFile = _this.getApp() + "_" + Date.now() + "_log." + type.toLowerCase();
                utils_1.Utils.downloadBlob(blob, nameFile);
                _this.resetQuery();
                callback(null, blob);
            });
        }
        else {
            this.resetQuery();
            callback(new Error("Your browser does not support File APIs. Visit http://browsehappy.com for update or your official page browser."));
        }
    };
    return Downloadable;
}());
exports.Downloadable = Downloadable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmxvYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvZG93bmxvYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxpQ0FBZ0M7QUFLaEM7SUFBQTtJQWlFQSxDQUFDO0lBaEVDOzs7O09BSUc7SUFDSCxzQ0FBZSxHQUFmLFVBQWdCLElBQW1CO1FBQW5CLHFCQUFBLEVBQUEsWUFBbUI7UUFDakMsRUFBRSxDQUFBLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0MsT0FBTyxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQ3pDLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztZQUNuQixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixLQUFLLEtBQUs7b0JBQ1IsU0FBUyxHQUFHLGFBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7b0JBQ2pELEtBQUssQ0FBQztnQkFDUixLQUFLLEtBQUs7b0JBQ1IsU0FBUyxHQUFHLGFBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7b0JBQ2pELEtBQUssQ0FBQztZQUNWLENBQUM7WUFDRCxJQUFJLElBQUksR0FBRyxhQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMxQyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQy9FLGFBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFBQSxJQUFJLENBQUMsQ0FBQztZQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsaUhBQWlILENBQUMsQ0FBQztRQUNySSxDQUFDO1FBQ0QsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xCLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCwyQ0FBb0IsR0FBcEIsVUFBcUIsSUFBbUIsRUFBRSxRQUErQztRQUF6RixpQkF5QkM7UUF6Qm9CLHFCQUFBLEVBQUEsWUFBbUI7UUFDdEMsRUFBRSxDQUFBLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZFLE9BQU8sQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUN6QyxJQUFJLFdBQVMsR0FBRyxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFDLEdBQUcsRUFBRSxJQUFJO2dCQUN6QixFQUFFLENBQUEsQ0FBQyxHQUFHLENBQUM7b0JBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFFN0IsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDM0IsS0FBSyxLQUFLO3dCQUNSLFdBQVMsR0FBRyxhQUFLLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUN4QyxLQUFLLENBQUM7b0JBQ1IsS0FBSyxLQUFLO3dCQUNSLFdBQVMsR0FBRyxhQUFLLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUN4QyxLQUFLLENBQUM7Z0JBQ1YsQ0FBQztnQkFDRCxJQUFJLElBQUksR0FBRyxhQUFLLENBQUMsT0FBTyxDQUFDLFdBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDMUMsSUFBSSxRQUFRLEdBQUcsS0FBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDL0UsYUFBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ25DLEtBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDbEIsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN2QixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFBQSxJQUFJLENBQUMsQ0FBQztZQUNMLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNsQixRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsaUhBQWlILENBQUMsQ0FBQyxDQUFDO1FBQ3pJLENBQUM7SUFDSCxDQUFDO0lBTUgsbUJBQUM7QUFBRCxDQUFDLEFBakVELElBaUVDO0FBakVZLG9DQUFZIn0=