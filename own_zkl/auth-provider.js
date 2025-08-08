// auth-provider.js
export function initGoogleAuth() {
  const client = google.accounts.oauth2.initTokenClient({
    client_id: '702305844559-28s97uhu0htdbocr5h0hoo8qijr9u0b7.apps.googleusercontent.com',
    scope: 'openid profile email',
    callback: (tokenResponse) => {
      console.log('JWT:', tokenResponse.access_token); // Verify the JWT is received
      return tokenResponse.access_token;
    },
  });

  // Bind the OAuth client to the button
  document.getElementById('login-btn').addEventListener('click', () => {
    client.requestAccessToken(); // Triggers the Google OAuth popup
  });
}