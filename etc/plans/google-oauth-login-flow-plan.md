# Google OAuth Login Flow Plan

## 1. Goal

Implement Google login in a clean and secure way.

The frontend should only start the login flow.  
The backend should handle Google OAuth, keep the Google client secret, create or find the user, and issue the application login session.

Recommended flow:

```text
Frontend -> Backend -> Google -> Backend -> Frontend
```

---

## 2. Configuration Approach

Use a clear configuration structure for Google authentication.

Recommended naming:

```text
Authentication
  Google
    ClientId
    ClientSecret
    CallbackPath
```

This structure is better than a flat name like `OAuthGoogle` because it is easier to extend later if the application supports more login providers such as Facebook, Microsoft, or GitHub.

Do not store real client secrets directly in committed configuration files.

Recommended secret storage:

- Local development: user secrets or local environment variables
- Production: environment variables, secret manager, or cloud key vault

---

## 3. Overall Login Flow

The login flow should work like this:

1. The user clicks the "Login with Google" button on the frontend.
2. The frontend redirects the browser to the backend Google login endpoint.
3. The backend starts the Google OAuth flow.
4. The backend redirects the browser to Google.
5. The user logs in or chooses a Google account.
6. Google redirects the browser back to the backend callback URL.
7. The backend validates the Google response.
8. The backend retrieves the user's Google profile.
9. The backend finds an existing user or creates a new user in the database.
10. The backend creates the application's own login session or token.
11. The backend stores the login result securely, preferably with an HttpOnly cookie.
12. The backend redirects the browser back to the frontend.
13. The frontend calls the backend to load the current logged-in user.
14. The frontend updates the UI and navigates the user into the application.

---

## 4. Frontend Responsibilities

The frontend should not handle the Google client secret.

The frontend is responsible for:

- Showing the "Login with Google" button.
- Redirecting the browser to the backend login endpoint when the user clicks the button.
- Providing a callback page that the backend can redirect to after login succeeds.
- Calling the backend after the redirect to check the current logged-in user.
- Updating the frontend authentication state after the user is confirmed.
- Redirecting the user to the correct page after login.

The frontend should treat Google login as a browser navigation flow, not a normal API request.

After the backend redirects back to the frontend callback page, the frontend should call a "current user" endpoint to confirm that login was successful.

---

## 5. Backend Responsibilities

The backend owns the authentication process.

The backend is responsible for:

- Storing Google OAuth configuration securely.
- Starting the Google OAuth challenge.
- Redirecting the browser to Google.
- Receiving the callback from Google.
- Validating the OAuth response.
- Exchanging the authorization code for Google tokens.
- Reading the user's Google profile.
- Finding or creating the application user.
- Creating the application's own session or access token.
- Setting a secure authentication cookie.
- Redirecting the browser back to the frontend.
- Providing an endpoint for the frontend to get the current logged-in user.

The backend should be the only place that handles the Google client secret.

---

## 6. Callback Design

Google should redirect back to the backend, not directly to the frontend.

Reason:

- The backend needs to validate the OAuth response.
- The backend needs to exchange the authorization code.
- The backend needs access to the client secret.
- The backend needs to create or find the local application user.
- The backend needs to issue the application's own authentication session.

After the backend finishes processing the Google callback, it should redirect the browser to the frontend callback page.

---

## 7. Session and Token Strategy

The recommended approach is to let the backend set an HttpOnly cookie after successful login.

This is safer than sending the access token through the URL.

Avoid redirecting to the frontend with a token in the query string, because the token can leak through:

- Browser history
- Server logs
- Analytics tools
- Referrer headers
- Screenshots
- Copied URLs

Recommended behavior:

1. Backend creates the application session or token.
2. Backend stores it in a secure HttpOnly cookie.
3. Backend redirects the browser to the frontend.
4. Frontend calls the backend to get the current user.

---

## 8. Current User Check

After login, the frontend should not assume that the user is already authenticated only because it reached the callback page.

Instead, the frontend should call a backend endpoint such as:

```text
GET /api/auth/me
```

This endpoint should return the current logged-in user if the session is valid.

If the session is invalid or missing, the backend should return unauthorized, and the frontend should send the user back to the login page.

---

## 9. User Database Handling

When the backend receives the Google profile, it should map the Google account to a local application user.

Recommended logic:

1. Read the Google user ID from the Google profile.
2. Check if a user already exists with that Google provider ID.
3. If the user exists, update login metadata such as last login time.
4. If the user does not exist, create a new local user.
5. Store the provider name as Google.
6. Store the Google provider user ID.
7. Store basic profile information such as email, name, and avatar if needed.

The Google provider user ID should be used as the primary external identity key because it is more stable than email.

---

## 10. CORS and Cookie Considerations

If the frontend and backend run on different domains or ports, the backend must allow cross-origin requests from the frontend.

The frontend must also include credentials when calling authenticated backend APIs.

Cookie settings should be chosen based on the deployment domain structure.

For same-site or subdomain setups, a strict or lax SameSite policy may work.

For fully cross-site setups, the cookie may require a cross-site setting and must always be secure.

In production, authentication cookies should always be secure.

---

## 11. Google Cloud Setup

In Google Cloud Console, create an OAuth client for the application.

The authorized redirect URI must point to the backend callback URL.

The redirect URI configured in Google Cloud must exactly match the callback URL used by the backend.

If the value does not match exactly, Google will reject the login flow with a redirect URI mismatch error.

Add both production and local development callback URLs if needed.

---

## 12. Security Notes

Important security rules:

- Do not expose the Google client secret to the frontend.
- Do not commit real secrets into the repository.
- Do not send application tokens in the redirect URL.
- Prefer HttpOnly cookies for browser-based login.
- Validate the OAuth state value to protect against CSRF.
- Only allow trusted frontend origins in CORS.
- Use HTTPS in production.
- Store external provider IDs in the database.
- Keep the application session separate from the Google token.

The Google token proves that the user logged in with Google.  
The application session proves that the user is logged in to this application.

These are related but should not be treated as the same thing.

---

## 13. Implementation Checklist

### Frontend

- Add a "Login with Google" button.
- Redirect the browser to the backend login endpoint.
- Add a frontend callback page.
- On the callback page, call the current user endpoint.
- Update frontend auth state after successful login.
- Redirect the user to the correct page after login.

### Backend

- Add Google authentication configuration.
- Keep Google client secret outside committed files.
- Add an endpoint to start Google login.
- Configure the backend callback URL.
- Handle the Google callback.
- Validate the Google response.
- Retrieve Google user information.
- Find or create the local user.
- Create the application session or token.
- Set a secure HttpOnly cookie.
- Redirect back to the frontend.
- Add a current user endpoint.
- Configure CORS if frontend and backend are on different origins.

### Google Cloud

- Create an OAuth client.
- Add the backend callback URL as an authorized redirect URI.
- Add local development redirect URI if needed.
- Store Client ID and Client Secret securely.

---

## 14. Final Recommended Flow

```text
User clicks Login with Google
-> Frontend redirects browser to Backend
-> Backend redirects browser to Google
-> User logs in with Google
-> Google redirects browser to Backend callback
-> Backend validates Google response
-> Backend reads Google profile
-> Backend finds or creates local user
-> Backend creates application session
-> Backend sets secure HttpOnly cookie
-> Backend redirects browser to Frontend callback page
-> Frontend calls current user endpoint
-> User enters the application
```
