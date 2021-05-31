const port = 8080;
const baseURL = `http://localhost:${port}`;
const client_id = '1089273202974-qt0j2dol1bmtq1ul4n2rk7729dp0ivbb.apps.googleusercontent.com'

module.exports = {
  // The secret for the encryption of the jsonwebtoken
  JWTsecret: '<your jwt secret>',
  baseURL: baseURL,
  port: port,
  // The credentials and information for OAuth2
  oauth2Credentials: {
    client_id: client_id,
    project_id: "Youtube-API", // The name of your project
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "<your secret>",
    redirect_uris: [
      `${baseURL}/callback`
    ],
    scopes: [
      'https://www.googleapis.com/auth/youtube.readonly'
    ]
  }
};
