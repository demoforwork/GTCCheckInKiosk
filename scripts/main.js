$(document).ready(function() {
    main.initialize();
});

//Main Scope
var main = {};
/**
 * Used to cancel the lookup page search progress bar interval
 * @type Number
 */
main.intervalId = null;
/**
 * Camera stream used while taking pictures.
 * @type MediaStream
 */
main.stream = null;
main.mytimer = null;

/**
 * Stops the video streaming
 */
main.stopVideo = function () {
    settings.log("main.stopVideo() enter");
    $("#video").remove();
    main.stream.stop();
    settings.log("main.stopVideo() exit");
};

/**
 * Starts searching for a person if the QR code is read properly
 */
qrcode.callback = function (data) {
    settings.log("qrcode.callback(" + data + ") enter");
    var matchterm = data.toLowerCase();
    if (matchterm.indexOf("error") > -1) {
        settings.log("Error: " + data);
    } else {
        settings.log("Alrighty! Start searching!");
        $("#page-lookup #item-search-query").val(data);
        main.lookupStartProgressTrigger();
        main.stopVideo();
        $("#canvas").remove();
        clearInterval(main.mytimer);
    }
    settings.log("qrcode.callback() exit");
};

/**
 * Creates new video and canvas objects
 */
main.createVideo = function(appendTo, sizeX, sizeY) {
    settings.log("main.createVideo(" + appendTo + ") enter");
    var canvasobj = $("<canvas/>").attr("width", sizeX).attr("height", sizeX).attr("id", "canvas");
    canvasobj.hide();
    var videoobj = $("<video/>").attr("width", sizeX).attr("height", sizeY).attr("id", "video").attr("autoplay", "");
    appendTo.append(videoobj).append(canvasobj);
    settings.log(canvasobj);

    main.startVideo();
    settings.log("main.createVideo() exit");
};

/**
 * Captures the picture and saves it on canvas
 */
main.capture = function (canvas, video, context, sizeX, sizeY) {
    settings.log("main.capture(" + canvas + ", " + video + ", " + context +") enter");
    context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, sizeX, sizeY);
    settings.log("main.capture() exit");
};

/**
 * Initialize the app
 * @returns {undefined}
 */
main.initialize = function() {
    settings.log("main.initialize() enter");
    //Load Data
    data.initialize();

    /*
     * Add Listeners
     */
    // Page-Refresh
    $("#page-refresh .content #nextUserButton").click(function ()  {
        settings.log("pagerefresh clicked");
        flipper.openPage("#page-lookup");
    });

    $("#page-refresh #registerButton").click(function () {
        flipper.openPage("#register");
    });
    $("#search-result #no").click(function () {
        flipper.openPage("#register");
    });

    $("#register").on(flipper.Event.BEFORE_OPEN, function () {
        $("#register .form input[name='name']").val("");
        $("#register .form input[name='email']").val("");
        $("#register .form input[name='location']").val("");
        $("#register .form input[name='company']").val("");
        $("#register .picture").empty();
        main.createVideo($("#register .form .picture"), 550, 450);
        main.startVideo();
        $("#register .form").fadeIn();
    });

    $(".cancel_button").click(function () {
        flipper.openPage("#page-refresh");
    });
    $("#register .snap_register_button").click(function () {
        var data_sheet = [];
        var name = $("#register .form input[name='name']").val(),
            email = $("#register .form input[name='email']").val(),
            location = $("#register .form input[name='location']").val(),
            company = $("#register .form input[name='company']").val();
        settings.log(data_sheet);
        var context, canvas = document.getElementById("canvas");
        main.capture(document.getElementById("canvas"), document.getElementById("video"), context, 550, 450);

        context = canvas.getContext("2d");
        context.font = "14pt Arial";
        context.fillStyle = "white";
        context.fillText(name + ', ' + company, 20, 480);
        context.fillText(location, 20, 510);


        var datablob = canvas.toDataURL("image/jpeg");

        main.stopVideo();

        images.pushImg(main.getBadgeCallback, datablob, name);
        $("#register .form").fadeOut();
        $("#canvas").remove();

        setTimeout(function() {
            $('#modules .loading-animation').clone().appendTo('#register .content');
        }, 1000);

        data_sheet.push(name);
        data_sheet.push(email);
        data_sheet.push(location);
        data_sheet.push(company);
        data_sheet.push("TRUE");
        spreadsheet.appendRow(data_sheet, function() {
            spreadsheet.sendEmail2(email, function () { console.log("done"); });
            console.log('tutaj');
        }, settings.SPREADSHEET_ID);
    });

    //Page-Lookup
    $('#page-lookup').on(flipper.Event.BEFORE_OPEN, function() {
        settings.log("pagelookup BEFORE_OPEN");
        $('#page-lookup #item-search-query').val('');
        main.createVideo ($("#page-lookup .content #search"), 350, 300);

        var context;
        main.mytimer = setInterval(function () {
            settings.log("main.mytimer = setInterval enter");
            main.capture(document.getElementById("canvas"), document.getElementById("video"), context, 350, 300);
            qrcode.decode(document.getElementById("canvas").toDataURL("image/jpeg"));
        }, 1000);
    });
    $('#page-lookup').on(flipper.Event.AFTER_CLOSE, function() {
        settings.log("pagelookup AFTER_CLOSE");
        if (main.stream) {
            main.stream.stop();
        }
        if (main.mytimer) {
            clearInterval(main.mytimer);
        }
    });

    $("#search-result #yes").click(main.lookupClicked);

    $(".continue").click(function () {
        main.closeOverlay();
        flipper.openPage("#register");
    });

    flipper.openPage('#page-refresh');
    settings.log("main.initialize() exit");
};

/**
 * Starts the app and resets the current session.
 * @returns {undefined}
 */
main.start = function() {
    flipper.openPage('#page-refresh');
    $("#badge .check-in-badge").fadeIn();
    main.clearSearchResult();
    main.clearBadge();
};


/*******************************************************************************
 * Actions
 ******************************************************************************/
/**
 * Displays an error message overlay.
 * @param {string} message the error message to display
 * @returns {undefined}
 */
main.showError = function() {
    flipper.openOverlay('#overlay-error');
};
/**
 * Searches for a visitor by the given query.
 * <p>
 * If the query is undefined, all visitors will be loaded.
 * @param {string} query the visitor to search for, or undefined to display 
 *      all visitors
 * @returns {undefined}
 */
main.visitorSearch = function(query) {
    settings.log("main.visitorSearch(" + query + ") enter");
    var j = 0;
    var found = false;
    if(typeof query !== 'undefined') {
        setTimeout(function() {
            for (var i = 0; i < data.visitorsArray.length && !found; i++) {
                var visitor = data.visitorsArray[i];

                var searchTerm = query.toLowerCase();
                var matchTerm = visitor.Name.toLowerCase() + ' ' + visitor.Email.toLowerCase();
                settings.log(matchTerm);
                settings.log("visitor: " + visitor.id + " " + visitor.Checked);
                if (matchTerm.indexOf(searchTerm) > -1 && !visitor.Checked) {
                    visitor.getSearchResult();
                    flipper.openPage("#search-result");
                    found = true; // quiting the for (we're only interested in one matching item - we assume there is only one)
                }
            }
            if (!found) {
                settings.log("Nothing found, we need to refresh");
                flipper.openPage("#page-refresh");
                main.showError();
            }
        }, 2000);
    }
    settings.log("main.visitorSearch() exit");
};
main.clearSearchResult = function () {
    $("#search-result .search-result .name").text("");
    $("#search-result .search-result .email").text("");
};

main.clearBadge = function () {
    $("#badge .check-in-badge .name").text("");
    $("#badge .check-in-badge .email").text("");
    $("#badge .check-in-badge .company").text("");
    $("#badge .check-in-badge .location").text("");
};
/**
 * checkIn
 * Checks whether user is already checked in and ticks 'yes' in the spreadsheet
 * if not. Then the picture is taken and the badge is printed.
 * @param {String} visitor visitor's name
 * @param {Integer} id visitor's id
 * @returns {undefined}
 */
main.checkIn = function (visitor, id) {
    settings.log ("main.checkIn(" + visitor + ", " + id + ") enter");
    var found = false;
    for (var i = 0; i < data.visitorsArray.length && !found; i++) {
        settings.log(data.visitorsArray[i].id);
        if (visitor === data.visitorsArray[i].Name && id == data.visitorsArray[i].id) {
            var v = data.visitorsArray[i];
            settings.log(v.Checked + ' ' + v.id);
            if (v.Checked) {
                main.showError();
                return;
            }
            v.getBadge();
            main.createVideo($("#badge .check-in-badge .picture"), 550, 450);

            main.startVideo();

            $("#badge .snap_button").click(function() {
                var canvas = document.getElementById("canvas"),
                context;
                main.capture(canvas, document.getElementById("video"), context, 550, 450);

                context = canvas.getContext("2d");
                context.font = "14pt Arial";
                context.fillStyle = "white";
                context.fillText(v.Name + ', ' + v.Company, 20, 480);
                context.fillText(v.Location, 20, 510);


                var datablob = canvas.toDataURL("image/jpeg");

                main.stopVideo();

                images.pushImg(main.getBadgeCallback, datablob, v);
                spreadsheet.update(v.id+1, 
                                   function () {
                                        spreadsheet.sendEmail(v.id+1, function () { console.log("done");}, settings.SPREADSHEET_ID);
                                   },
                                   settings.SPREADSHEET_ID);
                $("#badge .check-in-badge").fadeOut();
                $("#canvas").remove();
                main.clearBadge();

                setTimeout(function() {
                    $('#modules .loading-animation').clone().appendTo('#badge .content');
                }, 1000);
            });

            v.Checked = true;
            settings.log(data.visitorsArray[i]);
            data.visitorsArray.splice(i, 1);
            found = true;
        }
    }
    settings.log("main.checkIn() exit");
};
/** 
 * callback function to execute after getBadge
 */
main.getBadgeCallback = function (e) {
    settings.log("main.getBadgeCallback(" + e + ") enter");
    flipper.openOverlay('#overlay-success');
    settings.log("main.getBadgeCallback() exit");
    $('#badge .loading-animation').remove();
    $("#register .loading-animation").remove();
    setTimeout(function () {
        main.closeOverlaySuccess();
        main.start();
    }, 2000);
};

/*******************************************************************************
 * Listeners
 ******************************************************************************/
/**
 * Closes the current overlay.
 * <p>
 * This is equivalent to flipper.closeOverlay(), but if flipper.closeOverlay 
 * is added as an event listener, an error will occur since the argument 
 * passed to flipper.closeOverlay will be an Event object instead of 
 * undefined.
 * @returns {undefined}
 */
main.closeOverlay = function() {
    flipper.closeOverlay();
};

main.closeOverlaySuccess = function() {
    main.closeOverlay();
    flipper.openPage("#page-refresh");
};

/**
 * Adds the search result item clicked on to the session's receipt.
 * @returns {undefined}
 */
main.lookupClicked = function() {
    var obj = $(this).parent().parent();
    settings.log("main.lookupClicked() enter");
    var visitor = obj.find(".name").text();
    var visitor_id = obj.find(".name").attr("data-id");
    flipper.openPage('#badge');
    main.checkIn(visitor, visitor_id);
    settings.log("main.lookupClicked() exit");
};
/**
 * Starts a progress bar after scanning the qr code.
 * @returns {undefined}
 */
main.lookupStartProgressTrigger = function () {
    settings.log("main.lookupStartProgressTrigger() enter");
    clearInterval(main.intervalId);
    var i = 0;
    main.intervalId = setInterval(function(){
        main.lookupUpdateProgress(i);
        i++;
    }, 1);
    settings.log("main.lookupStartProgressTrigger() exit");
};
/**
 * Update the lookup progress bar with the given value.
 * <p>
 * Once the progress bar has reached its max value, the user's input will 
 * be passed to main.visitorSearch().
 * @param {number} value the value to set the progress bar to
 * @returns {undefined}
 */
main.lookupUpdateProgress = function(value) {
    settings.log("main.lookupUpdateProgress(" + value + ") enter");
    var progress = $('#page-lookup #search-timer-progress');
    if (value < progress.attr('max')) {
        progress.attr('value', value);
    }
    else {
        clearInterval(main.intervalId);
        progress.attr('value', 0);
        var searchQuery = $('#page-lookup #item-search-query').val();
        main.visitorSearch(searchQuery);
    }
    settings.log("main.lookupUpdateProgress() exit");
};

/**
 * Starts using the camera and sets up the video and canvas tags
 * @returns {undefined}
 */
main.startVideo = function () {
    settings.log("main.startVideo() enter");
    var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    video = document.getElementById("video"),
    videoObj = { "video": true };

    // Put video listeners into place
    // as we only use Chrome, we don't need to support other browsers
    navigator.webkitGetUserMedia(videoObj, function(stream){
        main.stream = stream;
        video.src = window.webkitURL.createObjectURL(stream);
        video.play();
    }, function (e) {
        settings.log("Video error: " + e.code);
    });
    settings.log("main.startVideo() exit");
};
