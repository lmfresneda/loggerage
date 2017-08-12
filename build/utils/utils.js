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
    Utils.applyMixins = function (derivedCtor, baseCtors) {
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            });
        });
    };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBaUM7QUFDakMseUNBQTJDO0FBSzlCLFFBQUEsaUJBQWlCLEdBQUcseUJBQXlCLENBQUM7QUFFM0Q7O0dBRUc7QUFDSDtJQUFBO0lBK0hBLENBQUM7SUE5SFEsaUJBQVcsR0FBbEIsVUFBbUIsV0FBZ0IsRUFBRSxTQUFnQjtRQUNuRCxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQUEsUUFBUTtZQUN0QixNQUFNLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7Z0JBQ3ZELFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzRCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLG9CQUFjLEdBQXJCLFVBQXNCLElBQXNCLEVBQUUsS0FBVztRQUN2RCxFQUFFLENBQUEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBRWhELElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQUMsR0FBRztZQUNyQixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUM7WUFFZCxFQUFFLENBQUEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO2dCQUNaLEVBQUUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkQsRUFBRSxDQUFBLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUM7Z0JBQ2hCLEVBQUUsR0FBRyxNQUFNLENB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