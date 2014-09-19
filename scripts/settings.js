var settings = {};

/**
 * Google Drive spreadsheet ID where visitor data is located
 */
// settings.SPREADSHEET_ID = '1ozLLsjg7t5aEPduPSROLTp7HT_C5a5aC6IDqCxMHEQc';
settings.SPREADSHEET_ID = '1u4UIHBOFMqIFEuFBwBlsQSQpM1Y4K4DRkowpKr_tjEQ';

/**
 * The web app URL that spreadsheet.gs is deployed to
 */
settings.SPREADSHEET_MACRO_URL  = 'https://script.google.com/macros/s/AKfycbyi97xNqhiDzeNQWblQBEhqY7VzUZIMAl9Z8-oSddm8pQeNDhg/exec'; // working

/**
 * The web app URL that images.gs is deployed to
 */
settings.IMAGES_MACRO_URL = 'https://script.google.com/macros/s/AKfycbx4yoeALCOViF7JZk5aDCwEahocAUqOai9Dn_MxHtzg6jup1Lqw/exec';

/**
 * The web app URL that badge.gs is deployed to
 */
settings.BADGES_MACRO_URL = 'https://script.google.com/macros/s/AKfycbw7Lh2ZoMNRMZ7C8i26WUPv-bCPkeA-hRz_ZdsSUCk5DWLNt5c/exec';

/**
 * prepares URL for get & post requests
 * @param {Map (String->String)} params parameters that will be appended to the URL
 * @param {String} macro URL for the call endpoint
 * @returns {String} prepared URL
 */
settings.prepareURL = function(params, macro) {
    var url = [];
    url.push(macro);
    url.push('?');
    if (params) {
        for (var key in params) {
            url.push(key);
            url.push('=');
            url.push(params[key]);
            url.push('&');
        }
    }
    url.pop();
    console.log(url.join(''));
    return url.join('');
};


settings.debug = true;

settings.log = function (string) {
    if (settings.debug) console.log(string);
}

