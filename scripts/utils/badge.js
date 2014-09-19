(function(window, JSON) {
    var badge = {};
    window.badge = badge;

    badge.getBadge = function (callback, visitor) {
        settings.log("badge.getBadge(" + callback + ", " + visitor + ") enter");
        var params = {
            row: visitor.id,
            picture: visitor.picture,
            SPREADSHEET_ID: settings.SPREADSHEET_ID

        };
        var url = settings.prepareURL(params, settings.BADGES_MACRO_URL);

        $.ajax({
            type: "GET",
            url: url,
        }).done(callback);
        settings.log("badge.getBadge() exit");
    };

})(window, JSON);
