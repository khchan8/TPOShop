// Set these variables according to your Google Sheet and folder setup
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
const SHEET_NAME = 'Receipts';
const FOLDER_ID = 'YOUR_FOLDER_ID';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const orderNumber = data.orderNumber;
    const email = data.email;
    const comments = data.comments;
    const imageData = data.image;

    // Upload image to Google Drive
    const imageName = `Receipt_${orderNumber}_${new Date().getTime()}.jpg`;
    const imageBlob = Utilities.newBlob(Utilities.base64Decode(imageData), 'image/jpeg', imageName);
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const file = folder.createFile(imageBlob);
    const imageUrl = file.getUrl();

    // Save data to Google Sheets
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    sheet.appendRow([new Date(), orderNumber, email, comments, imageUrl]);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Receipt uploaded successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return HtmlService.createHtmlOutput('<h1>This is a web app for handling receipt uploads.</h1>');
}
