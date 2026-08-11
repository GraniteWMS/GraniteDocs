# Session Timeout Configuration

Users are automatically logged out of the Process App and Business API after they've been idle for a while. This page explains how to change how long that takes — useful when a client asks for it, for example because long warehouse shifts keep logging people out, or because a security policy requires shorter idle windows.

!!! note "Four settings, one goal"
    Getting the timeout you want takes **four** changes: two in the Process App, one in the Business API, and one in IIS. They all need to agree with each other, so change them together — set the timeout you want, then work through this whole page.

## Process App

When someone stops using the Process App, they're eventually logged out and have to sign in again. Two settings control this together:

- How long the server will wait before ending an idle session.
- How long the browser is allowed to hold onto that person's login before it expires anyway.

Both need to be long enough to cover the idle period you want, so unless there's a specific reason to keep them different, set them to the same value.

### How to set it

Edit the Process App's `appsettings.json` and set:
```
"SessionIdleTimeoutMinutes": 480,
"AuthCookieExpireMinutes": 480
```

- `SessionIdleTimeoutMinutes` — how many minutes of inactivity before the server ends the session.
- `AuthCookieExpireMinutes` — how many minutes the browser keeps the user logged in for.

## Business API

The Business API keeps its own record of how long a login stays valid before whatever is calling it (the Process App, an integration, etc.) has to sign in again.

### How to set it

Edit the Business API's `appsettings.json` and set:
```
"Auth": {
  "SessionExpiryMinutes": 480
}
```

- `Auth:SessionExpiryMinutes` — how many idle minutes before that login stops working.

## IIS Configuration (both apps)

Separately from the settings above, IIS periodically restarts each app behind the scenes as routine maintenance — whether or not anyone is using it. By default this can happen well before the timeouts you just configured, which logs everyone out early and makes it look like the settings above "didn't work."

!!! warning "Don't skip this step"
    If you leave IIS's own restart timers at their defaults, users can still get logged out sooner than expected — even after correctly setting the Process App and Business API values above.

### How to set it

- Open **IIS Manager**.
- Select **Application Pools**.
- Identify the app pool used by the **Process App** and the **Business API** (configure both).
- For each app pool, right-click → **Advanced Settings...** and set:
  - **Process Model → Idle Time-out (minutes)**: `0`
  - **Recycling → Regular Time Interval (minutes)**: `0` (or set a very large value)

## Apply changes
After editing settings:
1. Save the files.
2. Restart the IIS application pools (or the sites) for the Process App and Business API.
