"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var includes = require("array-includes");
exports.QUERY_FORMAT_DATE = 'YYYY-MM-DD HH:mm:ss.SSS';
/**
 * Class of utilities
 */
var Utils = (function () {
    function Utils() {
    }
    Utils.getLogFiltered = function (logs, query) {
        if (!logs || !query || !logs.length)
            return logs;
        logs = logs.filter(function (log) {
            var ok = true;
            if (query.from)
                ok = moment(log.timestamp).isSameOrAfter(query.from);
            if (ok && query.to)
                ok = moment(log.timestamp).isSameOrBefore(query.to);
            if (ok && query.app)
                ok = log.app === query.app;
            if (ok && query.version)
                ok = log.version === query.version;
            if (ok && query.level && query.level instanceof Array) {
                ok = includes(query.level, log.level_number);
            }
            else if (ok && query.level != undefined) {
                ok = log.level_number === query.level;
            }
            return ok;
        });
        return logs;
    };
    /**
     * Return unix timestamp (milliseconds) from any type of date
     * @param  {moment.Moment|Date|string|number} date
     * @param  {string}                           dateStringFormat Optional. If we want to indicate our format according to the formats of momentjs.
     *                                                             By default 'YYYY-MM-DD HH:mm:ss.SSS'
     * @return {number}                                            Unix timestamp (milliseconds)
     */
    Utils.getUnixDate = function (date, dateStringFormat) {
        if (date instanceof Date) {
            return date.getTime();
        }
        else if (typeof date == typeof moment()) {
            return date.valueOf();
        }
        else if (typeof date == 'string') {
            if (dateStringFormat) {
                return moment(date, dateStringFormat).valueOf();
            }
            else {
                return moment(date, exports.QUERY_FORMAT_DATE).valueOf();
            }
        }
        return date;
    };
    /**
     * Build content for csv file
     * @param ar {Array}
     * @returns {string}
     */
    Utils.buildCsvContent = function (arr) {
        var contenido = '';
        if (!arr.length)
            return contenido;
        contenido += Object.keys(arr[0]).join(';') + '\n';
        arr.forEach(function (obj) {
            contenido += Object.keys(obj).map(function (key) { return obj[key]; }).join(';') + '\n';
        });
        return contenido;
    };
    /**
     * Build content for txt file
     * @param ar {Array}
     * @returns {string}
     */
    Utils.buildTxtContent = function (arr) {
        var contenido = '';
        if (!arr.length)
            return contenido;
        contenido += Object.keys(arr[0]).join('\t') + '\n';
        arr.forEach(function (obj) {
            contenido += Object.keys(obj).map(function (key) { return obj[key]; }).join('\t') + '\n';
        });
        return contenido;
    };
    /**
     * Make a blob with content
     * @param content   Content of blob
     * @param type      File type (csv || txt)
     * @returns {Blob}
     */
    Utils.getBlob = function (content, type) {
        if (type === void 0) { type = "txt"; }
        var blob;
        var mime = 'text/plain';
        switch (type.toLowerCase()) {
            case "csv":
                mime = 'text/csv';
                break;
        }
        blob = new Blob(["\ufeff", content], { type: mime });
        return blob;
    };
    /**
     * Fire the download file
     * @param blob
     * @param nameFile
     */
    Utils.downloadBlob = function (blob, nameFile) {
        //[http://lmfresneda.esy.es/javascript/crear-archivo-csv-con-array-de-objecto-en-javascript/]
        var reader = new FileReader();
        var save;
        reader.onload = function (event) {
            save = document.createElement('a');
            save.href = event.target["result"];
            save.target = '_blank';
            save.download = nameFile;
            var clicEvent;
            try {
                clicEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
            }
            catch (e) {
                clicEvent = document.createEvent("MouseEvent");
                clicEvent.initEvent('click', true, true);
            }
            save.dispatchEvent(clicEvent);
            (window.URL || window["webkitURL"]).revokeObjectURL(save.href);
        };
        reader.readAsDataURL(blob);
    };
    return Utils;
}());
exports.Utils = Utils;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBaUM7QUFDakMseUNBQTJDO0FBSzlCLFFBQUEsaUJBQWlCLEdBQUcseUJBQXlCLENBQUM7QUFFM0Q7O0dBRUc7QUFDSDtJQUFBO0lBdUhBLENBQUM7SUF0SFEsb0JBQWMsR0FBckIsVUFBc0IsSUFBc0IsRUFBRSxLQUFXO1FBQ3ZELEVBQUUsQ0FBQSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFFaEQsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBQyxHQUFHO1lBQ3JCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQztZQUVkLEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7Z0JBQ1osRUFBRSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2RCxFQUFFLENBQUEsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQztnQkFDaEIsRUFBRSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0RCxFQUFFLENBQUEsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQztnQkFBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsS0FBSyxLQUFLLENBQUMsR0FBRyxDQUFDO1lBQy9DLEVBQUUsQ0FBQSxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDO2dCQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsT0FBTyxLQUFLLEtBQUssQ0FBQyxPQUFPLENBQUM7WUFDM0QsRUFBRSxDQUFBLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNyRCxFQUFFLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQy9DLENBQUM7WUFBQSxJQUFJLENBQUMsRUFBRSxDQUFBLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxLQUFLLElBQUksU0FBUyxDQUFDLENBQUEsQ0FBQztnQkFDdkMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxZQUFZLEtBQUssS0FBSyxDQUFDLEtBQUssQ0FBQztZQUN4QyxDQUFDO1lBRUQsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRDs7Ozs7O09BTUc7SUFDSSxpQkFBVyxHQUFsQixVQUFtQixJQUFxQyxFQUFFLGdCQUF3QjtRQUNoRixFQUFFLENBQUEsQ0FBQyxJQUFJLFlBQVksSUFBSSxDQUFDLENBQUEsQ0FBQztZQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3hCLENBQUM7UUFBQSxJQUFJLENBQUMsRUFBRSxDQUFBLENBQUMsT0FBTyxJQUFJLElBQUksT0FBTyxNQUFNLEVBQUUsQ0FBQyxDQUFBLENBQUM7WUFDdkMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQVksQ0FBQztRQUNsQyxDQUFDO1FBQUEsSUFBSSxDQUFDLEVBQUUsQ0FBQSxDQUFDLE9BQU8sSUFBSSxJQUFJLFFBQVEsQ0FBQyxDQUFBLENBQUM7WUFDaEMsRUFBRSxDQUFBLENBQUMsZ0JBQWdCLENBQUMsQ0FBQSxDQUFDO2dCQUNuQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sRUFBWSxDQUFDO1lBQzVELENBQUM7WUFBQSxJQUFJLENBQUEsQ0FBQztnQkFDSixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSx5QkFBaUIsQ0FBQyxDQUFDLE9BQU8sRUFBWSxDQUFDO1lBQzdELENBQUM7UUFDSCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQWMsQ0FBQztJQUN4QixDQUFDO0lBQ0Q7Ozs7T0FJRztJQUNJLHFCQUFlLEdBQXRCLFVBQXVCLEdBQVM7UUFDOUIsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ25CLEVBQUUsQ0FBQSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDakMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNsRCxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRztZQUNkLFNBQVMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBUixDQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3RFLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBQ0Q7Ozs7T0FJRztJQUNJLHFCQUFlLEdBQXRCLFVBQXVCLEdBQVM7UUFDOUIsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ25CLEVBQUUsQ0FBQSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDakMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNuRCxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRztZQUNkLFNBQVMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBUixDQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3ZFLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBQ0Q7Ozs7O09BS0c7SUFDSSxhQUFPLEdBQWQsVUFBZSxPQUFjLEVBQUUsSUFBbUI7UUFBbkIscUJBQUEsRUFBQSxZQUFtQjtRQUNoRCxJQUFJLElBQVMsQ0FBQztRQUNkLElBQUksSUFBSSxHQUFHLFlBQVksQ0FBQztRQUN4QixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQSxDQUFDO1lBQzFCLEtBQUssS0FBSztnQkFBRSxJQUFJLEdBQUcsVUFBVSxDQUFDO2dCQUMxQixLQUFLLENBQUM7UUFDWixDQUFDO1FBQ0QsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDbkQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRDs7OztPQUlHO0lBQ0ksa0JBQVksR0FBbkIsVUFBb0IsSUFBUyxFQUFFLFFBQWU7UUFDNUMsNkZBQTZGO1FBQzdGLElBQUksTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7UUFDOUIsSUFBSSxJQUFJLENBQUM7UUFDVCxNQUFNLENBQUMsTUFBTSxHQUFHLFVBQVUsS0FBSztZQUM3QixJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuQyxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7WUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7WUFDekIsSUFBSSxTQUFTLENBQUM7WUFDZCxJQUFJLENBQUM7Z0JBQ0gsU0FBUyxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sRUFBRTtvQkFDbEMsTUFBTSxFQUFFLE1BQU07b0JBQ2QsU0FBUyxFQUFFLElBQUk7b0JBQ2YsWUFBWSxFQUFFLElBQUk7aUJBQ25CLENBQUMsQ0FBQztZQUNMLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNYLFNBQVMsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUMvQyxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDM0MsQ0FBQztZQUNELElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDOUIsQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakUsQ0FBQyxDQUFDO1FBQ0YsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBQ0gsWUFBQztBQUFELENBQUMsQUF2SEQsSUF1SEM7QUF2SFksc0JBQUsifQ==