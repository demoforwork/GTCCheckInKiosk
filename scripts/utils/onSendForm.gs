var numColumns = 3; // how many fields we want to process in the email
var startColumn = 1;
var checkedin_col = 4;



function formSubmitReply(e) {
    var values = e.values;
    callSendDocumentWithQRCode(values);
}

function callSendDocumentWithQRCode(v) {
    var user = {name: v[1], email: v[2]};

    var doc = DocumentApp.create('Conference Itinerary for ' + user.name).addEditor(user.email);
    var body = doc.getBody();

    body.insertParagraph(0, doc.getName())
        .setHeading(DocumentApp.ParagraphHeading.HEADING1);

    // ============================== SUPER IMPORTANT STUFF HERE ====================================== 

    var imageToUpload = "https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=" + user.name + "+" + user.email;
    var imageBlob = UrlFetchApp.fetch(imageToUpload).getBlob();
    body.appendImage(imageBlob);

    // ================================================================================================

    doc.saveAndClose();
    // Email a link to the Doc as well as a PDF copy.
    MailApp.sendEmail({
to: user.email,
subject: doc.getName(),
body: 'Thanks for registering! Here\'s your itinerary: ' + doc.getUrl(),
attachments: doc.getAs(MimeType.PDF),
});
}

