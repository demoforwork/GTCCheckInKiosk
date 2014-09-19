(function(window, JSON) {
    //Spreadsheet Scope
    var spreadsheet = {};
    window.spreadsheet = spreadsheet;

    /**
     * Retrieves all rows in the provided spreadsheet and returns them in the 
     * provided callback.
     * @param {function(Array,string,number)} callback callback function to 
     *      retrieve row information. The rows Array, message, and status are
     *      returned as the callback parameters
     * @param {string} spreadsheetId the spreadsheet ID
     * @returns {undefined}
     */
    spreadsheet.getAllRows = function(callback, spreadsheetId) {
        settings.log("spreadsheet.getAllRows(" + callback + ", " + spreadsheetId + ") enter");
        var params = {
            'spreadsheetId': spreadsheetId,
            'action': 'get'
        };

        var url = settings.prepareURL(params, settings.SPREADSHEET_MACRO_URL);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                //Always callback an array, message, and status, even if 
                //the web app returned an error
                var rows = [];
                var message = xhr.statusText;
                var status = xhr.status;
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    message = response.message;
                    status = xhr.status;
                    if (response.status === 200) {
                        settings.log(response.data);
                        rows = response.data;
                    }
                }
                if (typeof callback === 'function') {
                    callback(rows, message, status);
                }
            }
        };
        xhr.open('GET', url, true);
        xhr.send();
        settings.log("spreadsheet.getAllRows() exit");
    };

    /**
     * Adds a row to the provided spreadsheet, and calls the provided 
     * callback function upon completion.
     * @param {Array} row Array of row data to append
     * @param {function(string,number)} callback callback function that is 
     *      called with a message and status number indicating the result of 
     *      the appended row
     * @param {string} spreadsheetId the spreadsheet ID
     * @returns {undefined}
     */
    spreadsheet.appendRow = function(row, callback, spreadsheetId) {
        settings.log("spreadsheet.appendRow(" + row + ", " + callback + ", " + spreadsheetId + ") enter");
        var params = {
            'spreadsheetId': spreadsheetId,
            'action': 'post',
            'row': JSON.stringify(row)
        };
        var url = settings.prepareURL(params, settings.SPREADSHEET_MACRO_URL);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                var message = xhr.statusText;
                var status = xhr.status;
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    message = response.message;
                    status = response.status;
                }
                if (typeof callback === 'function') {
                    callback(message, status);
                }
            }
        };
        xhr.open('GET', url, true);
        xhr.send();
        settings.log("spreadsheet.appendRow() exit");
    };

    /**
     * Updates the information provided in the spreadsheet in a K row and constant column (set in spreadsheet.gs)
     * with the provided value.
     * @param {Integer} row Row number
     * @param {function(string,number)} callback callback function that is 
     *      called with a message and status number indicating the result of 
     *      the appended row
     * @param {string} spreadsheetId the spreadsheet ID
     * @returns {undefined}
     */
    spreadsheet.update = function(row, callback, spreadsheetId) {
        settings.log("spreadsheet.update(" + row + ", " + callback + ", " + spreadsheetId + ") enter");
        if (typeof callback === 'string') {
            spreadsheetId = callback;
        }
        var params = {
            'spreadsheetId': spreadsheetId,
            'action': 'update',
            'row': row
        };
        var url = settings.prepareURL(params, settings.SPREADSHEET_MACRO_URL);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                var message = xhr.statusText;
                var status = xhr.status;
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    message = response.message;
                    status = response.status;
                }
                if (typeof callback === 'function') {
                    callback(message, status);
                }
            }
        };
        xhr.open('GET', url, true);
        xhr.send(); 
        settings.log("spreadsheet.update() exit");
    };
})(window, JSON);
