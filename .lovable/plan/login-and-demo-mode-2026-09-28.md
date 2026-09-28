# Login and Demo Mode

## User experience
- Replace the current first screen with a mobile-first KrishiFeed AI login screen in the existing green and cream style.
- Add Phone Number and Password fields, password visibility control, validation, loading, and clear error feedback.
- Add a prominent “Continue in Demo Mode” action that opens the existing dashboard immediately with its current realistic sample data.
- Add a simple Logout action in the existing app shell that returns to login.

## Access behavior
- Use Lovable Cloud phone/password authentication without creating profile records.
- Protect all working app screens so signed-out visitors return to login.
- Keep Demo Mode local to the current browser and clearly preserve the existing demo labels and data.
- Clear authenticated and demo access safely on logout without changing dashboard content or styling.

## Technical details
- Add a small authentication state module shared by the login, route gate, and logout action.
- Group current app routes under a pathless authenticated layout so their public URLs remain unchanged.
- Keep the login route public and add complete page-specific social metadata.
- Verify login validation, Demo Mode entry, protected-route redirect, logout, desktop/mobile rendering, and build diagnostics.
