# Hardening Checklist

Use this checklist when installing Granite WMS, before go-live, and again after major changes. It is written for Granite consultants and your IT team. Adapt it to your own security policy and test changes in a non-production environment first.

## Network

- Do not expose Granite applications or APIs directly to the internet. Use a VPN or other controlled remote access where users connect from outside your network.
- Limit access to the API ports to the users and systems that need them. API access should be restricted by network rules as well as by login.
- Review the firewall rule created by the installer. It allows inbound traffic on the Granite ports for the Domain, Private and Public network profiles, so narrow it to what you need.
- Do not allow direct access to SQL Server from user networks.

## HTTPS and certificates

- Bind every Granite site to HTTPS, and remove any HTTP bindings. The applications do not prevent a site from being configured for HTTP, and cookies are only protected when HTTPS is used.
- Use a certificate issued by your organization's certificate authority or a public certificate authority. Keep self-signed certificates for test environments.
- Make sure the configured endpoints between Granite applications use `https://` addresses.
- Disable TLS 1.0 and TLS 1.1 on the server, and track certificate expiry dates.

## Application configuration

- Do not set `ASPNETCORE_ENVIRONMENT` to `Development` on production servers. HTTPS redirection and HSTS are not active in that environment for most applications.
- Leave `DebugMode` unset or set to `false` in production.
- Set `AllowedOrigins` to the exact HTTPS addresses that need browser access to each API.
- Set `UseSameSiteCookies` to `true` if your WebDesktop and APIs share a host name, then test login and normal use. The default `appsettings.json` for some applications sets it to `false`.
- Set `AllowedHosts` to the host names used to reach each site.
- Set session expiry values that suit your policy, particularly on shared devices.

## Users and permissions

- Change the passwords of the user accounts seeded by the database scripts, and deactivate any that you do not use.
- Do not create a user named `Debug` in production, because the Process App shows that user a debug view.
- Give each person their own account, and do not share logins.
- Assign permissions through user groups, and only grant what each role needs. Be especially careful with the Admin category.
- Activate the [password policies](system-security.md) that match your policy: failed attempts, recovery time, password strength and expiry.
- Reset the passwords of existing users after activating password strength or expiry, because these only apply when a password is saved.
- Use a dedicated Granite user for each integration, each with its own [API key](api-keys.md) and only the permissions it needs.

## Database and server

- Use a dedicated SQL login for Granite, with only the permissions it needs. Do not use `sa`.
- Use encrypted SQL connections with a trusted certificate where possible, rather than `TrustServerCertificate=True`.
- Restrict access to the `UsersCredential` table, because it holds API keys that must be treated like passwords.
- Restrict access to the application folders, because configuration files contain connection strings.
- Restrict access to log folders, because logs can contain request details and data values.
- Restrict access to the installer and its configuration, because it stores SQL connection details.
- Run each application in its own application pool. The installer does this for you, so follow the same approach for manually created sites.
- Install only the IIS features you need, and disable modules that are not in use, such as WebDAV and FTP.
- Keep Windows, SQL Server, IIS and the ASP.NET Core Hosting Bundle patched.
- Back up the Granite database, test your restores, and store backups securely.

## Ongoing

- Review users, groups and permissions regularly, and deactivate leavers promptly.
- Change the user's password straight away if an API key is exposed, because this replaces the key. 
- Apply Granite updates and review the [release notes](https://granitewms.canny.io/changelog).
- Repeat this checklist after upgrades, server moves and new integrations.
