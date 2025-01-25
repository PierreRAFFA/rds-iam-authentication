import { Signer } from "@aws-sdk/rds-signer";
import config from './config.js';

const intervalSeconds = 15;

var token = null;

const signer = new Signer({
  /**
   * Required. The hostname of the database to connect to.
   */
  hostname: config.RDS_REMOTE_HOST,
  /**
   * Required. The port number the database is listening on.
   */
  port: config.RDS_REMOTE_PORT,
  /**
   * Required. The username to login as.
   */
  username: config.RDS_USER,
  /**
   * Optional. The region the database is located in. Uses the region inferred from the runtime if omitted.
   */
  region: "us-east-2",
});

////////////////////////
// Get the auth token //
////////////////////////
async function getAuthToken() {
  console.log('Token being issued...');
  token = await signer.getAuthToken();
  console.log(token)
  console.log('New token issued');
  return token;
}

async function getToken() {
  if (token == null) {
    return await getAuthToken();
  } else {
    return token;
  }
}

////////////////////////
// Refresh the token //
////////////////////////
refreshToken();
function refreshToken() {
  setInterval(async () => {
    try {
      token = await getAuthToken();
      // You can store the token or use it as needed
    } catch (error) {
      console.error('Error issueing token:', error);
    }
  }, intervalSeconds * 1000);
}

export { getToken };