
(function(window, JSON) {
    var images = {};
    window.images = images;

    images.pushImg = function (callback, image, visitor) {
        settings.log("images.pushImg(" + callback + ", " + image + ", " + visitor + ") enter");
        var data = image.replace(/^data:image\/(png|jpeg);base64,/, ""); // base64 data ex) iVBORw0KGgoA...
        // url
        var url = settings.prepareURL(null, settings.IMAGES_MACRO_URL);

        var name;
        if (typeof(visitor)=== "string") name = visitor;
        else name = visitor.Name;

        $.ajax({
            type: "POST",
            url: url,
            data: {
                blob: data,
                name: name
            }
        }).done(callback);
        settings.log("images.pushImg() exit");
    };

})(window, JSON);
