//Startup Scope
var startup = {};

/**
 * Indicates if the startup page is currently testing
 */
startup.testing = false;

//Boolean value to indicate success/failure of hardware tests
startup.scannerTest = false;
startup.swiperTest = false;
startup.scaleTest = {};
startup.scaleTest.itemAdded = false;
startup.scaleTest.itemRemoved = false;
startup.scaleTest.weightRunning = false;
startup.scaleTest.stableWeight = false;

/**
 * Begins hardware testing for startup page.
 * @returns {undefined}
 */
startup.startTesting = function() {
    startup.testing = true;
    startup.startScannerTest();
    startup.startSwiperTest();
};
/**
 * Stops hardware testing.
 * @returns {undefined}
 */
startup.stopTesting = function() {
    startup.testing = false;

    scanner.scanning = false;
    scanner.removeFocus();
    swiper.scanning = false;
    swiper.removeFocus();
    startup.scaleTest.weightRunning = false;
};

/**
 * Start barcode scanning test.
 * @returns {undefined}
 */
startup.startScannerTest = function() {
    //Stop if no longer testing or if the test was a success
    if (!startup.testing || startup.scannerTest) {
        return;
    }
    var focus = $('#page-startup');
    scanner.scanning = true;
    scanner.setFocus(focus);
    focus.on(scanner.EVENT, function(e, value) {
        //Stop if no longer testing or if the test was a success
        if (!startup.testing || startup.scannerTest) {
            return;
        }
        if (typeof value === 'string' && value.length > 0) {
            $('#page-startup .barcode .status').removeClass('fail').addClass('success');
            scanner.removeFocus();
            scanner.scanning = false;
            startup.scannerTest = true;
        }
        else {
            $('#page-startup .barcode .status').removeClass('success').addClass('fail');
        }
    });
};

/**
 * Start card reader test.
 * @returns {undefined}
 */
startup.startSwiperTest = function() {
    //Stop if no longer testing or if the test was a success
    if (!startup.testing || startup.swiperTest) {
        return;
    }
    var focus = $('#page-startup');    
    swiper.scanning = true;
    swiper.setFocus(focus);
    focus.on(swiper.EVENT, function(e, card) {
        if (!startup.testing || startup.swiperTest) {
            return;
        }
        if (card && card.isValid && card.isValid()) {
            $('#page-startup .swiper .status').removeClass('fail').addClass('success');
            swiper.removeFocus();
            swiper.scanning = false;
            startup.swiperTest = true;
        }
        else {
            $('#page-startup .swiper .status').removeClass('success').addClass('fail');
        }
    });
};
