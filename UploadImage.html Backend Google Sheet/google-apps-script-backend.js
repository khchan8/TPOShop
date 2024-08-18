// Set these variables according to your Google Sheet and folder setup
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
const SHEET_NAME = 'Receipts';
const FOLDER_ID = 'YOUR_FOLDER_ID';
const OPERATOR_EMAIL = 'operator@example.com'; // Replace with actual operator email

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
    const timestamp = new Date();
    sheet.appendRow([timestamp, orderNumber, email, comments, imageUrl]);

    // Send emails
    sendOperatorEmail(orderNumber, email, comments, imageUrl, timestamp);
    sendCustomerEmail(email, orderNumber, timestamp);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Receipt uploaded successfully. Confirmation emails have been sent.'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendOperatorEmail(orderNumber, customerEmail, comments, imageUrl, timestamp) {
  const subject = `New Receipt Upload - Order #${orderNumber}`;
  const body = `
    A new receipt has been uploaded:
    
    Order Number: ${orderNumber}
    Customer Email: ${customerEmail}
    Timestamp: ${timestamp.toLocaleString()}
    Comments: ${comments}
    
    Image URL: ${imageUrl}
    
    Please review the uploaded receipt at your earliest convenience.
  `;
  
  MailApp.sendEmail(OPERATOR_EMAIL, subject, body);
}

function sendCustomerEmail(customerEmail, orderNumber, timestamp) {
  const subject = `Receipt Upload Confirmation - Order #${orderNumber}`;
  const body = `
    Dear Customer,
    
    We have received your receipt upload for Order #${orderNumber} on ${timestamp.toLocaleString()}.
    
    Thank you for submitting your receipt. Our team will review it shortly.
    
    If you have any questions, please don't hesitate to contact our customer support.
    
    Best regards,
    TPO Wellness Store Team
  `;
  
  MailApp.sendEmail(customerEmail, subject, body);
}

function doGet() {
  return HtmlService.createHtmlOutput('<h1>This is a web app for handling receipt uploads.</h1>');
}
