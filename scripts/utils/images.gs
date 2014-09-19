function doGet(event) {
    var response = {};
    response.message = '';
    response.status = 200;
    response.data = {};
    var blob = event.parameter.blob;
    uploadFile(blob);
    try {

        response.message = 'get';
        response.status = 200;
        response.data = {};
        return ContentService.createTextOutput(JSON.stringify(response));    
    }
    catch (e) {
        response.message = 'An unexpected error occurred: ' + e.message;
        response.status = 500;
        return ContentService.createTextOutput(JSON.stringify(response));
    }
}

function doPost(event) {
    var response = {};
    response.message = '';
    response.status = 200;
    response.data = {};

    try {
        var blob = Utilities.newBlob(Utilities.base64Decode(event.parameter.blob), "image/jpeg", event.parameter.name);
        var id = uploadFile(blob);
        response.message = 'Success';
        response.status = 200;
        response.data = {'id': id};
        return ContentService.createTextOutput(JSON.stringify(response));
    }
    catch (e) {
        response.message = 'An unexpected error occurred: ' + e.message;
        response.status = 500;
        return ContentService.createTextOutput(JSON.stringify(response));
    }
}

function uploadFile(blob) {
    var file;
    file = DriveApp.getFoldersByName("pictures").next().createFile(blob);
    Logger.log("Created new image in Folder named 'pictures': pictures/" + file.getName());
    return file.getId();
}
