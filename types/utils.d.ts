/**
 * Class of utilities
 */
export declare class Utils {
    /**
     * Build content for csv file
     * @param ar {Array}
     * @returns {string}
     */
    static buildCsvContent(arr: Array<any>): string;
    /**
     * Build content for txt file
     * @param ar {Array}
     * @returns {string}
     */
    static buildTxtContent(arr: Array<any>): string;
    /**
     * Make a blob with content
     * @param content   Content of blob
     * @param type      File type (csv || txt)
     * @returns {Blob}
     */
    static getBlob(content: string, type?: string): Blob;
    /**
     * Fire the download file
     * @param blob
     * @param nameFile
     */
    static downloadBlob(blob: Blob, nameFile: string): void;
}
