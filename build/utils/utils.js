"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class of utilities
 */
var Utils = (function () {
    function Utils() {
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7R0FFRztBQUNIO0lBQUE7SUEyRUEsQ0FBQztJQTFFQzs7OztPQUlHO0lBQ0kscUJBQWUsR0FBdEIsVUFBdUIsR0FBYztRQUNuQyxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDbkIsRUFBRSxDQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO1lBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNqQyxTQUFTLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ2xELEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHO1lBQ2QsU0FBUyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFSLENBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDdEUsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFDRDs7OztPQUlHO0lBQ0kscUJBQWUsR0FBdEIsVUFBdUIsR0FBYztRQUNuQyxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDbkIsRUFBRSxDQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO1lBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNqQyxTQUFTLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25ELEdBQUcsQ0FBQyxPQUFP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