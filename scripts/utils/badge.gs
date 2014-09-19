function doGet(event) {
  var response = {};
  response.message = 'success';
  response.status = 200;
  response.data = {};
  try {
    
    var picture = event.parameter.picture;
    var row = event.parameter.row;
    var id = event.parameter.SPREADSHEET_ID;
    var ss;
    try {
      ss = SpreadsheetApp.openById(id);
    }
    catch (e) {
      response.message = 'Invalid spreadsheet ID';
      response.status = 400;
      return ContentService.createTextOutput(JSON.stringify(response));    
    }
    var sheet = ss.getSheets()[0];
    var data;
    try {
      data = sheet.getDataRange().getValues();
    } catch (e) {
      response.message = 'Invalid data range';
      response.status = 400;
      return ContentService.createTextOutput(JSON.stringify(response));  
    }
    // do something with that data
    var doc = DocumentApp.create('Conference badge for ' + data[row][1]).addEditor(data[row][2]);
    var body = doc.getBody();
    body.insertParagraph(0, doc.getName()).setHeading(DocumentApp.ParagraphHeading.HEADING1);
    var image = DriveApp.getFileById(picture).getBlob();
    body.appendImage(image);
    doc.saveAndClose();
    response.data = { 'id': doc.getId() };
    
    return ContentService.createTextOutput(JSON.stringify(response));    
  }
  catch (e) {
    response.message = 'An unexpected error occurred: ' + e.message + ' log: ' + Logger.getLog();
    response.status = 500;
    return ContentService.createTextOutput(JSON.stringify(response));
  }
}

