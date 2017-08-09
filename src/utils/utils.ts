/**
 * Class of utilities
 */
export class Utils {
  /**
   * Build content for csv file
   * @param ar {Array}
   * @returns {string}
   */
  static buildCsvContent(arr:Array<any>):string {
    let contenido = '';
    if(!arr.length) return contenido;
    contenido += Object.keys(arr[0]).join(';') + '\n';
    arr.forEach((obj) => {
      contenido += Object.keys(obj).map(key => obj[key]).join(';') + '\n';
    });
    return contenido;
  }
  /**
   * Build content for txt file
   * @param ar {Array}
   * @returns {string}
   */
  static buildTxtContent(arr:Array<any>):string {
    let contenido = '';
    if(!arr.length) return contenido;
    contenido += Object.keys(arr[0]).join('\t') + '\n';
    arr.forEach((obj) => {
      contenido += Object.keys(obj).map(key => obj[key]).join('\t') + '\n';
    });
    return contenido;
  }
  /**
   * Make a blob with content
   * @param content   Content of blob
   * @param type      File type (csv || txt)
   * @returns {Blob}
   */
  static getBlob(content:string, type:string = "txt"):Blob {
    let blob:Blob;
    let mime = 'text/plain';
    switch (type.toLowerCase()){
      case "csv": mime = 'text/csv';
          break;
    }
    blob = new Blob(["\ufeff", content], {type: mime});
    return blob;
  }
  /**
   * Fire the download file
   * @param blob
   * @param nameFile
   */
  static downloadBlob(blob:Blob, nameFile:string):void {
    //[http://lmfresneda.esy.es/javascript/crear-archivo-csv-con-array-de-objecto-en-javascript/]
    let reader = new FileReader();
    let save;
    reader.onload = function (event) {
      save = document.createElement('a');
      save.href = event.target["result"];
      save.target = '_blank';
      save.download = nameFile;
      let clicEvent;
      try {
        clicEvent = new MouseEvent('click', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        });
      } catch (e) {
        clicEvent = document.createEvent("MouseEvent");
        clicEvent.initEvent('click', true, true);
      }
      save.dispatchEvent(clicEvent);
      (window.URL || window["webkitURL"]).revokeObjectURL(save.href);
    };
    reader.readAsDataURL(blob);
  }
}
