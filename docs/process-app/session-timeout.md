# Session Timeout Configuration

This guide explains how to set the session timeout values for the Process App and the Business API, and how to prevent IIS recycling from wiping sessions.

## Process App 
Edit the Process App settings files:
- `appsettings.json`

Set these keys to your desired inactivity window:
```
"SessionIdleTimeoutMinutes": 480,
"AuthCookieExpireMinutes": 480
```

What they do:
- `SessionIdleTimeoutMinutes` controls the server session idle timeout.
- `AuthCookieExpireMinutes` controls the auth cookie lifetime.

## Business API 
Edit the Business API settings file:
- `appsettings.json`

Set the session expiry value:
```
"Auth": {
  "SessionExpiryMinutes": 480
}
```

What it does:
- `Auth:SessionExpiryMinutes` controls how long a credentials session remains valid.

## IIS Configuration (both apps)
To avoid sessions being lost due to app pool recycling:

### App Pool Settings
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
