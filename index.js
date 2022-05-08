const express = require("express");
const {google} = require("googleapis");
const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: false }));
const _ = require('lodash');
const fs = require('fs');


const credentials = JSON.parse(fs.readFileSync('google-client-secret.json', 'utf-8'));
  
  const {
    client_secret: clientSecret,
    client_id: clientId,
    redirect_uris: redirectUris,
  } = credentials.web;
  
  const oAuth2Client = new google.auth.OAuth2(
    clientId, clientSecret, redirectUris[0],
  );
  
  const token = fs.readFileSync('google-oauth-token.json', 'utf-8');
  oAuth2Client.setCredentials(JSON.parse(token));
  const spreadsheetId = "1_-EG6vTpD2eY2NtfRqxbZao0AKxuDs0K3Ahq_-8ej6g";
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

// LOGIN
app.get("/login", async (req, res) => {

    // Create client instance
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({
        version: "v4",
        auth: oAuth2Client
    });

    res.send(googleSheets.context._options.auth.credentials.access_token);
});

//READ
app.get("/spreadsheet/:id", async (req, res) => {
    const getSpecific = req.params.id;
    if(getSpecific !== spreadsheetId){
        res.send("Wrong spreadsheet ID")
    }
    // Create client instance
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({
        version: "v4",
        auth: oAuth2Client
    });

    const getRows = await googleSheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Sheet1"
    });

    res.send(getRows.data.values);
});




// APPEND
 app.post("/spreadsheet/append", async(req,res)=>{
    const {Name,Gender,Major} = req.body;
    
    // Create client instance
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({
        version: "v4",
        auth: oAuth2Client
    });

    await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range:"Sheet1",
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [[Name,Gender,Major]],
        },
      });
      const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range:"Sheet1",
    });
    res.send(getRows.data);

 });

// UPDATE
app.put("/spreadsheet/update", async(req,res)=>{
    const {Range,Name,Gender,Major} = req.body;
    
    // Create client instance
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({
        version: "v4",
        auth: oAuth2Client
    });

    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range:[[Range]],
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [[Name,Gender,Major]],
        },
      });
      const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range:"Sheet1",
    });
    res.send(getRows.data);

 });

app.listen(1337, (req, res) => console.log("Running on 1337"));