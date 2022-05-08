const fs = require('fs');
  const { google } = require('googleapis');
  
  
  const code = '4/0AX4XfWgQ3_3c6gzcGeQnZNCgafx0GUu3U8snqhT0rcQ10XXKGz53ow7kWuIzkTrCyNAz0Q';
  
  const credentials = JSON.parse(fs.readFileSync('google-client-secret.json', 'utf-8'));
  
  const {
    client_secret: clientSecret,
    client_id: clientId,
    redirect_uris: redirectUris,
  } = credentials.web;
  
  const oAuth2Client = new google.auth.OAuth2(
      clientId, clientSecret, redirectUris[0],
  );
  
  const getToken = async () => {
      const { tokens } = await oAuth2Client.getToken(code);
      console.info(tokens);
      fs.writeFileSync('google-oauth-token.json', JSON.stringify(tokens));
  };
  
  getToken();