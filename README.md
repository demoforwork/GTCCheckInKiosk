Check-in Kiosk Application for GTC 2014

1. Installation

First, you need to deploy all .gs scripts from scripts/utils/ on a Google Drive.

REMEMBER: You need to have the altostrat.com account or other just to make sure you can allow ANYONE to access the script.

Just click Publish -> Deploy as a web app -> Execute the app as me && Anyone, even anonymous has access to the app.

Then, in scripts/settings.js change the MACRO_URLs (shown after publishing the script). Images.gs as IMAGES_MACRO_URL, spreadsheet.gs as SPREADSHEET_MACRO_URL.

The SPREADSHEET_ID from the settings.js is an id of the spreadsheet with all the data required by the app. 

The structure of the spreadsheet should look as follows: 
Name | Email | Location | Company | Checked (empty at the beginning).

