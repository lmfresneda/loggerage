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
            else if (ok && query.level) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBaUM7QUFDakMseUNBQTJDO0FBSzlCLFFBQUEsaUJBQWlCLEdBQUcseUJBQXlCLENBQUM7QUFFM0Q7O0dBRUc7QUFDSDtJQUFBO0lBdUhBLENBQUM7SUF0SFEsb0JBQWMsR0FBckIsVUFBc0IsSUFBc0IsRUFBRSxLQUFXO1FBQ3ZELEVBQUUsQ0FBQSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFFaEQsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBQyxHQUFHO1lBQ3JCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQztZQUVkLEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7Z0JBQ1osRUFBRSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2RCxFQUFFLENBQUEsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQztnQkFDaEIsRUFBRSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0RCxFQUFFLENBQUEsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQztnQkFBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsS0FBSyxLQUFLLENBQUMsR0FBRyxDQUFDO1lBQy9DLEVBQUUsQ0FBQSxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDO2dCQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsT0FBTyxLQUFLLEtBQUssQ0FBQyxPQUFPLENBQUM7WUFDM0QsRUFBRSxDQUFBLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNyRCxFQUFFLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQy9DLENBQUM7WUFBQSxJQUFJLENBQUMsRUFBRSxDQUFBLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQSxDQUFDO2dCQUMxQixFQUFFLEdBQUcsR0FBRyxDQUFDLFlBQVksS0FBSyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ3hDLENBQUM7WUFFRCxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNEOzs7Ozs7T0FNRztJQUNJLGlCQUFXLEdBQWxCLFVBQW1CLElBQXFDLEVBQUUsZ0JBQXdCO1FBQ2hGLEVBQUUsQ0FBQSxDQUFDLElBQUksWUFBWSxJQUFJLENBQUMsQ0FBQSxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDeEIsQ0FBQztRQUFBLElBQUksQ0FBQyxFQUFFLENBQUEsQ0FBQyxPQUFPLElBQUksSUFBSSxPQUFPLE1BQU0sRUFBRSxDQUFDLENBQUEsQ0FBQztZQUN2QyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBWSxDQUFDO1FBQ2xDLENBQUM7UUFBQSxJQUFJLENBQUMsRUFBRSxDQUFBLENBQUMsT0FBTyxJQUFJLElBQUksUUFBUSxDQUFDLENBQUEsQ0FBQztZQUNoQyxFQUFFLENBQUEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBLENBQUM7Z0JBQ25CLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUMsT0FBTyxFQUFZLENBQUM7WUFDNUQsQ0FBQztZQUFBLElBQUksQ0FBQSxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLHlCQUFpQixDQUFDLENBQUMsT0FBTyxFQUFZLENBQUM7WUFDN0QsQ0FBQztRQUNILENBQUM7UUFDRCxNQUFNLENBQUMsSUFBYyxDQUFDO0lBQ3hCLENBQUM7SUFDRDs7OztPQUlHO0lBQ0kscUJBQWUsR0FBdEIsVUFBdUIsR0FBUztRQUM5QixJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDbkIsRUFBRSxDQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO1lBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNqQyxTQUFTLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ2xELEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHO1lBQ2QsU0FBUyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFSLENBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDdEUsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFDRDs7OztPQUlHO0lBQ0kscUJBQWUsR0FBdEIsVUFBdUIsR0FBUztRQUM5QixJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDbkIsRUFBRSxDQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO1lBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNqQyxTQUFTLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25ELEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHO1lBQ2QsU0FBUyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFSLENBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDdkUsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFDRDs7Ozs7T0FLRztJQUNJLGFBQU8sR0FBZCxVQUFlLE9BQWMsRUFBRSxJQUFtQjtRQUFuQixxQkFBQSxFQUFBLFlBQW1CO1FBQ2hELElBQUksSUFBUyxDQUFDO1FBQ2QsSUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFBLENBQUM7WUFDMUIsS0FBSyxLQUFLO2dCQUFFLElBQUksR0FBRyxVQUFVLENBQUM7Z0JBQzFCLEtBQUssQ0FBQztRQUNaLENBQUM7UUFDRCxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUNuRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNEOzs7O09BSUc7SUFDSSxrQkFBWSxHQUFuQixVQUFvQixJQUFTLEVBQUUsUUFBZTtRQUM1Qyw2RkFBNkY7UUFDN0YsSUFBSSxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztRQUM5QixJQUFJLElBQUksQ0FBQztRQUNULE1BQU0sQ0FBQyxNQUFNLEdBQUcsVUFBVSxLQUFLO1lBQzdCLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNuQyxJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztZQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztZQUN6QixJQUFJLFNBQVMsQ0FBQztZQUNkLElBQUksQ0FBQztnQkFDSCxTQUFTLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFO29CQUNsQyxNQUFNLEVBQUUsTUFBTTtvQkFDZCxTQUFTLEVBQUUsSUFBSTtvQkFDZixZQUFZLEVBQUUsSUFBSTtpQkFDbkIsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsU0FBUyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQy9DLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzQyxDQUFDO1lBQ0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM5QixDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqRSxDQUFDLENBQUM7UUFDRixNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFDSCxZQUFDO0FBQUQsQ0FBQyxBQXZIRCxJQXVIQztBQXZIWSxzQkFBSyJ9