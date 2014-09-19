//Data Scope
var data = {};
window.data = data;

/**
 * Array of all Visitor objects
 */
data.visitorsArray = [];

/**
 * Loads visitor data from Google Drive spreadsheet and initializes 
 * visitor maps.
 * @returns {undefined}
 */
data.initialize = function() {
    settings.log("data.initialize() enter");
    spreadsheet.getAllRows(function(rows) {
        settings.log("Rows returned: " + rows.length);
        if (rows.length > 1) {
            //The first row contains the property key names for Visitor objects
            var properties = rows[0];

            for (var i = 1; i < rows.length; i++) {
                var p = new Visitor();
                p.id = i;
                for (var j = 0; j < properties.length; j++) {
                    p[properties[j]] = rows[i][j];
                }
                if (p[properties[4]] !== true) { // we're not interested in checked in people anymore!
                    p[properties[4]] = false;
                    data.visitorsArray.push(p);
                    settings.log("id: " + i + " " + p);
                    settings.log(p);
                }
            }
        }
    }, settings.SPREADSHEET_ID);
    settings.log("data.initialize() exit");
};
