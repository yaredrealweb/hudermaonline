import { google } from "googleapis";

export function getCalendarClient(account: {
  accessToken: string;
  refreshToken: string;
}) {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  auth.setCredentials({
    access_token: account.accessToken,
    refresh_token: account.refreshToken,
  });

  return google.calendar({ version: "v3", auth });
}
